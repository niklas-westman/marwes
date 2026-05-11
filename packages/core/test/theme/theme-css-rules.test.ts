/**
 * Tests CSS rule generation from resolved themes — single-mode rules,
 * dual-mode (light + dark) rule sheets, and root attribute selectors
 * for pre-hydration mode scripts.
 */
import { describe, expect, it } from "vitest"
import {
  ThemeMode,
  resolveThemeInput,
  themeModesToCSSRules,
  themeToCSSRule,
  themeToCSSVars,
} from "../../src"

describe("theme CSS rule helpers", () => {
  it("emits every CSS variable for a resolved theme", () => {
    const theme = resolveThemeInput({ mode: ThemeMode.dark })
    const rule = themeToCSSRule("[data-marwes-theme]", theme)

    for (const [property, value] of Object.entries(themeToCSSVars(theme))) {
      expect(rule).toContain(`${property}: ${value};`)
    }
  })

  it("keeps provider root background and text color parity with inline variables", () => {
    const theme = resolveThemeInput({ mode: ThemeMode.dark })
    const rule = themeToCSSRule("[data-marwes-theme]", theme)

    expect(rule).toContain("background-color: var(--mw-color-background);")
    expect(rule).toContain("color: var(--mw-color-text);")
  })

  it("emits light and dark provider mode rules", () => {
    const light = resolveThemeInput({ mode: ThemeMode.light })
    const dark = resolveThemeInput({ mode: ThemeMode.dark })
    const rules = themeModesToCSSRules({ light, dark })

    expect(rules).toContain('[data-marwes-theme][data-marwes-mode="light"]')
    expect(rules).toContain('[data-marwes-theme][data-marwes-mode="dark"]')
    expect(rules).toContain(`--mw-color-background: ${light.color.background};`)
    expect(rules).toContain(`--mw-color-background: ${dark.color.background};`)
  })

  it("can include root attribute selectors for pre-hydration mode scripts", () => {
    const rules = themeModesToCSSRules({
      light: resolveThemeInput({ mode: ThemeMode.light }),
      dark: resolveThemeInput({ mode: ThemeMode.dark }),
      rootTarget: "html",
      rootAttribute: "class",
    })

    expect(rules).toContain("html.light [data-marwes-theme]")
    expect(rules).toContain("html.dark [data-marwes-theme]")
  })
})
