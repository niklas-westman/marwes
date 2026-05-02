/**
 * Pure font utilities shared by adapter runtime layers.
 * Browser-side font injection lives in framework adapters.
 */

export const mwFontFallbacks = {
  sans: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  serif: 'Georgia, "Times New Roman", serif',
  mono: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
  rounded: 'ui-rounded, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
} as const

export type MwFontFallback = keyof typeof mwFontFallbacks

export const mwGoogleFontFamilies = [
  "Roboto",
  "Open Sans",
  "Source Sans 3",
  "Noto Sans",
  "DM Sans",
  "Manrope",
  "Geist",
  "Poppins",
  "Montserrat",
  "Nunito",
  "Lora",
  "Merriweather",
  "Playfair Display",
  "Fira Code",
  "JetBrains Mono",
] as const

export type MwGoogleFontFamily = (typeof mwGoogleFontFamilies)[number]

export function createFontStack(
  family: string,
  fallback: MwFontFallback | string = "sans",
): string {
  const fallbackStack =
    fallback in mwFontFallbacks ? mwFontFallbacks[fallback as MwFontFallback] : fallback
  return `${family}, ${fallbackStack}`
}

export const mwAvailableFonts = {
  SystemSans: mwFontFallbacks.sans,
  SystemSerif: mwFontFallbacks.serif,
  SystemMono: mwFontFallbacks.mono,
  Inter: createFontStack("Inter"),
  InstrumentSans: createFontStack("Instrument Sans"),
  Roboto: createFontStack("Roboto"),
  OpenSans: createFontStack("Open Sans"),
  SourceSans3: createFontStack("Source Sans 3"),
  NotoSans: createFontStack("Noto Sans"),
  DmSans: createFontStack("DM Sans"),
  Manrope: createFontStack("Manrope"),
  Geist: createFontStack("Geist"),
  Poppins: createFontStack("Poppins"),
  Montserrat: createFontStack("Montserrat"),
  Nunito: createFontStack("Nunito"),
  Lora: createFontStack("Lora", "serif"),
  Merriweather: createFontStack("Merriweather", "serif"),
  PlayfairDisplay: createFontStack("Playfair Display", "serif"),
  FiraCode: createFontStack("Fira Code", "mono"),
  JetBrainsMono: createFontStack("JetBrains Mono", "mono"),
  BrandSans: createFontStack("Brand Sans"),
  BrandSerif: createFontStack("Brand Serif", "serif"),
  BrandMono: createFontStack("Brand Mono", "mono"),
} as const

export type MwAvailableFont = keyof typeof mwAvailableFonts

// Fonts that should NOT trigger a Google Fonts load: CSS generics,
// platform-installed system fonts, project-bundled @fontsource families, and
// Marwes custom placeholders that consumers are expected to self-host.
const KNOWN_FONTS = new Set([
  "system-ui",
  "ui-monospace",
  "ui-sans-serif",
  "ui-serif",
  "ui-rounded",
  "-apple-system",
  "blinkmacsystemfont",
  "segoe ui",
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
  "brand sans",
  "brand serif",
  "brand mono",
])

const MW_GOOGLE_FONT_FAMILY_SET = new Set(mwGoogleFontFamilies.map(normalizeFontFamilyForMatch))

export type FontLoadingMode = "auto" | "none"

export interface FontLoadingOptions {
  /**
   * auto: load non-system font families from Google Fonts.
   * none: do not inject font links; consumers load fonts with CSS/framework tooling.
   */
  mode?: FontLoadingMode
  /**
   * Optional allowlist for Google Fonts loading. When provided, only these
   * family names are loaded from Google Fonts.
   */
  googleFamilies?: readonly string[]
  /**
   * Optional denylist for locally installed, bundled, or self-hosted fonts.
   */
  skipFamilies?: readonly string[]
}

export type FontLoadingConfig = FontLoadingMode | FontLoadingOptions

function normalizeFontFamilyForMatch(name: string): string {
  return name
    .trim()
    .replace(/^['"]|['"]$/g, "")
    .toLowerCase()
}

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
  return KNOWN_FONTS.has(normalizeFontFamilyForMatch(name))
}

/**
 * Determines whether a font family should be loaded from Google Fonts.
 *
 * The default mode is registry-first: known Marwes Google font families load
 * automatically, while custom/self-hosted family names do not.
 */
export function shouldLoadGoogleFont(name: string, config: FontLoadingConfig = "auto"): boolean {
  const options: FontLoadingOptions = typeof config === "string" ? { mode: config } : config
  const mode = options.mode ?? "auto"

  if (mode === "none" || isSystemFont(name)) return false

  const normalizedName = normalizeFontFamilyForMatch(name)
  const skipFamilies = new Set((options.skipFamilies ?? []).map(normalizeFontFamilyForMatch))
  if (skipFamilies.has(normalizedName)) return false

  if (options.googleFamilies) {
    const googleFamilies = new Set(options.googleFamilies.map(normalizeFontFamilyForMatch))
    return googleFamilies.has(normalizedName)
  }

  return MW_GOOGLE_FONT_FAMILY_SET.has(normalizedName)
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
