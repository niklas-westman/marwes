import { marwesTypography } from "./design-md-data"
import {
  contrastForeground,
  renderComponents,
  renderMarwesExtension,
  renderProse,
  renderTypography,
  renderYamlMap,
  yamlString,
} from "./design-md-renderer"
import type { PlaygroundSettings } from "./playground-settings"
import { resolveDashboardTheme } from "./playground-theme-resolver"
import type { ThemePreset } from "./theme-presets"

type DesignMdInput = {
  settings: PlaygroundSettings
  preset: ThemePreset
}

/**
 * Serialises a Marwes theme snapshot to a DESIGN.md file that follows the
 * Google Labs design.md format spec (YAML frontmatter + ordered prose
 * sections). Output is intended to lint clean under
 * `npx @google/design.md lint`.
 */
function generateDesignMd({ settings, preset }: DesignMdInput): string {
  const resolvedTheme = resolveDashboardTheme(settings, settings.mode, preset.personality)
  const { color } = resolvedTheme
  const fontFamily = resolvedTheme.font.family

  const colorTokens: Record<string, string> = {
    primary: color.primary,
    danger: color.danger,
    success: color.success,
    warning: color.warning,
    background: color.background,
    surface: color.surface,
    "surface-elevated": color.surfaceElevated,
    text: color.text,
    "text-muted": color.textMuted,
    "text-on-primary": contrastForeground(color.primary),
    "text-on-danger": contrastForeground(color.danger),
    "text-on-success": contrastForeground(color.success),
    "text-on-warning": contrastForeground(color.warning),
    border: color.border,
    "border-strong": color.borderStrong,
    focus: color.focus,
  }

  const radius = settings.radius
  const roundedTokens: Record<string, string> = {
    none: "0px",
    sm: `${Math.max(0, Math.round(radius / 2))}px`,
    md: `${radius}px`,
    lg: `${radius * 2}px`,
    full: "9999px",
  }

  const yaml = [
    "---",
    "version: 1",
    `name: ${yamlString(preset.name)}`,
    `description: ${yamlString(preset.description)}`,
    "colors:",
    ...renderYamlMap(colorTokens, 2, (v) => yamlString(v)),
    "typography:",
    ...renderTypography(marwesTypography, fontFamily),
    "rounded:",
    ...renderYamlMap(roundedTokens, 2, (v) => v),
    "spacing:",
    ...renderYamlMap(
      { xs: "4px", sm: "8px", md: "16px", lg: "24px", xl: "32px", "2xl": "48px" },
      2,
      (v) => v,
    ),
    "components:",
    ...renderComponents(),
    ...renderMarwesExtension({ settings, resolvedTheme }),
    "---",
  ].join("\n")

  const prose = renderProse({ settings, preset, fontFamily, primaryColor: color.primary })
  return `${yaml}\n\n${prose}\n`
}

/**
 * Triggers a browser download of the given markdown content as `DESIGN.md`.
 * Split from generation so tests can exercise the string builder without a
 * DOM.
 */
function downloadDesignFile(content: string, filename = "DESIGN.md"): void {
  const blob = new Blob([content], { type: "text/markdown" })
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement("a")
  anchor.href = url
  anchor.download = filename
  document.body.appendChild(anchor)
  anchor.click()
  document.body.removeChild(anchor)
  URL.revokeObjectURL(url)
}

export { downloadDesignFile, generateDesignMd }
export type { DesignMdInput }
