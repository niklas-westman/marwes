import type { CssVars } from "@marwes-ui/core"

export type SvelteStyleInput =
  | string
  | Record<string, string | number | null | undefined>
  | null
  | undefined

export function cssVarsToStyle(vars: CssVars | undefined): string | undefined {
  if (!vars) return undefined

  const declarations = Object.entries(vars)
    .filter(([, value]) => value !== undefined && value !== null && value !== "")
    .map(([property, value]) => `${property}: ${String(value)}`)

  return declarations.length > 0 ? declarations.join("; ") : undefined
}

export function styleObjectToString(
  style: Record<string, string | number | null | undefined> | undefined,
): string | undefined {
  if (!style) return undefined

  const declarations = Object.entries(style)
    .filter(([, value]) => value !== undefined && value !== null && value !== "")
    .map(([property, value]) => `${property}: ${String(value)}`)

  return declarations.length > 0 ? declarations.join("; ") : undefined
}

export function mergeStyle(...parts: Array<string | undefined>): string | undefined {
  const style = parts.filter(Boolean).join("; ")
  return style.length > 0 ? style : undefined
}
