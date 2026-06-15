import { ThemeMode } from "@marwes-ui/react"
import { describe, expect, it } from "vitest"

import {
  applyPlaygroundStyle,
  createDashboardThemeInput,
  defaultPlaygroundSettings,
} from "./playground-settings"

describe("playground settings", () => {
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
})
