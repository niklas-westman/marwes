/**
 * Compile-time type validation tests for theme types. If this file compiles
 * and passes, ColorInput, ColorRole, SecondaryColorRole, ThemeInput, and
 * ThemeInputColor are correctly shaped. Also verifies that deprecated v3
 * fields (on* prefixes, secondary color) are typed as never.
 */
import { describe, expect, it } from "vitest"
import { lightThemeDefaults } from "../../src/theme/theme-defaults"
import { TextVariant, ThemeMode } from "../../src/theme/theme-types"
import type {
  ColorInput,
  ColorRole,
  SecondaryColorRole,
  Theme,
  ThemeBreakpoints,
  ThemeInput,
  ThemeInputColor,
} from "../../src/theme/theme-types"

// These tests are primarily compile-time validations.
// If this file compiles and all assertions pass, the types are correctly shaped.

describe("ColorInput re-export", () => {
  it("accepts a plain hex string", () => {
    const input: ColorInput = "#5B8CFF"
    expect(typeof input).toBe("string")
  })

  it("accepts an object with base and optional overrides", () => {
    const input: ColorInput = { base: "#5B8CFF", hover: "#4A7AE0" }
    expect(typeof input).toBe("object")
  })

  it("accepts an object with only base", () => {
    const input: ColorInput = { base: "#5B8CFF" }
    expect(typeof input).toBe("object")
  })
})

describe("ColorRole re-export", () => {
  it("has all six required fields", () => {
    const role: ColorRole = {
      base: "#5B8CFF",
      hover: "#4A7AE0",
      pressed: "#3A6AC0",
      disabled: "rgba(91,140,255,0.35)",
      label: "#141414",
      labelDisabled: "rgba(20,20,20,0.5)",
    }
    expect(role.base).toBe("#5B8CFF")
    expect(role.label).toBe("#141414")
  })
})

describe("SecondaryColorRole re-export", () => {
  it("extends ColorRole with border fields", () => {
    const role: SecondaryColorRole = {
      base: "transparent",
      hover: "rgba(91,140,255,0.08)",
      pressed: "rgba(91,140,255,0.15)",
      disabled: "transparent",
      label: "#5B8CFF",
      labelDisabled: "rgba(91,140,255,0.5)",
      border: "#5B8CFF",
      borderDisabled: "rgba(91,140,255,0.35)",
    }
    expect(role.border).toBe("#5B8CFF")
    expect(role.borderDisabled).toBe("rgba(91,140,255,0.35)")
  })
})

describe("ThemeInputColor", () => {
  it("accepts ColorInput string for primary", () => {
    const color: Partial<ThemeInputColor> = { primary: "#5B8CFF" }
    expect(color.primary).toBe("#5B8CFF")
  })

  it("accepts object ColorInput for danger", () => {
    const color: Partial<ThemeInputColor> = { danger: { base: "#D90429" } }
    expect(typeof color.danger).toBe("object")
  })

  it("accepts plain string for surface fields", () => {
    const color: Partial<ThemeInputColor> = {
      background: "#FFFFFF",
      surfacePrimary: "#FFFFFF",
      surfaceBrand: "#EEEEFF",
      surfaceElevated: "#FFFFFF",
      textSubtle: "#595959",
      textLink: "#2527CA",
      iconMuted: "#A3A3A3",
      borderLow: "#00000026",
      borderStrong: "#A3A3A3",
      focus: "#2F31FC",
    }
    expect(color.background).toBe("#FFFFFF")
    expect(color.surfacePrimary).toBe("#FFFFFF")
    expect(color.surfaceBrand).toBe("#EEEEFF")
    expect(color.surfaceElevated).toBe("#FFFFFF")
    expect(color.textSubtle).toBe("#595959")
    expect(color.textLink).toBe("#2527CA")
    expect(color.iconMuted).toBe("#A3A3A3")
    expect(color.borderLow).toBe("#00000026")
    expect(color.borderStrong).toBe("#A3A3A3")
  })
})

describe("Theme.color — on* fields removed in v3", () => {
  it("lightThemeDefaults.color does not have onPrimary", () => {
    expect((lightThemeDefaults.color as Record<string, unknown>).onPrimary).toBeUndefined()
  })

  it("lightThemeDefaults.color does not have onSecondary", () => {
    expect((lightThemeDefaults.color as Record<string, unknown>).onSecondary).toBeUndefined()
  })

  it("lightThemeDefaults.color does not have onDanger", () => {
    expect((lightThemeDefaults.color as Record<string, unknown>).onDanger).toBeUndefined()
  })

  it("lightThemeDefaults.color does not have onSuccess", () => {
    expect((lightThemeDefaults.color as Record<string, unknown>).onSuccess).toBeUndefined()
  })

  it("lightThemeDefaults.color does not have onWarning", () => {
    expect((lightThemeDefaults.color as Record<string, unknown>).onWarning).toBeUndefined()
  })

  it("lightThemeDefaults.color does not have secondary", () => {
    expect((lightThemeDefaults.color as Record<string, unknown>).secondary).toBeUndefined()
  })
})

describe("ThemeInputColor — deprecated never fields", () => {
  it("onPrimary is typed never — assigning a value errors at compile time", () => {
    // @ts-expect-error — onPrimary is typed never in v3
    const color: Partial<ThemeInputColor> = { onPrimary: "#fff" }
    expect(color).toBeDefined()
  })

  it("secondary is typed never — assigning a value errors at compile time", () => {
    // @ts-expect-error — secondary is typed never in v3
    const color: Partial<ThemeInputColor> = { secondary: "#fff" }
    expect(color).toBeDefined()
  })
})

describe("TextVariant", () => {
  it("exposes runtime text variant values", () => {
    expect(TextVariant.display).toBe("display")
    expect(TextVariant.label).toBe("label")
    expect(TextVariant.labelSmall).toBe("label-small")
    expect(TextVariant.caption).toBe("caption")
    expect(TextVariant.overline).toBe("overline")
    expect(TextVariant.micro).toBe("micro")
  })
})

describe("ThemeInput", () => {
  it("accepts a minimal theme with just primary color", () => {
    const input: ThemeInput = { color: { primary: "#5B8CFF" } }
    expect(input.color?.primary).toBe("#5B8CFF")
  })

  it("accepts object-form primary with hover override", () => {
    const input: ThemeInput = {
      color: { primary: { base: "#5B8CFF", hover: "#4A7AE0" } },
    }
    expect(typeof input.color?.primary).toBe("object")
  })

  it("accepts font and ui overrides alongside color", () => {
    const input: ThemeInput = {
      color: { primary: "#5B8CFF" },
      font: { primary: "Custom Font" },
      ui: { radius: 8 },
    }
    expect(input.font?.primary).toBe("Custom Font")
    expect(input.ui?.radius).toBe(8)
  })

  it("accepts mode override", () => {
    const input: ThemeInput = { mode: ThemeMode.dark }
    expect(input.mode).toBe(ThemeMode.dark)
  })

  it("accepts empty object (all fields optional)", () => {
    const input: ThemeInput = {}
    expect(input.mode).toBeUndefined()
  })

  it("accepts partial breakpoint overrides", () => {
    const input: ThemeInput = { breakpoint: { tablet: 1024 } }
    expect(input.breakpoint?.tablet).toBe(1024)
  })

  it("rejects unknown breakpoint names", () => {
    const input: ThemeInput = {
      breakpoint: {
        // @ts-expect-error — breakpoint names are mobile/tablet/desktop/wideDesktop only.
        laptop: 1100,
      },
    }
    expect(input.breakpoint).toBeDefined()
  })

  it("exposes the breakpoint contract", () => {
    const breakpoints: ThemeBreakpoints = {
      mobile: 640,
      tablet: 900,
      desktop: 1200,
      wideDesktop: 1440,
    }
    expect(breakpoints.wideDesktop).toBe(1440)
  })
})
