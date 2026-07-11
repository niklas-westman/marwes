import { ThemeMode } from "@marwes-ui/react"
import { describe, expect, it } from "vitest"

import { dyslexicFontStack } from "./playground-fonts"
import {
  applyPlaygroundStyle,
  createDashboardThemeInput,
  defaultPlaygroundSettings,
} from "./playground-settings"

describe("playground settings", () => {
  it("defines accessibility defaults", () => {
    expect(defaultPlaygroundSettings.accessibility).toEqual({
      highContrast: false,
      reduceMotion: false,
      dyslexicFont: false,
      looseSpacing: false,
      colorVision: "normal",
    })
  })

  it("derives a ThemeInput from dashboard controls", () => {
    const theme = createDashboardThemeInput({
      ...defaultPlaygroundSettings,
      mode: ThemeMode.dark,
      colors: {
        primary: "#123456",
        danger: "#aa0000",
        success: "#00aa00",
        warning: "#ffaa00",
      },
      radius: 12,
      density: "compact",
    })

    expect(theme).toMatchObject({
      mode: ThemeMode.dark,
      tone: "default",
      color: {
        primary: "#123456",
        danger: "#aa0000",
        success: "#00aa00",
        warning: "#ffaa00",
      },
      ui: {
        radius: 12,
        density: "compact",
      },
    })
  })

  it("applies style presets without changing component options", () => {
    const cyber = applyPlaygroundStyle(defaultPlaygroundSettings, "cyber")
    const mono = applyPlaygroundStyle(defaultPlaygroundSettings, "mono")

    expect(cyber).toMatchObject({
      style: "cyber",
      font: "Fira Code",
      radius: 0,
      componentOptions: defaultPlaygroundSettings.componentOptions,
    })
    expect(createDashboardThemeInput(cyber)).toMatchObject({
      tone: "digital",
      font: { primary: expect.stringContaining("Fira Code") },
    })

    expect(mono).toMatchObject({
      style: "mono",
      font: "Fira Code",
      radius: 4,
      componentOptions: defaultPlaygroundSettings.componentOptions,
    })
  })

  it("applies high contrast color overrides to the theme", () => {
    const lightTheme = createDashboardThemeInput({
      ...defaultPlaygroundSettings,
      accessibility: {
        ...defaultPlaygroundSettings.accessibility,
        highContrast: true,
      },
    })
    const darkTheme = createDashboardThemeInput({
      ...defaultPlaygroundSettings,
      mode: ThemeMode.dark,
      accessibility: {
        ...defaultPlaygroundSettings.accessibility,
        highContrast: true,
      },
    })

    expect(lightTheme.color).toMatchObject({
      textMuted: "#141414",
      textSubtle: "#141414",
      iconMuted: "#141414",
      border: "#141414",
      borderStrong: "#141414",
    })
    expect(darkTheme.color).toMatchObject({
      textMuted: "#FFFFFF",
      textSubtle: "#FFFFFF",
      iconMuted: "#FFFFFF",
      border: "#FFFFFF",
      borderStrong: "#FFFFFF",
    })
  })

  it("lets dyslexic font override normal font choices", () => {
    const theme = createDashboardThemeInput({
      ...defaultPlaygroundSettings,
      font: "Fira Code",
      accessibility: {
        ...defaultPlaygroundSettings.accessibility,
        dyslexicFont: true,
      },
    })

    expect(theme.font).toEqual({ primary: dyslexicFontStack })
  })

  it("resolves the selected family into a full CSS stack", () => {
    expect(createDashboardThemeInput(defaultPlaygroundSettings).font).toEqual({
      primary: expect.stringContaining("Instrument Sans"),
    })
    expect(
      createDashboardThemeInput({
        ...defaultPlaygroundSettings,
        font: "Fira Code",
      }).font,
    ).toEqual({ primary: expect.stringContaining("Fira Code") })
  })
})
