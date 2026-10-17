import { readFileSync } from "node:fs"
import { resolve } from "node:path"
import { type Browser, chromium } from "playwright"
import { afterAll, beforeAll, expect, it } from "vitest"
import type { StructuralContract } from "../compile/structural-contract.js"
import { type Expectation, adapters } from "../contracts/report.js"
import { requireValue } from "../contracts/require-value.js"
import type { LegacyContract } from "../source/types.js"
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
const mappings: StructuralContract = JSON.parse(
  readFileSync(
    resolve(root, "packages/design-governance/reflection-families/button/structural-contract.json"),
    "utf8",
  ),
)
// Independent Figma paint facts, including fill opacity; do not derive from runtime tokens.
const selections: [string, string, string][] = [
  ["button.basic-hover", "light", "rgba(255, 255, 255, 0.2)"],
  ["button.basic-hover", "dark", "rgba(0, 0, 0, 0.2)"],
  ["button.basic-pressed", "light", "rgba(0, 0, 0, 0.1)"],
  ["button.basic-pressed", "dark", "rgba(255, 255, 255, 0.2)"],
  ["button.secondary-hover", "light", "rgba(47, 49, 252, 0.1)"],
  ["button.secondary-hover", "dark", "rgba(255, 255, 255, 0.1)"],
  ["button.secondary-pressed", "light", "rgba(47, 49, 252, 0.2)"],
  ["button.secondary-pressed", "dark", "rgba(255, 255, 255, 0.2)"],
  ["button.text-disabled", "light", "rgba(0, 0, 0, 0.3)"],
  ["button.text-disabled", "dark", "rgba(255, 255, 255, 0.3)"],
]
let browser: Browser
beforeAll(async () => {
  browser = await chromium.launch()
})
afterAll(async () => {
  await browser?.close()
})
for (const adapter of adapters)
  it(`${adapter}: preserves source surface/overlay separation and disabled text alpha, detects paint regressions`, async () => {
    const cases = selections.map(([caseId, mode]) =>
      requireValue(contract.cases.find((c) => c.caseId === caseId && c.mode === mode)),
    )
    const portal = await startPortal(root, adapter, cases)
    try {
      for (const [caseId, mode, expected] of selections) {
        const c = requireValue(cases.find((c) => c.caseId === caseId && c.mode === mode))
        const mapping = requireValue(
          mappings.cases.find((c) => c.caseId === caseId && c.mode === mode),
        )
        const disabledText = caseId === "button.text-disabled"
        const part = requireValue(
          mapping.parts.find((p) => p.part === (disabledText ? "label" : "overlay")),
        )
        const expectation: Expectation = {
          part: part.part,
          selector: part.selector,
          property: disabledText ? "color" : "backgroundColor",
          expected: requireValue(expected),
          tolerance: 0,
          comparison: "exact",
          source: {
            fileKey: contract.figmaFileKey,
            nodeId: part.nodeId,
            propertyPath: "fills.0.color",
          },
        }
        const page = await browser.newPage({ viewport: c.viewportSize })
        try {
          await page.goto(portal.url + c.portalPath)
          await page.waitForFunction(() =>
            Boolean(
              (window as GovernanceWindow).__governanceReady ||
                (window as GovernanceWindow).__governanceError,
            ),
          )
          const error = await page.evaluate(() => (window as GovernanceWindow).__governanceError)
          if (error) throw Error(error)
          await applyBrowserState(page, c.browserState)
          expect(
            requireValue((await measure(page, [expectation]))[0]).outcome,
            `${caseId}/${mode}`,
          ).toBe("passed")
          if (caseId.startsWith("button.secondary")) {
            expect(
              await page.locator(".mw-btn").evaluate((n) => getComputedStyle(n).backgroundColor),
            ).toBe("rgba(0, 0, 0, 0)")
          }
          if (disabledText) {
            expect(await page.locator(".mw-btn").evaluate((n) => getComputedStyle(n).opacity)).toBe(
              "1",
            )
            await page.locator(".mw-btn__label").evaluate((n) => {
              ;(n as HTMLElement).style.color = "rgb(115,115,115)"
            })
          } else {
            expect(await page.locator(".mw-btn").evaluate((n) => getComputedStyle(n).opacity)).toBe(
              "1",
            )
            await page.addStyleTag({
              content: ".mw-btn::before { background: transparent !important }",
            })
          }
          expect(requireValue((await measure(page, [expectation]))[0]).outcome).toBe("failed")
          if (!disabledText) {
            // Retain the correct source paint while removing the generated overlay box.
            await page.addStyleTag({
              content: `.mw-btn::before { background: ${expected} !important; content: none !important }`,
            })
            const missingOverlay = requireValue((await measure(page, [expectation]))[0])
            expect(missingOverlay.actual).toBe(null)
            expect(missingOverlay.diagnostic).toMatch(/not generated or visible/)
            expect(missingOverlay.outcome).toBe("failed")
          }
        } finally {
          await page.close()
        }
      }
    } finally {
      await portal.close()
    }
  })

it("does not substitute the originating element bounds for pseudo-element geometry", async () => {
  const page = await browser.newPage()
  try {
    await page.setContent("<style>button::before { content: '' }</style><button>Label</button>")
    const result = await measure(page, [
      {
        part: "overlay",
        selector: "button::before",
        property: "bounds.width",
        expected: 40,
        tolerance: 0,
        comparison: "exact",
        source: {
          fileKey: "fixture",
          nodeId: "overlay",
          propertyPath: "absoluteBoundingBox.width",
        },
      },
    ])
    expect(requireValue(result[0]).actual).toBe(null)
    expect(requireValue(result[0]).diagnostic).toMatch(/Pseudo-element geometry/)
  } finally {
    await page.close()
  }
})

it("rejects declared pseudo paint when display, visibility or opacity suppresses the overlay", async () => {
  const page = await browser.newPage()
  try {
    for (const suppression of [
      "display:none",
      "visibility:hidden",
      "visibility:collapse",
      "opacity:0",
    ]) {
      await page.setContent(
        `<style>button::before { content: ''; background: red; ${suppression} }</style><button>Label</button>`,
      )
      const result = await measure(page, [
        {
          part: "overlay",
          selector: "button::before",
          property: "backgroundColor",
          expected: "rgba(255, 0, 0, 1)",
          tolerance: 0,
          comparison: "exact",
          source: { fileKey: "fixture", nodeId: "overlay", propertyPath: "fills.0.color" },
        },
      ])
      expect(requireValue(result[0]).actual, suppression).toBe(null)
      expect(requireValue(result[0]).outcome, suppression).toBe("failed")
      expect(requireValue(result[0]).diagnostic, suppression).toMatch(/not generated or visible/)
    }
  } finally {
    await page.close()
  }
})

// These values are pinned Figma facts from the added Success/Ghost/Spinner selections.
const additionalPaints: {
  caseId: string
  mode: string
  facts: [string, string, string | number][]
}[] = [
  {
    caseId: "button.success-default",
    mode: "light",
    facts: [["surface", "backgroundColor", "rgba(0, 135, 90, 1)"]],
  },
  {
    caseId: "button.success-disabled",
    mode: "dark",
    facts: [
      ["surface", "backgroundColor", "rgba(0, 135, 90, 0.3)"],
      ["label", "color", "rgba(255, 255, 255, 0.3)"],
    ],
  },
  {
    caseId: "button.danger-default",
    mode: "dark",
    facts: [["surface", "backgroundColor", "rgba(217, 4, 41, 1)"]],
  },
  {
    caseId: "button.neutral-hover",
    mode: "light",
    facts: [
      ["surface", "backgroundColor", "rgba(0, 0, 0, 0)"],
      ["surface", "insetStrokeColor", "rgba(0, 0, 0, 0.15)"],
      ["overlay", "backgroundColor", "rgba(0, 0, 0, 0.1)"],
    ],
  },
  {
    caseId: "button.neutral-hover",
    mode: "dark",
    facts: [
      ["surface", "insetStrokeColor", "rgba(255, 255, 255, 0.3)"],
      ["overlay", "backgroundColor", "rgba(255, 255, 255, 0.1)"],
    ],
  },
  {
    caseId: "button.neutral-disabled",
    mode: "light",
    facts: [["label", "color", "rgba(0, 0, 0, 0.3)"]],
  },
  {
    caseId: "button.neutral-disabled",
    mode: "dark",
    facts: [["label", "color", "rgba(255, 255, 255, 0.3)"]],
  },
  {
    caseId: "button.secondary-error",
    mode: "light",
    facts: [
      ["surface", "insetStrokeColor", "rgba(255, 138, 149, 1)"],
      ["label", "color", "rgba(168, 3, 31, 1)"],
      ["icon-paint", "color", "rgba(217, 4, 41, 1)"],
    ],
  },
  {
    caseId: "button.secondary-error",
    mode: "dark",
    facts: [
      ["surface", "insetStrokeColor", "rgba(255, 40, 71, 1)"],
      ["label", "color", "rgba(255, 85, 102, 1)"],
      ["icon-paint", "color", "rgba(255, 40, 71, 1)"],
    ],
  },
  {
    caseId: "button.secondary-loading",
    mode: "light",
    facts: [
      ["surface", "backgroundColor", "rgba(0, 0, 0, 0)"],
      ["spinner-track", "fill", "rgba(0, 0, 0, 0.4)"],
      ["spinner-indicator", "fill", "rgba(47, 49, 252, 1)"],
    ],
  },
  {
    caseId: "button.secondary-loading",
    mode: "dark",
    facts: [
      ["surface", "backgroundColor", "rgba(0, 0, 0, 0)"],
      ["spinner-track", "fill", "rgba(255, 255, 255, 0.4)"],
      ["spinner-indicator", "fill", "rgba(255, 255, 255, 1)"],
    ],
  },
]
for (const adapter of adapters)
  it(`${adapter}: matches independent Success, Ghost, error and loading paints and rejects whole-control opacity drift`, async () => {
    const cases = additionalPaints.map(({ caseId, mode }) =>
      requireValue(contract.cases.find((c) => c.caseId === caseId && c.mode === mode)),
    )
    const portal = await startPortal(root, adapter, cases)
    try {
      for (const selection of additionalPaints) {
        const c = requireValue(
          cases.find((c) => c.caseId === selection.caseId && c.mode === selection.mode),
        )
        const mapping = requireValue(
          mappings.cases.find((c) => c.caseId === selection.caseId && c.mode === selection.mode),
        )
        const facts: [string, string, string | number][] = [
          ...selection.facts,
          ["root", "opacity", 1],
        ]
        const expectations: Expectation[] = facts.map(([partName, property, expected]) => {
          const part = requireValue(mapping.parts.find((p) => p.part === partName))
          const sourceProperty = requireValue(
            part.properties.find((p) => p.property === property),
          ).sourceProperty
          return {
            part: partName,
            selector: part.selector,
            property,
            expected,
            tolerance: 0,
            comparison: "exact",
            source: {
              fileKey: contract.figmaFileKey,
              nodeId: part.nodeId,
              propertyPath: sourceProperty,
            },
          }
        })
        const page = await browser.newPage({ viewport: c.viewportSize })
        try {
          await page.goto(portal.url + c.portalPath)
          await page.waitForFunction(() =>
            Boolean(
              (window as GovernanceWindow).__governanceReady ||
                (window as GovernanceWindow).__governanceError,
            ),
          )
          const error = await page.evaluate(() => (window as GovernanceWindow).__governanceError)
          if (error) throw Error(error)
          await applyBrowserState(page, c.browserState)
          const measured = await measure(page, expectations)
          expect(
            measured.filter((m) => m.outcome !== "passed"),
            `${selection.caseId}/${selection.mode}`,
          ).toEqual([])
          if (selection.caseId.endsWith("loading")) {
            expect(await page.locator(".mw-btn").isDisabled()).toBe(true)
            expect(await page.locator(".mw-btn").getAttribute("aria-busy")).toBe("true")
          }
          await page.locator(".mw-btn").evaluate((n) => {
            ;(n as HTMLElement).style.transition = "none"
            ;(n as HTMLElement).style.opacity = "0.5"
          })
          expect(
            requireValue((await measure(page, [requireValue(expectations.at(-1))]))[0]).outcome,
          ).toBe("failed")
        } finally {
          await page.close()
        }
      }
    } finally {
      await portal.close()
    }
  })

// Auto-width text boxes and IconButton use separate, exact pinned Figma dimensions.
for (const adapter of adapters)
  it(`${adapter}: matches source auto-text boxes and independent IconButton md sizing`, async () => {
    const facts = [
      { caseId: "button.success-default", label: 52, width: 100 },
      { caseId: "button.purpose-submit", label: 46, width: 78 },
      { caseId: "button.purpose-download", label: 64, width: 116 },
      { caseId: "button.neutral-default", label: 44, width: 76 },
      { caseId: "button.secondary-loading", label: 69, width: 121 },
      { caseId: "button.icon-only-neutral-default", label: null, width: 32 },
    ]
    const cases = facts.map((f) =>
      requireValue(contract.cases.find((c) => c.caseId === f.caseId && c.mode === "light")),
    )
    const portal = await startPortal(root, adapter, cases)
    try {
      for (const fact of facts) {
        const c = requireValue(cases.find((c) => c.caseId === fact.caseId))
        const page = await browser.newPage({ viewport: c.viewportSize })
        try {
          await page.goto(portal.url + c.portalPath)
          await page.waitForFunction(() => Boolean((window as GovernanceWindow).__governanceReady))
          const control = page.locator(".mw-btn")
          expect(requireValue(await control.boundingBox()).width, fact.caseId).toBe(fact.width)
          if (fact.label !== null) {
            const label = page.locator(".mw-btn__label")
            expect(requireValue(await label.boundingBox()).width, fact.caseId).toBe(fact.label)
            // Reintroducing natural browser advance must expose the source box mismatch.
            await label.evaluate((n) => {
              ;(n as HTMLElement).style.width = "auto"
            })
            expect(requireValue(await label.boundingBox()).width, fact.caseId).not.toBe(fact.label)
          } else {
            expect(requireValue(await control.boundingBox()).height).toBe(32)
            expect(requireValue(await page.locator(".mw-icon").boundingBox()).width).toBe(12)
            expect(await control.getAttribute("aria-label")).toBe("Close")
            await control.evaluate((n) => {
              ;(n as HTMLElement).style.transition = "none"
              ;(n as HTMLElement).style.height = "40px"
            })
            expect(requireValue(await control.boundingBox()).height).not.toBe(32)
          }
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
