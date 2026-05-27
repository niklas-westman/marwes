/**
 * Contract test: verifies that the theme engine's CSS variables match the
 * canonical color values in docs/marwes-colors.json. This keeps the code
 * and the Figma design documentation in sync across light and dark modes.
 */
import { readFileSync } from "node:fs"
import path from "node:path"
import { describe, expect, it } from "vitest"
import { themeToCSSVars } from "../../src/theme/theme-css"
import { resolveThemeInput } from "../../src/theme/theme-normalize"
import { ThemeMode } from "../../src/theme/theme-types"

type ModeValue = {
  light: string
  dark: string
}

type TokenModeValue = {
  light: { $value: string }
  dark: { $value: string }
}

type MarwesColorSource = {
  semantic: {
    surface: Record<
      "primary" | "secondary" | "sunken" | "raised" | "disabled" | "inverse" | "brand",
      ModeValue
    >
    text: Record<
      "primary" | "secondary" | "disabled" | "inverse" | "onSurfaceDark" | "brand" | "link",
      ModeValue
    >
    icon: Record<"muted", ModeValue>
    border: Record<"default" | "strong" | "brand", ModeValue>
    focus: Record<"ring", ModeValue>
    action: {
      primary: Record<"default" | "hover" | "active" | "disabled" | "label", ModeValue>
      secondary: Record<"default" | "hover" | "active" | "disabled" | "label", ModeValue>
      destructive: Record<"default" | "hover" | "active" | "disabled" | "label", ModeValue>
    }
    status: {
      success: Record<"background" | "text" | "icon" | "border", ModeValue>
      warning: Record<"background" | "text" | "icon" | "border", ModeValue>
      error: Record<"background" | "text" | "icon" | "border", ModeValue>
      info: Record<"background" | "text" | "icon" | "border", ModeValue>
    }
  }
}

type BorderStrongColorSource = {
  status: {
    info: { "border-strong": TokenModeValue }
    success: { "border-strong": TokenModeValue }
    warning: { "border-strong": TokenModeValue }
    error: { "border-strong": TokenModeValue }
  }
}

const colorSourcePath = path.resolve(__dirname, "../../../../docs/marwes-colors.json")
const colorSource = JSON.parse(readFileSync(colorSourcePath, "utf8")) as MarwesColorSource
const borderStrongSourcePath = path.resolve(
  __dirname,
  "../../../../docs/marwes-border-strong-tokens.json",
)
const borderStrongSource = JSON.parse(
  readFileSync(borderStrongSourcePath, "utf8"),
) as BorderStrongColorSource

const lightVars = themeToCSSVars(resolveThemeInput({ mode: ThemeMode.light }))
const darkVars = themeToCSSVars(resolveThemeInput({ mode: ThemeMode.dark }))

function expectModeVar(
  cssVar: string,
  expected: ModeValue,
  modeVars: { light: Record<string, string>; dark: Record<string, string> } = {
    light: lightVars,
    dark: darkVars,
  },
) {
  expect(modeVars.light[cssVar]).toBe(expected.light)
  expect(modeVars.dark[cssVar]).toBe(expected.dark)
}

function tokenModeValue(token: TokenModeValue): ModeValue {
  return {
    light: token.light.$value,
    dark: token.dark.$value,
  }
}

describe("Marwes color source contract", () => {
  it("maps surface and text CSS vars to docs/marwes-colors.json", () => {
    expectModeVar("--mw-color-background", colorSource.semantic.surface.primary)
    expectModeVar("--mw-color-surface", colorSource.semantic.surface.secondary)
    expectModeVar("--mw-color-surface-primary", colorSource.semantic.surface.primary)
    expectModeVar("--mw-color-surface-subtle", colorSource.semantic.surface.sunken)
    expectModeVar("--mw-color-surface-brand", colorSource.semantic.surface.brand)
    expectModeVar("--mw-color-surface-elevated", colorSource.semantic.surface.raised)
    expectModeVar("--mw-color-surface-disabled", colorSource.semantic.surface.disabled)
    expectModeVar("--mw-color-surface-inverted", colorSource.semantic.surface.inverse)

    expectModeVar("--mw-color-text", colorSource.semantic.text.primary)
    expectModeVar("--mw-color-text-muted", colorSource.semantic.text.secondary)
    expectModeVar("--mw-color-text-subtle", colorSource.semantic.text.disabled)
    expectModeVar("--mw-color-text-disabled", colorSource.semantic.text.disabled)
    expectModeVar("--mw-color-text-inverted", {
      light: colorSource.semantic.text.inverse.light,
      dark: colorSource.semantic.text.onSurfaceDark.dark,
    })
    expectModeVar("--mw-color-text-brand", colorSource.semantic.text.brand)
    expectModeVar("--mw-color-text-link", colorSource.semantic.text.link)
    expectModeVar("--mw-color-icon-muted", colorSource.semantic.icon.muted)
  })

  it("maps border and focus CSS vars to docs/marwes-colors.json", () => {
    expectModeVar("--mw-color-border", colorSource.semantic.border.default)
    expectModeVar("--mw-color-border-subtle", colorSource.semantic.border.default)
    expectModeVar("--mw-color-border-strong", colorSource.semantic.border.strong)
    expectModeVar("--mw-color-border-disabled", colorSource.semantic.border.default)
    expectModeVar("--mw-color-border-brand", colorSource.semantic.border.brand)
    expectModeVar("--mw-color-focus", colorSource.semantic.focus.ring)
  })

  it("maps action role CSS vars to docs/marwes-colors.json", () => {
    expectModeVar("--mw-color-primary-base", colorSource.semantic.action.primary.default)
    expectModeVar("--mw-color-primary-hover", colorSource.semantic.action.primary.hover)
    expectModeVar("--mw-color-primary-pressed", colorSource.semantic.action.primary.active)
    expectModeVar("--mw-color-primary-disabled", colorSource.semantic.action.primary.disabled)
    expectModeVar("--mw-color-primary-label", colorSource.semantic.action.primary.label)

    expectModeVar("--mw-color-secondary-hover", colorSource.semantic.action.secondary.hover)
    expectModeVar("--mw-color-secondary-pressed", colorSource.semantic.action.secondary.active)
    expectModeVar("--mw-color-secondary-label", colorSource.semantic.action.secondary.label)
    expectModeVar("--mw-color-secondary-border", colorSource.semantic.action.secondary.default)
    expectModeVar(
      "--mw-color-secondary-border-disabled",
      colorSource.semantic.action.secondary.disabled,
    )

    expectModeVar("--mw-color-danger-base", colorSource.semantic.action.destructive.default)
    expectModeVar("--mw-color-danger-hover", colorSource.semantic.action.destructive.hover)
    expectModeVar("--mw-color-danger-pressed", colorSource.semantic.action.destructive.active)
    expectModeVar("--mw-color-danger-disabled", colorSource.semantic.action.destructive.disabled)
    expectModeVar("--mw-color-danger-label", colorSource.semantic.action.destructive.label)
  })

  it("maps status role CSS vars to docs/marwes-colors.json", () => {
    expectModeVar("--mw-color-success-base", colorSource.semantic.status.success.text)
    expectModeVar("--mw-color-warning-base", colorSource.semantic.status.warning.text)
    expectModeVar("--mw-color-info-base", colorSource.semantic.status.info.icon)

    expectModeVar(
      "--mw-color-status-success-background",
      colorSource.semantic.status.success.background,
    )
    expectModeVar("--mw-color-status-success-text", colorSource.semantic.status.success.text)
    expectModeVar("--mw-color-status-success-icon", colorSource.semantic.status.success.icon)
    expectModeVar("--mw-color-status-success-border", colorSource.semantic.status.success.border)
    expectModeVar(
      "--mw-color-status-success-border-strong",
      tokenModeValue(borderStrongSource.status.success["border-strong"]),
    )

    expectModeVar(
      "--mw-color-status-warning-background",
      colorSource.semantic.status.warning.background,
    )
    expectModeVar("--mw-color-status-warning-text", colorSource.semantic.status.warning.text)
    expectModeVar("--mw-color-status-warning-icon", colorSource.semantic.status.warning.icon)
    expectModeVar("--mw-color-status-warning-border", colorSource.semantic.status.warning.border)
    expectModeVar(
      "--mw-color-status-warning-border-strong",
      tokenModeValue(borderStrongSource.status.warning["border-strong"]),
    )

    expectModeVar(
      "--mw-color-status-error-background",
      colorSource.semantic.status.error.background,
    )
    expectModeVar("--mw-color-status-error-text", colorSource.semantic.status.error.text)
    expectModeVar("--mw-color-status-error-icon", colorSource.semantic.status.error.icon)
    expectModeVar("--mw-color-status-error-border", colorSource.semantic.status.error.border)
    expectModeVar(
      "--mw-color-status-error-border-strong",
      tokenModeValue(borderStrongSource.status.error["border-strong"]),
    )

    expectModeVar("--mw-color-status-info-background", colorSource.semantic.status.info.background)
    expectModeVar("--mw-color-status-info-text", colorSource.semantic.status.info.text)
    expectModeVar("--mw-color-status-info-icon", colorSource.semantic.status.info.icon)
    expectModeVar("--mw-color-status-info-border", colorSource.semantic.status.info.border)
    expectModeVar(
      "--mw-color-status-info-border-strong",
      tokenModeValue(borderStrongSource.status.info["border-strong"]),
    )
  })
})
