import googleFonts from "../data/google-fonts.json"

type GoogleFontEntry = { family: string; category: string; popularity: number }

const googleFontRegistry = googleFonts as readonly GoogleFontEntry[]

export { googleFontRegistry }
export type { GoogleFontEntry }
