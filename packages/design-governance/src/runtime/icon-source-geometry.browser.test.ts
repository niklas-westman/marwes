import { type Browser, chromium } from "playwright"
import { afterAll, beforeAll, expect, it } from "vitest"
import { createIconRecipe } from "../../../core/src/components/atoms/icon/icon-recipe.js"
import { iconRegistry } from "../../../core/src/components/atoms/icon/icon-registry.js"
import { createSpinnerSvgDefinition } from "../../../core/src/components/atoms/spinner/spinner-svg.js"
import { requireValue } from "../contracts/require-value.js"
import sourceFacts from "./fixtures/button-icon-source-geometry.json"
import spinnerSource from "./fixtures/spinner-classic-source-geometry.json"

let browser: Browser
beforeAll(async () => {
  browser = await chromium.launch()
})
afterAll(async () => {
  await browser?.close()
})

for (const fact of sourceFacts) {
  it(`${fact.icon}: matches independent Figma outline ${fact.vectorNodeId} and detects the uncalibrated glyph`, async () => {
    const page = await browser.newPage()
    try {
      const scale = 24 / fact.iconSize
      const source = `<g transform="scale(${scale}) translate(${fact.offset.join(" ")})">${fact.paths.map((p) => `<path fill="black" stroke="none" d="${p.path}"/>`).join("")}</g>`
      const definition = createIconRecipe({
        name: fact.icon as keyof typeof iconRegistry,
        strokeWidth: 2,
      }).svg
      const serialize = (omitTransform: boolean) =>
        (omitTransform && fact.icon === "refreshCw"
          ? iconRegistry.refreshCw.nodes
          : definition.nodes
        )
          .map(
            (node) =>
              `<${node.tag} ${Object.entries(node.attrs)
                .filter(([key]) => !omitTransform || key !== "transform")
                .map(([key, value]) => `${key}="${value}"`)
                .join(" ")}/>`,
          )
          .join("")
      const result = await page.evaluate(
        async ({ source, actual, negativeControl }) => {
          // Magnification isolates glyph geometry from the Button's subpixel placement.
          // Reference paths are Figma's filled Union exports; actual paths remain stroked SVGs.
          const size = 240
          async function render(body: string): Promise<Uint8ClampedArray> {
            const image = new Image()
            image.src = `data:image/svg+xml;base64,${btoa(`<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${body}</svg>`)}`
            await image.decode()
            const canvas = document.createElement("canvas")
            canvas.width = canvas.height = size
            const context =
              canvas.getContext("2d") ??
              (() => {
                throw new Error("Required proof value is missing")
              })()
            context.drawImage(image, 0, 0)
            return context.getImageData(0, 0, size, size).data
          }
          const expected = await render(source)
          function meanInkAlphaError(pixels: Uint8ClampedArray): number {
            let total = 0
            let area = 0
            for (let i = 3; i < expected.length; i += 4) {
              total += Math.abs(
                (expected[i] ??
                  (() => {
                    throw new Error("Required proof value is missing")
                  })()) -
                  (pixels[i] ??
                    (() => {
                      throw new Error("Required proof value is missing")
                    })()),
              )
              if (
                (expected[i] ??
                  (() => {
                    throw new Error("Required proof value is missing")
                  })()) > 0 ||
                (pixels[i] ??
                  (() => {
                    throw new Error("Required proof value is missing")
                  })()) > 0
              )
                area++
            }
            return total / area
          }
          return {
            actual: meanInkAlphaError(await render(actual)),
            negativeControl: meanInkAlphaError(await render(negativeControl)),
          }
        },
        { source, actual: serialize(false), negativeControl: serialize(true) },
      )
      // Small residuals come from outlined Bezier exports versus native SVG strokes.
      if (fact.icon === "refreshCw") expect(result.actual).toBe(0)
      else expect(result.actual).toBeLessThan(4)
      expect(result.negativeControl).toBeGreaterThan(fact.icon === "refreshCw" ? 3 : 60)
    } finally {
      await page.close()
    }
  })
}

it("Classic Spinner matches canonical master outlines and detects the old undersized ring", async () => {
  const page = await browser.newPage()
  try {
    const definition = createSpinnerSvgDefinition("classic")
    expect(definition.viewBox).toBe("0 0 24 24")
    expect(definition.nodes).toHaveLength(spinnerSource.nodes.length)
    for (const [index, fact] of spinnerSource.nodes.entries()) {
      const node = requireValue(definition.nodes[index])
      const source = `<g transform="translate(${fact.offset.join(" ")})">${fact.paths.map((p) => `<path d="${p.path}"/>`).join("")}</g>`
      const actual = `<${node.tag} ${Object.entries(node.attrs)
        .filter(([key]) => key !== "fill")
        .map(([key, value]) => `${key}="${value}"`)
        .join(" ")}/>`
      const negativeControl =
        index === 0
          ? '<circle cx="12" cy="12" r="10" fill="none" stroke="black" stroke-width="2"/>'
          : '<circle cx="12" cy="12" r="10" fill="none" stroke="black" stroke-width="2" stroke-linecap="round" stroke-dasharray="15.7 47.1"/>'
      const comparison = await page.evaluate(
        async ({ source, actual, negativeControl }) => {
          async function mask(body: string) {
            const image = new Image()
            image.src = `data:image/svg+xml;base64,${btoa(`<svg xmlns="http://www.w3.org/2000/svg" width="240" height="240" viewBox="0 0 24 24" fill="black">${body}</svg>`)}`
            await image.decode()
            const canvas = document.createElement("canvas")
            canvas.width = canvas.height = 240
            const context =
              canvas.getContext("2d") ??
              (() => {
                throw new Error("Required proof value is missing")
              })()
            context.drawImage(image, 0, 0)
            return context.getImageData(0, 0, 240, 240).data
          }
          const expected = await mask(source)
          function changedPixels(value: Uint8ClampedArray) {
            let count = 0
            for (let i = 3; i < expected.length; i += 4)
              if (
                Math.abs(
                  (expected[i] ??
                    (() => {
                      throw new Error("Required proof value is missing")
                    })()) -
                    (value[i] ??
                      (() => {
                        throw new Error("Required proof value is missing")
                      })()),
                ) > 25
              )
                count++
            return count
          }
          return {
            actual: changedPixels(await mask(actual)),
            negativeControl: changedPixels(await mask(negativeControl)),
          }
        },
        { source, actual, negativeControl },
      )
      expect(comparison.actual, fact.nodeId).toBe(0)
      expect(comparison.negativeControl, fact.nodeId).toBeGreaterThan(1000)
    }
  } finally {
    await page.close()
  }
})
