import { describe, expect, it } from "vitest"
import { Spacings } from "../../src/components/atoms/spacing"
import * as publicApi from "../../src/index"
import { themeToCSSVars } from "../../src/theme/theme-css"
import { resolveThemeInput } from "../../src/theme/theme-normalize"
import { mwStyledTheme, mwThemeVarNames, mwThemeVars, mwVar } from "../../src/theme/theme-vars"

function flattenStringValues(value: unknown): string[] {
  if (typeof value === "string") return [value]
  if (typeof value !== "object" || value === null) return []

  return Object.values(value).flatMap(flattenStringValues)
}

describe("theme variable helpers", () => {
  it("exposes spacing CSS variable references", () => {
    expect(mwThemeVars.spacing.sp24).toBe("var(--mw-spacing-sp-24)")
    expect(mwThemeVarNames.spacing.sp24).toBe("--mw-spacing-sp-24")
  })

  it("exposes color CSS variable references", () => {
    expect(mwThemeVars.color.primary.base).toBe("var(--mw-color-primary-base)")
    expect(mwThemeVarNames.color.text).toBe("--mw-color-text")
  })

  it("exposes typography, font, ui, and density CSS variable references", () => {
    expect(mwThemeVars.font.primary).toBe("var(--mw-font-primary)")
    expect(mwThemeVars.ui.radius).toBe("var(--mw-ui-radius)")
    expect(mwThemeVars.density.height).toBe("var(--mw-density-height)")
    expect(mwThemeVars.typography.h1.fontSize).toBe("var(--mw-typography-h1-font-size)")
    expect(mwThemeVars.typography.paragraph.md.lineHeight).toBe(
      "var(--mw-typography-paragraph-md-line-height)",
    )
  })

  it("wraps custom property names in var references", () => {
    expect(mwVar("--mw-color-text")).toBe("var(--mw-color-text)")
    expect(mwVar("--mw-color-text", "#141414")).toBe("var(--mw-color-text, #141414)")
  })

  it("uses the same references for the styled theme object", () => {
    expect(mwStyledTheme).toBe(mwThemeVars)
    expect(mwStyledTheme.spacing.sp24).toBe(mwThemeVars.spacing.sp24)
  })

  it("covers the theme engine vars and static spacing tokens", () => {
    const exportedNames = new Set(flattenStringValues(mwThemeVarNames))
    const themeEngineNames = Object.keys(themeToCSSVars(resolveThemeInput({})))
    const spacingNames = Object.values(Spacings).map((spacing) => `--mw-spacing-${spacing}`)

    for (const name of [...themeEngineNames, ...spacingNames]) {
      expect(exportedNames.has(name)).toBe(true)
    }
  })

  it("exports the helpers from the core package root", () => {
    expect(publicApi.mwThemeVars).toBe(mwThemeVars)
    expect(publicApi.mwThemeVarNames).toBe(mwThemeVarNames)
    expect(publicApi.mwStyledTheme).toBe(mwStyledTheme)
    expect(publicApi.mwVar("--mw-color-text")).toBe("var(--mw-color-text)")
  })
})
