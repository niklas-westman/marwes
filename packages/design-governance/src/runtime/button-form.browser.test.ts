import { resolve } from "node:path"
import { type Browser, type Page, chromium } from "playwright"
import { afterAll, beforeAll, expect, it } from "vitest"
import { adapters } from "../contracts/report.js"
import { requireValue } from "../contracts/require-value.js"
import { loadBehaviorContract, runBehavior } from "./behavior.js"
import { startPortal } from "./portal.js"

const root = resolve(import.meta.dirname, "../../../..")
const kinds = ["submit", "reset"] as const
const modes = ["light", "dark"] as const
const cases = kinds.flatMap((kind) =>
  modes.map((mode) => ({
    caseId: `button.behavior-${kind}`,
    mode,
    portalPath: `/reflection/button/behavior-${kind}/${mode}`,
    viewportSize: { width: 640, height: 320 },
  })),
)
let browser: Browser
beforeAll(async () => {
  browser = await chromium.launch()
})
afterAll(async () => {
  await browser?.close()
})

async function state(page: Page) {
  return {
    callbacks: await page.getByTestId("button-behavior-callback-count").textContent(),
    submits: await page.getByTestId("button-behavior-submit-count").textContent(),
    resets: await page.getByTestId("button-behavior-reset-count").textContent(),
    value: await page.getByTestId("button-behavior-input").inputValue(),
    submitted: await page.getByTestId("button-behavior-submitted-value").textContent(),
  }
}
function expected(kind: (typeof kinds)[number], count: number) {
  return {
    callbacks: String(count),
    submits: kind === "submit" ? String(count) : "0",
    resets: kind === "reset" ? String(count) : "0",
    value: kind === "reset" ? "original" : "changed",
    submitted: kind === "submit" ? "changed" : "",
  }
}

for (const adapter of adapters)
  it(`${adapter}: real Submit/Reset form semantics and negative controls in both modes`, async () => {
    const portal = await startPortal(root, adapter, cases)
    const page = await browser.newPage({ viewport: requireValue(cases[0]).viewportSize })
    // Install defects before the behavior engine's navigation, not after its assertions.
    await page.addInitScript(() => {
      const defect = sessionStorage.getItem("governance-form-defect")
      if (!defect) return
      const observer = new MutationObserver(() => {
        const button = document.querySelector<HTMLButtonElement>(
          '[data-testid="button-behavior-trigger"]',
        )
        const form = document.querySelector<HTMLFormElement>('[data-testid="button-behavior-form"]')
        if (!button || !form) return
        if (defect === "type") button.type = "button"
        if (defect === "association") button.setAttribute("form", "missing-form")
        if (defect === "reset-default")
          form.addEventListener("reset", (event) => event.preventDefault())
        observer.disconnect()
      })
      observer.observe(document, { childList: true, subtree: true })
    })
    async function open(path: string) {
      await page.goto(portal.url + path)
      await page.waitForFunction(() => {
        if ((window as GovernanceWindow).__governanceError)
          throw Error((window as GovernanceWindow).__governanceError)
        return Boolean((window as GovernanceWindow).__governanceReady)
      })
      await page.getByTestId("button-behavior-input").fill("changed")
    }
    try {
      const contract = requireValue(loadBehaviorContract(root, "button"))
      for (const c of cases) {
        const kind = c.caseId.endsWith("submit") ? "submit" : "reset"
        await open(c.portalPath)
        const scenarios = contract.scenarios.filter(
          (s) => s.caseId === c.caseId && s.mode === c.mode,
        )
        expect(scenarios).toHaveLength(1)
        expect(
          (await runBehavior(page, scenarios)).map((result) => ({
            outcome: result.outcome,
            diagnostics: result.steps.filter((step) => step.outcome !== "passed"),
          })),
        ).toEqual([{ outcome: "passed", diagnostics: [] }])
        await open(c.portalPath)
        const button = page.getByTestId("button-behavior-trigger")
        expect(await button.getAttribute("type")).toBe(kind)
        expect(
          await page
            .getByRole("button", { name: kind === "submit" ? "Submit" : "Reset", exact: true })
            .count(),
        ).toBe(1)
        await button.focus()
        await page.keyboard.press("Enter")
        expect(await state(page)).toEqual(expected(kind, 1))
        await page.getByTestId("button-behavior-input").fill("changed")
        await button.click()
        expect(await state(page)).toEqual(expected(kind, 2))

        // A component which accidentally renders type=button must not pass native form proof.
        await open(c.portalPath)
        await button.evaluate((node) => {
          node.setAttribute("type", "button")
        })
        await button.click()
        expect(await state(page)).not.toEqual(expected(kind, 1))
        expect(await page.getByTestId(`button-behavior-${kind}-count`).textContent()).toBe("0")

        // Correct type without native form association also cannot pass.
        await open(c.portalPath)
        await button.evaluate((node) => {
          node.setAttribute("form", "missing-form")
        })
        await button.click()
        expect(await state(page)).not.toEqual(expected(kind, 1))
        expect(await page.getByTestId(`button-behavior-${kind}-count`).textContent()).toBe("0")

        for (const defect of kind === "reset"
          ? ["type", "association", "reset-default"]
          : ["type", "association"]) {
          await page.evaluate(
            (value) => sessionStorage.setItem("governance-form-defect", value),
            defect,
          )
          const broken = await runBehavior(page, scenarios)
          expect(broken).toHaveLength(1)
          expect(requireValue(broken[0]).outcome).toBe("failed")
          await page.evaluate(() => sessionStorage.removeItem("governance-form-defect"))
        }

        if (kind === "reset") {
          await open(c.portalPath)
          await page.getByTestId("button-behavior-form").evaluate((node) => {
            node.addEventListener("reset", (event) => event.preventDefault())
          })
          await button.click()
          expect(await page.getByTestId("button-behavior-reset-count").textContent()).toBe("1")
          expect(await page.getByTestId("button-behavior-input").inputValue()).toBe("changed")
          expect(await state(page)).not.toEqual(expected(kind, 1))
        }
      }
    } finally {
      await page.close()
      await portal.close()
    }
  })

type GovernanceWindow = Window & {
  __governanceReady?: boolean
  __governanceError?: string
  __cleanupFrameAlignment?: () => void
}
