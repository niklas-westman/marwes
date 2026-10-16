import { describe, expect, it } from "vitest"
import { requireValue } from "../contracts/require-value.js"
import { behaviorEnrollmentGap, parseBehaviorContract } from "./behavior.js"
const value = {
  schemaVersion: 1,
  family: "button",
  applicability: { kind: "interactive" },
  scenarios: [
    {
      id: "button.keyboard",
      caseId: "button.basic",
      mode: "light",
      authority: {
        kind: "accessibility-standard",
        reference: "https://www.w3.org/WAI/ARIA/apg/patterns/button/",
      },
      observations: [{ id: "activation", selector: ".mw-btn", event: "click" }],
      steps: [
        { kind: "focus", selector: ".mw-btn" },
        { kind: "press", key: "Enter" },
        { kind: "event-count", observation: "activation", expected: 1 },
      ],
    },
  ],
}
describe("behavior contract", () => {
  it("requires exact enrolled case and mode", () => {
    const contract = parseBehaviorContract(value)
    expect(behaviorEnrollmentGap(contract, "button.basic", "light")).toBeUndefined()
    expect(behaviorEnrollmentGap(contract, "button.basic", "dark")).toContain("not enrolled")
    expect(behaviorEnrollmentGap(undefined)).toContain("not enrolled")
  })
  it("rejects code, unknown actions, duplicate scenarios and scenarios without assertions", () => {
    expect(() => parseBehaviorContract({ ...value, code: "alert(1)" })).toThrow()
    for (const steps of [
      [{ kind: "evaluate", code: "alert(1)" }],
      [{ kind: "focus", selector: ".mw-btn" }],
      [{ kind: "event-count", observation: "missing", expected: 0 }],
    ])
      expect(() =>
        parseBehaviorContract({ ...value, scenarios: [{ ...value.scenarios[0], steps }] }),
      ).toThrow()
    expect(() =>
      parseBehaviorContract({ ...value, scenarios: [value.scenarios[0], value.scenarios[0]] }),
    ).toThrow()
  })
  it("records noninteractive applicability without manufacturing a behavior pass", () => {
    const contract = parseBehaviorContract({
      ...value,
      applicability: { kind: "noninteractive", reason: "Static text", authority: "docs/text" },
      scenarios: [],
    })
    expect(behaviorEnrollmentGap(contract, "button.basic", "light")).toContain("conflicts")
    expect(() =>
      parseBehaviorContract({ ...value, applicability: contract.applicability }),
    ).toThrow()
  })
})

it("rejects a claimed behavior pass with omitted or failed executable assertions", async () => {
  const { validateBehaviorEvidence } = await import("./behavior.js")
  const contract = parseBehaviorContract(value)
  const scenario = requireValue(
    contract.scenarios[0],
    "Required behavior value: contract.scenarios[0]",
  )
  const identity = {
    runId: "run-1",
    fingerprint: "a".repeat(64),
    family: "button",
    caseId: scenario.caseId,
    mode: scenario.mode,
    adapter: "react",
  }
  const evidence = {
    schemaVersion: 1,
    ...identity,
    scenarios: [scenario],
    results: [
      {
        scenarioId: scenario.id,
        outcome: "passed",
        steps: scenario.steps.map((step, index) => ({ index, kind: step.kind, outcome: "passed" })),
      },
    ],
  }
  expect(() => validateBehaviorEvidence(evidence, identity, "passed")).not.toThrow()
  requireValue(evidence.results[0], "Required behavior value: evidence.results[0]").steps.pop()
  expect(() => validateBehaviorEvidence(evidence, identity, "passed")).toThrow("contradicts")
  expect(() =>
    validateBehaviorEvidence(evidence, { ...identity, adapter: "vue" }, "passed"),
  ).toThrow("identity")
})

it("accepts only local URL-hash assertions without executable navigation actions", () => {
  const scenario = requireValue(value.scenarios[0], "Required behavior value: value.scenarios[0]")
  expect(() =>
    parseBehaviorContract({
      ...value,
      scenarios: [{ ...scenario, steps: [{ kind: "url-hash", expected: "#governance-target" }] }],
    }),
  ).not.toThrow()
  expect(() =>
    parseBehaviorContract({
      ...value,
      scenarios: [{ ...scenario, steps: [{ kind: "url-hash", expected: "https://example.com" }] }],
    }),
  ).toThrow()
  expect(() =>
    parseBehaviorContract({
      ...value,
      scenarios: [{ ...scenario, steps: [{ kind: "navigate", url: "https://example.com" }] }],
    }),
  ).toThrow()
})

it("allows only typed focus-visible assertions and binds their executed evidence", async () => {
  const { validateBehaviorEvidence } = await import("./behavior.js")
  const source = requireValue(value.scenarios[0], "Required behavior value: value.scenarios[0]")
  const scenario = requireValue(
    parseBehaviorContract({
      ...value,
      scenarios: [
        {
          ...source,
          steps: [
            { kind: "press", key: "Tab" },
            { kind: "focused", selector: ".mw-btn", expected: true },
            { kind: "focus-visible", selector: ".mw-btn", expected: true },
          ],
        },
      ],
    }).scenarios[0],
    'Required behavior value: parseBehaviorContract({\n    ...value,\n    scenarios: [{ ...source, steps: [\n      { kind: "press", key: "Tab" },\n      { kind: "focused", selector: ".mw-btn", expected: true },\n      { kind: "focus-visible", selector: ".mw-btn", expected: true },\n    ] }],\n  }).scenarios[0]',
  )
  for (const assertion of [
    { kind: "focus-visible", selector: ".mw-btn", expected: "true" },
    { kind: "focus-visible", selector: ".mw-btn", expected: true, code: "alert(1)" },
  ])
    expect(() =>
      parseBehaviorContract({
        ...value,
        scenarios: [{ ...source, steps: [assertion] }],
      }),
    ).toThrow()
  const identity = {
    runId: "focus-run",
    fingerprint: "b".repeat(64),
    family: "button",
    caseId: scenario.caseId,
    mode: scenario.mode,
    adapter: "react",
  }
  const evidence = {
    schemaVersion: 1,
    ...identity,
    scenarios: [scenario],
    results: [
      {
        scenarioId: scenario.id,
        outcome: "passed",
        steps: scenario.steps.map((step, index) => ({ index, kind: step.kind, outcome: "passed" })),
      },
    ],
  }
  expect(() => validateBehaviorEvidence(evidence, identity, "passed")).not.toThrow()
  requireValue(
    requireValue(evidence.results[0], "Required behavior value: evidence.results[0]").steps[2],
    'Required behavior value: requireValue(evidence.results[0], "Required behavior value: evidence.results[0]").steps[2]',
  ).kind = "focused"
  expect(() => validateBehaviorEvidence(evidence, identity, "passed")).toThrow("contradicts")
})
