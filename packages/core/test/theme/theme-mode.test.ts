/**
 * Tests theme mode helpers — mode validation, preference resolution
 * (light/dark/system), mode toggling, and the compile-time constraint
 * that ThemeInput.mode cannot be "system".
 */
import { describe, expect, it } from "vitest"
import {
  ThemeMode,
  isThemeMode,
  isThemePreference,
  nextThemeMode,
  resolveThemePreference,
} from "../../src"
import type { ThemeInput, ThemePreference } from "../../src"

describe("theme mode helpers", () => {
  it("validates concrete theme modes", () => {
    expect(isThemeMode(ThemeMode.light)).toBe(true)
    expect(isThemeMode(ThemeMode.dark)).toBe(true)
    expect(isThemeMode("system")).toBe(false)
    expect(isThemeMode(undefined)).toBe(false)
  })

  it("validates theme preferences", () => {
    expect(isThemePreference(ThemeMode.light)).toBe(true)
    expect(isThemePreference(ThemeMode.dark)).toBe(true)
    expect(isThemePreference("system")).toBe(true)
    expect(isThemePreference("auto")).toBe(false)
  })

  it("resolves concrete preferences directly", () => {
    expect(resolveThemePreference(ThemeMode.light, ThemeMode.dark)).toBe(ThemeMode.light)
    expect(resolveThemePreference(ThemeMode.dark, ThemeMode.light)).toBe(ThemeMode.dark)
  })

  it("resolves system preference from caller-provided system mode", () => {
    expect(resolveThemePreference("system", ThemeMode.dark)).toBe(ThemeMode.dark)
    expect(resolveThemePreference("system", ThemeMode.light)).toBe(ThemeMode.light)
  })

  it("toggles concrete theme modes", () => {
    expect(nextThemeMode(ThemeMode.light)).toBe(ThemeMode.dark)
    expect(nextThemeMode(ThemeMode.dark)).toBe(ThemeMode.light)
  })

  it("keeps ThemeInput.mode concrete", () => {
    const preference: ThemePreference = "system"
    expect(preference).toBe("system")

    // @ts-expect-error — ThemeInput.mode is rendered visual mode and cannot be system.
    const theme: ThemeInput = { mode: "system" }
    expect(theme).toBeDefined()
  })
})
