import type { ThemeInput } from "./theme-types"

export type ToneName = "default" | "digital" | "playful" | "editorial"

export type ToneDefinition = Pick<Partial<ThemeInput>, "font" | "ui" | "typography">

const digitalTone: ToneDefinition = {
  font: {
    primary: "Fira Code, ui-monospace, monospace",
    secondary: "Fira Code, monospace",
  },
  ui: { radius: 0 },
  typography: {
    h1: { fontWeight: 500, letterSpacing: 0, lineHeight: 1.1 },
    h2: { fontWeight: 500, letterSpacing: 0, lineHeight: 1.15 },
    h3: { fontWeight: 500, letterSpacing: 0, lineHeight: 1.2 },
    paragraph: {
      sm: { lineHeight: 1.4 },
      md: { lineHeight: 1.5 },
      lg: { lineHeight: 1.5 },
    },
  },
}

const playfulTone: ToneDefinition = {
  font: {
    primary: "Nunito, system-ui, sans-serif",
    secondary: "Nunito, sans-serif",
  },
  ui: { radius: 16 },
  typography: {
    h1: { fontWeight: 800, lineHeight: 1.3, letterSpacing: -0.5 },
    h2: { fontWeight: 800, lineHeight: 1.35, letterSpacing: -0.3 },
    h3: { fontWeight: 700, lineHeight: 1.4, letterSpacing: 0 },
    paragraph: {
      sm: { lineHeight: 1.6 },
      md: { lineHeight: 1.7 },
      lg: { lineHeight: 1.8 },
    },
  },
}

const editorialTone: ToneDefinition = {
  font: {
    primary: "Playfair Display, Georgia, serif",
    secondary: "Lora, Georgia, serif",
  },
  ui: { radius: 2 },
  typography: {
    h1: { fontWeight: 400, letterSpacing: 0.5, lineHeight: 1.3 },
    h2: { fontWeight: 400, letterSpacing: 0.3, lineHeight: 1.35 },
    h3: { fontWeight: 500, letterSpacing: 0.1, lineHeight: 1.4 },
    paragraph: {
      sm: { lineHeight: 1.6 },
      md: { lineHeight: 1.7 },
      lg: { lineHeight: 1.8 },
    },
  },
}

const TONE_MAP: Record<ToneName, ToneDefinition> = {
  default: {},
  digital: digitalTone,
  playful: playfulTone,
  editorial: editorialTone,
}

/**
 * Returns theme overrides for a given tone.
 * "default" returns an empty object (no overrides).
 * Consumer-supplied ThemeInput values should be merged on top of tone overrides.
 */
export function resolveTone(tone: ToneName): ToneDefinition {
  return TONE_MAP[tone]
}
