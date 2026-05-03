import type { FontLoadingConfig, ResolvedTheme } from "@marwes-ui/core"
import {
  buildGoogleFontsUrl,
  extractFontFamilyName,
  extractUsedWeights,
  shouldLoadGoogleFont,
  themeToCSSVars,
} from "@marwes-ui/core"

const loadedFonts = new Set<string>()
let preconnected = false

export function themeToRootStyle(theme: ResolvedTheme): Record<string, string> {
  return {
    ...themeToCSSVars(theme),
    backgroundColor: theme.color.background,
    color: theme.color.text,
  }
}

export function applyThemeToElement(element: HTMLElement, theme: ResolvedTheme): void {
  element.setAttribute("data-marwes-theme", "true")
  element.setAttribute("data-marwes-mode", theme.mode)

  for (const [property, value] of Object.entries(themeToRootStyle(theme))) {
    if (property === "backgroundColor") {
      element.style.backgroundColor = value
      continue
    }

    element.style.setProperty(property, value)
  }
}

function ensureFontPreconnect(): void {
  if (preconnected || typeof document === "undefined") return

  preconnected = true

  for (const href of ["https://fonts.googleapis.com", "https://fonts.gstatic.com"]) {
    const linkElement = document.createElement("link")
    linkElement.rel = "preconnect"
    linkElement.href = href

    if (href.includes("gstatic")) {
      linkElement.crossOrigin = "anonymous"
    }

    document.head.appendChild(linkElement)
  }
}

function loadGoogleFontToDocument(family: string, weights: number[]): void {
  if (typeof document === "undefined") return

  const cacheKey = `${family}:${weights.join(",")}`
  if (loadedFonts.has(cacheKey)) return

  loadedFonts.add(cacheKey)
  ensureFontPreconnect()

  const linkElement = document.createElement("link")
  linkElement.rel = "stylesheet"
  linkElement.href = buildGoogleFontsUrl(family, weights)
  linkElement.dataset.marwesFont = family
  document.head.appendChild(linkElement)
}

export function loadThemeFonts(theme: ResolvedTheme, config: FontLoadingConfig = "auto"): void {
  const weights = extractUsedWeights(theme.typography)
  const fontStacks = [theme.font.primary, theme.font.secondary]

  for (const fontStack of fontStacks) {
    const familyName = extractFontFamilyName(fontStack)

    if (familyName && shouldLoadGoogleFont(familyName, config)) {
      loadGoogleFontToDocument(familyName, weights)
    }
  }
}

export function resetThemeRuntimeState(): void {
  loadedFonts.clear()
  preconnected = false
}
