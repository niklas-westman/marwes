import { readFileSync } from "node:fs"
import { resolve } from "node:path"
import { type Browser, chromium } from "playwright"
import { afterAll, beforeAll, expect, it } from "vitest"
import { type Expectation, adapters } from "../contracts/report.js"
import { requireValue } from "../contracts/require-value.js"
import type { LegacyContract } from "../source/types.js"
import { measure } from "./measure.js"
import { startPortal } from "./portal.js"

const root = resolve(import.meta.dirname, "../../../..")
const contract: LegacyContract = JSON.parse(
  readFileSync(
    resolve(root, "packages/design-governance/reflection-families/button/reflection-contract.json"),
    "utf8",
  ),
)

// Pinned October 14 standard master 1364:11348 supplies the 2px stroke.
// Full source geometry/paint assertions live in button-focus-source.browser.test.ts.
// This test isolates focus visibility, hit testing, layout and forced-colors fallback.
const ringPaint: Expectation = {
  part: "standard-focus-ring",
  selector: ".mw-btn::after",
  property: "borderTopWidth",
  expected: 2,
  comparison: "numeric",
  tolerance: 0,
  source: { fileKey: contract.figmaFileKey, nodeId: "1364:11348", propertyPath: "strokeWeight" },
}

let browser: Browser
beforeAll(async () => {
  browser = await chromium.launch()
})
afterAll(async () => {
  await browser?.close()
})

for (const adapter of adapters)
  it(`${adapter}: paints the pinned keyboard focus ring without layout or pointer changes and retains forced-colors focus`, async () => {
    const cases = (["light", "dark"] as const).map((mode) =>
      requireValue(
        contract.cases.find(
          (entry) => entry.caseId === "button.standard-focus-example" && entry.mode === mode,
        ),
        `Missing standard focus example/${mode}`,
      ),
    )
    const portal = await startPortal(root, adapter, cases)
    try {
      for (const entry of cases) {
        if (entry.mode !== "light" && entry.mode !== "dark") throw Error("Unexpected focus mode")
        const expectations = [ringPaint]
        const page = await browser.newPage({ viewport: entry.viewportSize })
        try {
          await page.goto(`${portal.url}${entry.portalPath}`, { waitUntil: "networkidle" })
          await page.waitForFunction(() =>
            Boolean((window as unknown as { __governanceReady?: boolean }).__governanceReady),
          )
          const button = page.locator(".mw-btn")
          const unfocused = await measure(page, expectations)
          expect(
            unfocused.every((result) => result.actual === null && result.outcome === "failed"),
          ).toBe(true)
          const before = requireValue(await button.boundingBox())
          await page.keyboard.press("Tab")
          expect(
            await button.evaluate(
              (element) => element === document.activeElement && element.matches(":focus-visible"),
            ),
          ).toBe(true)
          const focused = await measure(page, expectations)
          expect(
            focused.every((result) => result.outcome === "passed"),
            JSON.stringify(focused),
          ).toBe(true)
          expect(await button.boundingBox()).toEqual(before)
          expect(
            await button.evaluate((element) => getComputedStyle(element, "::after").pointerEvents),
          ).toBe("none")
          await button.evaluate((element) => {
            element.setAttribute("data-focus-test-activations", "0")
            element.addEventListener("click", () => {
              element.setAttribute(
                "data-focus-test-activations",
                String(Number(element.getAttribute("data-focus-test-activations")) + 1),
              )
            })
          })
          const outerRing = { x: before.x - 5, y: before.y + before.height / 2 }
          expect(
            await page.evaluate(
              ({ x, y }) => Boolean(document.elementFromPoint(x, y)?.closest(".mw-btn")),
              outerRing,
            ),
          ).toBe(false)
          await page.mouse.click(outerRing.x, outerRing.y)
          expect(await button.getAttribute("data-focus-test-activations")).toBe("0")
          await page.mouse.click(before.x + before.width / 2, before.y + before.height / 2)
          expect(await button.getAttribute("data-focus-test-activations")).toBe("1")
          expect(await button.evaluate((element) => element.matches(":focus-visible"))).toBe(false)
          expect(
            (await measure(page, expectations)).every((result) => result.outcome === "failed"),
          ).toBe(true)
          // Return through keyboard navigation, rather than manufacturing focus with .focus().
          await page.keyboard.press("Tab")
          await page.keyboard.press("Shift+Tab")
          expect(await button.evaluate((element) => element.matches(":focus-visible"))).toBe(true)
          await page.emulateMedia({ forcedColors: "active" })
          const forced = await button.evaluate((element) => {
            const style = getComputedStyle(element)
            const systemColor = document.createElement("span")
            systemColor.style.color = "Highlight"
            document.body.append(systemColor)
            const highlight = getComputedStyle(systemColor).color
            systemColor.remove()
            return {
              width: style.outlineWidth,
              offset: style.outlineOffset,
              style: style.outlineStyle,
              color: style.outlineColor,
              highlight,
            }
          })
          // Forced colors uses the platform accessibility policy, independently
          // of the pinned standard-color Figma geometry above.
          expect(Number.parseFloat(forced.width)).toBeGreaterThan(0)
          expect(forced.style).toBe("solid")
          expect(Number.parseFloat(forced.offset)).toBeGreaterThanOrEqual(0)
          expect(forced.color).toBe(forced.highlight)
          expect(
            (await measure(page, expectations)).every((result) => result.actual === null),
          ).toBe(true)
          expect(await button.boundingBox()).toEqual(before)
          await page.emulateMedia({ forcedColors: "none" })
          await button.evaluate((element) => {
            if (!(element instanceof HTMLElement)) throw Error("Expected focusable Button")
            element.tabIndex = -1
            element.blur()
          })
          await page.keyboard.press("Tab")
          expect(await button.evaluate((element) => element === document.activeElement)).toBe(false)
          expect(
            (await measure(page, expectations)).every((result) => result.outcome === "failed"),
          ).toBe(true)
        } finally {
          await page.close()
        }
      }
    } finally {
      await portal.close()
    }
  })
