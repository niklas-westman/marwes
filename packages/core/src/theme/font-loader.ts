/**
 * Google Fonts auto-loading service.
 * Injects <link> tags for Google Fonts at runtime.
 * SSR-safe — no-ops when document is unavailable.
 */

// Fonts that should NOT trigger a Google Fonts load: CSS generics,
// platform-installed system fonts, and project-bundled @fontsource families.
const KNOWN_FONTS = new Set([
  "system-ui",
  "ui-monospace",
  "ui-sans-serif",
  "ui-serif",
  "ui-rounded",
  "-apple-system",
  "blinkmacsystemfont",
  "segoe ui",
  "roboto",
  "helvetica",
  "arial",
  "sans-serif",
  "serif",
  "monospace",
  "cursive",
  "fantasy",
  "inter",
  "instrument sans",
  "sfmono-regular",
  "menlo",
  "monaco",
  "consolas",
  "georgia",
  "times new roman",
  "courier new",
  "lucida console",
])

const loadedFonts = new Set<string>()
let preconnected = false

/**
 * Builds a Google Fonts CSS2 API URL for a given font family and weights.
 * Weights are sorted ascending in the output.
 */
export function buildGoogleFontsUrl(family: string, weights: number[]): string {
  const encodedFamily = family.replace(/ /g, "+")
  const sortedWeights = [...weights].sort((a, b) => a - b)
  const weightParam = sortedWeights.join(";")
  return `https://fonts.googleapis.com/css2?family=${encodedFamily}:wght@${weightParam}&display=swap`
}

/**
 * Extracts the first font family name from a CSS font-family stack.
 * Strips single and double quotes, trims whitespace.
 *
 * "Fira Code', ui-monospace, monospace" → "Fira Code"
 * "Instrument Sans, system-ui, sans-serif" → "Instrument Sans"
 */
export function extractFontFamilyName(fontStack: string): string {
  const firstFont = fontStack.split(",")[0] ?? ""
  return firstFont.trim().replace(/^['"]|['"]$/g, "")
}

/**
 * Returns true if the font name is a known system/generic font
 * that should not trigger a Google Fonts load.
 * Comparison is case-insensitive.
 */
export function isSystemFont(name: string): boolean {
  return KNOWN_FONTS.has(name.toLowerCase())
}

interface TypographyForWeightExtraction {
  h1: { fontWeight: number }
  h2: { fontWeight: number }
  h3: { fontWeight: number }
}

/**
 * Collects unique fontWeight values from typography config.
 * Always includes 400 and 500 as baseline weights.
 * Returns sorted ascending, deduplicated.
 */
export function extractUsedWeights(typography: TypographyForWeightExtraction): number[] {
  const weights = new Set([400, 500])
  weights.add(typography.h1.fontWeight)
  weights.add(typography.h2.fontWeight)
  weights.add(typography.h3.fontWeight)
  return [...weights].sort((a, b) => a - b)
}

function ensurePreconnect(): void {
  if (preconnected || typeof document === "undefined") return
  preconnected = true

  for (const href of ["https://fonts.googleapis.com", "https://fonts.gstatic.com"]) {
    const link = document.createElement("link")
    link.rel = "preconnect"
    link.href = href
    if (href.includes("gstatic")) link.crossOrigin = "anonymous"
    document.head.appendChild(link)
  }
}

export interface GoogleFontLoadOptions {
  family: string
  weights?: number[]
}

/**
 * Injects a Google Fonts <link> into document.head.
 * Idempotent — calling with the same family+weights is a no-op.
 * Safe to call server-side (no-ops when document is unavailable).
 */
export function loadGoogleFont(options: GoogleFontLoadOptions): void {
  if (typeof document === "undefined") return

  const { family, weights = [400, 500, 600, 700] } = options
  const key = `${family}:${weights.join(",")}`

  if (loadedFonts.has(key)) return
  loadedFonts.add(key)

  ensurePreconnect()

  const url = buildGoogleFontsUrl(family, weights)
  const link = document.createElement("link")
  link.rel = "stylesheet"
  link.href = url
  link.dataset.marwesFont = family
  document.head.appendChild(link)
}

/**
 * Resets internal font loading state.
 * Only intended for use in tests — clears the deduplication cache
 * so each test starts with a clean slate.
 */
export function resetFontLoaderState(): void {
  loadedFonts.clear()
  preconnected = false
}
