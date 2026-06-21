import { ThemeMode } from "@marwes-ui/react"
import { describe, expect, it } from "vitest"

import {
  applyPlaygroundStyle,
  createDashboardShellThemeInput,
  createDashboardThemeInput,
  defaultPlaygroundSettings,
  dyslexicFontStack,
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
      font: "mono",
      radius: 0,
      componentOptions: defaultPlaygroundSettings.componentOptions,
    })
    expect(createDashboardThemeInput(cyber)).toMatchObject({
      tone: "digital",
      font: { primary: expect.stringContaining("Fira Code") },
    })

    expect(mono).toMatchObject({
      style: "mono",
      font: "mono",
      radius: 4,
      componentOptions: defaultPlaygroundSettings.componentOptions,
    })
  })

  it("applies high contrast color overrides to preview and shell themes", () => {
    const lightPreview = createDashboardThemeInput({
      ...defaultPlaygroundSettings,
      accessibility: {
        ...defaultPlaygroundSettings.accessibility,
        highContrast: true,
      },
    })
    const darkShell = createDashboardShellThemeInput({
      ...defaultPlaygroundSettings,
      mode: ThemeMode.dark,
      accessibility: {
        ...defaultPlaygroundSettings.accessibility,
        highContrast: true,
      },
    })

    expect(lightPreview.color).toMatchObject({
      textMuted: "#141414",
      textSubtle: "#141414",
      iconMuted: "#141414",
      border: "#141414",
      borderStrong: "#141414",
    })
    expect(darkShell.color).toMatchObject({
      textMuted: "#FFFFFF",
      textSubtle: "#FFFFFF",
      iconMuted: "#FFFFFF",
      border: "#FFFFFF",
      borderStrong: "#FFFFFF",
      primary: defaultPlaygroundSettings.colors.primary,
    })
  })

  it("forwards user color, tone, and radius picks to the shell theme", () => {
    const shell = createDashboardShellThemeInput({
      ...defaultPlaygroundSettings,
      style: "cyber",
      radius: 12,
      colors: {
        primary: "#123456",
        danger: "#aa0000",
        success: "#00aa00",
        warning: "#ffaa00",
      },
    })

    expect(shell).toMatchObject({
      tone: "digital",
      color: {
        primary: "#123456",
        danger: "#aa0000",
        success: "#00aa00",
        warning: "#ffaa00",
      },
      ui: { radius: 12 },
    })
  })

  it("lets dyslexic font override normal font choices", () => {
    const theme = createDashboardThemeInput({
      ...defaultPlaygroundSettings,
      font: "mono",
      accessibility: {
        ...defaultPlaygroundSettings.accessibility,
        dyslexicFont: true,
      },
    })
    const shellTheme = createDashboardShellThemeInput({
      ...defaultPlaygroundSettings,
      font: "mono",
      accessibility: {
        ...defaultPlaygroundSettings.accessibility,
        dyslexicFont: true,
      },
    })

    expect(theme.font).toEqual({ primary: dyslexicFontStack })
    expect(shellTheme.font).toEqual({ primary: dyslexicFontStack })
  })

  it("keeps normal font behavior when dyslexic font is off", () => {
    expect(createDashboardThemeInput(defaultPlaygroundSettings).font).toBeUndefined()
    expect(
      createDashboardThemeInput({
        ...defaultPlaygroundSettings,
        font: "mono",
      }).font,
    ).toEqual({ primary: expect.stringContaining("Fira Code") })
    expect(
      createDashboardShellThemeInput({
        ...defaultPlaygroundSettings,
        font: "mono",
      }).font,
    ).toBeUndefined()
  })
})
