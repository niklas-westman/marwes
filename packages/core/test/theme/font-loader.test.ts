import { describe, expect, it } from "vitest"
import {
  buildGoogleFontsUrl,
  extractFontFamilyName,
  extractUsedWeights,
  isSystemFont,
} from "../../src/theme/font-loader"
import { lightThemeDefaults } from "../../src/theme/theme-defaults"

// ─── buildGoogleFontsUrl ──────────────────────────────────────────────────────

describe("buildGoogleFontsUrl", () => {
  it("builds URL for Fira Code with 400 and 700", () => {
    expect(buildGoogleFontsUrl("Fira Code", [400, 700])).toBe(
      "https://fonts.googleapis.com/css2?family=Fira+Code:wght@400;700&display=swap",
    )
  })

  it("builds URL for Playfair Display with all weights", () => {
    expect(buildGoogleFontsUrl("Playfair Display", [400, 500, 600, 700])).toBe(
      "https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700&display=swap",
    )
  })

  it("builds URL for Nunito with single weight", () => {
    expect(buildGoogleFontsUrl("Nunito", [400])).toBe(
      "https://fonts.googleapis.com/css2?family=Nunito:wght@400&display=swap",
    )
  })

  it("sorts weights ascending", () => {
    expect(buildGoogleFontsUrl("Test", [700, 400, 500])).toBe(
      "https://fonts.googleapis.com/css2?family=Test:wght@400;500;700&display=swap",
    )
  })
})

// ─── extractFontFamilyName ────────────────────────────────────────────────────

describe("extractFontFamilyName", () => {
  it("extracts quoted name from font stack", () => {
    expect(extractFontFamilyName("'Fira Code', ui-monospace, monospace")).toBe("Fira Code")
  })

  it("extracts unquoted name from font stack", () => {
    expect(extractFontFamilyName("Instrument Sans, system-ui, sans-serif")).toBe("Instrument Sans")
  })

  it("extracts double-quoted name", () => {
    expect(extractFontFamilyName('"Playfair Display", Georgia, serif')).toBe("Playfair Display")
  })

  it("extracts single name without stack", () => {
    expect(extractFontFamilyName("Helvetica")).toBe("Helvetica")
  })

  it("trims whitespace", () => {
    expect(extractFontFamilyName("  Nunito , sans-serif")).toBe("Nunito")
  })
})

// ─── isSystemFont ─────────────────────────────────────────────────────────────

describe("isSystemFont", () => {
  it("system-ui is a system font", () => {
    expect(isSystemFont("system-ui")).toBe(true)
  })

  it("ui-monospace is a system font", () => {
    expect(isSystemFont("ui-monospace")).toBe(true)
  })

  it("Helvetica is a system font", () => {
    expect(isSystemFont("Helvetica")).toBe(true)
  })

  it("Arial is a system font", () => {
    expect(isSystemFont("Arial")).toBe(true)
  })

  it("sans-serif is a system font", () => {
    expect(isSystemFont("sans-serif")).toBe(true)
  })

  it("serif is a system font", () => {
    expect(isSystemFont("serif")).toBe(true)
  })

  it("monospace is a system font", () => {
    expect(isSystemFont("monospace")).toBe(true)
  })

  it("Georgia is a system font", () => {
    expect(isSystemFont("Georgia")).toBe(true)
  })

  it("Inter is a system font", () => {
    expect(isSystemFont("Inter")).toBe(true)
  })

  it("-apple-system is a system font", () => {
    expect(isSystemFont("-apple-system")).toBe(true)
  })

  it("Fira Code is NOT a system font", () => {
    expect(isSystemFont("Fira Code")).toBe(false)
  })

  it("Nunito is NOT a system font", () => {
    expect(isSystemFont("Nunito")).toBe(false)
  })

  it("Playfair Display is NOT a system font", () => {
    expect(isSystemFont("Playfair Display")).toBe(false)
  })

  it("Instrument Sans is a system font (bundled via fontsource)", () => {
    expect(isSystemFont("Instrument Sans")).toBe(true)
  })

  it("case insensitive — helvetica matches", () => {
    expect(isSystemFont("helvetica")).toBe(true)
  })
})

// ─── extractUsedWeights ───────────────────────────────────────────────────────

describe("extractUsedWeights", () => {
  it("extracts weights from lightThemeDefaults typography", () => {
    const weights = extractUsedWeights(lightThemeDefaults.typography)
    expect(weights).toContain(400)
    expect(weights).toContain(500)
    expect(weights).toContain(700)
  })

  it("always includes 400 and 500", () => {
    const weights = extractUsedWeights(lightThemeDefaults.typography)
    expect(weights).toContain(400)
    expect(weights).toContain(500)
  })

  it("returns sorted unique values", () => {
    const weights = extractUsedWeights(lightThemeDefaults.typography)
    for (let i = 1; i < weights.length; i++) {
      const current = weights[i] as number
      const previous = weights[i - 1] as number
      expect(current).toBeGreaterThan(previous)
    }
    expect(new Set(weights).size).toBe(weights.length)
  })
})
