import { ThemeMode, isThemePreference } from "@marwes-ui/core"
import type { ThemePreference } from "@marwes-ui/core"

const mediaQuery = "(prefers-color-scheme: dark)"

export type ThemeTarget = "provider" | "html" | "body"
export type ThemeAttribute = "class" | "data-theme" | "data-mode"

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

export function applyModeAttribute({
  target,
  providerElement,
  mode,
  attribute,
}: {
  target: ThemeTarget
  providerElement: HTMLElement | null
  mode: ThemeMode
  attribute: ThemeAttribute
}): void {
  const element = getTargetElement(target, providerElement)
  if (!element) return

  if (attribute === "class") {
    const oppositeMode = mode === ThemeMode.dark ? ThemeMode.light : ThemeMode.dark
    element.classList.remove(oppositeMode)
    element.classList.add(mode)
    return
  }

  element.setAttribute(attribute, mode)
}

export function withoutModeTransitions(callback: () => void): void {
  if (typeof document === "undefined" || typeof window === "undefined") {
    callback()
    return
  }

  const style = document.createElement("style")
  style.dataset.marwesDisableTransitions = "true"
  style.textContent = "* { transition: none !important; }"
  document.head.appendChild(style)

  callback()
  window.getComputedStyle(document.body)
  window.requestAnimationFrame(() => {
    style.remove()
  })
}

function getTargetElement(
  target: ThemeTarget,
  providerElement: HTMLElement | null,
): HTMLElement | null {
  if (target === "provider") return providerElement
  if (typeof document === "undefined") return null
  return target === "html" ? document.documentElement : document.body
}
