import { rmSync } from "node:fs"
import { resolve } from "node:path"
import { type Browser, chromium } from "playwright"
import { afterAll, beforeAll, describe, expect, it } from "vitest"
import { compileFamily } from "../compile/compile-family.js"
import { adapters } from "../contracts/report.js"
import { requireValue } from "../contracts/require-value.js"
import { createOfflineProofFixture } from "../source/offline-test-fixture.js"
import { type BehaviorScenario, runBehavior } from "./behavior.js"
import { startPortal } from "./portal.js"
const repoRoot = resolve(import.meta.dirname, "../../../..")
const proofRoot = createOfflineProofFixture()
let browser: Browser
beforeAll(async () => {
  browser = await chromium.launch({ headless: true })
})
afterAll(async () => {
  await browser?.close()
  rmSync(proofRoot, { recursive: true, force: true })
})
for (const adapter of adapters)
  describe(adapter, () => {
    it("proves keyboard activation and detects focus and disabled defects on the real adapter", async () => {
      const entry = requireValue(
        compileFamily(proofRoot, "button").cases.find((entry) => entry.caseId === "button.basic"),
        'Required behavior value: compileFamily(proofRoot, "button").cases.find(\n        (entry) => entry.caseId === "button.basic",\n      )',
      )
      const portal = await startPortal(repoRoot, adapter, [entry])
      const page = await browser.newPage({ viewport: entry.viewportSize })
      const scenario: BehaviorScenario = {
        id: "button.keyboard",
        caseId: entry.caseId,
        mode: "light",
        authority: {
          kind: "accessibility-standard",
          reference: "WAI-ARIA APG button keyboard interaction",
        },
        observations: [{ id: "activation", selector: ".mw-btn", event: "click" }],
        steps: [
          { kind: "disabled", selector: ".mw-btn", expected: false },
          { kind: "accessible-name", selector: ".mw-btn", role: "button", expected: "Label" },
          { kind: "focus", selector: ".mw-btn" },
          { kind: "focused", selector: ".mw-btn", expected: true },
          { kind: "press", key: "Enter" },
          { kind: "press", key: "Space" },
          { kind: "click", selector: ".mw-btn" },
          { kind: "event-count", observation: "activation", expected: 3 },
          { kind: "text", selector: "[data-governance-button-activations]", expected: "3" },
        ],
      }
      try {
        await page.goto(portal.url + entry.portalPath)
        const good = requireValue(
          (await runBehavior(page, [scenario]))[0],
          "Required behavior value: (await runBehavior(page, [scenario]))[0]",
        )
        expect(good, JSON.stringify(good)).toMatchObject({ outcome: "passed" })
        let removedCallbacks = 0
        const callbackRoute = `**/packages/${adapter}/src/**/button/*`
        await page.route(callbackRoute, async (route) => {
          const response = await route.fetch()
          const original = await response.text()
          const expressions =
            adapter === "react"
              ? /props\.onClick\?\.\(e\)/g
              : adapter === "vue"
                ? /emit\("click", event\)/g
                : /(?:\$\$props\.)?onclick(?:\(\))?\?\.\(e\)/g
          const body = original.replace(expressions, () => {
            removedCallbacks++
            return "void 0"
          })
          await route.fulfill({ response, body })
        })
        const brokenCallback = requireValue(
          (await runBehavior(page, [scenario]))[0],
          "Required behavior value: (await runBehavior(page, [scenario]))[0]",
        )
        expect(removedCallbacks).toBeGreaterThan(0)
        expect(brokenCallback.outcome).toBe("failed")
        expect(brokenCallback.steps.find((step) => step.kind === "event-count")?.outcome).toBe(
          "passed",
        )
        expect(brokenCallback.steps.find((step) => step.kind === "text")?.outcome).toBe("failed")
        await page.unroute(callbackRoute)
        // An exact URL route preserves independent fixture defects through the runner's reload.
        await page.route("**/portal.js", async (route) => {
          const response = await route.fetch()
          await route.fulfill({
            response,
            body: (await response.text()).replace(
              "window.__governanceReady=true;",
              "document.querySelector('.mw-btn').disabled=true; window.__governanceReady=true;",
            ),
          })
        })
        const defective = requireValue(
          (await runBehavior(page, [scenario]))[0],
          "Required behavior value: (await runBehavior(page, [scenario]))[0]",
        )
        expect(defective.outcome).toBe("failed")
        expect(
          defective.steps.some((entry) => entry.kind === "disabled" && entry.outcome === "failed"),
        ).toBe(true)
        expect(
          defective.steps.some((entry) => entry.kind === "focused" && entry.outcome === "failed"),
        ).toBe(true)
        expect(
          defective.steps.some(
            (entry) => entry.kind === "event-count" && entry.outcome === "failed",
          ),
        ).toBe(true)
        const disabledScenario: BehaviorScenario = {
          ...scenario,
          id: "button.disabled",
          steps: scenario.steps.map((step) =>
            step.kind === "disabled"
              ? { ...step, expected: true }
              : step.kind === "focused"
                ? { ...step, expected: false }
                : step.kind === "event-count"
                  ? { ...step, expected: 0 }
                  : step.kind === "text"
                    ? { ...step, expected: "0" }
                    : step,
          ),
        }
        expect(
          requireValue(
            (await runBehavior(page, [disabledScenario]))[0],
            "Required behavior value: (await runBehavior(page, [disabledScenario]))[0]",
          ).outcome,
        ).toBe("passed")
        await page.unroute("**/portal.js")
        await page.route("**/portal.js", async (route) => {
          const response = await route.fetch()
          await route.fulfill({
            response,
            body: (await response.text()).replace(
              "window.__governanceReady=true;",
              "document.querySelector('.mw-btn').disabled=false; window.__governanceReady=true;",
            ),
          })
        })
        const brokenDisabled = requireValue(
          (await runBehavior(page, [disabledScenario]))[0],
          "Required behavior value: (await runBehavior(page, [disabledScenario]))[0]",
        )
        expect(brokenDisabled.outcome).toBe("failed")
        expect(
          brokenDisabled.steps.some(
            (step) => step.kind === "event-count" && step.outcome === "failed",
          ),
        ).toBe(true)
      } finally {
        await page.close()
        await portal.close()
      }
    })
  })

for (const adapter of adapters)
  it(`${adapter} distinguishes keyboard focus-visible from pointer and missing focus`, async () => {
    const entry = requireValue(
      compileFamily(proofRoot, "button").cases.find((entry) => entry.caseId === "button.basic"),
      'Required behavior value: compileFamily(proofRoot, "button").cases.find(\n      (entry) => entry.caseId === "button.basic",\n    )',
    )
    const portal = await startPortal(repoRoot, adapter, [entry])
    const page = await browser.newPage({ viewport: entry.viewportSize })
    const scenario: BehaviorScenario = {
      id: "button.focus-visible",
      caseId: entry.caseId,
      mode: "light",
      authority: { kind: "accessibility-standard", reference: "WCAG 2.4.7 Focus Visible" },
      observations: [],
      steps: [
        { kind: "press", key: "Tab" },
        { kind: "focused", selector: ".mw-btn", expected: true },
        { kind: "focus-visible", selector: ".mw-btn", expected: true },
      ],
    }
    try {
      await page.goto(portal.url + entry.portalPath)
      const keyboard = requireValue(
        (await runBehavior(page, [scenario]))[0],
        "Required behavior value: (await runBehavior(page, [scenario]))[0]",
      )
      expect(keyboard, JSON.stringify(keyboard)).toMatchObject({ outcome: "passed" })
      const pointer: BehaviorScenario = {
        ...scenario,
        id: "button.pointer-focus",
        steps: [
          { kind: "click", selector: ".mw-btn" },
          { kind: "focused", selector: ".mw-btn", expected: true },
          { kind: "focus-visible", selector: ".mw-btn", expected: false },
          // Programmatic focus after pointer input still does not establish keyboard modality.
          { kind: "focus", selector: ".mw-btn" },
          { kind: "focused", selector: ".mw-btn", expected: true },
          { kind: "focus-visible", selector: ".mw-btn", expected: false },
        ],
      }
      const pointerResult = requireValue(
        (await runBehavior(page, [pointer]))[0],
        "Required behavior value: (await runBehavior(page, [pointer]))[0]",
      )
      expect(pointerResult, JSON.stringify(pointerResult)).toMatchObject({ outcome: "passed" })
      const falseKeyboardProof = requireValue(
        (
          await runBehavior(page, [
            {
              ...pointer,
              steps: [
                { kind: "click", selector: ".mw-btn" },
                { kind: "focused", selector: ".mw-btn", expected: true },
                { kind: "focus-visible", selector: ".mw-btn", expected: true },
              ],
            },
          ])
        )[0],
        'Required behavior value: (await runBehavior(page, [{\n        ...pointer,\n        steps: [\n          { kind: "click", selector: ".mw-btn" },\n          { kind: "focused", selector: ".mw-btn", expected: true },\n          { kind: "focus-visible", selector: ".mw-btn", expected: true },\n        ],\n      }]))[0]',
      )
      expect(falseKeyboardProof.outcome).toBe("failed")
      expect(
        requireValue(
          falseKeyboardProof.steps[1],
          "Required behavior value: falseKeyboardProof.steps[1]",
        ).outcome,
      ).toBe("passed")
      expect(
        requireValue(
          falseKeyboardProof.steps[2],
          "Required behavior value: falseKeyboardProof.steps[2]",
        ).outcome,
      ).toBe("failed")
      await page.route("**/portal.js", async (route) => {
        const response = await route.fetch()
        await route.fulfill({
          response,
          body: (await response.text()).replace(
            "window.__governanceReady=true;",
            "document.querySelector('.mw-btn').tabIndex=-1; window.__governanceReady=true;",
          ),
        })
      })
      const unreachable = requireValue(
        (await runBehavior(page, [scenario]))[0],
        "Required behavior value: (await runBehavior(page, [scenario]))[0]",
      )
      expect(unreachable.outcome).toBe("failed")
      expect(unreachable.steps.find((step) => step.kind === "focus-visible")?.outcome).toBe(
        "failed",
      )
    } finally {
      await page.close()
      await portal.close()
    }
  })
