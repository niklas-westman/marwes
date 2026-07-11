import { createFontStack, type mwFontFallbacks } from "@marwes-ui/react"

const googleCategoryFallback: Record<string, keyof typeof mwFontFallbacks> = {
  "sans-serif": "sans",
  serif: "serif",
  monospace: "mono",
  display: "sans",
  handwriting: "sans",
}

/**
 * Seeded categories for the families we ship in presets and feature in the
 * picker. Keeping this in the eager bundle lets `resolveFontStack` return
 * the correct fallback before the full Google Fonts registry is loaded.
 * The combobox tops this map up via `registerFontCategories` when mounted.
 */
const seededCategories: Record<string, string> = {
  "Instrument Sans": "sans-serif",
  "DM Sans": "sans-serif",
  Inter: "sans-serif",
  Roboto: "sans-serif",
  Nunito: "sans-serif",
  "Playfair Display": "serif",
  Lora: "serif",
  "Fira Code": "monospace",
  "JetBrains Mono": "monospace",
}

const googleFontCategoryByFamily = new Map<string, string>(Object.entries(seededCategories))

function registerFontCategories(entries: Iterable<{ family: string; category: string }>): void {
  for (const entry of entries) {
    if (!googleFontCategoryByFamily.has(entry.family)) {
      googleFontCategoryByFamily.set(entry.family, entry.category)
    }
  }
}

function resolveFontStack(family: string): string {
  const category = googleFontCategoryByFamily.get(family)
  const fallbackKey = category ? (googleCategoryFallback[category] ?? "sans") : "sans"
  return createFontStack(family, fallbackKey)
}

const dyslexicFontFamily = "Atkinson Hyperlegible"
const dyslexicFontStack = `${dyslexicFontFamily}, ui-sans-serif, system-ui, sans-serif`

export { dyslexicFontFamily, dyslexicFontStack, registerFontCategories, resolveFontStack }
