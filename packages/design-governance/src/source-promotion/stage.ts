import { randomUUID } from "node:crypto"
import { mkdir, readFile, realpath, rm, writeFile } from "node:fs/promises"
import path from "node:path"
import {
  readBaselineInfoFromBuffer,
  receiptImageIdentity,
  receiptPathForBaselinePath,
} from "../baseline-receipts.mjs"
import { nonEmptyString, sha256String, strictObject, timestamp } from "../review/human-review.js"
import {
  type ArtifactKind,
  hashBytes,
  readOptional,
  safeFile,
  validateDestination,
} from "./safe-files.js"

export interface StagedArtifact {
  kind: ArtifactKind
  destination: string
  sha256: string
  bytes: number
  previousSha256: string | null
  changedProperties: string[]
}

export interface PromotionStage {
  schemaVersion: 1
  stageId: string
  family: string
  createdAt: string
  inputFingerprint: string
  artifacts: StagedArtifact[]
}

export interface StageInput {
  family: string
  inputFingerprint: string
  inputRoot: string
  activeRoot: string
  stagesRoot: string
  artifacts: Array<{
    sourcePath: string
    destination: string
    kind: ArtifactKind
  }>
}

export interface StagePreview {
  stage: PromotionStage
  stageHash: string
  stageDirectory: string
  changes: Array<{
    destination: string
    previousSha256: string | null
    sha256: string
    change: "added" | "changed" | "unchanged"
  }>
}

export function parsePromotionStage(value: unknown): PromotionStage {
  const record = strictObject(
    value,
    ["schemaVersion", "stageId", "family", "createdAt", "inputFingerprint", "artifacts"],
    "Stage",
  )
  if (record.schemaVersion !== 1) throw new Error("Unsupported stage schema")
  const stageId = nonEmptyString(record.stageId, "Stage ID")
  if (!/^[a-z0-9-]{36}$/.test(stageId)) throw new Error("Malformed stage ID")
  if (!Array.isArray(record.artifacts) || record.artifacts.length === 0)
    throw new Error("Stage requires artifacts")
  const destinations = new Set<string>()
  const artifacts = record.artifacts.map((entry): StagedArtifact => {
    const artifact = strictObject(
      entry,
      ["kind", "destination", "sha256", "bytes", "previousSha256", "changedProperties"],
      "Stage artifact",
    )
    if (
      artifact.kind !== "source" &&
      artifact.kind !== "reference" &&
      artifact.kind !== "receipt" &&
      artifact.kind !== "contract"
    )
      throw new Error("Invalid artifact kind")
    const destination = nonEmptyString(artifact.destination, "Destination")
    validateDestination(destination, artifact.kind)
    if (destinations.has(destination)) throw new Error("Duplicate artifact destination")
    destinations.add(destination)
    if (
      typeof artifact.bytes !== "number" ||
      !Number.isSafeInteger(artifact.bytes) ||
      artifact.bytes < 0
    )
      throw new Error("Invalid artifact size")
    if (
      !Array.isArray(artifact.changedProperties) ||
      artifact.changedProperties.some((entry) => typeof entry !== "string")
    )
      throw new Error("Invalid semantic change summary")
    return {
      kind: artifact.kind,
      destination,
      sha256: sha256String(artifact.sha256, "Artifact hash"),
      bytes: artifact.bytes,
      previousSha256:
        artifact.previousSha256 === null
          ? null
          : sha256String(artifact.previousSha256, "Previous hash"),
      changedProperties: artifact.changedProperties as string[],
    }
  })
  return {
    schemaVersion: 1,
    stageId,
    family: nonEmptyString(record.family, "Stage family"),
    createdAt: timestamp(record.createdAt, "Stage date"),
    inputFingerprint: sha256String(record.inputFingerprint, "Stage input fingerprint"),
    artifacts,
  }
}

function changedJsonPaths(before: unknown, after: unknown, propertyPath = "$"): string[] {
  if (JSON.stringify(before) === JSON.stringify(after)) return []
  if (
    before &&
    after &&
    typeof before === "object" &&
    typeof after === "object" &&
    !Array.isArray(before) &&
    !Array.isArray(after)
  ) {
    const left = before as Record<string, unknown>
    const right = after as Record<string, unknown>
    return [...new Set([...Object.keys(left), ...Object.keys(right)])]
      .sort()
      .flatMap((key) =>
        changedJsonPaths(left[key], right[key], `${propertyPath}[${JSON.stringify(key)}]`),
      )
  }
  return [propertyPath]
}

function validateArtifactBytes(bytes: Buffer, kind: ArtifactKind): void {
  if (kind === "reference") {
    readBaselineInfoFromBuffer(bytes)
  } else {
    const value: unknown = JSON.parse(bytes.toString("utf8"))
    if (!value || typeof value !== "object" || Array.isArray(value))
      throw new Error("Source/receipt must be a JSON object")
  }
}

// Capture copies supplied offline files without touching the active source/reference set.
export async function createPromotionStage(input: StageInput): Promise<StagePreview> {
  nonEmptyString(input.family, "Stage family")
  sha256String(input.inputFingerprint, "Input fingerprint")
  if (!input.artifacts.length) throw new Error("Stage requires artifacts")
  await mkdir(input.stagesRoot, { recursive: true })
  const stageId = randomUUID()
  const stageDirectory = path.join(await realpath(input.stagesRoot), stageId)
  await mkdir(stageDirectory)
  await mkdir(path.join(stageDirectory, "artifacts"))
  try {
    const artifacts: StagedArtifact[] = []
    for (const [index, artifact] of input.artifacts.entries()) {
      validateDestination(artifact.destination, artifact.kind)
      if (artifacts.some((entry) => entry.destination === artifact.destination))
        throw new Error("Duplicate artifact destination")
      const source = await safeFile(input.inputRoot, artifact.sourcePath)
      const bytes = await readOptional(source)
      if (bytes === null) throw new Error(`Missing capture input: ${artifact.sourcePath}`)
      validateArtifactBytes(bytes, artifact.kind)
      if (
        artifact.kind === "reference" &&
        !artifact.destination.endsWith(`.${readBaselineInfoFromBuffer(bytes).format}`)
      )
        throw new Error("Reference extension does not match image encoding")
      const target = await safeFile(input.activeRoot, artifact.destination)
      const previous = await readOptional(target)
      const changedProperties =
        artifact.kind === "reference"
          ? previous && hashBytes(previous) === hashBytes(bytes)
            ? []
            : ["Reference image bytes"]
          : changedJsonPaths(
              previous ? JSON.parse(previous.toString("utf8")) : null,
              JSON.parse(bytes.toString("utf8")),
            )
      artifacts.push({
        kind: artifact.kind,
        destination: artifact.destination,
        sha256: hashBytes(bytes),
        bytes: bytes.length,
        previousSha256: previous === null ? null : hashBytes(previous),
        changedProperties,
      })
      await writeFile(path.join(stageDirectory, "artifacts", `${index}`), bytes, {
        flag: "wx",
        mode: 0o600,
      })
    }
    const stage: PromotionStage = {
      schemaVersion: 1,
      stageId,
      family: input.family,
      createdAt: new Date().toISOString(),
      inputFingerprint: input.inputFingerprint,
      artifacts,
    }
    await writeFile(
      path.join(stageDirectory, "manifest.json"),
      `${JSON.stringify(stage, null, 2)}\n`,
      { flag: "wx", mode: 0o600 },
    )
    return await readPromotionStage(stageDirectory)
  } catch (error) {
    await rm(stageDirectory, { recursive: true, force: true })
    throw error
  }
}

export async function readPromotionStage(stageDirectory: string): Promise<StagePreview> {
  const manifest = await readFile(await safeFile(stageDirectory, "manifest.json"))
  const stage = parsePromotionStage(JSON.parse(manifest.toString("utf8")))
  if (path.basename(await realpath(stageDirectory)) !== stage.stageId)
    throw new Error("Stage directory does not match stage ID")
  for (const [index, artifact] of stage.artifacts.entries()) {
    const bytes = await readOptional(await safeFile(stageDirectory, `artifacts/${index}`))
    if (!bytes || bytes.length !== artifact.bytes || hashBytes(bytes) !== artifact.sha256)
      throw new Error(`Staged artifact changed: ${artifact.destination}`)
    validateArtifactBytes(bytes, artifact.kind)
    if (
      artifact.kind === "reference" &&
      !artifact.destination.endsWith(`.${readBaselineInfoFromBuffer(bytes).format}`)
    )
      throw new Error("Reference extension does not match image encoding")
    if (artifact.kind === "reference") {
      const receiptIndex = stage.artifacts.findIndex(
        (entry) =>
          entry.kind === "receipt" &&
          entry.destination === receiptPathForBaselinePath(artifact.destination),
      )
      if (receiptIndex < 0)
        throw new Error(`Reference requires its exact staged receipt: ${artifact.destination}`)
      const receipt: Record<string, unknown> = JSON.parse(
        await readFile(await safeFile(stageDirectory, `artifacts/${receiptIndex}`), "utf8"),
      )
      const info = readBaselineInfoFromBuffer(bytes)
      if (info.format === "webp" && (receipt.schemaVersion !== 2 || receipt.imageFormat !== "webp"))
        throw new Error("WebP requires a version 2 image receipt")
      if (
        receiptImageIdentity(receipt).sha256 !== artifact.sha256 ||
        receiptImageIdentity(receipt).byteLength !== artifact.bytes ||
        receipt.baseline !== path.basename(artifact.destination) ||
        receipt.family !== stage.family
      )
        throw new Error(`Reference receipt identity mismatch: ${artifact.destination}`)
    }
  }
  return {
    stage,
    stageHash: hashBytes(manifest),
    stageDirectory,
    changes: stage.artifacts.map((artifact) => ({
      destination: artifact.destination,
      previousSha256: artifact.previousSha256,
      sha256: artifact.sha256,
      change:
        artifact.previousSha256 === null
          ? "added"
          : artifact.previousSha256 === artifact.sha256
            ? "unchanged"
            : "changed",
    })),
  }
}
