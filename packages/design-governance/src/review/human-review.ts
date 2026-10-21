export interface ReviewException {
  caseId: string
  assertionIds: string[]
  reason: string
  expiresAt: string
}

export interface HumanReviewRecord {
  schemaVersion: 1
  reviewer: string
  authoredAt: string
  decision: "accepted" | "rejected"
  family: string
  runId: string
  evidenceHash: string
  inputFingerprint: string
  caseIds: string[]
  exceptions: ReviewException[]
}

export interface ReviewContext {
  family: string
  runId: string
  evidenceHash: string
  inputFingerprint: string
  latestRunId: string
  currentInputFingerprint: string
  caseIds: string[]
  assertionIdsByCase?: Record<string, string[]>
}

export interface ReviewAssessment {
  state: "unreviewed" | "accepted" | "rejected" | "stale" | "invalid"
  reasons: string[]
  reviewer?: string
  exceptions: Array<ReviewException & { state: "active" | "expired" | "stale" }>
}

export function strictObject(
  value: unknown,
  keys: string[],
  label: string,
): Record<string, unknown> {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    throw new Error(`${label} must be an object`)
  }
  const object = value as Record<string, unknown>
  if (
    Object.keys(object).some((key) => !keys.includes(key)) ||
    keys.some((key) => !Object.hasOwn(object, key))
  ) {
    throw new Error(`${label} has missing or unknown fields`)
  }
  return object
}

export function nonEmptyString(value: unknown, label: string): string {
  if (typeof value !== "string" || !value.trim()) throw new Error(`${label} must be nonempty`)
  return value
}

export function sha256String(value: unknown, label: string): string {
  const text = nonEmptyString(value, label)
  if (!/^[a-f0-9]{64}$/.test(text)) throw new Error(`${label} must be a SHA-256 hash`)
  return text
}

export function timestamp(value: unknown, label: string): string {
  const text = nonEmptyString(value, label)
  if (
    !/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{3})?Z$/.test(text) ||
    !Number.isFinite(Date.parse(text)) ||
    new Date(text).toISOString().replace(".000Z", "Z") !== text.replace(".000Z", "Z")
  ) {
    throw new Error(`${label} must be an ISO timestamp`)
  }
  return text
}

export function uniqueStrings(value: unknown, label: string): string[] {
  if (!Array.isArray(value) || value.length === 0)
    throw new Error(`${label} must have explicit scope`)
  const strings = value.map((entry) => nonEmptyString(entry, label))
  if (strings.some((entry) => entry.includes("*")) || new Set(strings).size !== strings.length) {
    throw new Error(`${label} cannot contain wildcards or duplicates`)
  }
  return strings
}

export function sameScope(left: string[], right: string[]): boolean {
  const sortedRight = [...right].sort()
  return (
    left.length === right.length &&
    [...left].sort().every((entry, index) => entry === sortedRight[index])
  )
}

export function parseHumanReview(value: unknown): HumanReviewRecord {
  const record = strictObject(
    value,
    [
      "schemaVersion",
      "reviewer",
      "authoredAt",
      "decision",
      "family",
      "runId",
      "evidenceHash",
      "inputFingerprint",
      "caseIds",
      "exceptions",
    ],
    "Review",
  )
  if (record.schemaVersion !== 1) throw new Error("Unsupported review schema")
  if (record.decision !== "accepted" && record.decision !== "rejected")
    throw new Error("Invalid human decision")
  if (!Array.isArray(record.exceptions)) throw new Error("Review exceptions must be an array")
  const exceptions = record.exceptions.map((entry) => {
    const exception = strictObject(
      entry,
      ["caseId", "assertionIds", "reason", "expiresAt"],
      "Exception",
    )
    return {
      caseId: nonEmptyString(exception.caseId, "Exception case"),
      assertionIds: uniqueStrings(exception.assertionIds, "Exception assertions"),
      reason: nonEmptyString(exception.reason, "Exception reason"),
      expiresAt: timestamp(exception.expiresAt, "Exception expiry"),
    }
  })
  return {
    schemaVersion: 1,
    reviewer: nonEmptyString(record.reviewer, "Reviewer"),
    authoredAt: timestamp(record.authoredAt, "Review date"),
    decision: record.decision,
    family: nonEmptyString(record.family, "Review family"),
    runId: nonEmptyString(record.runId, "Review run"),
    evidenceHash: sha256String(record.evidenceHash, "Evidence hash"),
    inputFingerprint: sha256String(record.inputFingerprint, "Input fingerprint"),
    caseIds: uniqueStrings(record.caseIds, "Review cases"),
    exceptions,
  }
}

// This projects a supplied human record; it never authors a decision or changes proof outcomes.
export function evaluateHumanReview(
  value: unknown,
  context: ReviewContext,
  now = new Date(),
): ReviewAssessment {
  if (value === undefined || value === null)
    return { state: "unreviewed", reasons: [], exceptions: [] }
  let record: HumanReviewRecord
  try {
    record = parseHumanReview(value)
    if (Date.parse(record.authoredAt) > now.getTime()) throw new Error("Review is future-dated")
    const scopes = new Set<string>()
    for (const exception of record.exceptions) {
      if (!record.caseIds.includes(exception.caseId))
        throw new Error("Exception case is outside review scope")
      if (Date.parse(exception.expiresAt) <= Date.parse(record.authoredAt))
        throw new Error("Exception expiry must follow review date")
      const known = context.assertionIdsByCase?.[exception.caseId]
      if (!known || exception.assertionIds.some((id) => !known.includes(id)))
        throw new Error("Exception assertions are not present in exact evidence")
      for (const id of exception.assertionIds) {
        const key = `${exception.caseId}:${id}`
        if (scopes.has(key)) throw new Error("Exception assertion is duplicated")
        scopes.add(key)
      }
    }
  } catch (error) {
    return {
      state: "invalid",
      reasons: [error instanceof Error ? error.message : "Invalid review"],
      exceptions: [],
    }
  }
  const reasons: string[] = []
  if (record.family !== context.family || !sameScope(record.caseIds, context.caseIds))
    reasons.push("Review scope differs from selected evidence")
  if (record.runId !== context.runId || record.evidenceHash !== context.evidenceHash)
    reasons.push("Review binds to different evidence")
  if (context.latestRunId !== context.runId) reasons.push("A newer run invalidates this review")
  if (
    record.inputFingerprint !== context.inputFingerprint ||
    context.inputFingerprint !== context.currentInputFingerprint
  )
    reasons.push("Review inputs changed")
  const stale = reasons.length > 0
  return {
    state: stale ? "stale" : record.decision,
    reasons,
    reviewer: record.reviewer,
    exceptions: record.exceptions.map((exception) => ({
      ...exception,
      state: stale
        ? "stale"
        : Date.parse(exception.expiresAt) <= now.getTime()
          ? "expired"
          : "active",
    })),
  }
}
