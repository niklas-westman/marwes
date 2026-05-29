/**
 * Tests themeToCSSVars — verifies that every resolved theme field maps to
 * the correct CSS custom property name, value format (px suffix, unitless),
 * and total variable count. Uses the light theme fixture for deterministic checks.
 */
import { describe, expect, it } from "vitest"
import {
  resolveColorRole,
  resolveInfoRole,
  resolveSecondaryRole,
} from "../../src/theme/color-resolve"
import { themeToCSSVars } from "../../src/theme/theme-css"
import type { ResolvedTheme } from "../../src/theme/theme-css"
import { ThemeMode } from "../../src/theme/theme-types"

// ─── Fixture ──────────────────────────────────────────────────────────────────

const primary = resolveColorRole("#5B8CFF")
const danger = resolveColorRole("#D90429")
const success = resolveColorRole("#006633")
const warning = resolveColorRole("#B45309")

const fixture: ResolvedTheme = {
  mode: ThemeMode.light,
  color: {
    primary,
    secondary: resolveSecondaryRole(primary),
    danger,
    success,
    warning,
    info: resolveInfoRole(primary),
    background: "#FFFFFF",
    surface: "#F8F8F8",
    surfacePrimary: "#FFFFFF",
    surfaceSubtle: "#F5F5F5",
    surfaceBrand: "#EEEEFF",
    surfaceElevated: "#FFFFFF",
    surfaceDisabled: "#F5F5F5",
    surfaceInverted: "#141414",
    text: "#141414",
    textMuted: "#595959",
    textSubtle: "#595959",
    textDisabled: "#737373",
    textInverted: "#FFFFFF",
    textBrand: "#2F31FC",
    textLink: "#2527CA",
    iconMuted: "#A3A3A3",
    borderLow: "#00000026",
    border: "#D8D8D8",
    borderSubtle: "#D8D8D8",
    borderStrong: "#A3A3A3",
    borderDisabled: "#D8D8D8",
    borderBrand: "#2F31FC",
    focus: "#2F31FC",
    status: {
      success: {
        background: "#E6F4ED",
        text: "#006633",
        icon: "#006D48",
        border: "#90CAAD",
        borderStrong: "#2E9970",
      },
      warning: {
        background: "#FFF8E6",
        text: "#B45309",
        icon: "#D97706",
        border: "#FDE08A",
        borderStrong: "#E46F00",
      },
      error: {
        background: "#FFE8EB",
        text: "#A8031F",
        icon: "#D90429",
        border: "#FF8A95",
        borderStrong: "#FF2847",
      },
      info: {
        background: "#EEEEFF",
        text: "#1B1D97",
        icon: "#2F31FC",
        border: "#ABABFD",
        borderStrong: "#5859FC",
      },
    },
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
  breakpoint: {
    mobile: 640,
    tablet: 900,
    desktop: 1200,
    wideDesktop: 1440,
  },
  typography: {
    display: { fontSize: 56, lineHeight: 1.1, fontWeight: 700, letterSpacing: -1.68 },
    h1: { fontSize: 44, lineHeight: 1.18, fontWeight: 700, letterSpacing: -1.32 },
    h2: { fontSize: 32, lineHeight: 1.25, fontWeight: 700, letterSpacing: -0.96 },
    h3: { fontSize: 24, lineHeight: 1.3, fontWeight: 600, letterSpacing: -0.48 },
    text: {
      display: { fontSize: 56, lineHeight: 1.1, fontWeight: 700, letterSpacing: -1.68 },
      label: { fontSize: 14, lineHeight: 1.14, fontWeight: 500, letterSpacing: -0.42 },
      "label-small": { fontSize: 12, lineHeight: 1, fontWeight: 500, letterSpacing: -0.36 },
      caption: { fontSize: 12, lineHeight: 1.33, fontWeight: 500, letterSpacing: 0 },
      overline: {
        fontSize: 11,
        lineHeight: 1.45,
        fontWeight: 500,
        letterSpacing: 0.88,
        textTransform: "uppercase",
      },
      micro: { fontSize: 11, lineHeight: 1.27, fontWeight: 400, letterSpacing: -0.33 },
    },
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
    expect(themeToCSSVars(fixture)["--mw-color-surface"]).toBe("#F8F8F8")
  })

  it("surface-primary equals fixture value", () => {
    expect(themeToCSSVars(fixture)["--mw-color-surface-primary"]).toBe("#FFFFFF")
  })

  it("surface-subtle equals fixture value", () => {
    expect(themeToCSSVars(fixture)["--mw-color-surface-subtle"]).toBe("#F5F5F5")
  })

  it("surface-brand equals fixture value", () => {
    expect(themeToCSSVars(fixture)["--mw-color-surface-brand"]).toBe("#EEEEFF")
  })

  it("surface-elevated equals fixture value", () => {
    expect(themeToCSSVars(fixture)["--mw-color-surface-elevated"]).toBe("#FFFFFF")
  })

  it("surface-disabled equals fixture value", () => {
    expect(themeToCSSVars(fixture)["--mw-color-surface-disabled"]).toBe("#F5F5F5")
  })

  it("surface-inverted equals fixture value", () => {
    expect(themeToCSSVars(fixture)["--mw-color-surface-inverted"]).toBe("#141414")
  })

  it("text equals fixture value", () => {
    expect(themeToCSSVars(fixture)["--mw-color-text"]).toBe("#141414")
  })

  it("text-muted equals fixture value", () => {
    expect(themeToCSSVars(fixture)["--mw-color-text-muted"]).toBe("#595959")
  })

  it("text-subtle equals fixture value", () => {
    expect(themeToCSSVars(fixture)["--mw-color-text-subtle"]).toBe("#595959")
  })

  it("text-disabled equals fixture value", () => {
    expect(themeToCSSVars(fixture)["--mw-color-text-disabled"]).toBe("#737373")
  })

  it("focus equals fixture value", () => {
    expect(themeToCSSVars(fixture)["--mw-color-focus"]).toBe("#2F31FC")
  })

  it("border equals fixture value", () => {
    expect(themeToCSSVars(fixture)["--mw-color-border"]).toBe("#D8D8D8")
  })

  it("border-strong equals fixture value", () => {
    expect(themeToCSSVars(fixture)["--mw-color-border-strong"]).toBe("#A3A3A3")
  })

  it("border-disabled equals fixture value", () => {
    expect(themeToCSSVars(fixture)["--mw-color-border-disabled"]).toBe("#D8D8D8")
  })

  it("brand text and border equal fixture values", () => {
    expect(themeToCSSVars(fixture)["--mw-color-text-brand"]).toBe("#2F31FC")
    expect(themeToCSSVars(fixture)["--mw-color-border-brand"]).toBe("#2F31FC")
  })

  it("text-link and icon-muted equal fixture values", () => {
    expect(themeToCSSVars(fixture)["--mw-color-text-link"]).toBe("#2527CA")
    expect(themeToCSSVars(fixture)["--mw-color-icon-muted"]).toBe("#A3A3A3")
    expect(themeToCSSVars(fixture)["--mw-color-border-low"]).toBe("#00000026")
  })
})

describe("themeToCSSVars — status tokens", () => {
  it("emits status role surfaces and readable text tokens", () => {
    expect(themeToCSSVars(fixture)["--mw-color-status-warning-background"]).toBe("#FFF8E6")
    expect(themeToCSSVars(fixture)["--mw-color-status-warning-text"]).toBe("#B45309")
    expect(themeToCSSVars(fixture)["--mw-color-status-error-text"]).toBe("#A8031F")
    expect(themeToCSSVars(fixture)["--mw-color-status-info-border"]).toBe("#ABABFD")
    expect(themeToCSSVars(fixture)["--mw-color-status-info-border-strong"]).toBe("#5859FC")
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
  it("display-font-size appends px", () => {
    expect(themeToCSSVars(fixture)["--mw-typography-display-font-size"]).toBe("56px")
  })

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

  it("text-overline-transform is emitted", () => {
    expect(themeToCSSVars(fixture)["--mw-typography-text-overline-transform"]).toBe("uppercase")
  })

  it("text-label vars are emitted", () => {
    expect(themeToCSSVars(fixture)["--mw-typography-text-label-font-size"]).toBe("14px")
    expect(themeToCSSVars(fixture)["--mw-typography-text-label-line-height"]).toBe("1.14")
    expect(themeToCSSVars(fixture)["--mw-typography-text-label-letter-spacing"]).toBe("-0.42px")
  })

  it("text-label-small vars are emitted", () => {
    expect(themeToCSSVars(fixture)["--mw-typography-text-label-small-font-size"]).toBe("12px")
    expect(themeToCSSVars(fixture)["--mw-typography-text-label-small-line-height"]).toBe("1")
    expect(themeToCSSVars(fixture)["--mw-typography-text-label-small-letter-spacing"]).toBe(
      "-0.36px",
    )
  })

  it("text-micro-letter-spacing appends px", () => {
    expect(themeToCSSVars(fixture)["--mw-typography-text-micro-letter-spacing"]).toBe("-0.33px")
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
  it("emits exactly 147 CSS variables", () => {
    expect(Object.keys(themeToCSSVars(fixture)).length).toBe(147)
  })

  it("does not emit --mw-ui-density as a string var", () => {
    expect("--mw-ui-density" in themeToCSSVars(fixture)).toBe(false)
  })

  it("does not emit --mw-ui-variant", () => {
    expect("--mw-ui-variant" in themeToCSSVars(fixture)).toBe(false)
  })
})
