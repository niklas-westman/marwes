import type { ReviewAssessment } from "../review/index.js"
export type Adapter = "react" | "vue" | "svelte"
export const adapters: Adapter[] = ["react", "vue", "svelte"]
export type ProofOutcome = "passed" | "failed" | "unsupported" | "not-run" | "error"
export type SourceFact = {
  fileKey: string
  nodeId: string
  propertyPath: string
  aliasChain?: string[]
  modeId?: string
  collectionId?: string
}
export type Expectation = {
  part: string
  selector: string
  property: string
  expected: string | number | boolean
  tolerance: number
  comparison?: "numeric" | "exact"
  source: SourceFact
}
export type Measurement = Expectation & {
  actual: string | number | boolean | null
  delta: number | null
  outcome: ProofOutcome
  diagnostic?: string
}
export type Artifact = {
  path: string
  sha256: string
  mimeType: string
  role?: "reference" | "actual" | "diff" | "capture" | "behavior"
}
export type CaseReport = {
  proofScope?: "behavior-only"
  caseId: string
  adapter: Adapter
  mode: string
  sourceUrl: string
  measurements: Measurement[]
  outcomes: {
    integrity: ProofOutcome
    structural: ProofOutcome
    visual: ProofOutcome
    behavior: ProofOutcome
    coverage: ProofOutcome
  }
  unsupported: string[]
  limitations?: string[]
  artifacts: Artifact[]
  requiredProofs?: ("integrity" | "structural" | "visual" | "behavior" | "coverage")[]
}
export type GovernanceReport = {
  schemaVersion: 1
  runId: string
  family: string
  startedAt: string
  finishedAt: string
  fingerprint: string
  environment: Record<string, string>
  cases: CaseReport[]
  freshness: { state: "current" | "stale" | "invalid" | "never-run"; reasons: string[] }
  review: {
    state: "unreviewed" | "accepted" | "rejected" | "stale"
    reasons?: string[]
    reviewer?: string
    exceptions?: ReviewAssessment["exceptions"]
  }
  outcome: "passed" | "failed" | "blocked"
}

/** Human acceptance is deliberately not part of automated proof composition. */
export function composeOutcome(
  cases: CaseReport[],
  freshness: GovernanceReport["freshness"],
): GovernanceReport["outcome"] {
  if (freshness.state !== "current" || !cases.length) return "blocked"
  if (
    cases.some((item) =>
      Object.values(item.outcomes).some((value) => value === "failed" || value === "error"),
    )
  )
    return "failed"
  if (
    cases.some((item) =>
      (item.requiredProofs ?? ["integrity", "structural", "visual", "coverage"]).some(
        (key) => item.outcomes[key] !== "passed",
      ),
    )
  )
    return "blocked"
  return "passed"
}

function object(
  value: unknown,
  keys: string[],
  label: string,
): asserts value is Record<string, unknown> {
  if (!value || typeof value !== "object" || Array.isArray(value))
    throw new Error(`${label} must be an object`)
  if (Object.keys(value).some((key) => !keys.includes(key)))
    throw new Error(`${label} contains unknown keys`)
  if (keys.some((key) => !(key in value))) throw new Error(`${label} is missing required fields`)
}
export function parseReport(value: unknown): GovernanceReport {
  object(
    value,
    [
      "schemaVersion",
      "runId",
      "family",
      "startedAt",
      "finishedAt",
      "fingerprint",
      "environment",
      "cases",
      "freshness",
      "review",
      "outcome",
    ],
    "report",
  )
  if (
    value.schemaVersion !== 1 ||
    typeof value.runId !== "string" ||
    !/^[a-z0-9-]+$/.test(value.runId) ||
    typeof value.family !== "string" ||
    !/^[a-z0-9-]+$/.test(value.family) ||
    typeof value.fingerprint !== "string" ||
    !/^[a-f0-9]{64}$/.test(value.fingerprint)
  )
    throw new Error("Invalid report identity")
  for (const key of ["startedAt", "finishedAt"] as const)
    if (typeof value[key] !== "string" || !Number.isFinite(Date.parse(value[key])))
      throw new Error(`Invalid ${key}`)
  object(value.freshness, ["state", "reasons"], "freshness")
  if (
    !["current", "stale", "invalid", "never-run"].includes(String(value.freshness.state)) ||
    !Array.isArray(value.freshness.reasons) ||
    value.freshness.reasons.some((reason) => typeof reason !== "string")
  )
    throw new Error("Invalid freshness")
  const reviewKeys = ["state"]
  if (value.review && typeof value.review === "object")
    for (const key of ["reasons", "reviewer", "exceptions"])
      if (key in value.review) reviewKeys.push(key)
  object(value.review, reviewKeys, "review")
  if (
    value.review.reasons !== undefined &&
    (!Array.isArray(value.review.reasons) ||
      value.review.reasons.some((reason) => typeof reason !== "string"))
  )
    throw Error("Invalid review reasons")
  if (value.review.reviewer !== undefined && typeof value.review.reviewer !== "string")
    throw Error("Invalid reviewer")
  if (value.review.exceptions !== undefined && !Array.isArray(value.review.exceptions))
    throw Error("Invalid review exceptions")
  if (!["unreviewed", "accepted", "rejected", "stale"].includes(String(value.review.state)))
    throw new Error("Invalid review")
  if (
    !value.environment ||
    typeof value.environment !== "object" ||
    Array.isArray(value.environment) ||
    Object.values(value.environment).some((entry) => typeof entry !== "string")
  )
    throw new Error("Invalid environment")
  if (!Array.isArray(value.cases)) throw new Error("Invalid cases")
  const proofValues = ["passed", "failed", "unsupported", "not-run", "error"]
  for (const item of value.cases) {
    const caseKeys = [
      "caseId",
      "adapter",
      "mode",
      "sourceUrl",
      "measurements",
      "outcomes",
      "unsupported",
      "artifacts",
    ]
    if (item.proofScope !== undefined) caseKeys.push("proofScope")
    if (item.requiredProofs !== undefined) caseKeys.push("requiredProofs")
    if (item.limitations !== undefined) caseKeys.push("limitations")
    object(item, caseKeys, "case")
    if (
      item.limitations !== undefined &&
      (!Array.isArray(item.limitations) ||
        item.limitations.some((entry: unknown) => typeof entry !== "string"))
    )
      throw Error("Invalid proof limitations")
    if (item.proofScope !== undefined && item.proofScope !== "behavior-only")
      throw Error("Invalid case proof scope")
    if (
      item.requiredProofs !== undefined &&
      (!Array.isArray(item.requiredProofs) ||
        !item.requiredProofs.includes("integrity") ||
        (item.proofScope !== "behavior-only" && !item.requiredProofs.includes("visual")) ||
        item.requiredProofs.some(
          (key: unknown) =>
            !["integrity", "structural", "visual", "behavior", "coverage"].includes(String(key)),
        ))
    )
      throw Error("Invalid required proof policy")
    if (
      typeof item.caseId !== "string" ||
      typeof item.mode !== "string" ||
      typeof item.sourceUrl !== "string" ||
      !adapters.includes(item.adapter as Adapter)
    )
      throw new Error("Invalid case identity")
    object(item.outcomes, ["integrity", "structural", "visual", "behavior", "coverage"], "outcomes")
    if (Object.values(item.outcomes).some((entry) => !proofValues.includes(String(entry))))
      throw new Error("Invalid proof outcome")
    if (
      !Array.isArray(item.unsupported) ||
      item.unsupported.some((entry) => typeof entry !== "string") ||
      !Array.isArray(item.measurements) ||
      !Array.isArray(item.artifacts)
    )
      throw new Error("Invalid case evidence")
    if (
      item.proofScope === "behavior-only" &&
      (!Array.isArray(item.requiredProofs) ||
        item.requiredProofs.length !== 3 ||
        !["integrity", "behavior", "coverage"].every((key) =>
          (item.requiredProofs as string[]).includes(key),
        ) ||
        item.outcomes.structural !== "not-run" ||
        item.outcomes.visual !== "not-run" ||
        item.measurements.length ||
        item.sourceUrl !== "" ||
        item.artifacts.some(
          (artifact: Artifact) =>
            artifact.role !== "behavior" || artifact.mimeType !== "application/json",
        ))
    )
      throw Error("Behavior-only proof must not substitute design evidence")
    for (const row of item.measurements) {
      const required = [
        "part",
        "selector",
        "property",
        "expected",
        "tolerance",
        "source",
        "actual",
        "delta",
        "outcome",
      ]
      if (
        !row ||
        typeof row !== "object" ||
        required.some((key) => !(key in row)) ||
        Object.keys(row).some((key) => ![...required, "comparison", "diagnostic"].includes(key))
      )
        throw new Error("Malformed measurement")
      if (
        !["string", "number", "boolean"].includes(typeof row.expected) ||
        (row.actual !== null && !["string", "number", "boolean"].includes(typeof row.actual)) ||
        (typeof row.expected === "number" && !Number.isFinite(row.expected)) ||
        (typeof row.actual === "number" && !Number.isFinite(row.actual)) ||
        typeof row.tolerance !== "number" ||
        !Number.isFinite(row.tolerance) ||
        row.tolerance < 0 ||
        !proofValues.includes(row.outcome) ||
        (row.delta !== null && (typeof row.delta !== "number" || !Number.isFinite(row.delta)))
      )
        throw new Error("Malformed measurement values")
      if (
        ![row.part, row.selector, row.property].every(
          (entry) => typeof entry === "string" && entry.length,
        )
      )
        throw new Error("Missing semantic mapping")
      if (row.comparison !== undefined && !["numeric", "exact"].includes(row.comparison))
        throw Error("Invalid comparison method")
      if (
        row.source?.aliasChain !== undefined &&
        (!Array.isArray(row.source.aliasChain) ||
          row.source.aliasChain.some((id: unknown) => typeof id !== "string"))
      )
        throw Error("Invalid alias chain")
      for (const key of ["modeId", "collectionId"])
        if (row.source?.[key] !== undefined && typeof row.source[key] !== "string")
          throw Error("Invalid source mode")
      if (
        !row.source ||
        ![row.source.fileKey, row.source.nodeId, row.source.propertyPath].every(
          (entry) => typeof entry === "string" && entry.length,
        ) ||
        Object.keys(row.source).some(
          (key) =>
            !["fileKey", "nodeId", "propertyPath", "aliasChain", "modeId", "collectionId"].includes(
              key,
            ),
        )
      )
        throw new Error("Missing source identifiers")
    }
    if (
      item.outcomes.structural === "passed" &&
      (!item.measurements.length ||
        item.measurements.some((row: { outcome: string }) => row.outcome !== "passed"))
    )
      throw Error("Structural outcome contradicts measurements")
    if (item.outcomes.coverage === "passed" && item.unsupported.length)
      throw Error("Coverage outcome contradicts unsupported properties")
    if (
      item.outcomes.behavior === "passed" &&
      !item.artifacts.some(
        (artifact: Artifact) =>
          artifact.role === "behavior" && artifact.mimeType === "application/json",
      )
    )
      throw Error("Behavior outcome lacks hashed executable evidence")
    for (const artifact of item.artifacts) {
      object(
        artifact,
        ["path", "sha256", "mimeType", ...(artifact.role !== undefined ? ["role"] : [])],
        "artifact",
      )
      if (
        artifact.role !== undefined &&
        !["reference", "actual", "diff", "capture", "behavior"].includes(String(artifact.role))
      )
        throw Error("Invalid artifact role")
      if (
        typeof artifact.path !== "string" ||
        artifact.path.startsWith("/") ||
        artifact.path.split(/[\\/]/).includes("..") ||
        typeof artifact.sha256 !== "string" ||
        !/^[a-f0-9]{64}$/.test(artifact.sha256) ||
        typeof artifact.mimeType !== "string"
      )
        throw new Error("Invalid artifact")
    }
  }
  if (!["passed", "failed", "blocked"].includes(String(value.outcome)))
    throw new Error("Invalid combined outcome")
  const report = value as unknown as GovernanceReport
  if (report.outcome !== composeOutcome(report.cases, report.freshness))
    throw new Error("Combined outcome contradicts required proof")
  return report
}
