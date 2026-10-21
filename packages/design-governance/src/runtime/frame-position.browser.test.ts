import { readFileSync } from "node:fs"
import { resolve } from "node:path"
import { type Browser, type Page, chromium } from "playwright"
import { afterAll, beforeAll, expect, it } from "vitest"
import { adapters } from "../contracts/report.js"
import { requireValue } from "../contracts/require-value.js"
import type { LegacyContract } from "../source/types.js"
import { alignFigmaFrameOrigin } from "./frame-position.js"
import { startPortal } from "./portal.js"
const root = resolve(import.meta.dirname, "../../../..")
let browser: Browser
beforeAll(async () => {
  browser = await chromium.launch()
})
afterAll(async () => {
  await browser?.close()
})

async function alignFixture(page: Page, buttonCase: boolean) {
  await page.evaluate(
    ({ source, buttonCase }) => {
      const align = new Function(`return (${source})`)() as typeof alignFigmaFrameOrigin
      ;(window as GovernanceWindow).__cleanupFrameAlignment = align(
        document.querySelector<HTMLElement>("#fixture") ??
          (() => {
            throw new Error("Required proof value is missing")
          })(),
        "center",
        buttonCase,
      )
    },
    { source: alignFigmaFrameOrigin.toString(), buttonCase },
  )
}

async function paintFixture(page: Page, inlineStyle = "") {
  await page.setContent(`<style>
    body { margin:0; height:220px; display:grid; place-items:center; background:white }
    #fixture { box-sizing:border-box; width:101px; height:41px; border:2px solid black; background:#e0e0e0 }
    </style><div id="fixture" style="${inlineStyle}"><div data-marwes-theme style="display:inline-flex"></div></div>`)
}

it("aligns Button paint to an independent integer-origin oracle, not just its bounding box", async () => {
  const page = await browser.newPage({ viewport: { width: 390, height: 220 } })
  try {
    await paintFixture(page)
    expect(await page.locator("#fixture").boundingBox()).toEqual({
      x: 144.5,
      y: 89.5,
      width: 101,
      height: 41,
    })
    await alignFixture(page, true)
    const alignedBounds = await page.locator("#fixture").boundingBox()
    expect(alignedBounds).toEqual({ x: 145, y: 90, width: 101, height: 41 })
    const actual = await page.screenshot()
    await page.evaluate(() => {
      ;(() => {
        const cleanup = (window as Window & { __cleanupFrameAlignment?: () => void })
          .__cleanupFrameAlignment
        if (!cleanup) throw new Error("Frame cleanup was not installed")
        cleanup()
      })()
      const fixture =
        document.querySelector<HTMLElement>("#fixture") ??
        (() => {
          throw new Error("Required proof value is missing")
        })()
      fixture.style.position = "absolute"
      fixture.style.left = "145px"
      fixture.style.top = "90px"
    })
    expect(await page.locator("#fixture").boundingBox()).toEqual(alignedBounds)
    expect(actual.equals(await page.screenshot())).toBe(true)
  } finally {
    await page.close()
  }
})

it("realigns Button layout after resize and restores all changed inline properties on cleanup", async () => {
  const page = await browser.newPage({ viewport: { width: 390, height: 220 } })
  try {
    await paintFixture(page, "position:relative;left:3px;top:5px;translate:2px 4px")
    await alignFixture(page, true)
    expect(await page.locator("[data-marwes-theme]").evaluate((el) => el.style.display)).toBe(
      "flex",
    )
    await page.locator("#fixture").evaluate((el) => {
      el.style.width = "105px"
      el.style.height = "43px"
    })
    await page.waitForFunction(() => {
      const box = (
        document.querySelector("#fixture") ??
        (() => {
          throw new Error("Required proof value is missing")
        })()
      ).getBoundingClientRect()
      return box.x === 143 && box.y === 89 && box.width === 105 && box.height === 43
    })
    await page.evaluate(() =>
      (() => {
        const cleanup = (window as Window & { __cleanupFrameAlignment?: () => void })
          .__cleanupFrameAlignment
        if (!cleanup) throw new Error("Frame cleanup was not installed")
        cleanup()
      })(),
    )
    expect(
      await page.locator("#fixture").evaluate((el) => ({
        position: el.style.position,
        left: el.style.left,
        top: el.style.top,
        translate: el.style.translate,
      })),
    ).toEqual({ position: "relative", left: "3px", top: "5px", translate: "2px 4px" })
    expect(await page.locator("[data-marwes-theme]").evaluate((el) => el.style.display)).toBe(
      "inline-flex",
    )
    await page.locator("#fixture").evaluate((el) => {
      el.style.width = "107px"
    })
    await page.evaluate(
      () => new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve))),
    )
    expect(
      await page.locator("#fixture").evaluate((el) => ({
        left: el.style.left,
        top: el.style.top,
        translate: el.style.translate,
      })),
    ).toEqual({ left: "3px", top: "5px", translate: "2px 4px" })
  } finally {
    await page.close()
  }
})

it("preserves non-Button translation and containing-block behavior", async () => {
  const page = await browser.newPage({ viewport: { width: 390, height: 220 } })
  try {
    await paintFixture(page, "translate:2px 4px")
    await alignFixture(page, false)
    expect(await page.locator("#fixture").boundingBox()).toEqual({
      x: 145,
      y: 90,
      width: 101,
      height: 41,
    })
    expect(
      await page.locator("#fixture").evaluate((el) => ({
        position: el.style.position,
        left: el.style.left,
        top: el.style.top,
        translate: el.style.translate,
      })),
    ).toEqual({ position: "", left: "", top: "", translate: "0.5px 0.5px" })
    expect(await page.locator("[data-marwes-theme]").evaluate((el) => el.style.display)).toBe(
      "inline-flex",
    )
    await page.evaluate(() =>
      (() => {
        const cleanup = (window as Window & { __cleanupFrameAlignment?: () => void })
          .__cleanupFrameAlignment
        if (!cleanup) throw new Error("Frame cleanup was not installed")
        cleanup()
      })(),
    )
    expect(await page.locator("#fixture").evaluate((el) => el.style.translate)).toBe("2px 4px")
  } finally {
    await page.close()
  }
})

for (const adapter of adapters)
  it(`${adapter}: centers the actual text control box and realigns after intrinsic size changes`, async () => {
    const contract: {
      cases: (LegacyContract["cases"][number] & {
        source: { componentBounds: { height: number } }
      })[]
    } = JSON.parse(
      readFileSync(
        resolve(
          root,
          "packages/design-governance/reflection-families/button/reflection-contract.json",
        ),
        "utf8",
      ),
    )
    const c = requireValue(
      contract.cases.find((c) => c.caseId === "button.text-icon-left" && c.mode === "light"),
    )
    const portal = await startPortal(root, adapter, [c])
    const page = await browser.newPage({ viewport: c.viewportSize })
    try {
      await page.goto(portal.url + c.portalPath)
      await page.waitForFunction(() => Boolean((window as GovernanceWindow).__governanceReady))
      await page.evaluate(async () => {
        await document.fonts.ready
      })
      const box = await page.locator(".mw-btn").boundingBox()
      expect(requireValue(box).y).toBe(
        Math.round((c.viewportSize.height - c.source.componentBounds.height) / 2),
      )
      const provider = await page.locator("[data-marwes-theme]").boundingBox()
      expect(requireValue(provider).height).toBe(c.source.componentBounds.height)
      await page.locator(".mw-btn__label").evaluate((n) => {
        n.textContent = "Longer caption after font/layout settling"
      })
      await page.waitForFunction(() => {
        const b = (
          document.querySelector("#reflection-case-root") ??
          (() => {
            throw new Error("Required proof value is missing")
          })()
        ).getBoundingClientRect()
        return b.x === Math.round(b.x) && b.y === Math.round(b.y)
      })
      const after = await page.locator(".mw-btn").boundingBox()
      expect(requireValue(after).width).toBeGreaterThan(requireValue(box).width)
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
