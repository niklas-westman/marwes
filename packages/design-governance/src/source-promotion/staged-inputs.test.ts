import { mkdir, mkdtemp, readFile, rm, writeFile } from "node:fs/promises"
import { tmpdir } from "node:os"
import { join } from "node:path"
import { afterEach, describe, expect, it, vi } from "vitest"
import { evidenceRoot, inputFingerprint } from "../evidence/store.js"
import { hashBytes } from "./safe-files.js"
import { createPromotionStage } from "./stage.js"
import { prepareStagedInputs } from "./staged-inputs.js"

const roots: string[] = []
afterEach(async () => {
  vi.unstubAllEnvs()
  await Promise.all(roots.splice(0).map((root) => rm(root, { recursive: true, force: true })))
})
async function fixture() {
  const root = await mkdtemp(join(tmpdir(), "staged-proof-"))
  roots.push(root)
  const family = join(root, "packages/design-governance/reflection-families/button")
  const capture = join(root, "capture")
  await mkdir(join(family, "source"), { recursive: true })
  await mkdir(capture)
  const contract = JSON.stringify({ family: "button", figmaFileKey: "exact-file", cases: [] })
  await writeFile(join(family, "reflection-contract.json"), contract)
  await writeFile(join(family, "source/snapshot.json"), '{"active":true}')
  await mkdir(join(root, ".pi"))
  await mkdir(join(root, ".figma/marwes/tokens"), { recursive: true })
  await writeFile(
    join(root, ".pi/figma-sync.json"),
    JSON.stringify({
      defaultTarget: "marwes",
      targets: {
        marwes: {
          figmaFile: "https://www.figma.com/design/exact-file/Marwes",
          liveDir: ".figma/marwes",
        },
      },
    }),
  )
  const manifest = JSON.stringify({
    fileKey: "exact-file",
    version: "1",
    lastModified: "2026-10-14T10:00:00Z",
  })
  const variables = JSON.stringify({ fileKey: "exact-file", variables: [], collections: [] })
  await writeFile(join(root, ".figma/marwes/manifest.json"), manifest)
  await writeFile(join(root, ".figma/marwes/tokens/variables.json"), variables)
  const snapshot = {
    schemaVersion: 1,
    family: "button",
    fileKey: "exact-file",
    hashes: { raw: "a".repeat(64), manifest: hashBytes(manifest), variables: hashBytes(variables) },
    capture: { version: "1", lastModified: "2026-10-14T10:00:00Z", provenance: "fixture" },
    nodes: { root: { id: "root", type: "COMPONENT", name: "Button" } },
    variables: [],
    collections: [],
    inheritedModes: { root: {} },
    components: {},
    styles: {},
    missingDependencies: [],
    missingOptionalFrames: [],
    variantInventory: [],
  }
  const bytes = JSON.stringify(snapshot)
  await writeFile(join(capture, "snapshot.json"), bytes)
  await writeFile(
    join(capture, "manifest.json"),
    JSON.stringify({
      schemaVersion: 1,
      family: "button",
      fileKey: "exact-file",
      hashes: snapshot.hashes,
      capture: snapshot.capture,
      snapshotSha256: hashBytes(bytes),
    }),
  )
  const preview = await createPromotionStage({
    family: "button",
    inputFingerprint: inputFingerprint(root),
    inputRoot: capture,
    activeRoot: family,
    stagesRoot: join(evidenceRoot(root), "stages"),
    artifacts: [
      { sourcePath: "snapshot.json", destination: "source/snapshot.json", kind: "source" },
      { sourcePath: "manifest.json", destination: "source/manifest.json", kind: "source" },
    ],
  })
  const run = join(evidenceRoot(root), "test-run")
  await mkdir(run, { recursive: true })
  return { root, family, preview, run, contract, bytes }
}

describe("isolated staged verification inputs", () => {
  it("uses exact staged bytes without changing active contracts, snapshots or the stage", async () => {
    const data = await fixture()
    const manifestBefore = await readFile(join(data.preview.stageDirectory, "manifest.json"))
    const prepared = await prepareStagedInputs(
      data.root,
      data.run,
      "button",
      data.preview.stage.stageId,
    )
    expect(prepared.stageHash).toBe(data.preview.stageHash)
    expect(prepared.snapshotSha256).toBe(hashBytes(data.bytes))
    expect(
      await readFile(
        join(
          prepared.proofRoot,
          "packages/design-governance/reflection-families/button/source/snapshot.json",
        ),
        "utf8",
      ),
    ).toBe(data.bytes)
    expect(await readFile(join(data.family, "source/snapshot.json"), "utf8")).toBe(
      '{"active":true}',
    )
    expect(await readFile(join(data.family, "reflection-contract.json"), "utf8")).toBe(
      data.contract,
    )
    expect(await readFile(join(data.preview.stageDirectory, "manifest.json"))).toEqual(
      manifestBefore,
    )
  })
  it("never permits staged proof in CI", async () => {
    const data = await fixture()
    vi.stubEnv("CI", "true")
    await expect(
      prepareStagedInputs(data.root, data.run, "button", data.preview.stage.stageId),
    ).rejects.toThrow("disabled in CI")
  })
  it("rejects a stage for another family before any proof input is written", async () => {
    const data = await fixture()
    await mkdir(join(data.root, "packages/design-governance/reflection-families/checkbox"))
    await expect(
      prepareStagedInputs(data.root, data.run, "checkbox", data.preview.stage.stageId),
    ).rejects.toThrow("another family")
  })
  it("rejects changed bytes and artifact hash changes", async () => {
    const data = await fixture()
    await writeFile(join(data.preview.stageDirectory, "artifacts/0"), "{}")
    await expect(
      prepareStagedInputs(data.root, data.run, "button", data.preview.stage.stageId),
    ).rejects.toThrow("Staged artifact changed")
    await writeFile(join(data.preview.stageDirectory, "artifacts/0"), data.bytes)
    const stage = {
      ...data.preview.stage,
      artifacts: data.preview.stage.artifacts.map((a, index) =>
        index ? a : { ...a, sha256: "0".repeat(64) },
      ),
    }
    await writeFile(join(data.preview.stageDirectory, "manifest.json"), JSON.stringify(stage))
    await expect(
      prepareStagedInputs(data.root, data.run, "button", data.preview.stage.stageId),
    ).rejects.toThrow("Staged artifact changed")
  })
  it("rejects stale runtime inputs and unsafe stage identifiers", async () => {
    const data = await fixture()
    await writeFile(join(data.family, "reflection-contract.json"), `${data.contract}\n`)
    await expect(
      prepareStagedInputs(data.root, data.run, "button", data.preview.stage.stageId),
    ).rejects.toThrow("stale")
    await expect(
      prepareStagedInputs(data.root, data.run, "button", "../other-stage"),
    ).rejects.toThrow("identifier")
  })
  it("rejects a newer local capture even when its identity file is outside the runtime fingerprint", async () => {
    const data = await fixture()
    await writeFile(
      join(data.root, ".figma/marwes/manifest.json"),
      JSON.stringify({ fileKey: "exact-file", version: "2", lastModified: "2026-10-14T11:00:00Z" }),
    )
    await expect(
      prepareStagedInputs(data.root, data.run, "button", data.preview.stage.stageId),
    ).rejects.toThrow(/stale|current configured/)
  })
})
