import { mkdir, mkdtemp, readFile, rm, writeFile } from "node:fs/promises"
import os from "node:os"
import path from "node:path"
import { afterEach, describe, expect, it } from "vitest"
import { evidenceRoot, inputFingerprint } from "../evidence/store.js"
import { type SourceSnapshot, loadSnapshot } from "../source/snapshot.js"
import { runSourcePromotionCommand } from "./cli.js"
import { hashBytes } from "./safe-files.js"
import { type StagePreview, createPromotionStage } from "./stage.js"

const directories: string[] = []
afterEach(async () => {
  await Promise.all(directories.splice(0).map((root) => rm(root, { recursive: true, force: true })))
})

async function captureFixture(): Promise<{
  repoRoot: string
  capturePath: string
  activeRoot: string
}> {
  const repoRoot = await mkdtemp(path.join(os.tmpdir(), "governance-capture-cli-"))
  directories.push(repoRoot)
  const activeRoot = path.join(repoRoot, "packages/design-governance/reflection-families/button")
  const captureRoot = path.join(repoRoot, "capture")
  await mkdir(activeRoot, { recursive: true })
  await mkdir(captureRoot)
  await writeFile(
    path.join(activeRoot, "reflection-contract.json"),
    JSON.stringify({ family: "button", figmaFileKey: "exact-file" }),
  )
  await mkdir(path.join(repoRoot, ".pi"))
  await mkdir(path.join(repoRoot, ".figma/marwes/tokens"), { recursive: true })
  await writeFile(
    path.join(repoRoot, ".pi/figma-sync.json"),
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
  const sourceManifestBytes = JSON.stringify({
    fileKey: "exact-file",
    version: "1",
    lastModified: "2026-10-14T10:00:00Z",
  })
  const variablesBytes = JSON.stringify({
    fileKey: "exact-file",
    variables: [],
    collections: [],
  })
  await writeFile(path.join(repoRoot, ".figma/marwes/manifest.json"), sourceManifestBytes)
  await writeFile(path.join(repoRoot, ".figma/marwes/tokens/variables.json"), variablesBytes)
  const snapshot = {
    schemaVersion: 1,
    family: "button",
    fileKey: "exact-file",
    hashes: {
      raw: "a".repeat(64),
      manifest: hashBytes(sourceManifestBytes),
      variables: hashBytes(variablesBytes),
    },
    capture: {
      version: "1",
      lastModified: "2026-10-14T10:00:00Z",
      provenance: "offline fixture",
    },
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
  await writeFile(path.join(captureRoot, "snapshot.json"), bytes)
  await writeFile(
    path.join(captureRoot, "manifest.json"),
    JSON.stringify({
      schemaVersion: 1,
      family: "button",
      fileKey: "exact-file",
      hashes: snapshot.hashes,
      capture: snapshot.capture,
      snapshotSha256: hashBytes(bytes),
    }),
  )
  const capturePath = path.join(captureRoot, "capture.json")
  await writeFile(
    capturePath,
    JSON.stringify({
      schemaVersion: 1,
      family: "button",
      artifacts: [
        {
          sourcePath: "snapshot.json",
          destination: "source/snapshot.json",
          kind: "source",
        },
        {
          sourcePath: "manifest.json",
          destination: "source/manifest.json",
          kind: "source",
        },
      ],
    }),
  )
  return { repoRoot, capturePath, activeRoot }
}

describe("explicit source CLI", () => {
  it("resolves capture paths against the repository rather than the caller working directory", async () => {
    const data = await captureFixture()
    const preview = (await runSourcePromotionCommand(
      data.repoRoot,
      "source-stage",
      new Map([
        ["--family", "button"],
        ["--capture", path.relative(data.repoRoot, data.capturePath)],
      ]),
    )) as StagePreview
    expect(preview.stage.family).toBe("button")
  })

  it("presents exact stage review information without approving or promoting", async () => {
    const data = await captureFixture()
    const preview = (await runSourcePromotionCommand(
      data.repoRoot,
      "source-stage",
      new Map([
        ["--family", "button"],
        ["--capture", data.capturePath],
      ]),
    )) as StagePreview & { approval: string }
    expect(preview.approval).toContain("Not approved")
    expect(preview.stage.artifacts[0]?.changedProperties).toEqual(["$"])
    await expect(
      readFile(path.join(data.activeRoot, "source/snapshot.json")),
    ).rejects.toMatchObject({ code: "ENOENT" })
    const inspected = (await runSourcePromotionCommand(
      data.repoRoot,
      "source-stage-preview",
      new Map([["--stage", preview.stage.stageId]]),
    )) as StagePreview
    expect(inspected.stageHash).toBe(preview.stageHash)
  })

  it("refuses a source manifest that points to different capture bytes", async () => {
    const data = await captureFixture()
    const manifestPath = path.join(path.dirname(data.capturePath), "manifest.json")
    const manifest: Record<string, unknown> = JSON.parse(await readFile(manifestPath, "utf8"))
    await writeFile(manifestPath, JSON.stringify({ ...manifest, snapshotSha256: "d".repeat(64) }))
    await expect(
      runSourcePromotionCommand(
        data.repoRoot,
        "source-stage",
        new Map([
          ["--family", "button"],
          ["--capture", data.capturePath],
        ]),
      ),
    ).rejects.toThrow("snapshot hash mismatch")
    await expect(
      readFile(path.join(data.activeRoot, "source/snapshot.json")),
    ).rejects.toMatchObject({ code: "ENOENT" })
  })

  it.each([
    "inheritedModes",
    "missingOptionalFrames",
    "variantInventory",
    "unknownField",
    "manifestUnknownField",
    "manifestMissingCapture",
  ])(
    "rejects hash-consistent malformed %s captures at stage and apply before active writes",
    async (field) => {
      const data = await captureFixture()
      const captureRoot = path.dirname(data.capturePath)
      const snapshotPath = path.join(captureRoot, "snapshot.json")
      const snapshot: Record<string, unknown> = JSON.parse(await readFile(snapshotPath, "utf8"))
      if (field === "unknownField") snapshot[field] = true
      else if (!field.startsWith("manifest")) delete snapshot[field]
      const bytes = JSON.stringify(snapshot)
      await writeFile(snapshotPath, bytes)
      const manifestPath = path.join(captureRoot, "manifest.json")
      const manifest: Record<string, unknown> = JSON.parse(await readFile(manifestPath, "utf8"))
      if (field === "manifestUnknownField") manifest.unknownField = true
      const { capture: _capture, ...withoutCapture } = manifest
      const nextManifest = field === "manifestMissingCapture" ? withoutCapture : manifest
      await writeFile(
        manifestPath,
        JSON.stringify({ ...nextManifest, snapshotSha256: hashBytes(bytes) }),
      )
      const options = new Map([
        ["--family", "button"],
        ["--capture", data.capturePath],
      ])
      await expect(
        runSourcePromotionCommand(data.repoRoot, "source-stage", options),
      ).rejects.toThrow(/snapshot|manifest/i)
      const capture: {
        artifacts: Array<{
          sourcePath: string
          destination: string
          kind: "source"
        }>
      } = JSON.parse(await readFile(data.capturePath, "utf8"))
      const preview = await createPromotionStage({
        family: "button",
        inputFingerprint: inputFingerprint(data.repoRoot),
        inputRoot: captureRoot,
        activeRoot: data.activeRoot,
        stagesRoot: path.join(evidenceRoot(data.repoRoot), "stages"),
        artifacts: capture.artifacts,
      })
      const approvalPath = path.join(captureRoot, "owner-approval.json")
      await writeFile(
        approvalPath,
        JSON.stringify({
          schemaVersion: 1,
          decision: "approve",
          reviewer: "Test fixture reviewer",
          approvedAt: new Date().toISOString(),
          family: "button",
          stageId: preview.stage.stageId,
          stageHash: preview.stageHash,
          inputFingerprint: preview.stage.inputFingerprint,
          destinations: preview.stage.artifacts.map((entry) => entry.destination),
        }),
      )
      await expect(
        runSourcePromotionCommand(
          data.repoRoot,
          "source-apply",
          new Map([
            ["--family", "button"],
            ["--stage", preview.stage.stageId],
            ["--approval", approvalPath],
          ]),
        ),
      ).rejects.toThrow(/snapshot|manifest/i)
      await expect(
        readFile(path.join(data.activeRoot, "source/snapshot.json")),
      ).rejects.toMatchObject({ code: "ENOENT" })
      await expect(
        readFile(path.join(data.activeRoot, "source/manifest.json")),
      ).rejects.toMatchObject({ code: "ENOENT" })
      await expect(
        readFile(path.join(data.activeRoot, ".governance-promotion.lock")),
      ).rejects.toMatchObject({ code: "ENOENT" })
    },
  )

  it.each(["capture", "manifest-hash", "variables-hash"])(
    "refuses exact-approved hash-consistent older %s sources before replacing current proof",
    async (change) => {
      const data = await captureFixture()
      const captureRoot = path.dirname(data.capturePath)
      const snapshotPath = path.join(captureRoot, "snapshot.json")
      const manifestPath = path.join(captureRoot, "manifest.json")
      const originalSnapshot = await readFile(snapshotPath)
      const originalManifest = await readFile(manifestPath)
      await mkdir(path.join(data.activeRoot, "source"))
      await writeFile(path.join(data.activeRoot, "source/snapshot.json"), originalSnapshot)
      await writeFile(path.join(data.activeRoot, "source/manifest.json"), originalManifest)
      expect(loadSnapshot(data.repoRoot, "button").capture.version).toBe("1")
      const snapshot = JSON.parse(originalSnapshot.toString("utf8")) as SourceSnapshot
      if (change === "capture")
        snapshot.capture = {
          ...snapshot.capture,
          version: "0",
          lastModified: "2026-10-13T10:00:00Z",
        }
      if (change === "manifest-hash") snapshot.hashes.manifest = "d".repeat(64)
      if (change === "variables-hash") snapshot.hashes.variables = "d".repeat(64)
      const bytes = JSON.stringify(snapshot)
      await writeFile(snapshotPath, bytes)
      const manifest: Record<string, unknown> = JSON.parse(originalManifest.toString("utf8"))
      await writeFile(
        manifestPath,
        JSON.stringify({
          ...manifest,
          hashes: snapshot.hashes,
          capture: snapshot.capture,
          snapshotSha256: hashBytes(bytes),
        }),
      )
      const capture: {
        artifacts: Array<{
          sourcePath: string
          destination: string
          kind: "source"
        }>
      } = JSON.parse(await readFile(data.capturePath, "utf8"))
      const preview = await createPromotionStage({
        family: "button",
        inputFingerprint: inputFingerprint(data.repoRoot),
        inputRoot: captureRoot,
        activeRoot: data.activeRoot,
        stagesRoot: path.join(evidenceRoot(data.repoRoot), "stages"),
        artifacts: capture.artifacts,
      })
      const approvalPath = path.join(captureRoot, "owner-approval.json")
      await writeFile(
        approvalPath,
        JSON.stringify({
          schemaVersion: 1,
          decision: "approve",
          reviewer: "Test fixture reviewer",
          approvedAt: new Date().toISOString(),
          family: "button",
          stageId: preview.stage.stageId,
          stageHash: preview.stageHash,
          inputFingerprint: preview.stage.inputFingerprint,
          destinations: preview.stage.artifacts.map((entry) => entry.destination),
        }),
      )
      await expect(
        runSourcePromotionCommand(
          data.repoRoot,
          "source-stage",
          new Map([
            ["--family", "button"],
            ["--capture", data.capturePath],
          ]),
        ),
      ).rejects.toThrow(/current configured Figma capture|current pinned capture/)
      await expect(
        runSourcePromotionCommand(
          data.repoRoot,
          "source-apply",
          new Map([
            ["--family", "button"],
            ["--stage", preview.stage.stageId],
            ["--approval", approvalPath],
          ]),
        ),
      ).rejects.toThrow(/current configured Figma capture|current pinned capture/)
      expect(await readFile(path.join(data.activeRoot, "source/snapshot.json"))).toEqual(
        originalSnapshot,
      )
      expect(await readFile(path.join(data.activeRoot, "source/manifest.json"))).toEqual(
        originalManifest,
      )
      expect(loadSnapshot(data.repoRoot, "button").capture.version).toBe("1")
      await expect(
        readFile(path.join(data.activeRoot, ".governance-promotion.lock")),
      ).rejects.toMatchObject({ code: "ENOENT" })
    },
  )
})
