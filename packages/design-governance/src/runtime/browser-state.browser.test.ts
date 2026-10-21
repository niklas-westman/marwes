import { readFileSync } from "node:fs"
import { resolve } from "node:path"
import { type Browser, chromium } from "playwright"
import { afterAll, beforeAll, expect, it } from "vitest"
import { adapters } from "../contracts/report.js"
import { requireValue } from "../contracts/require-value.js"
import type { LegacyContract } from "../source/types.js"
import { applyBrowserState } from "./browser-state.js"
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
  it(`${adapter}: exercises native hover/pressed and renders disabled Button selections`, async () => {
    const cases = contract.cases.filter(
      (c) =>
        ["button.basic-hover", "button.basic-pressed", "button.basic-disabled"].includes(
          c.caseId,
        ) && c.mode === "light",
    )
    const portal = await startPortal(root, adapter, cases)
    try {
      for (const c of cases) {
        const page = await browser.newPage({ viewport: c.viewportSize })
        try {
          await page.goto(portal.url + c.portalPath)
          await page.waitForFunction(() =>
            Boolean(
              (window as GovernanceWindow).__governanceReady ||
                (window as GovernanceWindow).__governanceError,
            ),
          )
          const portalError = await page.evaluate(
            () => (window as GovernanceWindow).__governanceError,
          )
          if (portalError) throw Error(portalError)
          await page.evaluate(async () => {
            await document.fonts.ready
          })
          await page.addStyleTag({
            content:
              ".mw-btn:hover { --test-native-hover: yes } .mw-btn:active { --test-native-active: yes }",
          })
          await applyBrowserState(page, c.browserState)
          const button = page.locator(".mw-btn")
          if (c.caseId.endsWith("disabled")) expect(await button.isDisabled()).toBe(true)
          else {
            expect(
              await button.evaluate((n) =>
                getComputedStyle(n).getPropertyValue("--test-native-hover").trim(),
              ),
            ).toBe("yes")
            expect(
              await button.evaluate((n) =>
                getComputedStyle(n).getPropertyValue("--test-native-active").trim(),
              ),
            ).toBe(c.caseId.endsWith("pressed") ? "yes" : "")
            // Native pointer-down leaves a click pending; no click is synthesized to fake a pressed image.
            if (c.caseId.endsWith("pressed")) {
              await page.mouse.up()
              expect(
                await button.evaluate((n) =>
                  getComputedStyle(n).getPropertyValue("--test-native-active").trim(),
                ),
              ).toBe("")
            }
          }
        } finally {
          await page.close()
        }
      }
    } finally {
      await portal.close()
    }
  })

it("rejects ambiguous pseudo-state targets", async () => {
  const page = await browser.newPage()
  try {
    await page.setContent("<button>One</button><button>Two</button>")
    await expect(
      applyBrowserState(page, {
        kind: "hover",
        selector: "button",
        animationStabilization: { disableAnimations: true },
      }),
    ).rejects.toThrow("exactly one")
  } finally {
    await page.close()
  }
})

for (const adapter of adapters)
  it(`${adapter}: follows the captured size collection and preserves destructive purpose geometry`, async () => {
    const expected = [
      { id: "button.basic-icon-right-sm", height: 32, vertical: 8, horizontal: 12 },
      { id: "button.secondary-icon-right-lg", height: 48, vertical: 16, horizontal: 24 },
      { id: "button.destructive", height: 36, vertical: 10, horizontal: 16 },
    ]
    const cases = expected.map((e) =>
      requireValue(contract.cases.find((c) => c.caseId === e.id && c.mode === "light")),
    )
    const portal = await startPortal(root, adapter, cases)
    try {
      for (const e of expected) {
        const c = requireValue(cases.find((c) => c.caseId === e.id))
        const page = await browser.newPage({ viewport: c.viewportSize })
        try {
          await page.goto(portal.url + c.portalPath)
          await page.waitForFunction(() =>
            Boolean(
              (window as GovernanceWindow).__governanceReady ||
                (window as GovernanceWindow).__governanceError,
            ),
          )
          const portalError = await page.evaluate(
            () => (window as GovernanceWindow).__governanceError,
          )
          if (portalError) throw Error(portalError)
          const geometry = await page.locator(".mw-btn").evaluate((n) => {
            const s = getComputedStyle(n)
            return {
              height: n.getBoundingClientRect().height,
              vertical: Number.parseFloat(s.paddingTop),
              horizontal: Number.parseFloat(s.paddingLeft),
              fontSize: Number.parseFloat(s.fontSize),
            }
          })
          expect(geometry).toEqual({
            height: e.height,
            vertical: e.vertical,
            horizontal: e.horizontal,
            fontSize: 14,
          })
        } finally {
          await page.close()
        }
      }
    } finally {
      await portal.close()
    }
  })

type GovernanceWindow = Window & {
  __governanceReady?: boolean
  __governanceError?: string
  __cleanupFrameAlignment?: () => void
}
