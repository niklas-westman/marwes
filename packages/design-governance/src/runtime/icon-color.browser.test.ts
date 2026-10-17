import { readFileSync } from "node:fs"
import { resolve } from "node:path"
import { type Browser, chromium } from "playwright"
import { afterAll, beforeAll, expect, it } from "vitest"
import { adapters } from "../contracts/report.js"
import { requireValue } from "../contracts/require-value.js"
import type { LegacyContract } from "../source/types.js"
import { startPortal } from "./portal.js"

const root = resolve(import.meta.dirname, "../../../..")
const contract: LegacyContract = JSON.parse(
  readFileSync(
    resolve(root, "packages/design-governance/reflection-families/button/reflection-contract.json"),
    "utf8",
  ),
)
let browser: Browser
beforeAll(async () => {
  browser = await chromium.launch()
})
afterAll(async () => {
  await browser?.close()
})

for (const adapter of adapters)
  it(`${adapter}: canonical Refresh fill follows all public Icon color classes`, async () => {
    const cases = ["light", "dark"].map((mode) =>
      requireValue(
        contract.cases.find((c) => c.caseId === "button.purpose-refresh" && c.mode === mode),
      ),
    )
    const portal = await startPortal(root, adapter, cases)
    const page = await browser.newPage()
    try {
      for (const c of cases) {
        await page.goto(portal.url + c.portalPath)
        await page.waitForFunction(() =>
          Boolean(
            (window as GovernanceWindow).__governanceReady ||
              (window as GovernanceWindow).__governanceError,
          ),
        )
        expect(
          await page.evaluate(() => (window as GovernanceWindow).__governanceError),
        ).toBeUndefined()
        const svg = page.locator(".mw-btn svg.mw-icon")
        expect(await svg.locator("path").count()).toBe(1)
        const colors = {
          currentColor: "rgb(17, 19, 23)",
          primary: "rgb(31, 43, 59)",
          secondary: "rgb(61, 73, 89)",
          muted: "rgb(97, 101, 103)",
        }
        await svg.evaluate((node) => {
          const element = node as SVGElement
          element.style.color = "rgb(17, 19, 23)"
          element.style.setProperty("--mw-color-primary-base", "rgb(31, 43, 59)")
          element.style.setProperty("--mw-color-secondary-base", "rgb(61, 73, 89)")
          element.style.setProperty("--mw-color-text-muted", "rgb(97, 101, 103)")
        })
        for (const [color, expected] of Object.entries(colors)) {
          await svg.evaluate((node, color) => {
            for (const value of ["currentColor", "primary", "secondary", "muted"])
              node.classList.remove(`mw-icon--${value}`)
            node.classList.add(`mw-icon--${color}`)
          }, color)
          expect(
            await svg.evaluate((node) => getComputedStyle(node).stroke),
            `${c.mode}/${color}: stroke`,
          ).toBe(expected)
          expect(
            await svg.locator("path").evaluate((node) => getComputedStyle(node).fill),
            `${c.mode}/${color}: fill`,
          ).toBe(expected)
          if (color !== "currentColor") {
            // Reproduce the original defect: direct currentColor ignores themed Icon color classes.
            await svg.locator("path").evaluate((node) => {
              ;(node as SVGElement).style.fill = "currentColor"
            })
            expect(
              await svg.locator("path").evaluate((node) => getComputedStyle(node).fill),
            ).not.toBe(expected)
            await svg
              .locator("path")
              .evaluate((node) => (node as SVGElement).style.removeProperty("fill"))
          }
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
