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

type MarwesColorSource = {
  semantic: {
    surface: Record<string, ModeValue>
    text: Record<string, ModeValue>
    border: Record<string, ModeValue>
    focus: Record<string, ModeValue>
    action: Record<string, Record<string, ModeValue>>
    status: Record<string, Record<string, ModeValue>>
  }
}

const colorSourcePath = path.resolve(__dirname, "../../../../docs/marwes-colors.json")
const colorSource = JSON.parse(readFileSync(colorSourcePath, "utf8")) as MarwesColorSource

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

describe("Marwes color source contract", () => {
  it("maps surface and text CSS vars to docs/marwes-colors.json", () => {
    expectModeVar("--mw-color-background", colorSource.semantic.surface.primary)
    expectModeVar("--mw-color-surface", colorSource.semantic.surface.secondary)
    expectModeVar("--mw-color-surface-subtle", colorSource.semantic.surface.sunken)
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
  })

  it("maps border and focus CSS vars to docs/marwes-colors.json", () => {
    expectModeVar("--mw-color-border", colorSource.semantic.border.default)
    expectModeVar("--mw-color-border-subtle", colorSource.semantic.border.default)
    expectModeVar("--mw-color-border-strong", colorSource.semantic.border.strong)
    expectModeVar("--mw-color-border-disabled", colorSource.semantic.border.default)
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

  it("maps status role base CSS vars to docs/marwes-colors.json", () => {
    expectModeVar("--mw-color-success-base", colorSource.semantic.status.success.text)
    expectModeVar("--mw-color-warning-base", colorSource.semantic.status.warning.text)
    expectModeVar("--mw-color-info-base", colorSource.semantic.status.info.icon)
  })
})
