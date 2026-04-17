import type { ResolvedTheme } from "@marwes-ui/core"
import {
  buildGoogleFontsUrl,
  extractFontFamilyName,
  extractUsedWeights,
  isSystemFont,
  themeToCSSVars,
} from "@marwes-ui/core"

const loadedFonts = new Set<string>()
let preconnected = false

export function applyThemeToElement(element: HTMLElement, theme: ResolvedTheme): void {
  element.setAttribute("data-marwes-theme", "true")

  for (const [property, value] of Object.entries(themeToCSSVars(theme))) {
    element.style.setProperty(property, value)
  }

  element.style.backgroundColor = theme.color.background
  element.style.color = theme.color.text
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

export function loadThemeFonts(theme: ResolvedTheme): void {
  const weights = extractUsedWeights(theme.typography)
  const fontStacks = [theme.font.primary, theme.font.secondary]

  for (const fontStack of fontStacks) {
    const familyName = extractFontFamilyName(fontStack)

    if (familyName && !isSystemFont(familyName)) {
      loadGoogleFontToDocument(familyName, weights)
    }
  }
}

export function resetThemeRuntimeState(): void {
  loadedFonts.clear()
  preconnected = false
}
