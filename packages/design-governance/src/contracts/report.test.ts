import { describe, expect, it } from "vitest"
import { reflectionOutcome } from "../runtime/visual.js"
import { type CaseReport, type GovernanceReport, composeOutcome, parseReport } from "./report.js"
const caseReport: CaseReport = {
  caseId: "button.basic",
  adapter: "react",
  mode: "light",
  sourceUrl: "https://figma.com",
  measurements: [
    {
      part: "root",
      selector: ".mw-btn",
      property: "bounds.width",
      expected: 66,
      actual: 66,
      delta: 0,
      tolerance: 0.6,
      source: { fileKey: "figma", nodeId: "1:2", propertyPath: "absoluteBoundingBox.width" },
      outcome: "passed",
    },
  ],
  outcomes: {
    integrity: "passed",
    structural: "passed",
    visual: "passed",
    coverage: "passed",
    behavior: "not-run",
  },
  unsupported: [],
  artifacts: [],
}
const report: GovernanceReport = {
  schemaVersion: 1,
  runId: "run-1",
  family: "button",
  startedAt: "2026-10-14T00:00:00Z",
  finishedAt: "2026-10-14T00:00:01Z",
  fingerprint: "a".repeat(64),
  environment: { node: "22" },
  cases: [caseReport],
  freshness: { state: "current", reasons: [] },
  review: { state: "unreviewed" },
  outcome: "passed",
}
describe("required proof composition", () => {
  it("does not turn a parseable failed Reflection check into success", () => {
    expect(reflectionOutcome("fail")).toBe("failed")
    expect(
      composeOutcome(
        [
          {
            ...caseReport,
            outcomes: { ...caseReport.outcomes, visual: reflectionOutcome("fail") },
          },
        ],
        report.freshness,
      ),
    ).toBe("failed")
  })
  it("blocks unsupported, missing and stale required proof", () => {
    for (const value of ["unsupported", "not-run"] as const)
      expect(
        composeOutcome(
          [{ ...caseReport, outcomes: { ...caseReport.outcomes, structural: value } }],
          report.freshness,
        ),
      ).toBe("blocked")
    expect(composeOutcome([caseReport], { state: "stale", reasons: ["changed"] })).toBe("blocked")
  })
  it("requires executed behavior evidence when behavior is required", () => {
    const item: CaseReport = {
      ...caseReport,
      requiredProofs: ["integrity", "structural", "visual", "coverage", "behavior"],
    }
    expect(composeOutcome([item], report.freshness)).toBe("blocked")
    const passing = { ...item, outcomes: { ...item.outcomes, behavior: "passed" as const } }
    expect(() => parseReport({ ...report, cases: [passing] })).toThrow("hashed executable evidence")
    passing.artifacts = [
      {
        path: "react-button-basic-light-behavior.json",
        sha256: "a".repeat(64),
        mimeType: "application/json",
        role: "behavior",
      },
    ]
    expect(parseReport({ ...report, cases: [passing] }).outcome).toBe("passed")
    expect(
      composeOutcome(
        [{ ...passing, outcomes: { ...passing.outcomes, behavior: "failed" } }],
        report.freshness,
      ),
    ).toBe("failed")
  })
  it("keeps review independent and rejects contradictory outcomes", () => {
    expect(parseReport(report).review.state).toBe("unreviewed")
    expect(() =>
      parseReport({
        ...report,
        cases: [{ ...caseReport, outcomes: { ...caseReport.outcomes, visual: "failed" } }],
      }),
    ).toThrow("contradicts")
  })
  it("rejects unknown report keys, malformed measurements and escaping artifacts", () => {
    expect(() => parseReport({ ...report, approved: true })).toThrow()
    expect(() =>
      parseReport({ ...report, cases: [{ ...caseReport, measurements: [{}] }] }),
    ).toThrow()
    expect(() =>
      parseReport({
        ...report,
        cases: [
          {
            ...caseReport,
            artifacts: [{ path: "../outside", sha256: "a".repeat(64), mimeType: "image/png" }],
          },
        ],
      }),
    ).toThrow()
  })
})

it("allows explicitly scoped behavior-only evidence without pretending to prove a design", () => {
  const item: CaseReport = {
    ...caseReport,
    proofScope: "behavior-only",
    sourceUrl: "",
    measurements: [],
    requiredProofs: ["integrity", "behavior", "coverage"],
    outcomes: {
      integrity: "passed",
      structural: "not-run",
      visual: "not-run",
      behavior: "passed",
      coverage: "passed",
    },
    artifacts: [
      {
        path: "form-behavior.json",
        mimeType: "application/json",
        sha256: "a".repeat(64),
        role: "behavior",
      },
    ],
  }
  expect(parseReport({ ...report, cases: [item] }).outcome).toBe("passed")
  expect(() => parseReport({ ...report, cases: [{ ...item, proofScope: undefined }] })).toThrow()
  expect(() =>
    parseReport({
      ...report,
      cases: [
        {
          ...item,
          artifacts: [
            ...item.artifacts,
            {
              path: "fake-reference.png",
              mimeType: "image/png",
              role: "reference",
              sha256: "a".repeat(64),
            },
          ],
        },
      ],
    }),
  ).toThrow("substitute design evidence")
  expect(() =>
    parseReport({ ...report, cases: [{ ...item, requiredProofs: ["integrity", "coverage"] }] }),
  ).toThrow()
})
