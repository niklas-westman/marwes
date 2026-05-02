import { describe, expect, it } from "vitest"
import {
  normalizeColorInput,
  resolveColorRole,
  resolveInfoRole,
  resolveSecondaryRole,
} from "../../src/theme/color-resolve"
import { parseHex, rgbToOklch } from "../../src/theme/color-utils"

// ─── Ticket 1: resolveColorRole ───────────────────────────────────────────────

describe("resolveColorRole", () => {
  it("returns the base unchanged", () => {
    expect(resolveColorRole("#5B8CFF").base).toBe("#5B8CFF")
  })

  it("dark color → white label", () => {
    // #1A1A2E (dark navy) — confirmed by pickContrastColor WCAG test
    expect(resolveColorRole("#1A1A2E").label).toBe("#FFFFFF")
  })

  it("light color → dark label", () => {
    expect(resolveColorRole("#FFE066").label).toBe("#141414")
  })

  it("hover is darker than base (lower OKLCH L)", () => {
    const role = resolveColorRole("#5B8CFF")
    const baseL = rgbToOklch(...(parseHex(role.base) as [number, number, number]))[0]
    const hoverL = rgbToOklch(...(parseHex(role.hover) as [number, number, number]))[0]
    expect(hoverL).toBeLessThan(baseL)
  })

  it("pressed is darker than hover", () => {
    const role = resolveColorRole("#5B8CFF")
    const hoverL = rgbToOklch(...(parseHex(role.hover) as [number, number, number]))[0]
    const pressedL = rgbToOklch(...(parseHex(role.pressed) as [number, number, number]))[0]
    expect(pressedL).toBeLessThan(hoverL)
  })

  it("disabled is base at 35% alpha", () => {
    expect(resolveColorRole("#5B8CFF").disabled).toBe("rgba(91,140,255,0.35)")
  })

  it("labelDisabled is white label at 50% alpha for dark color", () => {
    // #1A1A2E → white label → rgba(255,255,255,0.5)
    expect(resolveColorRole("#1A1A2E").labelDisabled).toBe("rgba(255,255,255,0.5)")
  })

  it("labelDisabled is dark label at 50% alpha for light color", () => {
    expect(resolveColorRole("#FFE066").labelDisabled).toBe("rgba(20,20,20,0.5)")
  })

  it("applies override to a single field, derives the rest", () => {
    // #5B8CFF luminance ~0.282 → dark label (#141414)
    const role = resolveColorRole("#5B8CFF", { hover: "#FF0000" })
    expect(role.hover).toBe("#FF0000")
    expect(role.base).toBe("#5B8CFF")
    expect(role.label).toBe("#141414")
    expect(role.disabled).toBe("rgba(91,140,255,0.35)")
  })

  it("handles pure black", () => {
    const role = resolveColorRole("#000000")
    expect(role.base).toBe("#000000")
    expect(role.label).toBe("#FFFFFF")
  })

  it("handles pure white", () => {
    const role = resolveColorRole("#FFFFFF")
    expect(role.base).toBe("#FFFFFF")
    expect(role.label).toBe("#141414")
  })
})

// ─── Ticket 2: resolveSecondaryRole + resolveInfoRole ─────────────────────────

describe("resolveSecondaryRole", () => {
  const primary = resolveColorRole("#5B8CFF")

  it("base is transparent", () => {
    expect(resolveSecondaryRole(primary).base).toBe("transparent")
  })

  it("label equals primary base", () => {
    expect(resolveSecondaryRole(primary).label).toBe(primary.base)
  })

  it("border equals primary base", () => {
    expect(resolveSecondaryRole(primary).border).toBe(primary.base)
  })

  it("borderDisabled equals primary disabled", () => {
    expect(resolveSecondaryRole(primary).borderDisabled).toBe(primary.disabled)
  })

  it("hover is primary base at 8% alpha", () => {
    expect(resolveSecondaryRole(primary).hover).toBe("rgba(91,140,255,0.08)")
  })

  it("pressed is primary base at 15% alpha", () => {
    expect(resolveSecondaryRole(primary).pressed).toBe("rgba(91,140,255,0.15)")
  })

  it("disabled is transparent", () => {
    expect(resolveSecondaryRole(primary).disabled).toBe("transparent")
  })

  it("labelDisabled is primary base at 50% alpha", () => {
    expect(resolveSecondaryRole(primary).labelDisabled).toBe("rgba(91,140,255,0.5)")
  })
})

describe("resolveInfoRole", () => {
  const primary = resolveColorRole("#5B8CFF")

  it("base equals primary base", () => {
    expect(resolveInfoRole(primary).base).toBe(primary.base)
  })

  it("label equals primary label", () => {
    expect(resolveInfoRole(primary).label).toBe(primary.label)
  })

  it("all fields equal primary", () => {
    const info = resolveInfoRole(primary)
    expect(info.hover).toBe(primary.hover)
    expect(info.pressed).toBe(primary.pressed)
    expect(info.disabled).toBe(primary.disabled)
    expect(info.labelDisabled).toBe(primary.labelDisabled)
  })
})

// ─── Ticket 3: normalizeColorInput ───────────────────────────────────────────

describe("normalizeColorInput", () => {
  it("string input → same result as resolveColorRole(string)", () => {
    const fromString = normalizeColorInput("#5B8CFF")
    const fromResolve = resolveColorRole("#5B8CFF")
    expect(fromString).toEqual(fromResolve)
  })

  it("object with only base → same result as resolveColorRole(base)", () => {
    const fromObject = normalizeColorInput({ base: "#5B8CFF" })
    const fromResolve = resolveColorRole("#5B8CFF")
    expect(fromObject).toEqual(fromResolve)
  })

  it("object with base + hover override → hover overridden, rest derived", () => {
    // #5B8CFF luminance ~0.282 → dark label (#141414)
    const result = normalizeColorInput({ base: "#5B8CFF", hover: "#FF0000" })
    expect(result.hover).toBe("#FF0000")
    expect(result.label).toBe("#141414")
    expect(result.disabled).toBe("rgba(91,140,255,0.35)")
  })

  it("object with all fields overridden → returns all overrides as-is", () => {
    const allOverrides = {
      base: "#5B8CFF",
      hover: "#FF0000",
      pressed: "#00FF00",
      disabled: "rgba(0,0,0,0.1)",
      label: "#123456",
      labelDisabled: "rgba(1,2,3,0.5)",
    }
    expect(normalizeColorInput(allOverrides)).toEqual(allOverrides)
  })
})
