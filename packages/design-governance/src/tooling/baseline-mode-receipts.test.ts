import { mkdtempSync, rmSync, writeFileSync } from "node:fs"
import { tmpdir } from "node:os"
import { join } from "node:path"
import { afterEach, expect, it } from "vitest"
import {
  buildBaselineReceipt,
  compareReceipt,
  computeCaseFingerprint,
  sha256Json,
  validateBaselineReceipt,
} from "../baseline-receipts.mjs"

const semantic = "VariableCollectionId:1358:5072"
const brand = "VariableCollectionId:1358:7240"
const policy = {
  schemaVersion: 1,
  descendants: "override-declared-collections",
  collectionModes: { [semantic]: "1358:2", [brand]: "1358:13" },
}
const directories: string[] = []
afterEach(() => {
  for (const path of directories.splice(0)) rmSync(path, { recursive: true, force: true })
})
function fixture() {
  const root = mkdtempSync(join(tmpdir(), "marwes-mode-receipt-"))
  directories.push(root)
  const pngPath = join(root, "focus.png")
  writeFileSync(
    pngPath,
    Buffer.from(
      "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=",
      "base64",
    ),
  )
  const contract = { family: "button", figmaFileKey: "pinned" }
  const caseEntry = {
    caseId: "button.focus",
    mode: "dark",
    figmaNodeId: "9:1",
    figmaFrameName: "reflection/button/focus/dark",
    baseline: "focus.png",
    viewport: "test",
    viewportSize: { width: 1, height: 1 },
    source: { componentNodeId: "1:1", sourceFrameId: "2:1" },
    collectionModes: { [semantic]: "1358:2", [brand]: "1358:13" },
    prep: { sourceFrameId: "2:1", variableModePolicy: structuredClone(policy) },
  }
  const context = {
    rawSource: { document: { id: "1:1", type: "FRAME", children: [] } },
    variableSource: { variables: [], collections: [] },
  }
  const captureMetadata = {
    variableModePolicy: structuredClone(policy),
    figmaNodeId: "9:1",
    requestHash: "h123abc",
  }
  const args = {
    repoRoot: root,
    contract,
    caseEntry,
    ...context,
    pngPath,
    sourceFrameId: "2:1",
    origin: "figma-bridge-export",
    createdAt: "2026-10-16T00:00:00Z",
    captureMetadata,
  }
  return { root, pngPath, contract, caseEntry, context, captureMetadata, args }
}
it("keeps established absent-policy case fingerprints unchanged", () => {
  const f = fixture()
  const { variableModePolicy: _policy, ...withoutPolicy } = f.caseEntry.prep
  const caseEntry = { ...f.caseEntry, prep: withoutPolicy }
  const expected = sha256Json({
    family: "button",
    figmaFileKey: "pinned",
    caseId: "button.focus",
    mode: "dark",
    figmaFrameName: "reflection/button/focus/dark",
    baseline: "focus.png",
    sourceFrameId: "2:1",
    sourceNodeId: "1:1",
    sourceNodeIds: ["1:1"],
    viewport: "test",
    viewportSize: { width: 1, height: 1 },
    framing: null,
    exportScale: 1,
  })
  expect(computeCaseFingerprint({ contract: f.contract, caseEntry, sourceFrameId: "2:1" })).toBe(
    expected,
  )
  expect(buildBaselineReceipt({ ...f.args, caseEntry })).not.toHaveProperty("variableModePolicy")
})
it("binds normalized explicit policy, acknowledged generated frame and request hash to receipt", () => {
  const f = fixture()
  const receipt = buildBaselineReceipt(f.args)
  expect(receipt.variableModePolicy).toEqual(policy)
  expect(receipt.variableModePolicySha256).toBe(sha256Json(policy))
  expect(receipt.captureRequestHash).toBe("h123abc")
  expect(() => buildBaselineReceipt({ ...f.args, captureMetadata: undefined })).toThrow(
    /acknowledgment/,
  )
  expect(() =>
    buildBaselineReceipt({
      ...f.args,
      captureMetadata: { ...f.captureMetadata, figmaNodeId: "9:2" },
    }),
  ).toThrow(/acknowledgment/)
  expect(() =>
    buildBaselineReceipt({ ...f.args, captureMetadata: { ...f.captureMetadata, requestHash: "" } }),
  ).toThrow(/acknowledgment/)
  const wrong = structuredClone(f.captureMetadata)
  wrong.variableModePolicy.collectionModes[semantic] = "1358:1"
  expect(() => buildBaselineReceipt({ ...f.args, captureMetadata: wrong })).toThrow(
    /acknowledgment/,
  )
})
it("rejects explicit policy conflicts with independently declared case modes", () => {
  const f = fixture()
  f.caseEntry.prep.variableModePolicy.collectionModes[semantic] = "1358:1"
  expect(() =>
    computeCaseFingerprint({ contract: f.contract, caseEntry: f.caseEntry, sourceFrameId: "2:1" }),
  ).toThrow(/conflicts/)
  const { collectionModes: _modes, ...withoutModes } = f.caseEntry
  expect(() =>
    computeCaseFingerprint({ contract: f.contract, caseEntry: withoutModes, sourceFrameId: "2:1" }),
  ).toThrow(/independent/)
})
it("invalidates an old receipt on mode-only contract change and refuses metadata tampering", () => {
  const f = fixture()
  const old = buildBaselineReceipt(f.args)
  writeFileSync(join(f.root, "focus.meta.json"), JSON.stringify(old))
  expect(
    validateBaselineReceipt({
      repoRoot: f.root,
      contract: f.contract,
      caseEntry: f.caseEntry,
      context: f.context,
      pngPath: f.pngPath,
      requireReceipt: true,
    }).status,
  ).toBe("pass")
  f.caseEntry.prep.variableModePolicy.collectionModes[brand] = "1358:14"
  f.caseEntry.collectionModes[brand] = "1358:14"
  const nextCapture = structuredClone(f.captureMetadata)
  nextCapture.variableModePolicy.collectionModes[brand] = "1358:14"
  const next = buildBaselineReceipt({ ...f.args, captureMetadata: nextCapture })
  expect(next.caseFingerprint).not.toBe(old.caseFingerprint)
  expect(compareReceipt(old, next)).toContain("caseFingerprint mismatch")
  expect(
    validateBaselineReceipt({
      repoRoot: f.root,
      contract: f.contract,
      caseEntry: f.caseEntry,
      context: f.context,
      pngPath: f.pngPath,
      requireReceipt: true,
    }).status,
  ).toBe("fail")
  const altered = { ...next, variableModePolicySha256: "0".repeat(64) }
  expect(compareReceipt(altered, next)).toContain("variableModePolicySha256 mismatch")
})
