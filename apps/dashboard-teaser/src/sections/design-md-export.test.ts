import { ThemeMode } from "@marwes-ui/react"
import { describe, expect, it } from "vitest"

import { generateDesignMd } from "./design-md-export"
import { defaultPlaygroundSettings } from "./playground-settings"
import { themePresets } from "./theme-presets"

function getPreset(id: (typeof themePresets)[number]["id"]): (typeof themePresets)[number] {
  const preset = themePresets.find((candidate) => candidate.id === id)
  if (!preset) throw new Error(`missing ${id} theme preset`)
  return preset
}

const marwesPreset = getPreset("marwes")
const cyberPreset = getPreset("cyber")

function splitFrontmatter(markdown: string): { frontmatter: string; body: string } {
  const match = markdown.match(/^---\n([\s\S]*?)\n---\n\n([\s\S]*)$/)
  if (!match) throw new Error("no frontmatter fences found")
  const frontmatter = match[1]
  const body = match[2]
  if (frontmatter === undefined || body === undefined) {
    throw new Error("frontmatter capture groups missing")
  }
  return { frontmatter, body }
}

function collectTokenPaths(frontmatter: string): Set<string> {
  const paths = new Set<string>()
  const lines = frontmatter.split("\n")
  const stack: Array<{ key: string; indent: number }> = []

  for (const rawLine of lines) {
    if (!rawLine.trim()) continue
    if (
      rawLine.startsWith("version:") ||
      rawLine.startsWith("name:") ||
      rawLine.startsWith("description:")
    ) {
      continue
    }
    const indent = rawLine.length - rawLine.trimStart().length
    const match = rawLine.match(/^ *([\w-]+):\s*(.*)$/)
    if (!match) continue
    const key = match[1]
    if (!key) continue

    while ((stack.at(-1)?.indent ?? -1) >= indent) {
      stack.pop()
    }

    const path = [...stack.map((s) => s.key), key].join(".")
    paths.add(path)
    stack.push({ key, indent })
  }
  return paths
}

function collectTokenReferences(frontmatter: string): string[] {
  const refs: string[] = []
  for (const match of frontmatter.matchAll(/\{([^}]+)\}/g)) {
    const reference = match[1]
    if (reference) refs.push(reference)
  }
  return refs
}

describe("generateDesignMd", () => {
  it("emits YAML frontmatter delimited by --- fences", () => {
    const output = generateDesignMd({ settings: defaultPlaygroundSettings, preset: marwesPreset })
    expect(output.startsWith("---\n")).toBe(true)
    expect(output).toMatch(/\n---\n\n/)
  })

  it("includes name and version in frontmatter without duplicated Marwes prefix", () => {
    const output = generateDesignMd({ settings: defaultPlaygroundSettings, preset: marwesPreset })
    const { frontmatter } = splitFrontmatter(output)
    expect(frontmatter).toMatch(/^version: 1$/m)
    expect(frontmatter).toMatch(/^name: "Marwes"$/m)
  })

  it("orders prose sections with canonical spec order first, non-canonical last", () => {
    const output = generateDesignMd({ settings: defaultPlaygroundSettings, preset: marwesPreset })
    const { body } = splitFrontmatter(output)
    const headings = [...body.matchAll(/^## (.+)$/gm)].map((m) => m[1])
    expect(headings).toEqual([
      "Overview",
      "Colors",
      "Typography",
      "Shapes",
      "Components",
      "Do's and Don'ts",
      "Marwes Integration",
    ])
  })

  it("does not emit an Accessibility prose section — a11y lives under x-marwes as runtime defaults", () => {
    const withA11yOn = generateDesignMd({
      settings: {
        ...defaultPlaygroundSettings,
        accessibility: {
          ...defaultPlaygroundSettings.accessibility,
          highContrast: true,
          reduceMotion: true,
          dyslexicFont: true,
          looseSpacing: true,
          colorVision: "protanopia",
        },
      },
      preset: marwesPreset,
    })
    expect(withA11yOn).not.toMatch(/^## Accessibility$/m)
  })

  it("emits recommendedAccessibilityDefaults under x-marwes with static system defaults", () => {
    const output = generateDesignMd({ settings: defaultPlaygroundSettings, preset: marwesPreset })
    const { frontmatter } = splitFrontmatter(output)
    expect(frontmatter).toMatch(/^ {2}recommendedAccessibilityDefaults:$/m)
    expect(frontmatter).toMatch(/^ {4}reducedMotion: system$/m)
    expect(frontmatter).toMatch(/^ {4}contrast: system$/m)
    expect(frontmatter).toMatch(/^ {4}colorVision: normal$/m)
  })

  it("exports the effective dyslexic font when that accessibility option is active", () => {
    const output = generateDesignMd({
      settings: {
        ...defaultPlaygroundSettings,
        accessibility: { ...defaultPlaygroundSettings.accessibility, dyslexicFont: true },
      },
      preset: marwesPreset,
    })
    expect(output).toMatch(/fontFamily: "Atkinson Hyperlegible"/)
    expect(output).toMatch(/^ {4}family: "Atkinson Hyperlegible"$/m)
    expect(output).toMatch(/^ {4}dyslexicFont: true$/m)
  })

  it("exports active accessibility state separately from recommended defaults", () => {
    const output = generateDesignMd({
      settings: {
        ...defaultPlaygroundSettings,
        accessibility: {
          highContrast: true,
          reduceMotion: true,
          dyslexicFont: true,
          looseSpacing: true,
          colorVision: "deuteranopia",
        },
      },
      preset: marwesPreset,
    })
    const { frontmatter } = splitFrontmatter(output)

    expect(frontmatter).toMatch(/^ {2}activeAccessibility:$/m)
    expect(frontmatter).toMatch(/^ {4}highContrast: true$/m)
    expect(frontmatter).toMatch(/^ {4}reducedMotion: true$/m)
    expect(frontmatter).toMatch(/^ {4}increasedSpacing: true$/m)
    expect(frontmatter).toMatch(/^ {4}dyslexicFont: true$/m)
    expect(frontmatter).toMatch(/^ {4}colorVision: deuteranopia$/m)
    expect(frontmatter).toMatch(/^ {2}recommendedAccessibilityDefaults:$/m)
  })

  it("applies high contrast colors to both generated ThemeInput modes", () => {
    const output = generateDesignMd({
      settings: {
        ...defaultPlaygroundSettings,
        accessibility: {
          ...defaultPlaygroundSettings.accessibility,
          highContrast: true,
        },
      },
      preset: marwesPreset,
    })
    const lightBlock = output.match(/export const marwesLight[\s\S]*?^\}$/m)?.[0] ?? ""
    const darkBlock = output.match(/export const marwesDark[\s\S]*?^\}$/m)?.[0] ?? ""

    expect(lightBlock).toMatch(/textMuted: "#141414"/)
    expect(lightBlock).toMatch(/borderStrong: "#141414"/)
    expect(darkBlock).toMatch(/textMuted: "#FFFFFF"/)
    expect(darkBlock).toMatch(/borderStrong: "#FFFFFF"/)
  })

  it("resolves every token reference to a defined token path", () => {
    const output = generateDesignMd({ settings: defaultPlaygroundSettings, preset: marwesPreset })
    const { frontmatter } = splitFrontmatter(output)
    const defined = collectTokenPaths(frontmatter)
    const referenced = collectTokenReferences(frontmatter)

    for (const ref of referenced) {
      expect(defined, `token ref {${ref}} should resolve to a defined token`).toContain(ref)
    }
  })

  it("emits Marwes-native typography names 1:1", () => {
    const output = generateDesignMd({ settings: defaultPlaygroundSettings, preset: marwesPreset })
    const { frontmatter } = splitFrontmatter(output)
    for (const name of [
      "display",
      "h1",
      "h2",
      "h3",
      "paragraph-lg",
      "paragraph-md",
      "paragraph-sm",
      "text-label",
      "text-label-small",
      "text-caption",
      "text-overline",
      "text-micro",
    ]) {
      expect(frontmatter).toMatch(new RegExp(`^ {2}${name}:$`, "m"))
    }
  })

  it("swaps in a preset's color overrides for the active mode", () => {
    const output = generateDesignMd({
      settings: {
        ...defaultPlaygroundSettings,
        mode: ThemeMode.dark,
        colors: { ...defaultPlaygroundSettings.colors, primary: cyberPreset.primary },
        colorOverrides: cyberPreset.colorOverrides,
      },
      preset: cyberPreset,
    })
    expect(output).toMatch(/background: "#0A0A0F"/)
    expect(output).toMatch(/primary: "#FFE500"/)
  })

  it("references rounded.lg from card and rounded.full from badge", () => {
    const output = generateDesignMd({ settings: defaultPlaygroundSettings, preset: marwesPreset })
    expect(output).toMatch(/^ {2}card:\n(?: {4}[^\n]*\n){2} {4}rounded: "\{rounded\.lg\}"$/m)
    expect(output).toMatch(/^ {2}badge:\n(?: {4}[^\n]*\n){3} {4}rounded: "\{rounded\.full\}"$/m)
  })

  it("does not emit a button-primary-hover recipe (Marwes derives hover automatically)", () => {
    const output = generateDesignMd({ settings: defaultPlaygroundSettings, preset: marwesPreset })
    expect(output).not.toMatch(/button-primary-hover/)
  })

  it("emits an x-marwes extension block with Marwes-specific values", () => {
    const output = generateDesignMd({ settings: defaultPlaygroundSettings, preset: marwesPreset })
    const { frontmatter } = splitFrontmatter(output)
    expect(frontmatter).toMatch(/^x-marwes:$/m)
    expect(frontmatter).toMatch(/^ {2}tone: default$/m)
    expect(frontmatter).toMatch(/^ {2}personality: flat$/m)
    expect(frontmatter).toMatch(/^ {2}density: comfortable$/m)
    expect(frontmatter).toMatch(/^ {2}defaultMode: light$/m)
    expect(frontmatter).toMatch(/^ {2}framework: react$/m)
    expect(frontmatter).toMatch(/^ {2}packageName: "@marwes-ui\/react"$/m)
    expect(frontmatter).toMatch(/^ {4}foregroundResolution: automatic$/m)
  })

  it("reflects the Cyber preset's tone (digital) and personality (glow) in x-marwes", () => {
    const output = generateDesignMd({
      settings: {
        ...defaultPlaygroundSettings,
        style: cyberPreset.style,
        personality: cyberPreset.personality,
        density: cyberPreset.density,
      },
      preset: cyberPreset,
    })
    expect(output).toMatch(/^ {2}tone: digital$/m)
    expect(output).toMatch(/^ {2}personality: glow$/m)
    expect(output).toMatch(/^ {2}density: compact$/m)
  })

  it("emits defaultMode: dark when settings.mode is dark", () => {
    const output = generateDesignMd({
      settings: { ...defaultPlaygroundSettings, mode: ThemeMode.dark },
      preset: marwesPreset,
    })
    expect(output).toMatch(/^ {2}defaultMode: dark$/m)
  })

  it("emits a Marwes Integration section with both light and dark ThemeInput objects", () => {
    const output = generateDesignMd({ settings: defaultPlaygroundSettings, preset: marwesPreset })
    expect(output).toMatch(/^## Marwes Integration$/m)
    expect(output).toMatch(/import \{ ThemeMode, type ThemeInput \} from "@marwes-ui\/react"/)
    expect(output).toMatch(/^export const marwesLight: ThemeInput = \{$/m)
    expect(output).toMatch(/^export const marwesDark: ThemeInput = \{$/m)
    expect(output).toMatch(/mode: ThemeMode\.light,/)
    expect(output).toMatch(/mode: ThemeMode\.dark,/)
  })

  it("names the ThemeInput exports after the preset id", () => {
    const output = generateDesignMd({
      settings: {
        ...defaultPlaygroundSettings,
        style: cyberPreset.style,
        personality: cyberPreset.personality,
        density: cyberPreset.density,
        radius: cyberPreset.radius,
        colors: { ...defaultPlaygroundSettings.colors, primary: cyberPreset.primary },
        colorOverrides: cyberPreset.colorOverrides,
      },
      preset: cyberPreset,
    })
    expect(output).toMatch(/^export const cyberLight: ThemeInput = \{$/m)
    expect(output).toMatch(/^export const cyberDark: ThemeInput = \{$/m)
  })

  it("emits complete color objects (background/surface/text/etc.) in both TS ThemeInput blocks", () => {
    const output = generateDesignMd({ settings: defaultPlaygroundSettings, preset: marwesPreset })
    const light = output.match(/export const marwesLight[\s\S]*?^\}$/m)?.[0] ?? ""
    const dark = output.match(/export const marwesDark[\s\S]*?^\}$/m)?.[0] ?? ""
    for (const key of [
      "background",
      "surface",
      "surfaceElevated",
      "text",
      "textMuted",
      "border",
      "borderStrong",
    ]) {
      expect(light, `light block should include ${key}`).toMatch(new RegExp(`^ {4}${key}:`, "m"))
      expect(dark, `dark block should include ${key}`).toMatch(new RegExp(`^ {4}${key}:`, "m"))
    }
    expect(light.match(/background: "([^"]+)"/)?.[1]).not.toBe(
      dark.match(/background: "([^"]+)"/)?.[1],
    )
    expect(light.match(/text: "([^"]+)"/)?.[1]).not.toBe(dark.match(/text: "([^"]+)"/)?.[1])
  })

  it("emits pre-resolved text-on-* tokens in colors and references them from banner components", () => {
    const output = generateDesignMd({ settings: defaultPlaygroundSettings, preset: marwesPreset })
    const { frontmatter } = splitFrontmatter(output)
    expect(frontmatter).toMatch(/^ {2}text-on-primary: "#/m)
    expect(frontmatter).toMatch(/^ {2}text-on-danger: "#/m)
    expect(frontmatter).toMatch(/^ {2}text-on-success: "#/m)
    expect(frontmatter).toMatch(/^ {2}text-on-warning: "#/m)
    expect(frontmatter).toMatch(/textColor: "\{colors\.text-on-danger\}"/)
    expect(frontmatter).toMatch(/textColor: "\{colors\.text-on-success\}"/)
    expect(frontmatter).toMatch(/textColor: "\{colors\.text-on-warning\}"/)
    expect(frontmatter).toMatch(/^ {4}exportedForegroundTokensAreResolved: true$/m)
  })

  it("does not emit an OpenType fontFeature line (text-transform is a CSS runtime concern in Marwes)", () => {
    const output = generateDesignMd({ settings: defaultPlaygroundSettings, preset: marwesPreset })
    expect(output).not.toMatch(/fontFeature:/)
    expect(output).not.toMatch(/tcap/)
  })

  it("emits x-marwes.font with source, weights, and fallback for consumer font-loading strategy", () => {
    const output = generateDesignMd({ settings: defaultPlaygroundSettings, preset: marwesPreset })
    const { frontmatter } = splitFrontmatter(output)
    expect(frontmatter).toMatch(/^ {2}font:$/m)
    expect(frontmatter).toMatch(/^ {4}family: "Instrument Sans"$/m)
    expect(frontmatter).toMatch(/^ {4}source: google-fonts$/m)
    expect(frontmatter).toMatch(/^ {4}weights: \[[\d, ]+\]$/m)
    expect(frontmatter).toMatch(/^ {4}loadingRequired: true$/m)
  })

  it("emits x-marwes.focusRing with color, width, style, offset", () => {
    const output = generateDesignMd({ settings: defaultPlaygroundSettings, preset: marwesPreset })
    const { frontmatter } = splitFrontmatter(output)
    expect(frontmatter).toMatch(/^ {2}focusRing:$/m)
    expect(frontmatter).toMatch(/^ {4}color: "\{colors\.focus\}"$/m)
    expect(frontmatter).toMatch(/^ {4}width: 2px$/m)
    expect(frontmatter).toMatch(/^ {4}style: solid$/m)
    expect(frontmatter).toMatch(/^ {4}offset: 2px$/m)
  })

  it("does not carry the stale hover-variants sentence in the Components prose", () => {
    const output = generateDesignMd({ settings: defaultPlaygroundSettings, preset: marwesPreset })
    expect(output).not.toMatch(/Variants \(e\.g\. `-hover`\)/)
  })

  it("presents YAML as the sole normative source in the Marwes Integration prose", () => {
    const output = generateDesignMd({ settings: defaultPlaygroundSettings, preset: marwesPreset })
    expect(output).toMatch(/generated Marwes integration artefact/)
    expect(output).toMatch(/YAML takes precedence/)
    expect(output).not.toMatch(/TypeScript objects below are the normative representation/)
  })

  it("bakes preset colorOverrides into the correct mode's ThemeInput.color", () => {
    const output = generateDesignMd({
      settings: {
        ...defaultPlaygroundSettings,
        style: cyberPreset.style,
        colors: { ...defaultPlaygroundSettings.colors, primary: cyberPreset.primary },
        colorOverrides: cyberPreset.colorOverrides,
      },
      preset: cyberPreset,
    })
    const darkBlock = output.match(/export const cyberDark[\s\S]*?^\}$/m)?.[0] ?? ""
    expect(darkBlock).toMatch(/background: "#0A0A0F"/)
    expect(darkBlock).toMatch(/surface: "#12121A"/)
    const lightBlock = output.match(/export const cyberLight[\s\S]*?^\}$/m)?.[0] ?? ""
    expect(lightBlock).toMatch(/background: "#F5F5F0"/)
    expect(lightBlock).toMatch(/surface: "#FFFFFF"/)
  })

  it("bakes edited custom overrides into YAML and both ThemeInput modes", () => {
    const customPreset = getPreset("custom")
    const output = generateDesignMd({
      settings: {
        ...defaultPlaygroundSettings,
        selectedPresetId: "custom",
        mode: ThemeMode.dark,
        colorOverrides: {
          light: {
            ...customPreset.colorOverrides?.light,
            primary: "#112233",
            background: "#FAFAFA",
            surface: "#F0F0F0",
            surfaceElevated: "#F0F0F0",
            text: "#202020",
          },
          dark: {
            ...customPreset.colorOverrides?.dark,
            primary: "#AABBCC",
            background: "#101010",
            surface: "#181818",
            surfaceElevated: "#181818",
            text: "#F5F5F5",
          },
        },
      },
      preset: customPreset,
    })
    const { frontmatter } = splitFrontmatter(output)
    const lightBlock = output.match(/export const customLight[\s\S]*?^\}$/m)?.[0] ?? ""
    const darkBlock = output.match(/export const customDark[\s\S]*?^\}$/m)?.[0] ?? ""

    expect(frontmatter).toMatch(/^ {2}primary: "#AABBCC"$/m)
    expect(frontmatter).toMatch(/^ {2}background: "#101010"$/m)
    expect(lightBlock).toMatch(/primary: "#112233"/)
    expect(lightBlock).toMatch(/background: "#FAFAFA"/)
    expect(lightBlock).toMatch(/surface: "#F0F0F0"/)
    expect(lightBlock).toMatch(/text: "#202020"/)
    expect(darkBlock).toMatch(/primary: "#AABBCC"/)
    expect(darkBlock).toMatch(/background: "#101010"/)
    expect(darkBlock).toMatch(/surface: "#181818"/)
    expect(darkBlock).toMatch(/text: "#F5F5F5"/)
  })

  it("scales the rounded scale from settings.radius", () => {
    const output = generateDesignMd({
      settings: { ...defaultPlaygroundSettings, radius: 10 },
      preset: marwesPreset,
    })
    const { frontmatter } = splitFrontmatter(output)
    expect(frontmatter).toMatch(/^ {2}sm: 5px$/m)
    expect(frontmatter).toMatch(/^ {2}md: 10px$/m)
    expect(frontmatter).toMatch(/^ {2}lg: 20px$/m)
    expect(frontmatter).toMatch(/^ {2}full: 9999px$/m)
  })
})
