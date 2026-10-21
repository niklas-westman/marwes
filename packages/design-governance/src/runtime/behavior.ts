import { existsSync, readFileSync } from "node:fs"
import { join } from "node:path"
import type { Page } from "playwright"
import { z } from "zod"
import type { ProofOutcome } from "../contracts/report.js"
import { requireValue } from "../contracts/require-value.js"

const selector = z.string().min(1).max(500)
const key = z.enum([
  "Enter",
  "Space",
  "Tab",
  "Shift+Tab",
  "Escape",
  "ArrowUp",
  "ArrowDown",
  "ArrowLeft",
  "ArrowRight",
  "Home",
  "End",
])
const step = z.discriminatedUnion("kind", [
  z.object({ kind: z.literal("fill"), selector, value: z.string() }).strict(),
  z.object({ kind: z.literal("value"), selector, expected: z.string() }).strict(),
  z
    .object({
      kind: z.literal("url-hash"),
      expected: z
        .string()
        .refine((value) => value === "" || value.startsWith("#"), "Expected URL hash"),
    })
    .strict(),
  z.object({ kind: z.literal("text"), selector, expected: z.string() }).strict(),
  z.object({ kind: z.literal("focus"), selector }).strict(),
  z.object({ kind: z.literal("press"), key }).strict(),
  z.object({ kind: z.literal("click"), selector }).strict(),
  z.object({ kind: z.literal("focused"), selector, expected: z.boolean() }).strict(),
  z.object({ kind: z.literal("focus-visible"), selector, expected: z.boolean() }).strict(),
  z.object({ kind: z.literal("disabled"), selector, expected: z.boolean() }).strict(),
  z
    .object({
      kind: z.literal("attribute"),
      selector,
      name: z.string().min(1),
      expected: z.string().nullable(),
    })
    .strict(),
  z
    .object({
      kind: z.literal("accessible-name"),
      selector,
      role: z.string().min(1),
      expected: z.string(),
    })
    .strict(),
  z
    .object({
      kind: z.literal("event-count"),
      observation: z.string().min(1),
      expected: z.number().int().nonnegative(),
    })
    .strict(),
])
const scenario = z
  .object({
    id: z.string().regex(/^[a-z0-9.-]+$/),
    caseId: z.string().regex(/^[a-z0-9.-]+$/),
    mode: z.enum(["light", "dark"]),
    authority: z
      .object({
        kind: z.enum(["public-contract", "accessibility-standard"]),
        reference: z.string().min(1),
      })
      .strict(),
    observations: z
      .array(
        z
          .object({
            id: z.string().min(1),
            selector,
            event: z.enum(["click", "submit", "reset", "change", "input"]),
          })
          .strict(),
      )
      .default([]),
    steps: z.array(step).min(1).max(100),
  })
  .strict()
  .superRefine((value, context) => {
    const ids = value.observations.map((entry) => entry.id)
    if (new Set(ids).size !== ids.length)
      context.addIssue({ code: "custom", message: "Duplicate observation" })
    if (!value.steps.some((entry) => !["focus", "press", "click", "fill"].includes(entry.kind)))
      context.addIssue({ code: "custom", message: "Behavior scenarios require assertions" })
    for (const entry of value.steps)
      if (entry.kind === "event-count" && !ids.includes(entry.observation))
        context.addIssue({ code: "custom", message: "Unknown event observation" })
  })
const contractSchema = z
  .object({
    schemaVersion: z.literal(1),
    family: z.string().regex(/^[a-z0-9-]+$/),
    applicability: z.discriminatedUnion("kind", [
      z.object({ kind: z.literal("interactive") }).strict(),
      z
        .object({
          kind: z.literal("noninteractive"),
          reason: z.string().min(1),
          authority: z.string().min(1),
        })
        .strict(),
    ]),
    scenarios: z.array(scenario),
  })
  .strict()
  .superRefine((value, context) => {
    if (new Set(value.scenarios.map((entry) => entry.id)).size !== value.scenarios.length)
      context.addIssue({ code: "custom", message: "Duplicate behavior scenario" })
    if (value.applicability.kind === "noninteractive" && value.scenarios.length)
      context.addIssue({
        code: "custom",
        message: "Noninteractive applicability cannot include scenarios",
      })
  })
export type BehaviorContract = z.infer<typeof contractSchema>
export type BehaviorScenario = BehaviorContract["scenarios"][number]
export const parseBehaviorContract = (value: unknown): BehaviorContract =>
  contractSchema.parse(value)
export function loadBehaviorContract(
  repoRoot: string,
  family: string,
): BehaviorContract | undefined {
  const path = join(
    repoRoot,
    "packages/design-governance/reflection-families",
    family,
    "behavior-contract.json",
  )
  if (!existsSync(path)) return undefined
  const contract = parseBehaviorContract(JSON.parse(readFileSync(path, "utf8")))
  if (contract.family !== family) throw Error("Behavior contract family mismatch")
  return contract
}
export function behaviorEnrollmentGap(
  contract: BehaviorContract | undefined,
  caseId?: string,
  mode?: string,
): string | undefined {
  if (!contract) return "Behavior contract not enrolled"
  if (contract.applicability.kind === "noninteractive")
    return "Required behavior conflicts with noninteractive applicability"
  if (!contract.scenarios.some((entry) => entry.caseId === caseId && entry.mode === mode))
    return "Behavior scenario not enrolled"
  return undefined
}
export type BehaviorResult = {
  scenarioId: string
  outcome: ProofOutcome
  steps: {
    index: number
    kind: string
    outcome: "passed" | "failed" | "error"
    diagnostic?: string
  }[]
}

/** Only declarative, allowlisted browser operations execute; contracts never contain code. */
export async function runBehavior(
  page: Page,
  scenarios: BehaviorScenario[],
): Promise<BehaviorResult[]> {
  const results: BehaviorResult[] = []
  const fixtureURL = new URL(page.url())
  fixtureURL.hash = ""
  for (const scenario of scenarios) {
    const result: BehaviorResult = { scenarioId: scenario.id, outcome: "passed", steps: [] }
    results.push(result)
    try {
      await page.mouse.up()
      await page.goto(fixtureURL.href, { waitUntil: "networkidle" })
      await page.waitForFunction(
        () => Boolean((window as unknown as { __governanceReady?: boolean }).__governanceReady),
        {},
        { timeout: 60_000 },
      )
      for (const observation of scenario.observations) {
        const locator = page.locator(observation.selector)
        if ((await locator.count()) !== 1)
          throw Error(`Observation selector must resolve once: ${observation.selector}`)
        // Browser-local counters are read after each action, avoiding asynchronous binding races.
        await locator.evaluate((element, value) => {
          const state = window as unknown as { __governanceEvents?: Record<string, number> }
          state.__governanceEvents ??= {}
          state.__governanceEvents[value.id] = 0
          element.addEventListener(
            value.event,
            () => {
              const events = state.__governanceEvents
              const count = events?.[value.id]
              if (!events || count === undefined) throw Error("Behavior event counter is missing")
              events[value.id] = count + 1
            },
            { capture: true },
          )
        }, observation)
      }
      for (const [index, entry] of scenario.steps.entries()) {
        try {
          const locator = "selector" in entry ? page.locator(entry.selector) : undefined
          if (locator && (await locator.count()) !== 1)
            throw Error(`Selector must resolve once: ${"selector" in entry ? entry.selector : ""}`)
          let passed = true
          let actual: unknown
          switch (entry.kind) {
            case "focus":
              await requireValue(locator, "Behavior step requires a selected element").focus({
                timeout: 3000,
              })
              break
            case "press":
              await page.keyboard.press(entry.key)
              break
            case "click": {
              const bounds = await requireValue(
                locator,
                "Behavior step requires a selected element",
              ).boundingBox()
              if (!bounds) throw Error("Click target is not visible")
              await page.mouse.click(bounds.x + bounds.width / 2, bounds.y + bounds.height / 2)
              break
            }
            case "focused":
              actual = await requireValue(
                locator,
                "Behavior step requires a selected element",
              ).evaluate((element) => element === document.activeElement)
              passed = actual === entry.expected
              break
            case "focus-visible":
              actual = await requireValue(
                locator,
                "Behavior step requires a selected element",
              ).evaluate(
                (element) =>
                  element === document.activeElement && element.matches(":focus-visible"),
              )
              passed = actual === entry.expected
              break
            case "disabled":
              actual = await requireValue(
                locator,
                "Behavior step requires a selected element",
              ).isDisabled()
              passed = actual === entry.expected
              break
            case "url-hash":
              actual = new URL(page.url()).hash
              passed = actual === entry.expected
              break
            case "fill":
              await requireValue(locator, "Behavior step requires a selected element").fill(
                entry.value,
                { timeout: 3000 },
              )
              break
            case "value":
              actual = await requireValue(
                locator,
                "Behavior step requires a selected element",
              ).inputValue()
              passed = actual === entry.expected
              break
            case "text":
              actual = await requireValue(
                locator,
                "Behavior step requires a selected element",
              ).textContent()
              passed = actual === entry.expected
              break
            case "attribute":
              actual = await requireValue(
                locator,
                "Behavior step requires a selected element",
              ).getAttribute(entry.name)
              passed = actual === entry.expected
              break
            case "accessible-name":
              actual = await requireValue(locator, "Behavior step requires a selected element")
                .and(
                  page.getByRole(entry.role as Parameters<Page["getByRole"]>[0], {
                    name: entry.expected,
                    exact: true,
                  }),
                )
                .count()
              passed = actual === 1
              break
            case "event-count":
              actual = await page.evaluate(
                (id) =>
                  (window as unknown as { __governanceEvents: Record<string, number> })
                    .__governanceEvents[id],
                entry.observation,
              )
              passed = actual === entry.expected
              break
          }
          result.steps.push({
            index,
            kind: entry.kind,
            outcome: passed ? "passed" : "failed",
            ...(!passed
              ? {
                  diagnostic: `Expected ${JSON.stringify("expected" in entry ? entry.expected : null)}; received ${JSON.stringify(actual)}`,
                }
              : {}),
          })
          if (!passed) result.outcome = "failed"
        } catch (error) {
          result.steps.push({
            index,
            kind: entry.kind,
            outcome: "error",
            diagnostic: String(error),
          })
          result.outcome = "error"
          break
        }
      }
    } catch (error) {
      result.outcome = "error"
      result.steps.push({ index: -1, kind: "setup", outcome: "error", diagnostic: String(error) })
    }
  }
  return results
}

/** Validate executed evidence before displaying a stored behavior outcome. */
export function validateBehaviorEvidence(
  value: unknown,
  identity: {
    runId: string
    fingerprint: string
    family: string
    caseId: string
    mode: string
    adapter: string
  },
  outcome: ProofOutcome,
): void {
  const evidence = z
    .object({
      schemaVersion: z.literal(1),
      runId: z.string(),
      fingerprint: z.string(),
      family: z.string(),
      caseId: z.string(),
      mode: z.string(),
      adapter: z.string(),
      scenarios: z.array(scenario).min(1),
      results: z
        .array(
          z
            .object({
              scenarioId: z.string(),
              outcome: z.enum(["passed", "failed", "error"]),
              steps: z
                .array(
                  z
                    .object({
                      index: z.number().int(),
                      kind: z.string(),
                      outcome: z.enum(["passed", "failed", "error"]),
                      diagnostic: z.string().optional(),
                    })
                    .strict(),
                )
                .min(1),
            })
            .strict(),
        )
        .min(1),
    })
    .strict()
    .parse(value)
  for (const [key, expected] of Object.entries(identity))
    if (evidence[key as keyof typeof identity] !== expected)
      throw Error("Behavior evidence identity differs from report")
  if (evidence.scenarios.length !== evidence.results.length)
    throw Error("Behavior results incomplete")
  for (const [index, declared] of evidence.scenarios.entries()) {
    const result = requireValue(
      evidence.results[index],
      "Required behavior value: evidence.results[index]",
    )
    if (
      declared.caseId !== identity.caseId ||
      declared.mode !== identity.mode ||
      result.scenarioId !== declared.id
    )
      throw Error("Behavior scenario differs from case")
    if (
      result.outcome === "passed" &&
      (result.steps.length !== declared.steps.length ||
        result.steps.some(
          (step, index) =>
            step.index !== index ||
            step.kind !== declared.steps[index]?.kind ||
            step.outcome !== "passed",
        ))
    )
      throw Error("Behavior pass contradicts executed assertions")
    if (result.outcome === "failed" && !result.steps.some((step) => step.outcome === "failed"))
      throw Error("Behavior failure lacks assertion evidence")
    if (result.outcome === "error" && !result.steps.some((step) => step.outcome === "error"))
      throw Error("Behavior error lacks evidence")
  }
  const combined = evidence.results.some((result) => result.outcome === "error")
    ? "error"
    : evidence.results.some((result) => result.outcome === "failed")
      ? "failed"
      : "passed"
  if (combined !== outcome) throw Error("Behavior outcome contradicts executable evidence")
}
