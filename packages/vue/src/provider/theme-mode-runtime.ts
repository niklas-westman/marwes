import { ThemeMode, isThemePreference } from "@marwes-ui/core"
import type { ThemePreference } from "@marwes-ui/core"

const mediaQuery = "(prefers-color-scheme: dark)"

export function getSystemThemeMode(): ThemeMode {
  if (typeof window === "undefined") return ThemeMode.light
  return window.matchMedia?.(mediaQuery).matches ? ThemeMode.dark : ThemeMode.light
}

export function subscribeToSystemThemeMode(onChange: (mode: ThemeMode) => void): () => void {
  if (typeof window === "undefined" || !window.matchMedia) return () => {}

  const media = window.matchMedia(mediaQuery)
  const listener = (event: MediaQueryListEvent) => {
    onChange(event.matches ? ThemeMode.dark : ThemeMode.light)
  }

  if (media.addEventListener) {
    media.addEventListener("change", listener)
  } else {
    media.addListener?.(listener)
  }

  return () => {
    if (media.removeEventListener) {
      media.removeEventListener("change", listener)
    } else {
      media.removeListener?.(listener)
    }
  }
}

export function readStoredThemePreference(storageKey: string | false): ThemePreference | undefined {
  if (!storageKey || typeof window === "undefined") return undefined

  try {
    const value = window.localStorage.getItem(storageKey)
    return isThemePreference(value) ? value : undefined
  } catch {
    return undefined
  }
}

export function writeStoredThemePreference(
  storageKey: string | false,
  preference: ThemePreference,
): void {
  if (!storageKey || typeof window === "undefined") return

  try {
    window.localStorage.setItem(storageKey, preference)
  } catch {
    // Ignore unavailable storage.
  }
}
