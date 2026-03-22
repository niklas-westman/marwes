import { describe, expect, it } from "vitest"
import { DENSITY_SCALES, densityToCSSVars } from "../../src/theme/density"

// ─── DENSITY_SCALES structural invariants ─────────────────────────────────────

describe("DENSITY_SCALES", () => {
  const densities = ["compact", "comfortable", "spacious"] as const

  it("has exactly 3 density levels", () => {
    expect(Object.keys(DENSITY_SCALES)).toHaveLength(3)
  })

  it("all numeric values are positive", () => {
    for (const density of densities) {
      const scale = DENSITY_SCALES[density]
      for (const [key, value] of Object.entries(scale)) {
        expect(value, `${density}.${key}`).toBeGreaterThan(0)
      }
    }
  })

  it("compact < comfortable < spacious for all numeric props", () => {
    const numericKeys = Object.keys(
      DENSITY_SCALES.compact,
    ) as (keyof typeof DENSITY_SCALES.compact)[]

    for (const key of numericKeys) {
      const c = DENSITY_SCALES.compact[key]
      const m = DENSITY_SCALES.comfortable[key]
      const s = DENSITY_SCALES.spacious[key]
      expect(c, `compact.${key} < comfortable.${key}`).toBeLessThan(m)
      expect(m, `comfortable.${key} < spacious.${key}`).toBeLessThan(s)
    }
  })

  it("comfortable spacingMultiplier is 1 (the baseline)", () => {
    expect(DENSITY_SCALES.comfortable.spacingMultiplier).toBe(1)
  })
})

// ─── densityToCSSVars ─────────────────────────────────────────────────────────

describe("densityToCSSVars", () => {
  it("emits exactly 10 CSS variables", () => {
    expect(Object.keys(densityToCSSVars("comfortable"))).toHaveLength(10)
  })

  it("all 10 density vars are present", () => {
    const vars = densityToCSSVars("comfortable")
    expect(vars["--mw-density-height"]).toBeDefined()
    expect(vars["--mw-density-padding-x"]).toBeDefined()
    expect(vars["--mw-density-padding-y"]).toBeDefined()
    expect(vars["--mw-density-gap"]).toBeDefined()
    expect(vars["--mw-density-font-size"]).toBeDefined()
    expect(vars["--mw-density-icon-size"]).toBeDefined()
    expect(vars["--mw-density-checkbox-size"]).toBeDefined()
    expect(vars["--mw-density-field-gap"]).toBeDefined()
    expect(vars["--mw-density-spacing-multiplier"]).toBeDefined()
    expect(vars["--mw-density-font-size-sm"]).toBeDefined()
  })

  it("spacingMultiplier is unitless in CSS output", () => {
    const vars = densityToCSSVars("comfortable")
    const value = vars["--mw-density-spacing-multiplier"]
    expect(value).toBe("1")
    expect(value).not.toContain("px")
  })

  it("height values track the density order", () => {
    const compact = densityToCSSVars("compact")["--mw-density-height"]
    const comfortable = densityToCSSVars("comfortable")["--mw-density-height"]
    const spacious = densityToCSSVars("spacious")["--mw-density-height"]

    expect(Number.parseInt(compact)).toBeLessThan(Number.parseInt(comfortable))
    expect(Number.parseInt(comfortable)).toBeLessThan(Number.parseInt(spacious))
  })
})
