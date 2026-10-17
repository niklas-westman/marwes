import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import { runInNewContext } from "node:vm"
import { it as test } from "vitest"
import { requireValue } from "../contracts/require-value.js"
const pluginPath = new URL("../../figma-reflection-plugin/code.js", import.meta.url)
const toolPath = new URL("./prepare-figma-reflection-frames.mjs", import.meta.url)
const collectionId = "VariableCollectionId:1358:5072"
const modes: Record<string, { id: string; modes: Array<{ modeId: string }> }> = {
  [collectionId]: { id: collectionId, modes: [{ modeId: "1358:1" }, { modeId: "1358:2" }] },
}
const policy = {
  schemaVersion: 1,
  descendants: "override-declared-collections",
  collectionModes: { [collectionId]: "1358:2" },
}
function harness() {
  const context = {
    figma: {
      showUI() {},
      root: { name: "Pinned", children: [] },
      currentPage: { name: "Source", id: "1:1" },
      ui: { postMessage() {} },
      variables: {
        getVariableCollectionByIdAsync: async (id: string) => modes[id],
      },
    },
    __html__: "",
  }
  runInNewContext(readFileSync(pluginPath, "utf8"), context)
  return (name: string) => {
    const value: unknown = runInNewContext(name, context)
    if (typeof value !== "function") throw Error(`Missing plugin function: ${name}`)
    return value
  }
}
const json = (x: unknown) => JSON.parse(JSON.stringify(x))
test("policy is strict, versioned, bounded and identical at CLI/plugin boundary", () => {
  const plugin = harness()("validateVariableModePolicy")
  const cliSource = readFileSync(toolPath, "utf8")
  const start = cliSource.indexOf("function validateVariableModePolicy(")
  const end = cliSource.indexOf("\nfunction validateViewportSize", start)
  const cli = runInNewContext(`(${cliSource.slice(start, end)})`)
  for (const validate of [plugin, cli]) {
    assert.equal(validate(undefined), undefined)
    assert.deepEqual(json(validate(policy)), policy)
    for (const input of [
      null,
      {},
      { ...policy, schemaVersion: 2 },
      { ...policy, extra: true },
      { ...policy, descendants: "ignore" },
      { ...policy, collectionModes: {} },
      { ...policy, collectionModes: { Semantic: "Dark" } },
      { ...policy, collectionModes: { [collectionId]: "wrong" } },
    ])
      assert.throws(() => validate(input))
  }
})
test("preflight rejects unavailable collection or mode before mutation", async () => {
  const resolve = harness()("resolveVariableModePolicy")
  await assert.rejects(
    resolve({ ...policy, collectionModes: { [collectionId]: "999:1" } }),
    /Unavailable/,
  )
  await assert.rejects(
    resolve({ ...policy, collectionModes: { "VariableCollectionId:999:1": "1:1" } }),
    /Unavailable/,
  )
  assert.equal(await resolve(undefined), undefined)
})
type ModeNode = {
  id: string
  children?: ModeNode[]
  explicitVariableModes?: Record<string, string>
  setExplicitVariableModeForCollection?: (collection: { id: string }, mode: string) => void
}
function node(id: string, children: ModeNode[] = []) {
  const explicitVariableModes: Record<string, string> = {
    [collectionId]: "1358:1",
    "VariableCollectionId:1593:4566": "1593:5",
  }
  return {
    id,
    children,
    explicitVariableModes,

    setExplicitVariableModeForCollection(collection: { id: string }, mode: string) {
      this.explicitVariableModes[collection.id] = mode
    },
  }
}
test("declared dark modes override conflicting descendants and preserve unrelated size", async () => {
  const get = harness()
  const plan = await get("resolveVariableModePolicy")(policy)
  const child = node("3:1")
  const root = node("2:1", [child])
  await get("applyVariableModePolicy")(root, plan)
  for (const n of [root, child]) {
    assert.equal(n.explicitVariableModes[collectionId], "1358:2")
    assert.equal(n.explicitVariableModes["VariableCollectionId:1593:4566"], "1593:5")
  }
})
test("absent policy preserves all original explicit modes", async () => {
  const get = harness()
  const root = node("2:1", [node("3:1")])
  const before = JSON.stringify(root)
  await get("applyVariableModePolicy")(root, undefined)
  assert.equal(JSON.stringify(root), before)
})
test("unsupported cloned descendant or failed mode readback fails closed", async () => {
  const get = harness()
  const plan = await get("resolveVariableModePolicy")(policy)
  await assert.rejects(
    get("applyVariableModePolicy")(node("1:1", [{ id: "2:1" }]), plan),
    /Cannot enforce/,
  )
  const broken = node("1:1")
  broken.setExplicitVariableModeForCollection = () => {}
  await assert.rejects(get("applyVariableModePolicy")(broken, plan), /readback failed/)
})
function baseRecord() {
  return {
    entry: {
      family: "button",
      caseId: "button.focus",
      mode: "dark",
      outputFrameName: "reflection/button/focus/dark",
      viewportSize: { width: 390, height: 220 },
      framing: { background: "#000" },
      selector: { strategy: "directNode" },
    },
    sourceSelection: {
      sourceNodeId: "1:1",
      sourceNodeIds: ["1:1"],
      nodes: [
        {
          id: "1:1",
          type: "FRAME",
          name: "Source",
          x: 0,
          y: 0,
          width: 78,
          height: 52,
          absoluteBoundingBox: { x: 0, y: 0, width: 78, height: 52 },
          children: [],
        },
      ],
    },
    destinationPage: { id: "2:1" },
    position: { x: 0, y: 0 },
  }
}
function record() {
  const value: ReturnType<typeof baseRecord> & {
    requestHash?: string
    variableModePlan?: unknown
  } = baseRecord()
  return value
}
test("legacy request hash is unchanged, explicit modes change it and bind payload/results", async () => {
  const proposed = harness()
  const b = record()
  proposed("finalizeRecordRevision")(b, {})
  // Independently spell out the established request fields: absence must not add an undefined key.
  const establishedRequest = {
    prepVersion: 4,
    family: "button",
    caseId: "button.focus",
    mode: "dark",
    outputFrameName: "reflection/button/focus/dark",
    viewportSize: { width: 390, height: 220 },
    framing: { background: "#000" },
    selector: { strategy: "directNode" },
    sourceFrameId: null,
    sourceNodeIds: ["1:1"],
    destinationPageId: "2:1",
    position: { x: 0, y: 0 },
    placementAnchor: null,
  }
  assert.equal(
    b.requestHash,
    proposed("hashString")(proposed("stableStringify")(establishedRequest)),
  )
  const c = record()
  c.variableModePlan = await proposed("resolveVariableModePolicy")(policy)
  proposed("finalizeRecordRevision")(c, {})
  assert.notEqual(c.requestHash, b.requestHash)
  assert.deepEqual(json(proposed("buildPayload")(c, "9:1").variableModePolicy), policy)
  assert.deepEqual(json(proposed("resultPayload")(c, "9:1").variableModePolicy), policy)
  const d = record()
  d.variableModePlan = await proposed("resolveVariableModePolicy")({
    ...policy,
    collectionModes: { [collectionId]: "1358:1" },
  })
  proposed("finalizeRecordRevision")(d, {})
  assert.notEqual(c.requestHash, d.requestHash)
})
function cliHarness() {
  const s = readFileSync(toolPath, "utf8")
  const context = {
    URL,
    defaultModes: ["light", "dark"],
    supportedStrategies: new Set(["directNode"]),
    repoRoot: process.cwd(),
    selectedPrepFamily: () => true,
    reflectionFamilyFromPath: () => "button",
    mergeSelector: (_parent: unknown, entry: { selector?: unknown; sourceNodeId?: string }) =>
      entry.selector ?? { strategy: "directNode", sourceNodeId: entry.sourceNodeId },
  }
  const names = [
    "validateVariableModePolicy",
    "validateViewportSize",
    "validateSelector",
    "validateFrameName",
    "nodeIdToUrlNodeId",
    "validateFigmaNodeUrl",
    "normalizeManifest",
    "normalizeContractPrep",
    "caseSlug",
    "buildPlanFrameIndex",
    "collectExportableFrameEntries",
  ]
  for (const name of names) {
    const start = s.indexOf(`function ${name}(`)
    const end = s.indexOf("\nfunction ", start + 1)
    runInNewContext(s.slice(start, end), context)
  }
  return (name: string) => {
    const value: unknown = runInNewContext(name, context)
    if (typeof value !== "function") throw Error(`Missing plugin function: ${name}`)
    return value
  }
}
test("legacy manifest and contract prep retain explicit policy in bridge request", () => {
  const get = cliHarness()
  const dark: {
    sourceNodeId: string
    outputFrameName: string
    variableModePolicy?: typeof policy
  } = { sourceNodeId: "3977:38660", outputFrameName: "reflection/button/focus/dark" }
  const manifest = {
    schemaVersion: 1,
    family: "button",
    figmaFileKey: "pinnedKey",
    cases: [
      {
        caseId: "button.standard-focus-example",
        viewport: "button-default",
        viewportSize: { width: 390, height: 220 },
        selector: { strategy: "directNode" },
        modes: {
          light: { sourceNodeId: "3977:38660", outputFrameName: "reflection/button/focus/light" },
          dark,
        },
      },
    ],
  }

  requireValue(manifest.cases[0], "Focus manifest case").modes.dark.variableModePolicy = policy
  const legacy = get("normalizeManifest")(manifest, "fixture.json", {})
  assert.deepEqual(
    json(legacy.frames.find((f: { mode: string }) => f.mode === "dark").variableModePolicy),
    policy,
  )
  const contract = {
    schemaVersion: 1,
    family: "button",
    figmaFileKey: manifest.figmaFileKey,
    cases: [
      {
        caseId: "button.focus",
        mode: "dark",
        collectionModes: policy.collectionModes,
        viewportSize: { width: 390, height: 220 },
        prep: {
          ...requireValue(manifest.cases[0], "Focus manifest case").modes.dark,
          selector: { strategy: "directNode" },
          variableModePolicy: policy,
        },
      },
    ],
  }
  const modern = get("normalizeContractPrep")(contract, "fixture.json", {})
  assert.deepEqual(json(modern.frames[0].variableModePolicy), policy)
  const conflict = structuredClone(contract)
  requireValue(
    conflict.cases[0],
    "Required prepare-figma-reflection-modes.test value",
  ).collectionModes = { [collectionId]: "1358:1" }
  assert.throws(() => get("normalizeContractPrep")(conflict, "fixture.json", {}), /conflicts/)
})
test("reference capture entries retain acknowledged exact modes and reject a different or absent acknowledgment", () => {
  const get = cliHarness()
  const frame = {
    family: "button",
    caseId: "button.focus",
    mode: "dark",
    outputFrameName: "reflection/button/focus/dark",
    variableModePolicy: policy,
    viewportSize: { width: 390, height: 220 },
  }
  const entry = {
    outputFrameName: frame.outputFrameName,
    figmaNodeId: "9:1",
    variableModePolicy: policy,
    requestHash: "h123",
  }
  const collect = get("collectExportableFrameEntries")
  const plan = { figmaFileKey: "pinnedKey", frames: [frame] }
  const output = collect({ created: [entry] }, plan, { write: true })
  assert.deepEqual(json(output[0].variableModePolicy), policy)
  assert.equal(output[0].requestHash, "h123")
  assert.throws(
    () =>
      collect({ created: [{ ...entry, variableModePolicy: undefined }] }, plan, { write: true }),
    /differs/,
  )
  assert.throws(
    () =>
      collect(
        {
          created: [
            {
              ...entry,
              variableModePolicy: { ...policy, collectionModes: { [collectionId]: "1358:1" } },
            },
          ],
        },
        plan,
        { write: true },
      ),
    /differs/,
  )
})
