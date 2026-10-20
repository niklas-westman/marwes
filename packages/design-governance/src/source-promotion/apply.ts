import { randomUUID } from "node:crypto"
import { mkdir, readFile, realpath, unlink, writeFile } from "node:fs/promises"
import path from "node:path"
import {
  readBaselineInfoFromBuffer,
  receiptImageIdentity,
  receiptPathForBaselinePath,
} from "../baseline-receipts.mjs"
import {
  nonEmptyString,
  sameScope,
  sha256String,
  strictObject,
  timestamp,
  uniqueStrings,
} from "../review/human-review.js"
import { atomicWrite, fileHash, hashBytes, readOptional, safeFile } from "./safe-files.js"
import {
  type PromotionStage,
  type StagePreview,
  parsePromotionStage,
  readPromotionStage,
} from "./stage.js"

export interface PromotionApproval {
  schemaVersion: 1
  decision: "approve"
  reviewer: string
  approvedAt: string
  family: string
  stageId: string
  stageHash: string
  inputFingerprint: string
  destinations: string[]
}

export function parsePromotionApproval(value: unknown): PromotionApproval {
  const approval = strictObject(
    value,
    [
      "schemaVersion",
      "decision",
      "reviewer",
      "approvedAt",
      "family",
      "stageId",
      "stageHash",
      "inputFingerprint",
      "destinations",
    ],
    "Promotion approval",
  )
  if (approval.schemaVersion !== 1 || approval.decision !== "approve")
    throw new Error("Explicit promotion approval is required")
  return {
    schemaVersion: 1,
    decision: "approve",
    reviewer: nonEmptyString(approval.reviewer, "Reviewer"),
    approvedAt: timestamp(approval.approvedAt, "Approval date"),
    family: nonEmptyString(approval.family, "Approval family"),
    stageId: nonEmptyString(approval.stageId, "Approved stage ID"),
    stageHash: sha256String(approval.stageHash, "Approved stage hash"),
    inputFingerprint: sha256String(approval.inputFingerprint, "Approved input fingerprint"),
    destinations: uniqueStrings(approval.destinations, "Approved destinations"),
  }
}

export function validatePromotionApproval(
  value: unknown,
  preview: StagePreview,
  currentInputFingerprint: string,
  now = new Date(),
): PromotionApproval {
  const approval = parsePromotionApproval(value)
  if (
    approval.stageId !== preview.stage.stageId ||
    approval.stageHash !== preview.stageHash ||
    approval.family !== preview.stage.family ||
    !sameScope(
      approval.destinations,
      preview.stage.artifacts.map((entry) => entry.destination),
    )
  )
    throw new Error("Approval does not bind to the exact stage/hash/scope")
  if (
    approval.inputFingerprint !== preview.stage.inputFingerprint ||
    currentInputFingerprint !== preview.stage.inputFingerprint
  )
    throw new Error("Stage inputs changed; capture and approve a new stage")
  if (
    Date.parse(approval.approvedAt) < Date.parse(preview.stage.createdAt) ||
    Date.parse(approval.approvedAt) > now.getTime()
  )
    throw new Error("Approval must follow capture and cannot be future-dated")
  return approval
}

interface PromotionJournal {
  schemaVersion: 1
  transactionId: string
  activeRoot: string
  stage: PromotionStage
  stageHash: string
  approval: PromotionApproval
  state: "prepared" | "applying" | "applied" | "rolled-back"
}

export interface ApplyOptions {
  stageDirectory: string
  activeRoot: string
  transactionsRoot: string
  approval: unknown
  currentInputFingerprint: () => Promise<string>
  // Callers can validate family-specific source/receipt schemas before mutation.
  validateStage?: (preview: StagePreview) => Promise<void>
  afterWrite?: (destination: string, index: number) => Promise<void>
}

export interface PromotionResult {
  transactionDirectory: string
  stageId: string
  state: "applied" | "rolled-back"
}

async function validateReceiptSet(preview: StagePreview, activeRoot: string): Promise<void> {
  for (const [index, artifact] of preview.stage.artifacts.entries()) {
    if (artifact.kind !== "receipt") continue
    const receipt: Record<string, unknown> = JSON.parse(
      await readFile(await safeFile(preview.stageDirectory, `artifacts/${index}`), "utf8"),
    )
    if (
      typeof receipt.baseline !== "string" ||
      path.basename(receipt.baseline) !== receipt.baseline
    )
      throw new Error("Receipt requires a baseline filename")
    const baselinePath = path.posix.join(path.posix.dirname(artifact.destination), receipt.baseline)
    if (receiptPathForBaselinePath(baselinePath) !== artifact.destination)
      throw new Error("Receipt baseline does not match its exact receipt path")
    const referenceIndex = preview.stage.artifacts.findIndex(
      (entry) => entry.kind === "reference" && entry.destination === baselinePath,
    )
    const reference =
      referenceIndex < 0
        ? await readOptional(await safeFile(activeRoot, baselinePath))
        : await readOptional(await safeFile(preview.stageDirectory, `artifacts/${referenceIndex}`))
    if (
      !reference ||
      receipt.baseline !== path.basename(baselinePath) ||
      receipt.family !== preview.stage.family ||
      receiptImageIdentity(receipt).sha256 !== hashBytes(reference) ||
      receiptImageIdentity(receipt).byteLength !== reference.length
    )
      throw new Error(`Receipt does not bind to its exact reference: ${artifact.destination}`)
  }
}

async function saveJournal(directory: string, journal: PromotionJournal): Promise<void> {
  await atomicWrite(path.join(directory, "journal.json"), `${JSON.stringify(journal, null, 2)}\n`)
}

async function rollback(directory: string, journal: PromotionJournal): Promise<void> {
  // Check the full set before restoring anything; refuse to overwrite unrelated post-crash edits.
  for (const artifact of journal.stage.artifacts) {
    const actual = await fileHash(await safeFile(journal.activeRoot, artifact.destination))
    if (actual !== artifact.previousSha256 && actual !== artifact.sha256)
      throw new Error(`Rollback blocked by external changes: ${artifact.destination}`)
  }
  const backups = await Promise.all(
    journal.stage.artifacts.map(async (artifact, index) => {
      if (artifact.previousSha256 === null) return null
      const backup = await readFile(await safeFile(directory, `backups/${index}`))
      if (hashBytes(backup) !== artifact.previousSha256)
        throw new Error("Rollback backup failed integrity validation")
      return backup
    }),
  )
  for (const [index, artifact] of journal.stage.artifacts.entries()) {
    const target = await safeFile(journal.activeRoot, artifact.destination)
    if (artifact.previousSha256 === null) {
      await unlink(target).catch((error: NodeJS.ErrnoException) => {
        if (error.code !== "ENOENT") throw error
      })
    } else {
      const backup = backups[index]
      if (!backup) throw new Error("Rollback backup missing")
      await atomicWrite(target, backup)
    }
  }
  journal.state = "rolled-back"
  await saveJournal(directory, journal)
}

export async function applyPromotionStage(options: ApplyOptions): Promise<PromotionResult> {
  const preview = await readPromotionStage(options.stageDirectory)
  const approval = validatePromotionApproval(
    options.approval,
    preview,
    await options.currentInputFingerprint(),
  )
  await options.validateStage?.(preview)
  const activeRoot = await realpath(options.activeRoot)
  await validateReceiptSet(preview, activeRoot)
  const lock = path.join(activeRoot, ".governance-promotion.lock")
  await mkdir(options.transactionsRoot, { recursive: true })
  const transactionId = randomUUID()
  const transactionDirectory = path.join(await realpath(options.transactionsRoot), transactionId)
  // Exclusive lock also survives process termination; recovery explicitly resolves it.
  await writeFile(lock, JSON.stringify({ transactionId, transactionDirectory }), {
    flag: "wx",
    mode: 0o600,
  })
  let journal: PromotionJournal | undefined
  let keepLock = false
  try {
    await mkdir(transactionDirectory)
    await mkdir(path.join(transactionDirectory, "backups"))
    for (const [index, artifact] of preview.stage.artifacts.entries()) {
      const target = await safeFile(activeRoot, artifact.destination)
      const bytes = await readOptional(target)
      if ((bytes === null ? null : hashBytes(bytes)) !== artifact.previousSha256)
        throw new Error(`Active artifact changed since capture: ${artifact.destination}`)
      if (bytes !== null)
        await writeFile(path.join(transactionDirectory, "backups", `${index}`), bytes, {
          flag: "wx",
          mode: 0o600,
        })
    }
    journal = {
      schemaVersion: 1,
      transactionId,
      activeRoot,
      stage: preview.stage,
      stageHash: preview.stageHash,
      approval,
      state: "prepared",
    }
    await saveJournal(transactionDirectory, journal)
    validatePromotionApproval(
      approval,
      await readPromotionStage(options.stageDirectory),
      await options.currentInputFingerprint(),
    )
    journal.state = "applying"
    await saveJournal(transactionDirectory, journal)
    for (const [index, artifact] of preview.stage.artifacts.entries()) {
      const target = await safeFile(activeRoot, artifact.destination)
      if ((await fileHash(target)) !== artifact.previousSha256)
        throw new Error(`Active artifact changed during apply: ${artifact.destination}`)
      const bytes = await readFile(await safeFile(options.stageDirectory, `artifacts/${index}`))
      if (hashBytes(bytes) !== artifact.sha256)
        throw new Error("Staged artifact changed during apply")
      await atomicWrite(target, bytes)
      await options.afterWrite?.(artifact.destination, index)
    }
    journal.state = "applied"
    await saveJournal(transactionDirectory, journal)
    return {
      transactionDirectory,
      stageId: preview.stage.stageId,
      state: "applied",
    }
  } catch (error) {
    if (journal) {
      try {
        if (journal.state === "prepared") {
          journal.state = "rolled-back"
          await saveJournal(transactionDirectory, journal)
        } else await rollback(transactionDirectory, journal)
      } catch (rollbackError) {
        keepLock = true
        throw new AggregateError(
          [error, rollbackError],
          `Promotion failed; recovery required at ${transactionDirectory}`,
        )
      }
    }
    throw error
  } finally {
    if (!keepLock) await unlink(lock)
  }
}

// Crash recovery uses the checked journal/backup set, never paths from an approval file.
export async function recoverPromotionTransaction(
  transactionDirectory: string,
  expectedActiveRoot: string,
): Promise<PromotionResult> {
  const record = strictObject(
    JSON.parse(await readFile(await safeFile(transactionDirectory, "journal.json"), "utf8")),
    ["schemaVersion", "transactionId", "activeRoot", "stage", "stageHash", "approval", "state"],
    "Journal",
  )
  const activeRoot = await realpath(expectedActiveRoot)
  if (
    record.schemaVersion !== 1 ||
    record.activeRoot !== activeRoot ||
    record.transactionId !== path.basename(await realpath(transactionDirectory))
  )
    throw new Error("Journal scope mismatch")
  if (!["prepared", "applying", "applied", "rolled-back"].includes(String(record.state)))
    throw new Error("Invalid journal state")
  const journal: PromotionJournal = {
    schemaVersion: 1,
    transactionId: nonEmptyString(record.transactionId, "Transaction ID"),
    activeRoot,
    stage: parsePromotionStage(record.stage),
    stageHash: sha256String(record.stageHash, "Stage hash"),
    approval: parsePromotionApproval(record.approval),
    state: record.state as PromotionJournal["state"],
  }
  const lock = path.join(activeRoot, ".governance-promotion.lock")
  const lockRecord: unknown = JSON.parse(await readFile(lock, "utf8"))
  const lockObject = strictObject(
    lockRecord,
    ["transactionId", "transactionDirectory"],
    "Promotion lock",
  )
  if (
    lockObject.transactionId !== journal.transactionId ||
    lockObject.transactionDirectory !== (await realpath(transactionDirectory))
  )
    throw new Error("Promotion lock belongs to another transaction")
  if (journal.state === "applying") await rollback(transactionDirectory, journal)
  if (journal.state === "prepared") {
    journal.state = "rolled-back"
    await saveJournal(transactionDirectory, journal)
  }
  await unlink(lock)
  return {
    transactionDirectory,
    stageId: journal.stage.stageId,
    state: journal.state === "applied" ? "applied" : "rolled-back",
  }
}
