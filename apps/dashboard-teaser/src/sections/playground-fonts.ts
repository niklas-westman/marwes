import { createFontStack, type mwFontFallbacks } from "@marwes-ui/react"

import googleFonts from "../data/google-fonts.json"

type GoogleFontEntry = { family: string; category: string; popularity: number }

const googleFontRegistry = googleFonts as readonly GoogleFontEntry[]

const googleFontCategoryByFamily = new Map<string, string>(
  googleFontRegistry.map((entry) => [entry.family, entry.category]),
)

const googleCategoryFallback: Record<string, keyof typeof mwFontFallbacks> = {
  "sans-serif": "sans",
  serif: "serif",
  monospace: "mono",
  display: "sans",
  handwriting: "sans",
}

function resolveFontStack(family: string): string {
  const category = googleFontCategoryByFamily.get(family)
  const fallbackKey = category ? (googleCategoryFallback[category] ?? "sans") : "sans"
  return createFontStack(family, fallbackKey)
}

const dyslexicFontStack = "Atkinson Hyperlegible, ui-sans-serif, system-ui, sans-serif"

export { dyslexicFontStack, googleFontRegistry, resolveFontStack }
export type { GoogleFontEntry }
