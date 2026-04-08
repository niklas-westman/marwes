import { describe, expect, it, vi } from "vitest"
import {
  resolveColorRole,
  resolveInfoRole,
  resolveSecondaryRole,
} from "../../src/theme/color-resolve"
import { applyTheme, themeToCSSVars } from "../../src/theme/theme-css"
import type { ResolvedTheme } from "../../src/theme/theme-css"

// ─── Fixture ──────────────────────────────────────────────────────────────────

const primary = resolveColorRole("#5B8CFF")
const danger = resolveColorRole("#D90429")
const success = resolveColorRole("#006633")
const warning = resolveColorRole("#FFB703")

const fixture: ResolvedTheme = {
  color: {
    primary,
    secondary: resolveSecondaryRole(primary),
    danger,
    success,
    warning,
    info: resolveInfoRole(primary),
    background: "#FFFFFF",
    surface: "#F9FAFB",
    surfaceSubtle: "#F3F4F6",
    surfaceElevated: "#FFFFFF",
    surfaceDisabled: "#F3F4F6",
    surfaceInverted: "#141414",
    text: "#141414",
    textMuted: "#9CA3AF",
    textSubtle: "#9CA3AF",
    textDisabled: "rgba(20,20,20,0.4)",
    textInverted: "#F9FAFB",
    border: "rgba(0,0,0,0.4)",
    borderSubtle: "#00000033",
    borderStrong: "#141414",
    borderDisabled: "rgba(20,20,20,0.16)",
    focus: "#2684FF",
  },
  font: {
    primary: "'Instrument Sans', Inter, system-ui, sans-serif",
    secondary: "Helvetica",
    mono: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
  },
  ui: {
    radius: 4,
    density: "comfortable",
  },
  typography: {
    h1: { fontSize: 44, lineHeight: 1.18, fontWeight: 700, letterSpacing: -1.32 },
    h2: { fontSize: 32, lineHeight: 1.25, fontWeight: 700, letterSpacing: -0.96 },
    h3: { fontSize: 24, lineHeight: 1.3, fontWeight: 600, letterSpacing: -0.48 },
    paragraph: {
      sm: { fontSize: 14, lineHeight: 1.5 },
      md: { fontSize: 16, lineHeight: 1.6 },
      lg: { fontSize: 18, lineHeight: 1.7 },
    },
  },
}

// ─── Ticket 1: themeToCSSVars ─────────────────────────────────────────────────

describe("themeToCSSVars — color roles", () => {
  it("primary-base equals role base", () => {
    expect(themeToCSSVars(fixture)["--mw-color-primary-base"]).toBe(primary.base)
  })

  it("primary-hover equals role hover", () => {
    expect(themeToCSSVars(fixture)["--mw-color-primary-hover"]).toBe(primary.hover)
  })

  it("primary-pressed equals role pressed", () => {
    expect(themeToCSSVars(fixture)["--mw-color-primary-pressed"]).toBe(primary.pressed)
  })

  it("primary-disabled equals role disabled", () => {
    expect(themeToCSSVars(fixture)["--mw-color-primary-disabled"]).toBe(primary.disabled)
  })

  it("primary-label equals role label", () => {
    expect(themeToCSSVars(fixture)["--mw-color-primary-label"]).toBe(primary.label)
  })

  it("primary-label-disabled equals role labelDisabled", () => {
    expect(themeToCSSVars(fixture)["--mw-color-primary-label-disabled"]).toBe(primary.labelDisabled)
  })

  it("danger-base equals danger role base", () => {
    expect(themeToCSSVars(fixture)["--mw-color-danger-base"]).toBe(danger.base)
  })

  it("success-base equals success role base", () => {
    expect(themeToCSSVars(fixture)["--mw-color-success-base"]).toBe(success.base)
  })

  it("warning-base equals warning role base", () => {
    expect(themeToCSSVars(fixture)["--mw-color-warning-base"]).toBe(warning.base)
  })
})

describe("themeToCSSVars — secondary (D4)", () => {
  it("secondary-base is transparent", () => {
    expect(themeToCSSVars(fixture)["--mw-color-secondary-base"]).toBe("transparent")
  })

  it("secondary-border equals primary base", () => {
    expect(themeToCSSVars(fixture)["--mw-color-secondary-border"]).toBe(primary.base)
  })

  it("secondary-border-disabled equals primary disabled", () => {
    expect(themeToCSSVars(fixture)["--mw-color-secondary-border-disabled"]).toBe(primary.disabled)
  })

  it("secondary-label equals primary base", () => {
    expect(themeToCSSVars(fixture)["--mw-color-secondary-label"]).toBe(primary.base)
  })

  it("secondary-hover equals primary base at 8% alpha", () => {
    expect(themeToCSSVars(fixture)["--mw-color-secondary-hover"]).toBe("rgba(91,140,255,0.08)")
  })
})

describe("themeToCSSVars — info alias (D3)", () => {
  it("info-base equals primary base", () => {
    expect(themeToCSSVars(fixture)["--mw-color-info-base"]).toBe(primary.base)
  })

  it("info-label equals primary label", () => {
    expect(themeToCSSVars(fixture)["--mw-color-info-label"]).toBe(primary.label)
  })

  it("info-hover equals primary hover", () => {
    expect(themeToCSSVars(fixture)["--mw-color-info-hover"]).toBe(primary.hover)
  })
})

describe("themeToCSSVars — surface / semantic", () => {
  it("background equals fixture value", () => {
    expect(themeToCSSVars(fixture)["--mw-color-background"]).toBe("#FFFFFF")
  })

  it("surface equals fixture value", () => {
    expect(themeToCSSVars(fixture)["--mw-color-surface"]).toBe("#F9FAFB")
  })

  it("surface-subtle equals fixture value", () => {
    expect(themeToCSSVars(fixture)["--mw-color-surface-subtle"]).toBe("#F3F4F6")
  })

  it("surface-elevated equals fixture value", () => {
    expect(themeToCSSVars(fixture)["--mw-color-surface-elevated"]).toBe("#FFFFFF")
  })

  it("surface-disabled equals fixture value", () => {
    expect(themeToCSSVars(fixture)["--mw-color-surface-disabled"]).toBe("#F3F4F6")
  })

  it("surface-inverted equals fixture value", () => {
    expect(themeToCSSVars(fixture)["--mw-color-surface-inverted"]).toBe("#141414")
  })

  it("text equals fixture value", () => {
    expect(themeToCSSVars(fixture)["--mw-color-text"]).toBe("#141414")
  })

  it("text-muted equals fixture value", () => {
    expect(themeToCSSVars(fixture)["--mw-color-text-muted"]).toBe("#9CA3AF")
  })

  it("text-subtle equals fixture value", () => {
    expect(themeToCSSVars(fixture)["--mw-color-text-subtle"]).toBe("#9CA3AF")
  })

  it("text-disabled equals fixture value", () => {
    expect(themeToCSSVars(fixture)["--mw-color-text-disabled"]).toBe("rgba(20,20,20,0.4)")
  })

  it("focus equals fixture value", () => {
    expect(themeToCSSVars(fixture)["--mw-color-focus"]).toBe("#2684FF")
  })

  it("border equals fixture value", () => {
    expect(themeToCSSVars(fixture)["--mw-color-border"]).toBe("rgba(0,0,0,0.4)")
  })

  it("border-strong equals fixture value", () => {
    expect(themeToCSSVars(fixture)["--mw-color-border-strong"]).toBe("#141414")
  })

  it("border-disabled equals fixture value", () => {
    expect(themeToCSSVars(fixture)["--mw-color-border-disabled"]).toBe("rgba(20,20,20,0.16)")
  })
})

describe("themeToCSSVars — font / ui", () => {
  it("font-primary equals fixture value", () => {
    expect(themeToCSSVars(fixture)["--mw-font-primary"]).toBe(fixture.font.primary)
  })

  it("font-secondary equals fixture value", () => {
    expect(themeToCSSVars(fixture)["--mw-font-secondary"]).toBe(fixture.font.secondary)
  })

  it("font-mono equals fixture value", () => {
    expect(themeToCSSVars(fixture)["--mw-font-mono"]).toBe(fixture.font.mono)
  })

  it("ui-radius appends px", () => {
    expect(themeToCSSVars(fixture)["--mw-ui-radius"]).toBe("4px")
  })
})

describe("themeToCSSVars — typography", () => {
  it("h1-font-size appends px", () => {
    expect(themeToCSSVars(fixture)["--mw-typography-h1-font-size"]).toBe("44px")
  })

  it("h1-line-height is unitless string", () => {
    expect(themeToCSSVars(fixture)["--mw-typography-h1-line-height"]).toBe("1.18")
  })

  it("h1-font-weight is string", () => {
    expect(themeToCSSVars(fixture)["--mw-typography-h1-font-weight"]).toBe("700")
  })

  it("h1-letter-spacing supports negative values in px", () => {
    expect(themeToCSSVars(fixture)["--mw-typography-h1-letter-spacing"]).toBe("-1.32px")
  })

  it("h2-font-size appends px", () => {
    expect(themeToCSSVars(fixture)["--mw-typography-h2-font-size"]).toBe("32px")
  })

  it("h3-font-size appends px", () => {
    expect(themeToCSSVars(fixture)["--mw-typography-h3-font-size"]).toBe("24px")
  })

  it("paragraph-sm-font-size appends px", () => {
    expect(themeToCSSVars(fixture)["--mw-typography-paragraph-sm-font-size"]).toBe("14px")
  })

  it("paragraph-sm-line-height is unitless string", () => {
    expect(themeToCSSVars(fixture)["--mw-typography-paragraph-sm-line-height"]).toBe("1.5")
  })

  it("paragraph-lg-font-size appends px", () => {
    expect(themeToCSSVars(fixture)["--mw-typography-paragraph-lg-font-size"]).toBe("18px")
  })
})

describe("themeToCSSVars — density vars", () => {
  it("emits --mw-density-height with px suffix", () => {
    expect(themeToCSSVars(fixture)["--mw-density-height"]).toBe("40px")
  })

  it("emits --mw-density-padding-x with px suffix", () => {
    expect(themeToCSSVars(fixture)["--mw-density-padding-x"]).toBe("16px")
  })

  it("emits --mw-density-padding-y with px suffix", () => {
    expect(themeToCSSVars(fixture)["--mw-density-padding-y"]).toBe("12px")
  })

  it("emits --mw-density-gap with px suffix", () => {
    expect(themeToCSSVars(fixture)["--mw-density-gap"]).toBe("8px")
  })

  it("emits --mw-density-font-size with px suffix", () => {
    expect(themeToCSSVars(fixture)["--mw-density-font-size"]).toBe("14px")
  })

  it("emits --mw-density-icon-size with px suffix", () => {
    expect(themeToCSSVars(fixture)["--mw-density-icon-size"]).toBe("20px")
  })

  it("emits --mw-density-checkbox-size with px suffix", () => {
    expect(themeToCSSVars(fixture)["--mw-density-checkbox-size"]).toBe("18px")
  })

  it("emits --mw-density-field-gap with px suffix", () => {
    expect(themeToCSSVars(fixture)["--mw-density-field-gap"]).toBe("4px")
  })

  it("emits --mw-density-spacing-multiplier as unitless", () => {
    expect(themeToCSSVars(fixture)["--mw-density-spacing-multiplier"]).toBe("1")
  })

  it("emits --mw-density-font-size-sm with px suffix", () => {
    expect(themeToCSSVars(fixture)["--mw-density-font-size-sm"]).toBe("13px")
  })
})

describe("themeToCSSVars — total key count", () => {
  it("emits exactly 86 CSS variables", () => {
    expect(Object.keys(themeToCSSVars(fixture)).length).toBe(86)
  })

  it("does not emit --mw-ui-density as a string var", () => {
    expect("--mw-ui-density" in themeToCSSVars(fixture)).toBe(false)
  })

  it("does not emit --mw-ui-variant", () => {
    expect("--mw-ui-variant" in themeToCSSVars(fixture)).toBe(false)
  })
})

// ─── Ticket 2: applyTheme ─────────────────────────────────────────────────────

describe("applyTheme", () => {
  it("sets data-marwes-theme attribute on element", () => {
    const setAttribute = vi.fn()
    const setProperty = vi.fn()
    const el = { setAttribute, style: { setProperty } } as unknown as HTMLElement

    applyTheme(el, fixture)

    expect(setAttribute).toHaveBeenCalledWith("data-marwes-theme", "true")
  })

  it("calls style.setProperty for --mw-color-primary-base", () => {
    const setAttribute = vi.fn()
    const setProperty = vi.fn()
    const el = { setAttribute, style: { setProperty } } as unknown as HTMLElement

    applyTheme(el, fixture)

    expect(setProperty).toHaveBeenCalledWith("--mw-color-primary-base", primary.base)
  })

  it("calls style.setProperty exactly 86 times", () => {
    const setAttribute = vi.fn()
    const setProperty = vi.fn()
    const el = { setAttribute, style: { setProperty } } as unknown as HTMLElement

    applyTheme(el, fixture)

    expect(setProperty).toHaveBeenCalledTimes(86)
  })

  it("sets backgroundColor to the resolved background color", () => {
    const el = { setAttribute: vi.fn(), style: { setProperty: vi.fn() } } as unknown as HTMLElement

    applyTheme(el, fixture)

    expect((el.style as CSSStyleDeclaration).backgroundColor).toBe("#FFFFFF")
  })

  it("sets color to the resolved text color", () => {
    const el = { setAttribute: vi.fn(), style: { setProperty: vi.fn() } } as unknown as HTMLElement

    applyTheme(el, fixture)

    expect((el.style as CSSStyleDeclaration).color).toBe("#141414")
  })
})
