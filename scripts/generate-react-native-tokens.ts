import * as fs from "node:fs"
import * as path from "node:path"
import postcss, { type Declaration, type Rule } from "postcss"

type NativeTokenValue = string | number

type NativeTokenRef =
  | { kind: "theme"; path: string; fallback?: NativeTokenValue }
  | { kind: "static"; value: NativeTokenValue }

type TokenPointer = {
  selector: string
  varName: string
}

type BadgeVariant = "neutral" | "info" | "success" | "warning" | "error"
type CheckboxSize = "sm" | "md" | "lg"

const repoRoot = path.resolve(new URL("..", import.meta.url).pathname)
const outputPath = path.join(
  repoRoot,
  "packages/react-native/src/styles/native-tokens/generated/first-edition.native-token-data.ts",
)

const themeVarPaths: Record<string, string> = {
  "--mw-ui-radius": "ui.radius",
  "--mw-font-primary": "font.primary",
  "--mw-color-surface": "color.surface",
  "--mw-color-surface-subtle": "color.surfaceSubtle",
  "--mw-color-border": "color.border",
  "--mw-color-border-subtle": "color.borderSubtle",
  "--mw-color-text-muted": "color.textMuted",
  "--mw-color-primary-base": "color.primary.base",
  "--mw-color-primary-label": "color.primary.label",
  "--mw-color-danger-base": "color.danger.base",
  "--mw-color-status-info-background": "color.status.info.background",
  "--mw-color-status-info-border": "color.status.info.border",
  "--mw-color-status-info-text": "color.status.info.text",
  "--mw-color-status-success-background": "color.status.success.background",
  "--mw-color-status-success-border": "color.status.success.border",
  "--mw-color-status-success-text": "color.status.success.text",
  "--mw-color-status-warning-background": "color.status.warning.background",
  "--mw-color-status-warning-border": "color.status.warning.border",
  "--mw-color-status-warning-text": "color.status.warning.text",
  "--mw-color-status-error-background": "color.status.error.background",
  "--mw-color-status-error-border": "color.status.error.border",
  "--mw-color-status-error-text": "color.status.error.text",
}

const badgeTokens = {
  sourceCss: "packages/presets/src/firstEdition/badge.css",
  base: {
    radius: { selector: ".mw-badge", varName: "--mw-badge-radius" },
    paddingX: { selector: ".mw-badge", varName: "--mw-badge-padding-x" },
    paddingY: { selector: ".mw-badge", varName: "--mw-badge-padding-y" },
    gap: { selector: ".mw-badge", varName: "--mw-badge-gap" },
    fontFamily: { selector: ".mw-badge", varName: "--mw-badge-font-family" },
    fontSize: { selector: ".mw-badge", varName: "--mw-badge-font-size" },
    fontWeight: { selector: ".mw-badge", varName: "--mw-badge-font-weight" },
    lineHeight: { selector: ".mw-badge", varName: "--mw-badge-line-height" },
  } satisfies Record<string, TokenPointer>,
  tones: {
    neutral: {
      surface: { selector: ".mw-badge--neutral", varName: "--mw-badge-surface" },
      border: { selector: ".mw-badge--neutral", varName: "--mw-badge-border" },
      label: { selector: ".mw-badge--neutral", varName: "--mw-badge-label" },
    },
    info: {
      surface: { selector: ".mw-badge--info", varName: "--mw-badge-surface" },
      border: { selector: ".mw-badge--info", varName: "--mw-badge-border" },
      label: { selector: ".mw-badge--info", varName: "--mw-badge-label" },
    },
    success: {
      surface: { selector: ".mw-badge--success", varName: "--mw-badge-surface" },
      border: { selector: ".mw-badge--success", varName: "--mw-badge-border" },
      label: { selector: ".mw-badge--success", varName: "--mw-badge-label" },
    },
    warning: {
      surface: { selector: ".mw-badge--warning", varName: "--mw-badge-surface" },
      border: { selector: ".mw-badge--warning", varName: "--mw-badge-border" },
      label: { selector: ".mw-badge--warning", varName: "--mw-badge-label" },
    },
    error: {
      surface: { selector: ".mw-badge--error", varName: "--mw-badge-surface" },
      border: { selector: ".mw-badge--error", varName: "--mw-badge-border" },
      label: { selector: ".mw-badge--error", varName: "--mw-badge-label" },
    },
  } satisfies Record<BadgeVariant, Record<string, TokenPointer>>,
}

const checkboxTokens = {
  sourceCss: "packages/presets/src/firstEdition/checkbox.css",
  sizes: {
    sm: { size: { selector: ".mw-checkbox--sm", varName: "--mw-checkbox-size" } },
    md: { size: { selector: ".mw-checkbox--md", varName: "--mw-checkbox-size" } },
    lg: { size: { selector: ".mw-checkbox--lg", varName: "--mw-checkbox-size" } },
  } satisfies Record<CheckboxSize, Record<string, TokenPointer>>,
  box: {
    radius: { selector: ".mw-checkbox", varName: "--mw-checkbox-radius" },
    radiusMultiplier: { selector: ".mw-checkbox", varName: "--mw-checkbox-radius-multiplier" },
    border: { selector: ".mw-checkbox", varName: "--mw-checkbox-border" },
    background: { selector: ".mw-checkbox", varName: "--mw-checkbox-bg" },
    checkedBackground: { selector: ".mw-checkbox", varName: "--mw-checkbox-checked-bg" },
    check: { selector: ".mw-checkbox", varName: "--mw-checkbox-check" },
    disabledOpacity: { selector: ".mw-checkbox", varName: "--mw-checkbox-disabled-opacity" },
    invalidBorder: { selector: ".mw-checkbox", varName: "--mw-checkbox-invalid-border" },
  } satisfies Record<string, TokenPointer>,
}

function readCssVars(sourceCss: string): Map<string, Map<string, string>> {
  const css = fs.readFileSync(path.join(repoRoot, sourceCss), "utf8")
  const root = postcss.parse(css, { from: sourceCss })
  const vars = new Map<string, Map<string, string>>()

  root.walkRules((rule: Rule) => {
    for (const selector of rule.selectors || [rule.selector]) {
      const selectorVars = vars.get(selector) ?? new Map<string, string>()
      rule.walkDecls((decl: Declaration) => {
        if (decl.prop.startsWith("--mw-")) {
          selectorVars.set(decl.prop, decl.value)
        }
      })
      vars.set(selector, selectorVars)
    }
  })

  return vars
}

function readToken(vars: Map<string, Map<string, string>>, pointer: TokenPointer): NativeTokenRef {
  const raw = vars.get(pointer.selector)?.get(pointer.varName)
  if (!raw) {
    throw new Error(`Missing native token ${pointer.varName} on selector ${pointer.selector}`)
  }

  return parseTokenValue(raw)
}

function parseTokenValue(raw: string): NativeTokenRef {
  const value = raw.trim()
  const varMatch = value.match(/^var\((--mw-[^,)]+)(?:,\s*([^)]+))?\)$/)

  if (varMatch) {
    const varName = varMatch[1]
    const fallbackRaw = varMatch[2]?.trim()
    if (!varName) {
      throw new Error(`Invalid variable reference: ${raw}`)
    }

    const themePath = themeVarPaths[varName]
    if (!themePath) {
      throw new Error(`No native theme mapping for ${varName}`)
    }

    const fallback = fallbackRaw ? parseStaticValue(fallbackRaw) : undefined
    return fallback === undefined
      ? { kind: "theme", path: themePath }
      : { kind: "theme", path: themePath, fallback }
  }

  return { kind: "static", value: parseStaticValue(value) }
}

function parseStaticValue(value: string): NativeTokenValue {
  if (value === "inherit") return "System"
  if (value === "transparent") return "transparent"

  const pxMatch = value.match(/^(-?\d+(?:\.\d+)?)px$/)
  if (pxMatch?.[1]) return Number.parseFloat(pxMatch[1])

  const msMatch = value.match(/^(-?\d+(?:\.\d+)?)ms$/)
  if (msMatch?.[1]) return Number.parseFloat(msMatch[1])

  if (/^-?\d+(?:\.\d+)?$/.test(value)) return Number.parseFloat(value)

  return value
}

function mapRecord<T extends Record<string, TokenPointer>>(
  vars: Map<string, Map<string, string>>,
  record: T,
): Record<keyof T, NativeTokenRef> {
  return Object.fromEntries(
    Object.entries(record).map(([key, pointer]) => [key, readToken(vars, pointer)]),
  ) as Record<keyof T, NativeTokenRef>
}

function generateData(): string {
  const badgeVars = readCssVars(badgeTokens.sourceCss)
  const checkboxVars = readCssVars(checkboxTokens.sourceCss)

  const badge = {
    base: mapRecord(badgeVars, badgeTokens.base),
    tones: Object.fromEntries(
      Object.entries(badgeTokens.tones).map(([tone, tokens]) => [
        tone,
        mapRecord(badgeVars, tokens),
      ]),
    ),
  }

  const checkbox = {
    sizes: Object.fromEntries(
      Object.entries(checkboxTokens.sizes).map(([size, tokens]) => [
        size,
        mapRecord(checkboxVars, tokens),
      ]),
    ),
    box: mapRecord(checkboxVars, checkboxTokens.box),
  }

  return `// Generated by scripts/generate-react-native-tokens.ts
// Do not edit this file directly.

import type { BadgeNativeTokens, CheckboxNativeTokens } from "../native-token-types"

export const firstEditionBadgeNativeTokens: BadgeNativeTokens = ${toTs(badge)}

export const firstEditionCheckboxNativeTokens: CheckboxNativeTokens = ${toTs(checkbox)}
`
}

function toTs(value: unknown, depth = 0): string {
  const indent = "  ".repeat(depth)
  const nextIndent = "  ".repeat(depth + 1)

  if (Array.isArray(value)) {
    return `[${value.map((item) => toTs(item, depth)).join(", ")}]`
  }

  if (value && typeof value === "object") {
    const entries = Object.entries(value as Record<string, unknown>)
    if (entries.length === 0) return "{}"

    const body = entries
      .map(([key, entryValue]) => `${nextIndent}${key}: ${toTs(entryValue, depth + 1)},`)
      .join("\n")
    return `{\n${body}\n${indent}}`
  }

  return JSON.stringify(value)
}

const generated = generateData()

if (process.argv.includes("--check")) {
  const current = fs.existsSync(outputPath) ? fs.readFileSync(outputPath, "utf8") : ""
  if (current !== generated) {
    console.error("Generated native token data is out of date. Run: pnpm native-tokens:generate")
    process.exit(1)
  }

  console.log("Generated native token data is up to date.")
} else {
  fs.mkdirSync(path.dirname(outputPath), { recursive: true })
  fs.writeFileSync(outputPath, generated)
  console.log(`Generated ${path.relative(repoRoot, outputPath)}`)
}
