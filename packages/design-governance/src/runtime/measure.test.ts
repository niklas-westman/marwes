import { expect, it } from "vitest"
import { normalizeLetterSpacing, normalizeSrgbColor } from "./measure.js"
it("normal tracking represents zero additional spacing only for non-justified text", () => {
  expect(normalizeLetterSpacing("normal", "left")).toBe(0)
  expect(normalizeLetterSpacing("normal", "center")).toBe(0)
  expect(normalizeLetterSpacing("normal", "justify")).toBe(null)
  expect(normalizeLetterSpacing("normal", "start", "justify")).toBe(null)
  expect(normalizeLetterSpacing("-0.42px", "left")).toBe(-0.42)
})
it("normalizes supported sRGB serializations at source color precision", () => {
  expect(normalizeSrgbColor("color(srgb 0.40098 0.40098 0.40098)")).toBe("rgba(102, 102, 102, 1)")
  expect(normalizeSrgbColor("rgb(102, 102, 102)")).toBe("rgba(102, 102, 102, 1)")
  expect(normalizeSrgbColor("color(srgb 0 0 0 / 0.6)")).toBe("rgba(0, 0, 0, 0.6)")
  expect(normalizeSrgbColor("color(display-p3 0.4 0.4 0.4)")).toBe(null)
  expect(normalizeSrgbColor("color(srgb -0.2 0.4 0.4)")).toBe(null)
})
it("preserves alpha mismatches instead of compositing source paints", () => {
  expect(normalizeSrgbColor("rgba(0,0,0,0.6)")).not.toBe(normalizeSrgbColor("rgb(89,89,89)"))
  expect(normalizeSrgbColor("color(srgb 0 0 0 / 0.6)")).not.toBe(
    normalizeSrgbColor("color(srgb 0 0 0)"),
  )
})
