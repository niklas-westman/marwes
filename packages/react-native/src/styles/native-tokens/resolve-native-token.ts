import type { ResolvedTheme } from "@marwes-ui/core"
import type { NativeTokenRef, NativeTokenValue } from "./native-token-types"

function readPath(source: unknown, path: string): unknown {
  return path.split(".").reduce<unknown>((current, key) => {
    if (current && typeof current === "object" && key in current) {
      return (current as Record<string, unknown>)[key]
    }

    return undefined
  }, source)
}

export function resolveNativeToken(ref: NativeTokenRef, theme: ResolvedTheme): NativeTokenValue {
  if (ref.kind === "static") {
    return ref.value
  }

  const value = readPath(theme, ref.path)
  if (typeof value === "string" || typeof value === "number") {
    return value
  }

  return ref.fallback ?? "transparent"
}

export function resolveNativeNumber(ref: NativeTokenRef, theme: ResolvedTheme): number {
  const value = resolveNativeToken(ref, theme)
  if (typeof value === "number") {
    return value
  }

  const parsed = Number.parseFloat(value)
  return Number.isFinite(parsed) ? parsed : 0
}

export function resolveNativeString(ref: NativeTokenRef, theme: ResolvedTheme): string {
  return String(resolveNativeToken(ref, theme))
}
