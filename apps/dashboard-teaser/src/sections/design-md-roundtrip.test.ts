import { ThemeMode } from "@marwes-ui/react"
import { describe, expect, it } from "vitest"

import { generateDesignMd } from "./design-md-export"
import { defaultPlaygroundSettings, styleToneMap } from "./playground-settings"
import type { PlaygroundSettings } from "./playground-settings"
import { themePresets } from "./theme-presets"

function getPreset(id: (typeof themePresets)[number]["id"]): (typeof themePresets)[number] {
  const preset = themePresets.find((candidate) => candidate.id === id)
  if (!preset) throw new Error(`missing ${id} theme preset`)
  return preset
}

const marwesPreset = getPreset("marwes")
const cyberPreset = getPreset("cyber")
const editorialPreset = getPreset("editorial")

/**
 * Extracts a scalar YAML value under a specific parent block. `path` is a
 * dotted key path relative to the top of the frontmatter, e.g.
 * "colors.primary", "x-marwes.tone", "rounded.md".
 */
function extractYamlValue(markdown: string, path: string): string | undefined {
  const [frontmatter] = markdown.split(/\n---\n/)
  if (!frontmatter) return undefined
  const parts = path.split(".")
  const leaf = parts.at(-1)
  if (!leaf) return undefined
  const parents = parts.slice(0, -1)

  const lines = frontmatter.split("\n")
  const stack: Array<{ key: string; indent: number }> = []

  for (const line of lines) {
    if (!line.trim()) continue
    const indent = line.length - line.trimStart().length
    const match = line.match(/^ *([\w-]+):\s*(.*)$/)
    if (!match) continue
    const [, key, value] = match

    while ((stack.at(-1)?.indent ?? -1) >= indent) {
      stack.pop()
    }

    if (
      key === leaf &&
      stack.length === parents.length &&
      stack.every((s, i) => s.key === parents[i])
    ) {
      return value?.replace(/^"|"$/g, "")
    }

    if (key) stack.push({ key, indent })
  }

  return undefined
}

/**
 * Extracts a value from inside a `export const <varName>: ThemeInput = { ... }`
 * block by dotted path (e.g. "color.primary", "ui.radius", "font.primary").
 */
function extractTsThemeInputValue(
  markdown: string,
  varName: string,
  path: string,
): string | undefined {
  const blockMatch = markdown.match(new RegExp(`export const ${varName}[\\s\\S]*?^\\}$`, "m"))
  if (!blockMatch) return undefined
  const block = blockMatch[0]
  const parts = path.split(".")
  const leaf = parts.at(-1)
  if (!leaf) return undefined

  const lines = block.split("\n")
  const stack: Array<{ key: string; indent: number }> = []

  for (const line of lines) {
    if (!line.trim()) continue
    const indent = line.length - line.trimStart().length
    const match = line.match(/^ *([\w-]+):\s*(.*)$/)
    if (!match) continue
    const [, key, rawValue] = match
    while ((stack.at(-1)?.indent ?? -1) >= indent) {
      stack.pop()
    }

    if (
      key === leaf &&
      stack.length === parts.length - 1 &&
      stack.every((s, i) => s.key === parts[i])
    ) {
      return rawValue?.replace(/,$/, "").replace(/^"|"$/g, "")
    }

    if (key) stack.push({ key, indent })
  }

  return undefined
}

describe("DESIGN.md round-trip", () => {
  it("preserves settings.colors.primary through both YAML tokens and both TS ThemeInput blocks", () => {
    const settings: PlaygroundSettings = {
      ...defaultPlaygroundSettings,
      colors: { ...defaultPlaygroundSettings.colors, primary: "#123456" },
    }
    const md = generateDesignMd({ settings, preset: marwesPreset })

    expect(extractYamlValue(md, "colors.primary")).toBe("#123456")
    expect(extractTsThemeInputValue(md, "marwesLight", "color.primary")).toBe("#123456")
    expect(extractTsThemeInputValue(md, "marwesDark", "color.primary")).toBe("#123456")
  })

  it("preserves settings.radius through rounded.md and ui.radius in both TS blocks", () => {
    const settings: PlaygroundSettings = { ...defaultPlaygroundSettings, radius: 10 }
    const md = generateDesignMd({ settings, preset: marwesPreset })

    expect(extractYamlValue(md, "rounded.md")).toBe("10px")
    expect(extractTsThemeInputValue(md, "marwesLight", "ui.radius")).toBe("10")
    expect(extractTsThemeInputValue(md, "marwesDark", "ui.radius")).toBe("10")
  })

  it("preserves settings.density through x-marwes.density and both TS ui.density fields", () => {
    const settings: PlaygroundSettings = { ...defaultPlaygroundSettings, density: "spacious" }
    const md = generateDesignMd({ settings, preset: marwesPreset })

    expect(extractYamlValue(md, "x-marwes.density")).toBe("spacious")
    expect(extractTsThemeInputValue(md, "marwesLight", "ui.density")).toBe("spacious")
    expect(extractTsThemeInputValue(md, "marwesDark", "ui.density")).toBe("spacious")
  })

  it("preserves styleToneMap[settings.style] through x-marwes.tone and both TS tone fields", () => {
    const settings: PlaygroundSettings = { ...defaultPlaygroundSettings, style: "cyber" }
    const md = generateDesignMd({ settings, preset: cyberPreset })
    const expected = styleToneMap.cyber

    expect(extractYamlValue(md, "x-marwes.tone")).toBe(expected)
    expect(extractTsThemeInputValue(md, "cyberLight", "tone")).toBe(expected)
    expect(extractTsThemeInputValue(md, "cyberDark", "tone")).toBe(expected)
  })

  it("preserves preset.personality when settings.personality is unset", () => {
    const settings: PlaygroundSettings = {
      ...defaultPlaygroundSettings,
      style: editorialPreset.style,
      personality: undefined,
    }
    const md = generateDesignMd({ settings, preset: editorialPreset })

    expect(extractYamlValue(md, "x-marwes.personality")).toBe(editorialPreset.personality)
    expect(extractTsThemeInputValue(md, "editorialLight", "personality")).toBe(
      editorialPreset.personality,
    )
  })

  it("routes preset.colorOverrides to the matching mode's TS block, not the other", () => {
    const md = generateDesignMd({
      settings: {
        ...defaultPlaygroundSettings,
        style: cyberPreset.style,
        colors: { ...defaultPlaygroundSettings.colors, primary: cyberPreset.primary },
        colorOverrides: cyberPreset.colorOverrides,
      },
      preset: cyberPreset,
    })

    expect(extractTsThemeInputValue(md, "cyberLight", "color.background")).toBe(
      cyberPreset.colorOverrides?.light?.background as string,
    )
    expect(extractTsThemeInputValue(md, "cyberDark", "color.background")).toBe(
      cyberPreset.colorOverrides?.dark?.background as string,
    )
  })

  it("preserves settings.mode as x-marwes.defaultMode", () => {
    const mdDark = generateDesignMd({
      settings: { ...defaultPlaygroundSettings, mode: ThemeMode.dark },
      preset: marwesPreset,
    })
    expect(extractYamlValue(mdDark, "x-marwes.defaultMode")).toBe("dark")

    const mdLight = generateDesignMd({
      settings: { ...defaultPlaygroundSettings, mode: ThemeMode.light },
      preset: marwesPreset,
    })
    expect(extractYamlValue(mdLight, "x-marwes.defaultMode")).toBe("light")
  })
})
