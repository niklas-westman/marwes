import { describe, expect, it } from "vitest"
import {
  adjustLightness,
  contrastRatio,
  parseHex,
  pickContrastColor,
  relativeLuminance,
  rgbToHex,
  rgbToOklch,
  setAlpha,
} from "../../src/theme/color-utils"

// ─── Ticket 1: parseHex + rgbToHex ───────────────────────────────────────────

describe("parseHex", () => {
  it("parses a 6-char hex into [r, g, b]", () => {
    expect(parseHex("#5B8CFF")).toEqual([91, 140, 255])
    expect(parseHex("#000000")).toEqual([0, 0, 0])
    expect(parseHex("#FFFFFF")).toEqual([255, 255, 255])
  })

  it("expands 3-char shorthand to full channels", () => {
    expect(parseHex("#abc")).toEqual([170, 187, 204])
    expect(parseHex("#ABC")).toEqual([170, 187, 204])
  })
})

describe("rgbToHex", () => {
  it("converts [r, g, b] to uppercase #RRGGBB", () => {
    expect(rgbToHex([91, 140, 255])).toBe("#5B8CFF")
    expect(rgbToHex([0, 0, 0])).toBe("#000000")
    expect(rgbToHex([255, 255, 255])).toBe("#FFFFFF")
  })

  it("clamps out-of-range channel values", () => {
    expect(rgbToHex([-10, 300, 128])).toBe("#00FF80")
  })
})

describe("parseHex + rgbToHex round-trip", () => {
  it("is lossless for valid uppercase 6-char hex strings", () => {
    const samples = ["#5B8CFF", "#D90429", "#FFB703", "#141414", "#F9FAFB", "#006633"]
    for (const hex of samples) {
      expect(rgbToHex(parseHex(hex))).toBe(hex)
    }
  })
})

// ─── Ticket 2: OKLCH pipeline + adjustLightness ──────────────────────────────

describe("adjustLightness", () => {
  it("returns the same hex at delta 0 (identity)", () => {
    expect(adjustLightness("#5B8CFF", 0)).toBe("#5B8CFF")
  })

  it("returns a darker hex at a negative delta", () => {
    const result = adjustLightness("#5B8CFF", -0.1)
    expect(result).not.toBe("#5B8CFF")
    const [inputL] = rgbToOklch(...(parseHex("#5B8CFF") as [number, number, number]))
    const [resultL] = rgbToOklch(...(parseHex(result) as [number, number, number]))
    expect(resultL).toBeLessThan(inputL)
  })

  it("clamps at black — does not go below #000000", () => {
    expect(adjustLightness("#000000", -0.5)).toBe("#000000")
  })

  it("clamps at white — does not go above #FFFFFF", () => {
    expect(adjustLightness("#FFFFFF", 0.5)).toBe("#FFFFFF")
  })

  it("produces perceptually uniform steps across different hues (OKLCH)", () => {
    const redBefore = rgbToOklch(...(parseHex("#FF0000") as [number, number, number]))[0]
    const blueBefore = rgbToOklch(...(parseHex("#0000FF") as [number, number, number]))[0]
    const redAfter = rgbToOklch(
      ...(parseHex(adjustLightness("#FF0000", -0.1)) as [number, number, number]),
    )[0]
    const blueAfter = rgbToOklch(
      ...(parseHex(adjustLightness("#0000FF", -0.1)) as [number, number, number]),
    )[0]
    // Tolerance of 0.03 accounts for sRGB gamut clipping on saturated boundary colors.
    // OKLCH is perceptually uniform — the residual difference comes from gamut compression,
    // not from the color space itself.
    expect(Math.abs(redBefore - redAfter - (blueBefore - blueAfter))).toBeLessThan(0.03)
  })

  it("handles achromatic input (grey) without producing NaN", () => {
    const result = adjustLightness("#808080", -0.1)
    expect(result).toMatch(/^#[0-9A-F]{6}$/)
    expect(result).not.toBe("#808080")
  })
})

// ─── Ticket 3: setAlpha ───────────────────────────────────────────────────────

describe("setAlpha", () => {
  it("returns an rgba() string with the correct channel values and alpha", () => {
    expect(setAlpha("#5B8CFF", 0.35)).toBe("rgba(91,140,255,0.35)")
    expect(setAlpha("#000000", 0)).toBe("rgba(0,0,0,0)")
    expect(setAlpha("#FFFFFF", 1)).toBe("rgba(255,255,255,1)")
  })
})

// ─── Ticket 4: WCAG functions + pickContrastColor ────────────────────────────

describe("relativeLuminance", () => {
  it("returns 1.0 for white", () => {
    expect(relativeLuminance("#FFFFFF")).toBeCloseTo(1.0, 4)
  })

  it("returns 0.0 for black", () => {
    expect(relativeLuminance("#000000")).toBeCloseTo(0.0, 4)
  })

  it("returns ~0.282 for #5B8CFF", () => {
    expect(relativeLuminance("#5B8CFF")).toBeCloseTo(0.282, 2)
  })
})

describe("contrastRatio", () => {
  it("white vs black is 21", () => {
    expect(contrastRatio("#FFFFFF", "#000000")).toBeCloseTo(21, 0)
  })

  it("is order-independent", () => {
    expect(contrastRatio("#000000", "#FFFFFF")).toBeCloseTo(21, 0)
  })

  it("same color vs itself is 1", () => {
    expect(contrastRatio("#FFFFFF", "#FFFFFF")).toBeCloseTo(1, 2)
  })
})

describe("pickContrastColor", () => {
  it("light yellow → dark label", () => {
    expect(pickContrastColor("#FFE066")).toBe("#141414")
  })

  it("dark navy → white label", () => {
    expect(pickContrastColor("#1A1A2E")).toBe("#FFFFFF")
  })

  it("saturated orange → dark label (the case HSL threshold gets wrong)", () => {
    expect(pickContrastColor("#FF8C00")).toBe("#141414")
  })

  it("pure white → dark label", () => {
    expect(pickContrastColor("#FFFFFF")).toBe("#141414")
  })

  it("pure black → white label", () => {
    expect(pickContrastColor("#000000")).toBe("#FFFFFF")
  })

  it("always produces WCAG AA contrast (≥ 4.5:1) for all test inputs", () => {
    const inputs = [
      "#FFE066",
      "#1A1A2E",
      "#FF8C00",
      "#FFFFFF",
      "#000000",
      "#5B8CFF",
      "#D90429",
      "#FFB703",
      "#141414",
    ]
    for (const base of inputs) {
      const label = pickContrastColor(base)
      expect(contrastRatio(base, label)).toBeGreaterThanOrEqual(4.5)
    }
  })
})
