import type { ThemeMode as ThemeModeValue } from "@marwes-ui/react"
import { ThemeMode } from "@marwes-ui/react"

import { baselineColorsByMode, marwesTypography } from "./design-md-data"
import type { TypographyMetric } from "./design-md-data"
import type { PlaygroundSettings } from "./playground-settings"
import { resolveFontStack, styleToneMap } from "./playground-settings"
import type { ThemePreset } from "./theme-presets"

function yamlString(value: string): string {
  return `"${value.replace(/"/g, '\\"')}"`
}

function tsString(value: string): string {
  return `"${value.replace(/\\/g, "\\\\").replace(/"/g, '\\"')}"`
}

function escapeRegExp(source: string): string {
  return source.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
}

function toCamelCase(input: string): string {
  return input
    .split(/[^a-zA-Z0-9]+/)
    .filter(Boolean)
    .map((word, index) =>
      index === 0
        ? word.charAt(0).toLowerCase() + word.slice(1)
        : word.charAt(0).toUpperCase() + word.slice(1).toLowerCase(),
    )
    .join("")
}

function relativeLuminance(hex: string): number {
  const value = hex.replace("#", "")
  const r = Number.parseInt(value.substr(0, 2), 16) / 255
  const g = Number.parseInt(value.substr(2, 2), 16) / 255
  const b = Number.parseInt(value.substr(4, 2), 16) / 255
  const toLinear = (v: number): number => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4)
  return 0.2126 * toLinear(r) + 0.7152 * toLinear(g) + 0.0722 * toLinear(b)
}

/**
 * Picks a foreground hex that clears WCAG AA against the given background —
 * mirrors Marwes' automatic label derivation on primary/danger/success/warning.
 * A single `text-on-primary` token cannot represent this because semantic
 * roles vary in luminance from theme to theme (yellow primary vs. deep-green
 * success).
 */
function contrastForeground(backgroundHex: string): string {
  const L = relativeLuminance(backgroundHex)
  const contrastWithBlack = (L + 0.05) / 0.05
  const contrastWithWhite = 1.05 / (L + 0.05)
  return contrastWithBlack >= contrastWithWhite ? "#0A0A0F" : "#FFFFFF"
}

function renderYamlMap(
  map: Record<string, string>,
  indent: number,
  serializeValue: (value: string) => string,
): string[] {
  const pad = " ".repeat(indent)
  return Object.entries(map).map(([key, value]) => `${pad}${key}: ${serializeValue(value)}`)
}

function renderTypography(tokens: Record<string, TypographyMetric>, fontFamily: string): string[] {
  const lines: string[] = []
  for (const [name, metric] of Object.entries(tokens)) {
    lines.push(`  ${name}:`)
    lines.push(`    fontFamily: ${yamlString(fontFamily)}`)
    lines.push(`    fontSize: ${metric.fontSize}px`)
    lines.push(`    lineHeight: ${metric.lineHeight}`)
    lines.push(`    fontWeight: ${metric.fontWeight}`)
    if (metric.letterSpacing !== 0) {
      lines.push(`    letterSpacing: ${metric.letterSpacing}px`)
    }
    /*
     * `textTransform: uppercase` for `text-overline` is a runtime CSS
     * transform in Marwes, not an OpenType feature — no `fontFeature` line
     * is emitted here. The uppercase behaviour is applied by the Marwes
     * component recipe; consumers who need to reproduce it apply
     * `text-transform: uppercase` in CSS.
     */
  }
  return lines
}

function renderComponents(): string[] {
  return [
    "  button-primary:",
    `    backgroundColor: ${yamlString("{colors.primary}")}`,
    `    textColor: ${yamlString("{colors.text-on-primary}")}`,
    `    typography: ${yamlString("{typography.text-label}")}`,
    `    rounded: ${yamlString("{rounded.md}")}`,
    "    padding: 12px 20px",
    "  button-secondary:",
    `    backgroundColor: ${yamlString("{colors.surface}")}`,
    `    textColor: ${yamlString("{colors.text}")}`,
    `    typography: ${yamlString("{typography.text-label}")}`,
    `    rounded: ${yamlString("{rounded.md}")}`,
    "    padding: 12px 20px",
    "  input-field:",
    `    backgroundColor: ${yamlString("{colors.background}")}`,
    `    textColor: ${yamlString("{colors.text}")}`,
    `    typography: ${yamlString("{typography.paragraph-md}")}`,
    `    rounded: ${yamlString("{rounded.md}")}`,
    "    height: 40px",
    "    padding: 8px 12px",
    "  card:",
    `    backgroundColor: ${yamlString("{colors.surface-elevated}")}`,
    `    textColor: ${yamlString("{colors.text}")}`,
    `    rounded: ${yamlString("{rounded.lg}")}`,
    "    padding: 24px",
    "  badge:",
    `    backgroundColor: ${yamlString("{colors.surface}")}`,
    `    textColor: ${yamlString("{colors.text}")}`,
    `    typography: ${yamlString("{typography.text-label-small}")}`,
    `    rounded: ${yamlString("{rounded.full}")}`,
    "    padding: 4px 10px",
    "  banner-danger:",
    `    backgroundColor: ${yamlString("{colors.danger}")}`,
    `    textColor: ${yamlString("{colors.text-on-danger}")}`,
    `    typography: ${yamlString("{typography.paragraph-sm}")}`,
    `    rounded: ${yamlString("{rounded.md}")}`,
    "    padding: 12px 16px",
    "  banner-success:",
    `    backgroundColor: ${yamlString("{colors.success}")}`,
    `    textColor: ${yamlString("{colors.text-on-success}")}`,
    `    typography: ${yamlString("{typography.paragraph-sm}")}`,
    `    rounded: ${yamlString("{rounded.md}")}`,
    "    padding: 12px 16px",
    "  banner-warning:",
    `    backgroundColor: ${yamlString("{colors.warning}")}`,
    `    textColor: ${yamlString("{colors.text-on-warning}")}`,
    `    typography: ${yamlString("{typography.paragraph-sm}")}`,
    `    rounded: ${yamlString("{rounded.md}")}`,
    "    padding: 12px 16px",
    "  helper-text:",
    `    textColor: ${yamlString("{colors.text-muted}")}`,
    `    typography: ${yamlString("{typography.text-caption}")}`,
    "  divider:",
    `    backgroundColor: ${yamlString("{colors.border}")}`,
    "    height: 1px",
    "  divider-strong:",
    `    backgroundColor: ${yamlString("{colors.border-strong}")}`,
    "    height: 1px",
    "  focus-ring:",
    `    backgroundColor: ${yamlString("{colors.focus}")}`,
    "    height: 2px",
  ]
}

/**
 * `x-marwes` is an intentionally-namespaced YAML extension that lives inside
 * the standard design.md frontmatter. Google's spec ignores unknown top-level
 * keys with `x-` prefix, so this stays lint-clean while carrying the
 * Marwes-specific values (tone, personality, density, defaultMode, package
 * identity, foreground-derivation behaviour) that ThemeInput needs but the
 * portable schema cannot express.
 */
function renderMarwesExtension({
  settings,
  preset,
}: {
  settings: PlaygroundSettings
  preset: ThemePreset
}): string[] {
  const tone = styleToneMap[settings.style]
  const personality = settings.personality ?? preset.personality
  const defaultMode = settings.mode === ThemeMode.dark ? "dark" : "light"
  const fontStack = resolveFontStack(settings.font)
  const usedWeights = Array.from(
    new Set(Object.values(marwesTypography).map((t) => t.fontWeight)),
  ).sort((a, b) => a - b)
  const fontFallback = fontStack.replace(new RegExp(`^${escapeRegExp(settings.font)},\\s*`), "")

  return [
    "x-marwes:",
    `  tone: ${tone}`,
    `  personality: ${personality}`,
    `  density: ${settings.density}`,
    `  defaultMode: ${defaultMode}`,
    "  framework: react",
    `  packageName: ${yamlString("@marwes-ui/react")}`,
    "  colorBehavior:",
    "    foregroundResolution: automatic",
    "    algorithm: wcag-contrast",
    "    exportedForegroundTokensAreResolved: true",
    "  font:",
    `    family: ${yamlString(settings.font)}`,
    "    source: google-fonts",
    `    weights: [${usedWeights.join(", ")}]`,
    `    fallback: ${yamlString(fontFallback)}`,
    "    loadingRequired: true",
    "  focusRing:",
    `    color: ${yamlString("{colors.focus}")}`,
    "    width: 2px",
    "    style: solid",
    "    offset: 2px",
    "  recommendedAccessibilityDefaults:",
    "    reducedMotion: system",
    "    contrast: system",
    "    colorVision: normal",
    "    increasedSpacing: false",
    "    dyslexicFont: false",
  ]
}

/**
 * Serialisable snapshot of a `ThemeInput` for a specific mode. Kept as a
 * literal object (not a real ThemeInput) so the TS emitter can render
 * enum-typed values (`ThemeMode.light`) as unquoted identifiers.
 */
type ThemeInputSnapshot = {
  mode: ThemeModeValue
  tone: string
  personality: string
  color: Record<string, string>
  ui: { radius: number; density: string }
  font: { primary: string }
}

function buildThemeInputSnapshot(
  settings: PlaygroundSettings,
  preset: ThemePreset,
  mode: ThemeModeValue,
): ThemeInputSnapshot {
  const baseline = baselineColorsByMode[mode]
  const presetOverrides = (preset.colorOverrides?.[mode] ?? {}) as Record<string, string>
  return {
    mode,
    tone: styleToneMap[settings.style],
    personality: settings.personality ?? preset.personality,
    color: {
      background: baseline.background,
      surface: baseline.surface,
      surfaceElevated: baseline.surfaceElevated,
      text: baseline.text,
      textMuted: baseline.textMuted,
      border: baseline.border,
      borderStrong: baseline.borderStrong,
      primary: settings.colors.primary,
      danger: settings.colors.danger,
      success: settings.colors.success,
      warning: settings.colors.warning,
      ...presetOverrides,
    },
    ui: { radius: settings.radius, density: settings.density },
    font: { primary: resolveFontStack(settings.font) },
  }
}

function renderThemeInputTs(varName: string, snapshot: ThemeInputSnapshot): string {
  const modeLiteral = snapshot.mode === ThemeMode.dark ? "ThemeMode.dark" : "ThemeMode.light"
  const colorLines = Object.entries(snapshot.color).map(
    ([key, value]) => `    ${key}: ${tsString(value)},`,
  )
  return [
    `export const ${varName}: ThemeInput = {`,
    `  mode: ${modeLiteral},`,
    `  tone: ${tsString(snapshot.tone)},`,
    `  personality: ${tsString(snapshot.personality)},`,
    "  color: {",
    ...colorLines,
    "  },",
    "  ui: {",
    `    radius: ${snapshot.ui.radius},`,
    `    density: ${tsString(snapshot.ui.density)},`,
    "  },",
    "  font: {",
    `    primary: ${tsString(snapshot.font.primary)},`,
    "  },",
    "}",
  ].join("\n")
}

/**
 * The normative "how do I actually apply this to MarwesProvider" section.
 * Emitted as a fenced ```ts block in the markdown body so it stays inside a
 * single downloadable file, while remaining copy-pasteable as real
 * TypeScript.
 */
function renderMarwesIntegrationSection(settings: PlaygroundSettings, preset: ThemePreset): string {
  const baseName = toCamelCase(preset.id)
  const lightSnapshot = buildThemeInputSnapshot(settings, preset, ThemeMode.light)
  const darkSnapshot = buildThemeInputSnapshot(settings, preset, ThemeMode.dark)
  const lightVar = `${baseName}Light`
  const darkVar = `${baseName}Dark`

  return [
    "## Marwes Integration",
    "",
    "The TypeScript objects below are a generated Marwes integration artefact — the exact `ThemeInput` that `MarwesProvider` expects for this theme. The YAML frontmatter and `x-marwes` block above remain the normative source; if the two disagree, the YAML takes precedence and the TypeScript block should be regenerated.",
    "",
    "Foreground colors on primary/danger/success/warning are pre-resolved into `colors.text-on-*` tokens in the YAML for tooling that cannot compute WCAG contrast — a Marwes consumer will derive identical values automatically at runtime and does not need to set them.",
    "",
    "```ts",
    'import { ThemeMode, type ThemeInput } from "@marwes-ui/react"',
    "",
    renderThemeInputTs(lightVar, lightSnapshot),
    "",
    renderThemeInputTs(darkVar, darkSnapshot),
    "```",
  ].join("\n")
}

type ProseContext = {
  settings: PlaygroundSettings
  preset: ThemePreset
  fontFamily: string
}

function renderProse({ settings, preset, fontFamily }: ProseContext): string {
  const modeLabel = settings.mode === ThemeMode.dark ? "dark" : "light"
  const personality = settings.personality ?? preset.personality

  const overview = [
    "## Overview",
    "",
    `**${preset.name}** — ${preset.description}`,
    "",
    `Emitted from the Marwes theme playground in ${modeLabel} mode with a ${personality} personality and \`${settings.density}\` density. The tokens above are the normative values; this prose gives an agent the "why" behind each choice.`,
  ].join("\n")

  const colorsProse = [
    "## Colors",
    "",
    `The palette is anchored by \`primary\` (${settings.colors.primary}) — reserved for the single most important action per screen. Semantic roles (\`danger\`, \`success\`, \`warning\`) carry outcome, not decoration. Surface and text roles adapt to ${modeLabel} mode so contrast is preserved when the header light/dark toggle flips.`,
  ].join("\n")

  const typographyProse = [
    "## Typography",
    "",
    `Set in **${fontFamily}** across every level. The naming follows Marwes' own vocabulary (\`display\`, \`h1\`–\`h3\`, \`paragraph-*\`, \`text-*\`) rather than remapping to a generic scale — this preserves round-trip fidelity with the Marwes React/Vue/Svelte packages.`,
  ].join("\n")

  const shapesProse = [
    "## Shapes",
    "",
    `Corner radius is scaled from a single base of \`${settings.radius}px\` (\`rounded.md\`). \`sm\` is half that, \`lg\` is double, and \`full\` is \`9999px\` for pill shapes. Radius scales apply to interactive elements (Button, Input, Badge) and containers (Card) alike, so the whole surface feels tuned to one shape language.`,
  ].join("\n")

  const componentsProse = [
    "## Components",
    "",
    "Component tokens reference the color and typography tokens above. Use references (`{colors.primary}`) rather than literal values so a swap of `primary` propagates automatically. Interactive states (hover, focus, disabled) are derived by Marwes at runtime — they are not enumerated here.",
  ].join("\n")

  const dosDonts = [
    "## Do's and Don'ts",
    "",
    "- Do use `primary` only for the single most important action per screen.",
    "- Do keep semantic colors (`danger`, `success`, `warning`) reserved for outcome — not decoration.",
    "- Do maintain WCAG AA contrast (4.5:1 for body text) when substituting `text` on `surface`.",
    "- Don't mix rounded and sharp corners in the same view — pick one `rounded.md` and let `sm`/`lg` scale from it.",
    "- Don't introduce a second display font. One family per DESIGN.md keeps the identity coherent.",
  ].join("\n")

  const integration = renderMarwesIntegrationSection(settings, preset)

  return [
    overview,
    colorsProse,
    typographyProse,
    shapesProse,
    componentsProse,
    dosDonts,
    integration,
  ]
    .filter(Boolean)
    .join("\n\n")
}

export {
  contrastForeground,
  renderComponents,
  renderMarwesExtension,
  renderProse,
  renderTypography,
  renderYamlMap,
  yamlString,
}
