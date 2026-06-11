/**
 * Tests the theme variable helper layer — mwThemeVars/mwThemeVarNames expose
 * typed CSS custom property references, mwVar wraps property names in var(),
 * and the helpers cover every variable the theme engine + spacing system emits.
 */
import { describe, expect, it } from "vitest"
import { Spacings } from "../../src/components/atoms/spacing"
import type { MwTheme } from "../../src/index"
import * as publicApi from "../../src/index"
import { themeToCSSVars } from "../../src/theme/theme-css"
import { resolveThemeInput } from "../../src/theme/theme-normalize"
import {
  createMwTheme,
  mwStyledTheme,
  mwTheme,
  mwThemeVarNames,
  mwThemeVars,
  mwVar,
} from "../../src/theme/theme-vars"

function flattenStringValues(value: unknown): string[] {
  if (typeof value === "string") return [value]
  if (typeof value !== "object" || value === null) return []

  return Object.values(value).flatMap(flattenStringValues)
}

describe("theme variable helpers", () => {
  it("exposes spacing CSS variable references", () => {
    expect(mwTheme.spacing.sp12).toBe("var(--mw-spacing-sp-12)")
    expect(mwThemeVarNames.spacing.sp12).toBe("--mw-spacing-sp-12")
    expect(mwTheme.spacing.sp16).toBe("var(--mw-spacing-sp-16)")
    expect(mwThemeVars.spacing.sp24).toBe("var(--mw-spacing-sp-24)")
    expect(mwThemeVarNames.spacing.sp24).toBe("--mw-spacing-sp-24")
  })

  it("exposes color CSS variable references", () => {
    expect(mwTheme.color.textMuted).toBe("var(--mw-color-text-muted)")
    expect(mwTheme.color.textLink).toBe("var(--mw-color-text-link)")
    expect(mwTheme.color.iconMuted).toBe("var(--mw-color-icon-muted)")
    expect(mwTheme.color.borderLow).toBe("var(--mw-color-border-low)")
    expect(mwTheme.color.borderFull).toBe("var(--mw-color-border-full)")
    expect(mwThemeVars.color.primary.base).toBe("var(--mw-color-primary-base)")
    expect(mwThemeVarNames.color.surfaceBrand).toBe("--mw-color-surface-brand")
    expect(mwThemeVarNames.color.borderLow).toBe("--mw-color-border-low")
    expect(mwThemeVarNames.color.borderFull).toBe("--mw-color-border-full")
    expect(mwThemeVarNames.color.text).toBe("--mw-color-text")
  })

  it("exposes typography, font, ui, and density CSS variable references", () => {
    expect(mwThemeVars.font.primary).toBe("var(--mw-font-primary)")
    expect(mwThemeVars.ui.radius).toBe("var(--mw-ui-radius)")
    expect(mwThemeVars.density.height).toBe("var(--mw-density-height)")
    expect(mwThemeVars.typography.display.fontSize).toBe("var(--mw-typography-display-font-size)")
    expect(mwThemeVars.typography.h1.fontSize).toBe("var(--mw-typography-h1-font-size)")
    expect(mwThemeVars.typography.text.label.fontSize).toBe(
      "var(--mw-typography-text-label-font-size)",
    )
    expect(mwThemeVars.typography.text["label-small"].fontSize).toBe(
      "var(--mw-typography-text-label-small-font-size)",
    )
    expect(mwThemeVars.typography.text.overline.textTransform).toBe(
      "var(--mw-typography-text-overline-transform)",
    )
    expect(mwTheme.typography.paragraph.sm.fontSize).toBe(
      "var(--mw-typography-paragraph-sm-font-size)",
    )
    expect(mwThemeVars.typography.paragraph.md.lineHeight).toBe(
      "var(--mw-typography-paragraph-md-line-height)",
    )
  })

  it("exposes default breakpoints and media helpers on the CSS-provider theme", () => {
    expect(mwTheme.breakpoint).toEqual({
      mobile: 640,
      tablet: 900,
      desktop: 1200,
      wideDesktop: 1440,
    })
    expect(mwTheme.media).toEqual({
      mobileAndAbove: "@media (min-width: 640px)",
      tabletAndAbove: "@media (min-width: 900px)",
      desktopAndAbove: "@media (min-width: 1200px)",
      wideDesktopAndAbove: "@media (min-width: 1440px)",
      mobileAndBelow: "@media (max-width: 639.98px)",
      tabletAndBelow: "@media (max-width: 899.98px)",
      desktopAndBelow: "@media (max-width: 1199.98px)",
      wideDesktopAndBelow: "@media (max-width: 1439.98px)",
    })
  })

  it("derives media helpers from resolved breakpoint overrides", () => {
    const resolved = resolveThemeInput({ breakpoint: { tablet: 1024 } })
    const theme = createMwTheme(resolved)

    expect(theme.breakpoint.tablet).toBe(1024)
    expect(theme.media.tabletAndAbove).toBe("@media (min-width: 1024px)")
    expect(theme.media.tabletAndBelow).toBe("@media (max-width: 1023.98px)")
    expect(theme.spacing.sp16).toBe(mwTheme.spacing.sp16)
  })

  it("wraps custom property names in var references", () => {
    expect(mwVar("--mw-color-text")).toBe("var(--mw-color-text)")
    expect(mwVar("--mw-color-text", "#141414")).toBe("var(--mw-color-text, #141414)")
  })

  it("uses the same references for the styled theme object", () => {
    expect(mwStyledTheme).toBe(mwTheme)
    expect(mwStyledTheme.spacing.sp24).toBe(mwThemeVars.spacing.sp24)
    expect(mwStyledTheme.media.desktopAndAbove).toBe("@media (min-width: 1200px)")
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
    const exportedTheme: MwTheme = publicApi.mwTheme

    expect(exportedTheme.media.desktopAndAbove).toBe("@media (min-width: 1200px)")
    expect(publicApi.mwTheme).toBe(mwTheme)
    expect(publicApi.mwThemeVars).toBe(mwThemeVars)
    expect(publicApi.mwThemeVarNames).toBe(mwThemeVarNames)
    expect(publicApi.mwStyledTheme).toBe(mwStyledTheme)
    expect(publicApi.createMwTheme(resolveThemeInput({}))).toEqual(mwTheme)
    expect(publicApi.mwVar("--mw-color-text")).toBe("var(--mw-color-text)")
  })
})
