import { readFileSync, rmSync } from "node:fs"
import { resolve } from "node:path"
import { type Browser, chromium } from "playwright"
import { afterAll, beforeAll, describe, expect, it } from "vitest"
import { themeToCSSVars } from "../../../core/src/theme/theme-css"
import { resolveThemeInput } from "../../../core/src/theme/theme-normalize"
import { compileFamily } from "../compile/compile-family.js"
import { type Expectation, adapters } from "../contracts/report.js"
import { requireValue } from "../contracts/require-value.js"
import { createOfflineProofFixture } from "../source/offline-test-fixture.ts"
import { measure, measureFonts, normalizeSrgbColor } from "./measure.js"
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
    it("matches Secondary Figma width and preserves intrinsic labels, explicit widths and icon-only sizing", async () => {
      const item = requireValue(
        compileFamily(proofRoot, "button").cases.find((c) => c.caseId === "button.secondary"),
      )
      const width = requireValue(
        item.expectations.find((e) => e.part === "root" && e.property === "bounds.width"),
      )
      const portal = await startPortal(repoRoot, adapter, [item])
      const page = await browser.newPage({ viewport: item.viewportSize })
      try {
        await page.goto(portal.url + item.portalPath)
        await page.waitForFunction(() => Boolean((window as GovernanceWindow).__governanceReady))
        const control = page.locator(".mw-btn")
        await control.evaluate((element) => {
          ;(element as HTMLElement).style.transition = "none"
        })
        expect(requireValue((await measure(page, [width]))[0]).outcome).toBe("passed")
        // Reintroduce the fractional sizing defect: strict source width must fail.
        await control.evaluate((element) => {
          ;(element as HTMLElement).style.width = "66.5px"
        })
        expect(requireValue((await measure(page, [width]))[0]).outcome).toBe("failed")
        await control.evaluate((element) => {
          ;(element as HTMLElement).style.width = ""
        })
        await page.locator(".mw-btn__label").evaluate((element) => {
          element.textContent = "Save all changes"
        })
        expect(requireValue(await control.boundingBox()).width).toBeGreaterThan(
          Number(width.expected),
        )
        await page.locator(".mw-btn__label").evaluate((element) => {
          element.textContent = "OK"
        })
        expect(requireValue(await control.boundingBox()).width).toBeLessThan(Number(width.expected))
        await control.evaluate((element) => {
          ;(element as HTMLElement).style.width = "96px"
        })
        expect(requireValue(await control.boundingBox()).width).toBe(96)
        await control.evaluate((element) => {
          ;(element as HTMLElement).style.width = ""
          ;(element as HTMLElement).dataset.iconOnly = "true"
        })
        expect(requireValue(await control.boundingBox()).width).toBe(32)
      } finally {
        await page.close()
        await portal.close()
      }
    })
    it("matches Figma whole-pixel framing without hiding component width drift", async () => {
      const item = requireValue(
        compileFamily(proofRoot, "button").cases.find((item) => item.caseId === "button.text"),
      )
      const portal = await startPortal(repoRoot, adapter, [item])
      const page = await browser.newPage({ viewport: item.viewportSize })
      try {
        await page.goto(portal.url + item.portalPath)
        await page.waitForFunction(() => Boolean((window as GovernanceWindow).__governanceReady))
        const position = await page.locator("#reflection-case-root").boundingBox()
        expect(requireValue(position).x).toBe(Math.round(requireValue(position).x))
        expect(requireValue(position).y).toBe(Math.round(requireValue(position).y))
        const width = requireValue(
          item.expectations.find((entry) => entry.property === "bounds.width"),
        )
        expect(requireValue((await measure(page, [width]))[0]).outcome).toBe("passed")
        await page.locator(width.selector).evaluate((element) => {
          ;(element as HTMLElement).style.width = "80px"
          ;(element as HTMLElement).style.transition = "none"
        })
        expect(requireValue((await measure(page, [width]))[0]).outcome).toBe("failed")
      } finally {
        await page.close()
        await portal.close()
      }
    })
    it("measures real fixtures and rejects padding, weight, color, content and ambiguous selector defects", async () => {
      const family = compileFamily(proofRoot, "button")
      const basic = requireValue(family.cases.find((item) => item.caseId === "button.basic"))
      if (!basic) throw Error("Missing basic source case")
      const portal = await startPortal(repoRoot, adapter, [basic])
      const page = await browser.newPage({ viewport: basic.viewportSize })
      try {
        await page.goto(`${portal.url}${basic.portalPath}`, { waitUntil: "networkidle" })
        await page.waitForFunction(() =>
          Boolean((window as unknown as { __governanceReady?: boolean }).__governanceReady),
        )
        const initial = await measure(page, basic.expectations)
        expect(initial.length).toBeGreaterThanOrEqual(12)
        expect(initial.every((item) => item.actual !== null)).toBe(true)
        expect(initial.every((item) => item.outcome === "passed")).toBe(true)
        for (const property of ["paddingLeft", "fontWeight", "backgroundColor"]) {
          const expectation = requireValue(
            basic.expectations.find((item) => item.property === property),
          )
          if (!expectation) throw Error("Missing source expectation")
          expect(expectation).toBeDefined()
          await page.locator(expectation.selector).evaluate(
            (element, { property }) => {
              ;(element as HTMLElement).style.setProperty("transition", "none", "important")
              ;(element as HTMLElement).style.setProperty(
                property === "paddingLeft"
                  ? "padding-inline-start"
                  : property.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`),
                property === "backgroundColor"
                  ? "rgb(255,0,0)"
                  : property === "fontWeight"
                    ? "900"
                    : "33px",
                "important",
              )
            },
            { property },
          )
          const result = await measure(page, [expectation])
          expect(result[0]?.outcome, JSON.stringify({ property, result })).toBe("failed")
          expect(result[0]?.source.nodeId).toBeTruthy()
        }
        expect(
          (await measureFonts(page, basic.expectations)).every((row) => row.outcome === "passed"),
        ).toBe(true)
        const noFontPage = await browser.newPage({ viewport: basic.viewportSize })
        try {
          await noFontPage.route(/\.woff2?(?:\?|$)/, (route) => route.abort())
          await noFontPage.goto(`${portal.url}${basic.portalPath}`, { waitUntil: "networkidle" })
          await noFontPage.waitForFunction(() =>
            Boolean((window as unknown as { __governanceReady?: boolean }).__governanceReady),
          )
          expect(
            (await measureFonts(noFontPage, basic.expectations)).some(
              (row) => row.outcome === "failed",
            ),
          ).toBe(true)
        } finally {
          await noFontPage.close()
        }
        const position = requireValue(
          basic.expectations.find((item) => item.part === "label" && item.property === "relativeX"),
        )
        if (!position) throw Error("Missing source-backed label position")
        await page.locator(position.selector).evaluate((element) => {
          ;(element as HTMLElement).style.transform = "translateX(5px)"
        })
        expect((await measure(page, [position]))[0]?.outcome).toBe("failed")
        const text = requireValue(basic.expectations.find((item) => item.property === "text"))
        if (!text) throw Error("Missing text source")
        await page.locator(text.selector).evaluate((element) => {
          element.textContent = "Broken"
        })
        expect((await measure(page, [text]))[0]?.outcome).toBe("failed")
        await page.locator(text.selector).evaluate((element) => {
          element.parentElement?.append(element.cloneNode(true))
        })
        expect((await measure(page, [text]))[0]?.diagnostic).toContain("matched 2")
        await page.locator(text.selector).evaluateAll((elements) => {
          for (const element of elements) element.remove()
        })
        expect((await measure(page, [text]))[0]?.diagnostic).toContain("matched 0")
      } finally {
        await page.close()
        await portal.close()
      }
    }, 120_000)
    it("renders disabled role paints once in both themes against captured Figma palette values", async () => {
      const source = JSON.parse(readFileSync(resolve(repoRoot, "docs/marwes-colors.json"), "utf8"))
      const cases = compileFamily(proofRoot, "button").cases.filter(
        (c) => c.caseId !== "button.text",
      )
      const portal = await startPortal(repoRoot, adapter, cases)
      try {
        for (const mode of ["light", "dark"] as const)
          for (const item of cases) {
            const page = await browser.newPage({ viewport: item.viewportSize })
            try {
              await page.goto(portal.url + item.portalPath)
              await page.waitForFunction(() =>
                Boolean((window as GovernanceWindow).__governanceReady),
              )
              const vars = themeToCSSVars(resolveThemeInput({ mode }))
              await page.evaluate(
                ({ mode, vars }) => {
                  const control = document.querySelector(".mw-btn") as HTMLButtonElement
                  control.style.transition = "none"
                  control.disabled = true
                  const provider = control.closest(
                    ".mw-theme--light,.mw-theme--dark",
                  ) as HTMLElement
                  provider.classList.remove("mw-theme--light", "mw-theme--dark")
                  provider.classList.add(`mw-theme--${mode}`)
                  for (const [key, value] of Object.entries(vars))
                    provider.style.setProperty(key, value)
                },
                { mode, vars },
              )
              const role =
                item.caseId === "button.basic"
                  ? "primary"
                  : item.caseId === "button.secondary"
                    ? "secondary"
                    : "destructive"
              const palette = source.semantic.action[role]
              const properties = [
                ["color", "label-disabled"],
                [role === "secondary" ? "insetStrokeColor" : "backgroundColor", "disabled"],
              ]
              const expectations: Expectation[] = properties.map(([property, token]) => ({
                part: "disabled",
                selector: ".mw-btn",
                property: requireValue(property),
                expected: requireValue(normalizeSrgbColor(palette[requireValue(token)][mode])),
                tolerance: 0,
                comparison: "exact",
                source: {
                  fileKey: "captured-palette-fixture",
                  nodeId: role,
                  propertyPath: `semantic.action.${role}.${token}`,
                },
              }))
              expectations.push({
                part: "disabled",
                selector: ".mw-btn",
                property: "opacity",
                expected: 1,
                tolerance: 0,
                comparison: "numeric",
                source: {
                  fileKey: "captured-palette-fixture",
                  nodeId: role,
                  propertyPath: "role-alpha-applied-once",
                },
              })
              expect((await measure(page, expectations)).every((r) => r.outcome === "passed")).toBe(
                true,
              )
            } finally {
              await page.close()
            }
          }
      } finally {
        await portal.close()
      }
    }, 120_000)
    it("matches the small destructive icon fixture and rejects icon geometry drift", async () => {
      const item = requireValue(
        compileFamily(proofRoot, "button").cases.find((c) => c.caseId === "button.destructive"),
      )
      if (!item) throw Error("Missing destructive source case")
      const portal = await startPortal(repoRoot, adapter, [item])
      const page = await browser.newPage({ viewport: item.viewportSize })
      try {
        await page.goto(portal.url + item.portalPath)
        await page.waitForFunction(() => Boolean((window as GovernanceWindow).__governanceReady))
        expect((await measure(page, item.expectations)).every((r) => r.outcome === "passed")).toBe(
          true,
        )
        const icon = requireValue(
          item.expectations.find((e) => e.part === "icon" && e.property === "bounds.width"),
        )
        if (!icon) throw Error("Missing source-backed icon assertion")
        await page.locator(icon.selector).evaluate((el) => {
          ;(el as HTMLElement).style.width = "20px"
        })
        expect((await measure(page, [icon]))[0]?.outcome).toBe("failed")
      } finally {
        await page.close()
        await portal.close()
      }
    }, 120_000)
  })

it("compares browser normal tracking and sRGB paints without losing alpha", async () => {
  const page = await browser.newPage()
  try {
    await page.setContent(
      '<span id="label" style="letter-spacing:normal;text-align:left;color:color(srgb 0.40098 0.40098 0.40098)">Label</span>',
    )
    const source = {
      fileKey: "browser-normalization-fixture",
      nodeId: "fixture:label",
      propertyPath: "literal",
    }
    const expectations: Expectation[] = [
      {
        part: "label",
        selector: "#label",
        property: "letterSpacing",
        expected: 0,
        tolerance: 0,
        source,
      },
      {
        part: "label",
        selector: "#label",
        property: "color",
        expected: "rgba(102, 102, 102, 1)",
        tolerance: 0,
        source,
      },
    ]
    const [tracking, paint] = expectations
    if (!tracking || !paint) throw Error("Missing normalization fixture expectations")
    expect((await measure(page, expectations)).every((row) => row.outcome === "passed")).toBe(true)
    await page.locator("#label").evaluate((element) => {
      ;(element as HTMLElement).style.textAlign = "justify"
    })
    expect((await measure(page, [tracking]))[0]?.diagnostic).toContain("justified")
    await page.locator("#label").evaluate((element) => {
      ;(element as HTMLElement).style.color = "rgb(89,89,89)"
    })
    const alphaExpectation = { ...paint, expected: "rgba(0, 0, 0, 0.6)" }
    expect((await measure(page, [alphaExpectation]))[0]?.outcome).toBe("failed")
  } finally {
    await page.close()
  }
})

it("measures fractional inset strokes and rejects unsupported shadow combinations", async () => {
  const page = await browser.newPage()
  try {
    await page.setContent(
      '<div id="stroke" style="box-shadow:inset 0 0 0 1.5px rgba(0,0,0,0.2)"></div>',
    )
    const source = {
      fileKey: "stroke-fixture",
      nodeId: "figma:stroke",
      propertyPath: "strokeWeight",
    }
    const expectations: Expectation[] = [
      {
        part: "stroke",
        selector: "#stroke",
        property: "insetStrokeWidth",
        expected: 1.5,
        tolerance: 0.02,
        comparison: "numeric",
        source,
      },
      {
        part: "stroke",
        selector: "#stroke",
        property: "insetStrokeColor",
        expected: "rgba(0, 0, 0, 0.2)",
        tolerance: 0,
        comparison: "exact",
        source,
      },
    ]
    expect((await measure(page, expectations)).every((r) => r.outcome === "passed")).toBe(true)
    await page.locator("#stroke").evaluate((el) => {
      ;(el as HTMLElement).style.boxShadow = "inset 0 0 0 2px rgba(0,0,0,0.2)"
    })
    expect((await measure(page, expectations))[0]?.outcome).toBe("failed")
    await page.locator("#stroke").evaluate((el) => {
      ;(el as HTMLElement).style.boxShadow = "inset 1px 0 2px 1.5px black"
    })
    expect((await measure(page, expectations))[0]?.diagnostic).toContain("Unsupported inset stroke")
  } finally {
    await page.close()
  }
})

type GovernanceWindow = Window & {
  __governanceReady?: boolean
  __governanceError?: string
  __cleanupFrameAlignment?: () => void
}
