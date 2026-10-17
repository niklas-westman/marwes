import { describe, expect, it } from "vitest"
import { type HumanReviewRecord, type ReviewContext, evaluateHumanReview } from "./human-review.js"

const fingerprint = "a".repeat(64)
const now = new Date("2026-10-14T12:00:00Z")
const context: ReviewContext = {
  family: "button",
  runId: "run-1",
  evidenceHash: "b".repeat(64),
  inputFingerprint: fingerprint,
  latestRunId: "run-1",
  currentInputFingerprint: fingerprint,
  caseIds: ["button.basic.react"],
  assertionIdsByCase: { "button.basic.react": ["padding", "color"] },
}
const review: HumanReviewRecord = {
  schemaVersion: 1,
  reviewer: "Niklas",
  authoredAt: "2026-10-14T10:00:00Z",
  decision: "accepted",
  family: "button",
  runId: "run-1",
  evidenceHash: context.evidenceHash,
  inputFingerprint: fingerprint,
  caseIds: ["button.basic.react"],
  exceptions: [],
}

describe("human review binding", () => {
  it("projects an exact human-authored decision without altering proof", () => {
    expect(evaluateHumanReview(review, context, now).state).toBe("accepted")
    expect(evaluateHumanReview({ ...review, decision: "rejected" }, context, now).state).toBe(
      "rejected",
    )
    expect(evaluateHumanReview(undefined, context, now).state).toBe("unreviewed")
  })

  it.each([
    { latestRunId: "run-2" },
    { currentInputFingerprint: "c".repeat(64) },
    { evidenceHash: "c".repeat(64) },
    { caseIds: ["button.secondary.react"] },
  ])("invalidates acceptance for changed evidence/scope/inputs: %j", (change) => {
    expect(evaluateHumanReview(review, { ...context, ...change }, now).state).toBe("stale")
  })

  it.each([
    { caseIds: ["*"] },
    { caseIds: [context.caseIds[0], context.caseIds[0]] },
    { admin: true },
    { authoredAt: "2027-10-14T10:00:00Z" },
    { evidenceHash: "not-hashed" },
  ])("rejects malformed or broad records: %j", (change) => {
    expect(evaluateHumanReview({ ...review, ...change }, context, now).state).toBe("invalid")
  })

  it("tracks scoped expiry separately and marks exceptions stale with their run", () => {
    const record = {
      ...review,
      exceptions: [
        {
          caseId: context.caseIds[0],
          assertionIds: ["padding"],
          reason: "Observed subpixel discrepancy pending investigation",
          expiresAt: "2026-10-14T11:00:00Z",
        },
      ],
    }
    const result = evaluateHumanReview(record, context, now)
    expect(result.state).toBe("accepted")
    expect(result.exceptions[0]?.state).toBe("expired")
    expect(
      evaluateHumanReview(record, { ...context, latestRunId: "run-2" }, now).exceptions[0]?.state,
    ).toBe("stale")
    expect(
      evaluateHumanReview(
        {
          ...record,
          exceptions: [{ ...record.exceptions[0], assertionIds: ["absent"] }],
        },
        context,
        now,
      ).state,
    ).toBe("invalid")
  })
})
