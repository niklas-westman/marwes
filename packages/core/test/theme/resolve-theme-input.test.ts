import { describe, expect, it } from "vitest"
import { resolveThemeInput } from "../../src/theme/theme-normalize"

describe("resolveThemeInput — defaults", () => {
  it("light mode default: primary base is #141414", () => {
    expect(resolveThemeInput({}).color.primary.base).toBe("#141414")
  })

  it("dark mode default: primary base is #FFFFFF", () => {
    expect(resolveThemeInput({ mode: "dark" }).color.primary.base).toBe("#FFFFFF")
  })

  it("default background is #FFFFFF (light)", () => {
    expect(resolveThemeInput({}).color.background).toBe("#FFFFFF")
  })

  it("dark mode default background is #141414", () => {
    expect(resolveThemeInput({ mode: "dark" }).color.background).toBe("#141414")
  })

  it("default ui.radius is 4", () => {
    expect(resolveThemeInput({}).ui.radius).toBe(4)
  })

  it("default font.primary contains Instrument Sans", () => {
    expect(resolveThemeInput({}).font.primary).toContain("Instrument Sans")
  })

  it("default typography.h1.fontSize is 44", () => {
    expect(resolveThemeInput({}).typography.h1.fontSize).toBe(44)
  })
})

describe("resolveThemeInput — color role overrides", () => {
  it("string primary override sets base", () => {
    expect(resolveThemeInput({ color: { primary: "#5B8CFF" } }).color.primary.base).toBe("#5B8CFF")
  })

  it("string primary override still auto-derives label contrast", () => {
    expect(resolveThemeInput({ color: { primary: "#5B8CFF" } }).color.primary.label).toBe("#141414")
  })

  it("object primary override with hover sets hover, derives rest", () => {
    const result = resolveThemeInput({ color: { primary: { base: "#5B8CFF", hover: "#FF0000" } } })
    expect(result.color.primary.hover).toBe("#FF0000")
    expect(result.color.primary.base).toBe("#5B8CFF")
    expect(["#141414", "#FFFFFF"]).toContain(result.color.primary.label)
  })

  it("object primary override can explicitly set label and labelDisabled", () => {
    const result = resolveThemeInput({
      color: {
        primary: {
          base: "#5B8CFF",
          label: "#FFFFFF",
          labelDisabled: "rgba(255,255,255,0.5)",
        },
      },
    })

    expect(result.color.primary.base).toBe("#5B8CFF")
    expect(result.color.primary.label).toBe("#FFFFFF")
    expect(result.color.primary.labelDisabled).toBe("rgba(255,255,255,0.5)")
  })

  it("danger override", () => {
    expect(resolveThemeInput({ color: { danger: "#FF0000" } }).color.danger.base).toBe("#FF0000")
  })

  it("success override", () => {
    expect(resolveThemeInput({ color: { success: "#00FF00" } }).color.success.base).toBe("#00FF00")
  })

  it("warning override", () => {
    expect(resolveThemeInput({ color: { warning: "#FFAA00" } }).color.warning.base).toBe("#FFAA00")
  })
})

describe("resolveThemeInput — secondary derivation (D4)", () => {
  it("secondary.base is always transparent", () => {
    expect(resolveThemeInput({ color: { primary: "#5B8CFF" } }).color.secondary.base).toBe(
      "transparent",
    )
  })

  it("secondary.border equals primary.base", () => {
    const result = resolveThemeInput({ color: { primary: "#5B8CFF" } })
    expect(result.color.secondary.border).toBe(result.color.primary.base)
  })

  it("secondary changes when primary changes", () => {
    const a = resolveThemeInput({ color: { primary: "#5B8CFF" } })
    const b = resolveThemeInput({ color: { primary: "#D90429" } })
    expect(a.color.secondary.border).not.toBe(b.color.secondary.border)
  })
})

describe("resolveThemeInput — info alias (D3)", () => {
  it("info.base equals primary.base", () => {
    const result = resolveThemeInput({ color: { primary: "#5B8CFF" } })
    expect(result.color.info.base).toBe(result.color.primary.base)
  })

  it("info.label equals primary.label", () => {
    const result = resolveThemeInput({ color: { primary: "#5B8CFF" } })
    expect(result.color.info.label).toBe(result.color.primary.label)
  })
})

describe("resolveThemeInput — surface overrides", () => {
  it("background override", () => {
    expect(resolveThemeInput({ color: { background: "#F0F0F0" } }).color.background).toBe("#F0F0F0")
  })

  it("focus override", () => {
    expect(resolveThemeInput({ color: { focus: "#FF0000" } }).color.focus).toBe("#FF0000")
  })

  it("text override", () => {
    expect(resolveThemeInput({ color: { text: "#333333" } }).color.text).toBe("#333333")
  })

  it("surfaceElevated override", () => {
    expect(resolveThemeInput({ color: { surfaceElevated: "#FAFAFA" } }).color.surfaceElevated).toBe(
      "#FAFAFA",
    )
  })

  it("textSubtle override", () => {
    expect(resolveThemeInput({ color: { textSubtle: "#777777" } }).color.textSubtle).toBe("#777777")
  })

  it("borderStrong override", () => {
    expect(resolveThemeInput({ color: { borderStrong: "#101010" } }).color.borderStrong).toBe(
      "#101010",
    )
  })
})

describe("resolveThemeInput — font / ui / typography overrides", () => {
  it("font.primary override", () => {
    expect(resolveThemeInput({ font: { primary: "My Font" } }).font.primary).toBe("My Font")
  })

  it("font.secondary preserved from defaults when not overridden", () => {
    const result = resolveThemeInput({ font: { primary: "My Font" } })
    expect(result.font.secondary).toBe("Helvetica")
  })

  it("ui.radius override", () => {
    expect(resolveThemeInput({ ui: { radius: 8 } }).ui.radius).toBe(8)
  })

  it("typography.h1.fontSize override", () => {
    expect(resolveThemeInput({ typography: { h1: { fontSize: 48 } } }).typography.h1.fontSize).toBe(
      48,
    )
  })

  it("typography.h1.lineHeight preserved when only fontSize overridden", () => {
    expect(
      resolveThemeInput({ typography: { h1: { fontSize: 48 } } }).typography.h1.lineHeight,
    ).toBe(1.18)
  })

  it("typography.paragraph.sm.fontSize override", () => {
    expect(
      resolveThemeInput({ typography: { paragraph: { sm: { fontSize: 12 } } } }).typography
        .paragraph.sm.fontSize,
    ).toBe(12)
  })
})

// ─── Tone integration ─────────────────────────────────────────────────────────

describe("resolveThemeInput — tone: digital", () => {
  it("sets monospace font when tone is digital", () => {
    expect(resolveThemeInput({ tone: "digital" }).font.primary).toContain("Fira Code")
  })

  it("sets radius to 0 when tone is digital", () => {
    expect(resolveThemeInput({ tone: "digital" }).ui.radius).toBe(0)
  })

  it("user font override beats tone font", () => {
    const result = resolveThemeInput({ tone: "digital", font: { primary: "My Font" } })
    expect(result.font.primary).toBe("My Font")
  })

  it("user radius override beats tone radius", () => {
    const result = resolveThemeInput({ tone: "digital", ui: { radius: 8 } })
    expect(result.ui.radius).toBe(8)
  })

  it("user typography override beats tone typography", () => {
    const result = resolveThemeInput({ tone: "digital", typography: { h1: { fontWeight: 900 } } })
    expect(result.typography.h1.fontWeight).toBe(900)
  })
})

describe("resolveThemeInput — tone: playful", () => {
  it("sets Nunito font when tone is playful", () => {
    expect(resolveThemeInput({ tone: "playful" }).font.primary).toContain("Nunito")
  })

  it("sets radius to 16 when tone is playful", () => {
    expect(resolveThemeInput({ tone: "playful" }).ui.radius).toBe(16)
  })
})

describe("resolveThemeInput — tone: editorial", () => {
  it("sets Playfair Display font when tone is editorial", () => {
    expect(resolveThemeInput({ tone: "editorial" }).font.primary).toContain("Playfair Display")
  })

  it("sets radius to 2 when tone is editorial", () => {
    expect(resolveThemeInput({ tone: "editorial" }).ui.radius).toBe(2)
  })
})

describe("resolveThemeInput — tone: default", () => {
  it("uses standard defaults when tone is default", () => {
    const result = resolveThemeInput({ tone: "default" })
    expect(result.font.primary).toContain("Instrument Sans")
    expect(result.ui.radius).toBe(4)
  })

  it("no tone specified uses standard defaults", () => {
    const result = resolveThemeInput({})
    expect(result.font.primary).toContain("Instrument Sans")
    expect(result.ui.radius).toBe(4)
  })
})

describe("resolveThemeInput — variant removed from ResolvedTheme.ui", () => {
  it("resolved theme does not have variant property on ui", () => {
    const result = resolveThemeInput({})
    expect("variant" in result.ui).toBe(false)
  })
})
