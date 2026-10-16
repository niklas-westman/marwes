import { mkdir, readFile } from "node:fs/promises"
import path from "node:path"
import { stableStringify } from "../baseline-receipts.mjs"
import { evidenceRoot, inputFingerprint } from "../evidence/store.js"
import { nonEmptyString, strictObject } from "../review/human-review.js"
import {
  type SourceSnapshot,
  sourceIdentity,
  validateSnapshot,
  validateSnapshotManifest,
} from "../source/snapshot.js"
import { applyPromotionStage, recoverPromotionTransaction } from "./apply.js"
import { type ArtifactKind, hashBytes, safeFile } from "./safe-files.js"
import { type StagePreview, createPromotionStage, readPromotionStage } from "./stage.js"

function identifier(value: string | undefined, label: string): string {
  const text = nonEmptyString(value, label)
  if (!/^[a-z0-9-]+$/.test(text)) throw new Error(`Invalid ${label}`)
  return text
}

export async function validateFamilyStage(
  preview: StagePreview,
  repoRoot: string,
  activeRoot: string,
  family: string,
): Promise<void> {
  if (preview.stage.family !== family) throw new Error("Stage belongs to another family")
  let contract: Record<string, unknown> = JSON.parse(
    await readFile(await safeFile(activeRoot, "reflection-contract.json"), "utf8"),
  )
  const contractIndex = preview.stage.artifacts.findIndex(
    (artifact) => artifact.kind === "contract",
  )
  if (contractIndex >= 0) {
    const converted = JSON.parse(
      await readFile(await safeFile(preview.stageDirectory, `artifacts/${contractIndex}`), "utf8"),
    )
    const originalCases = contract.cases as Array<Record<string, unknown>>
    if (
      !Array.isArray(originalCases) ||
      !Array.isArray(converted.cases) ||
      originalCases.length !== converted.cases.length
    )
      throw new Error("Encoding conversion cannot change case inventory")
    const normalized = structuredClone(converted)
    for (const [index, original] of originalCases.entries()) {
      const replacement = converted.cases[index].baseline
      if (
        replacement !== original.baseline &&
        (typeof original.baseline !== "string" ||
          !original.baseline.endsWith(".png") ||
          replacement !== original.baseline.replace(/\.png$/, ".webp"))
      )
        throw new Error("Contract stage may only convert PNG baseline paths to WebP")
      normalized.cases[index].baseline = original.baseline
      if (
        replacement !== original.baseline &&
        !preview.stage.artifacts.some(
          (artifact) =>
            artifact.kind === "reference" && artifact.destination === `baselines/${replacement}`,
        )
      )
        throw new Error("Converted contract requires every changed reference in the same stage")
    }
    if (stableStringify(normalized) !== stableStringify(contract))
      throw new Error("Encoding conversion cannot change semantic contracts or thresholds")
    contract = converted
  }
  for (const artifact of preview.stage.artifacts) {
    if (
      artifact.kind === "source" &&
      !["source/snapshot.json", "source/manifest.json"].includes(artifact.destination)
    )
      throw new Error("CLI supports only canonical source snapshot/manifest destinations")
    if (artifact.kind === "receipt") {
      const index = preview.stage.artifacts.indexOf(artifact)
      const receipt: Record<string, unknown> = JSON.parse(
        await readFile(await safeFile(preview.stageDirectory, `artifacts/${index}`), "utf8"),
      )
      if (receipt.family !== family || receipt.figmaFileKey !== contract.figmaFileKey)
        throw new Error("Receipt Figma identity differs from family contract")
    }
  }
  const snapshotIndex = preview.stage.artifacts.findIndex(
    (artifact) => artifact.destination === "source/snapshot.json",
  )
  const manifestIndex = preview.stage.artifacts.findIndex(
    (artifact) => artifact.destination === "source/manifest.json",
  )
  if (snapshotIndex < 0 && manifestIndex < 0) return
  if (snapshotIndex < 0 || manifestIndex < 0)
    throw new Error("Source capture requires snapshot and manifest together")
  const snapshotBytes = await readFile(
    await safeFile(preview.stageDirectory, `artifacts/${snapshotIndex}`),
  )
  const snapshot = JSON.parse(snapshotBytes.toString("utf8")) as SourceSnapshot
  validateSnapshot(snapshot)
  const manifest: unknown = JSON.parse(
    await readFile(await safeFile(preview.stageDirectory, `artifacts/${manifestIndex}`), "utf8"),
  )
  validateSnapshotManifest(manifest, snapshot, snapshotBytes)
  if (snapshot.family !== family || snapshot.fileKey !== contract.figmaFileKey)
    throw new Error("Source capture Figma identity differs from family contract")
  if (!Object.keys(snapshot.nodes).length) throw new Error("Source snapshot is incomplete")
  if (snapshot.missingDependencies.length)
    throw new Error("Source snapshot has unresolved dependencies")
  const identity = sourceIdentity(repoRoot)
  if (
    snapshot.fileKey !== identity.fileKey ||
    snapshot.capture.version !== identity.manifest.version ||
    snapshot.capture.lastModified !== identity.manifest.lastModified
  ) {
    throw new Error("Staged source does not match the current configured Figma capture")
  }
  if (
    snapshot.hashes.manifest !== hashBytes(await readFile(identity.manifestPath)) ||
    snapshot.hashes.variables !== hashBytes(await readFile(identity.variablesPath))
  ) {
    throw new Error("Staged source manifest or variables differ from the current pinned capture")
  }
}

/** Explicit file/CLI operations only. The local UI never dispatches these commands. */
export async function runSourcePromotionCommand(
  repoRoot: string,
  command: string,
  options: Map<string, string>,
): Promise<unknown> {
  if (process.env.CI) throw new Error("Source capture/apply/recovery is disabled in CI")
  const stagesRoot = path.join(evidenceRoot(repoRoot), "stages")
  const transactionsRoot = path.join(evidenceRoot(repoRoot), "transactions")
  if (command === "source-stage-preview") {
    const stageId = identifier(options.get("--stage"), "stage ID")
    return await readPromotionStage(await safeFile(stagesRoot, stageId))
  }
  const family = identifier(options.get("--family"), "family")
  const activeRoot = await safeFile(
    path.join(repoRoot, "packages/design-governance/reflection-families"),
    family,
  )
  await readFile(await safeFile(activeRoot, "reflection-contract.json"))
  if (command === "source-recover") {
    const transactionId = identifier(options.get("--transaction"), "transaction ID")
    return await recoverPromotionTransaction(
      await safeFile(transactionsRoot, transactionId),
      activeRoot,
    )
  }
  if (command === "source-stage") {
    const capturePath = path.resolve(
      repoRoot,
      nonEmptyString(options.get("--capture"), "Capture manifest file"),
    )
    const capture = strictObject(
      JSON.parse(await readFile(capturePath, "utf8")),
      ["schemaVersion", "family", "artifacts"],
      "Capture manifest",
    )
    if (
      capture.schemaVersion !== 1 ||
      capture.family !== family ||
      !Array.isArray(capture.artifacts)
    )
      throw new Error("Capture manifest schema/family mismatch")
    const artifacts = capture.artifacts.map((entry) => {
      const artifact = strictObject(
        entry,
        ["sourcePath", "destination", "kind"],
        "Capture artifact",
      )
      if (!["source", "reference", "receipt", "contract"].includes(String(artifact.kind)))
        throw new Error("Unsupported capture artifact kind")
      return {
        sourcePath: nonEmptyString(artifact.sourcePath, "Capture source path"),
        destination: nonEmptyString(artifact.destination, "Capture destination"),
        kind: artifact.kind as ArtifactKind,
      }
    })
    await mkdir(stagesRoot, { recursive: true })
    const preview = await createPromotionStage({
      family,
      inputFingerprint: inputFingerprint(repoRoot),
      inputRoot: path.dirname(capturePath),
      activeRoot,
      stagesRoot,
      artifacts,
    })
    await validateFamilyStage(preview, repoRoot, activeRoot, family)
    return {
      ...preview,
      approval:
        "Not approved. Supply a separate owner-authored approval binding this exact stage ID, hash, input fingerprint and destinations.",
    }
  }
  if (command === "source-apply") {
    const stageId = identifier(options.get("--stage"), "stage ID")
    const approvalPath = path.resolve(
      repoRoot,
      nonEmptyString(options.get("--approval"), "Owner approval file"),
    )
    const approval: unknown = JSON.parse(await readFile(approvalPath, "utf8"))
    return await applyPromotionStage({
      stageDirectory: await safeFile(stagesRoot, stageId),
      activeRoot,
      transactionsRoot,
      approval,
      currentInputFingerprint: async () => inputFingerprint(repoRoot),
      validateStage: async (preview) => validateFamilyStage(preview, repoRoot, activeRoot, family),
    })
  }
  throw new Error(`Unknown source promotion command: ${command}`)
}
