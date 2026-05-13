import * as fs from "node:fs"
import * as path from "node:path"
import postcss, { type Declaration, type Rule } from "postcss"
import {
  type TokenPointer,
  avatarTokens,
  badgeTokens,
  buttonTokens,
  checkboxTokens,
  dividerTokens,
  firstEditionThemeVarPaths,
  iconTokens,
  skeletonTokens,
  spinnerTokens,
} from "./react-native-token-manifest"

export type NativeTokenValue = string | number

export type NativeTokenRef =
  | { kind: "theme"; path: string; fallback?: NativeTokenValue }
  | { kind: "static"; value: NativeTokenValue }

export const repoRoot = path.resolve(new URL("..", import.meta.url).pathname)

export const nativeTokenOutputPath = path.join(
  repoRoot,
  "packages/react-native/src/styles/native-tokens/generated/first-edition.native-token-data.ts",
)

export function readCssVars(sourceCss: string): Map<string, Map<string, string>> {
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

export function readToken(
  vars: Map<string, Map<string, string>>,
  pointer: TokenPointer,
): NativeTokenRef {
  const raw = vars.get(pointer.selector)?.get(pointer.varName)
  if (!raw) {
    throw new Error(`Missing native token ${pointer.varName} on selector ${pointer.selector}`)
  }

  return parseTokenValue(raw)
}

export function parseTokenValue(
  raw: string,
  themeVarPaths: Record<string, string> = firstEditionThemeVarPaths,
): NativeTokenRef {
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

export function parseStaticValue(value: string): NativeTokenValue {
  if (value === "inherit") return "System"
  if (value === "transparent") return "transparent"

  const pxMatch = value.match(/^(-?\d+(?:\.\d+)?)px$/)
  if (pxMatch?.[1]) return Number.parseFloat(pxMatch[1])

  const msMatch = value.match(/^(-?\d+(?:\.\d+)?)ms$/)
  if (msMatch?.[1]) return Number.parseFloat(msMatch[1])

  if (/^-?\d+(?:\.\d+)?$/.test(value)) return Number.parseFloat(value)

  return value
}

export function mapRecord<T extends Record<string, TokenPointer>>(
  vars: Map<string, Map<string, string>>,
  record: T,
): Record<keyof T, NativeTokenRef> {
  return Object.fromEntries(
    Object.entries(record).map(([key, pointer]) => [key, readToken(vars, pointer)]),
  ) as Record<keyof T, NativeTokenRef>
}

export function generateFirstEditionNativeTokenData(): string {
  const avatarVars = readCssVars(avatarTokens.sourceCss)
  const badgeVars = readCssVars(badgeTokens.sourceCss)
  const buttonVars = readCssVars(buttonTokens.sourceCss)
  const checkboxVars = readCssVars(checkboxTokens.sourceCss)
  const dividerVars = readCssVars(dividerTokens.sourceCss)
  const iconVars = readCssVars(iconTokens.sourceCss)
  const skeletonVars = readCssVars(skeletonTokens.sourceCss)
  const spinnerVars = readCssVars(spinnerTokens.sourceCss)

  const avatar = {
    base: mapRecord(avatarVars, avatarTokens.base),
    sizes: Object.fromEntries(
      Object.entries(avatarTokens.sizes).map(([size, tokens]) => [
        size,
        mapRecord(avatarVars, tokens),
      ]),
    ),
    types: Object.fromEntries(
      Object.entries(avatarTokens.types).map(([type, tokens]) => [
        type,
        mapRecord(avatarVars, tokens),
      ]),
    ),
  }

  const badge = {
    base: mapRecord(badgeVars, badgeTokens.base),
    tones: Object.fromEntries(
      Object.entries(badgeTokens.tones).map(([tone, tokens]) => [
        tone,
        mapRecord(badgeVars, tokens),
      ]),
    ),
  }

  const button = {
    base: mapRecord(buttonVars, buttonTokens.base),
    sizes: Object.fromEntries(
      Object.entries(buttonTokens.sizes).map(([size, tokens]) => [
        size,
        mapRecord(buttonVars, tokens),
      ]),
    ),
    variants: Object.fromEntries(
      Object.entries(buttonTokens.variants).map(([variant, tokens]) => [
        variant,
        mapRecord(buttonVars, tokens),
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

  const divider = {
    base: mapRecord(dividerVars, dividerTokens.base),
    sizes: Object.fromEntries(
      Object.entries(dividerTokens.sizes).map(([size, tokens]) => [
        size,
        mapRecord(dividerVars, tokens),
      ]),
    ),
  }

  const icon = {
    base: mapRecord(iconVars, iconTokens.base),
    sizes: Object.fromEntries(
      Object.entries(iconTokens.sizes).map(([size, tokens]) => [size, mapRecord(iconVars, tokens)]),
    ),
    colors: Object.fromEntries(
      Object.entries(iconTokens.colors).map(([color, tokens]) => [
        color,
        mapRecord(iconVars, tokens),
      ]),
    ),
  }

  const skeleton = {
    base: mapRecord(skeletonVars, skeletonTokens.base),
    variants: Object.fromEntries(
      Object.entries(skeletonTokens.variants).map(([variant, tokens]) => [
        variant,
        mapRecord(skeletonVars, tokens),
      ]),
    ),
  }

  const spinner = {
    base: mapRecord(spinnerVars, spinnerTokens.base),
    colors: mapRecord(spinnerVars, spinnerTokens.colors),
    motion: mapRecord(spinnerVars, spinnerTokens.motion),
  }

  return `// Generated by scripts/generate-react-native-tokens.ts
// Do not edit this file directly.

import type {
  AvatarNativeTokens,
  BadgeNativeTokens,
  ButtonNativeTokens,
  CheckboxNativeTokens,
  DividerNativeTokens,
  IconNativeTokens,
  SkeletonNativeTokens,
  SpinnerNativeTokens,
} from "../native-token-types"

export const firstEditionAvatarNativeTokens: AvatarNativeTokens = ${toTs(avatar)}

export const firstEditionBadgeNativeTokens: BadgeNativeTokens = ${toTs(badge)}

export const firstEditionButtonNativeTokens: ButtonNativeTokens = ${toTs(button)}

export const firstEditionCheckboxNativeTokens: CheckboxNativeTokens = ${toTs(checkbox)}

export const firstEditionDividerNativeTokens: DividerNativeTokens = ${toTs(divider)}

export const firstEditionIconNativeTokens: IconNativeTokens = ${toTs(icon)}

export const firstEditionSkeletonNativeTokens: SkeletonNativeTokens = ${toTs(skeleton)}

export const firstEditionSpinnerNativeTokens: SpinnerNativeTokens = ${toTs(spinner)}
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
