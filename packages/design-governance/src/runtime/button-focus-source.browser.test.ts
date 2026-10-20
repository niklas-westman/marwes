import { readFileSync } from "node:fs"
import { resolve } from "node:path"
import { type Browser, chromium } from "playwright"
import { afterAll, beforeAll, expect, it } from "vitest"
import { type Expectation, adapters } from "../contracts/report.js"
import { requireValue } from "../contracts/require-value.js"
import type { LegacyContract } from "../source/types.js"
import { loadBehaviorContract, runBehavior } from "./behavior.js"
import { applyBrowserState } from "./browser-state.js"
import { measure } from "./measure.js"
import { startPortal } from "./portal.js"

const root = resolve(import.meta.dirname, "../../../..")
const contract: LegacyContract = JSON.parse(
  readFileSync(
    resolve(root, "packages/design-governance/reflection-families/button/reflection-contract.json"),
    "utf8",
  ),
)
// Independent pinned Figma facts: Standard1364:11348, ring1461:13442,
// nested control3873:42699; capture2410234809276115335 (2026-10-14).
// Outer78×52/radius6/2px INSIDE stroke encloses66×40 at a6px inset.
const geometry = {
  borderWidth: 2,
  borderStyle: "solid",
  borderRadius: 6,
  width: 78,
  height: 52,
  left: -6,
  top: -6,
  boxSizing: "border-box",
}
const sourcePaths: Record<string, string> = {
  borderWidth: "strokeWeight",
  borderColor: "strokes.0.color",
  borderStyle: "strokes.0.type",
  borderRadius: "cornerRadius",
  width: "absoluteBoundingBox.width",
  height: "absoluteBoundingBox.height",
  left: "absoluteBoundingBox.x",
  top: "absoluteBoundingBox.y",
  boxSizing: "strokeAlign",
}
let browser: Browser
beforeAll(async () => {
  browser = await chromium.launch()
})
afterAll(async () => {
  await browser?.close()
})

for (const adapter of adapters)
  it(`${adapter}: matches independent Standard focus paint and detects geometry, paint, visibility and keyboard defects`, async () => {
    const cases = contract.cases.filter((entry) => entry.caseId === "button.standard-focus-example")
    expect(cases).toHaveLength(2)
    const portal = await startPortal(root, adapter, cases)
    try {
      for (const entry of cases) {
        const page = await browser.newPage({ viewport: entry.viewportSize })
        try {
          await page.goto(portal.url + entry.portalPath)
          await page.waitForFunction(() =>
            Boolean((window as unknown as { __governanceReady?: boolean }).__governanceReady),
          )
          const button = page.locator(".mw-btn")
          expect(
            await button.evaluate((element) => getComputedStyle(element, "::after").content),
          ).toBe("none")
          await page.keyboard.press("Tab")
          expect(
            await button.evaluate(
              (element) => element.matches(":focus-visible") && element === document.activeElement,
            ),
          ).toBe(true)
          await applyBrowserState(page, entry.browserState)
          const facts = {
            ...geometry,
            borderColor: entry.mode === "dark" ? "rgba(171, 171, 253, 1)" : "rgba(47, 49, 252, 1)",
          }
          const expectations: Expectation[] = Object.entries(facts).map(([property, expected]) => ({
            part: "standard-focus",
            selector: ".mw-btn::after",
            property,
            expected,
            tolerance: 0,
            comparison: typeof expected === "number" ? "numeric" : "exact",
            source: {
              fileKey: "nybMu3iJUnnOvWtuxjMG8b",
              nodeId: "1364:11348",
              propertyPath: requireValue(sourcePaths[property]),
            },
          }))
          expect((await measure(page, expectations)).map((result) => result.outcome)).toEqual(
            expectations.map(() => "passed"),
          )
          for (const declaration of [
            "border-width:1px",
            "left:-4px",
            "border-radius:8px",
            "border-color:rgb(255,0,0)",
            "display:none",
          ]) {
            const style = await page.addStyleTag({
              content: `.mw-btn:focus-visible::after { ${declaration} !important; }`,
            })
            const broken = await measure(page, expectations)
            expect(
              broken.some((result) => result.outcome !== "passed"),
              declaration,
            ).toBe(true)
            await style.evaluate((element) => element.parentNode?.removeChild(element))
          }
          const scenario = requireValue(
            loadBehaviorContract(root, "button")?.scenarios.find(
              (scenario) => scenario.caseId === entry.caseId && scenario.mode === entry.mode,
            ),
          )
          expect((await runBehavior(page, [scenario]))[0]?.outcome).toBe("passed")
          await page.route("**/portal.js", async (route) => {
            const response = await route.fetch()
            await route.fulfill({
              response,
              body: `${await response.text()}\ndocument.addEventListener('keydown', event => { if (event.key === 'Tab') event.preventDefault(); }, true);`,
            })
          })
          const broken = requireValue((await runBehavior(page, [scenario]))[0])
          expect(broken.outcome).toBe("failed")
          expect(broken.steps.find((step) => step.kind === "focus-visible")?.outcome).toBe("failed")
        } finally {
          await page.close()
        }
      }
    } finally {
      await portal.close()
    }
  })
