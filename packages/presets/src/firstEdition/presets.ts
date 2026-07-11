import type { ThemeInput } from "@marwes-ui/core"

/**
 * Curated preset themes shipped with the firstEdition CSS. Each preset is a
 * `ThemeInput` — pass it directly to `<MarwesProvider theme={cyberPreset}>`
 * or spread it into a larger theme. The `personality` field maps to the
 * matching CSS signature block in `personality.css`.
 *
 * Presets do not include font imports. The consumer app must load fonts
 * separately (e.g. via Fontsource) when a preset references a non-default
 * font family.
 */

const marwesPreset: ThemeInput = {
  mode: "light",
  personality: "flat",
  color: {
    primary: "#2F31FC",
  },
  ui: { radius: 4, density: "comfortable" },
}

const cyberPreset: ThemeInput = {
  mode: "dark",
  tone: "digital",
  personality: "glow",
  color: {
    primary: "#FFE500",
    background: "#0A0A0F",
    surface: "#12121A",
    surfaceElevated: "#1B1B26",
    text: "#F4F4F5",
    textMuted: "#A1A1AA",
    border: "#27272A",
    borderStrong: "#3F3F46",
  },
  font: { primary: "'Fira Code', ui-monospace, monospace" },
  ui: { radius: 0, density: "compact" },
}

const editorialPreset: ThemeInput = {
  mode: "light",
  personality: "outlined",
  color: {
    primary: "#8B1E3F",
    background: "#FBF7F0",
    surface: "#FFFFFF",
    text: "#1B1B1F",
    textMuted: "#5C5C63",
    border: "#E5DFD2",
    borderStrong: "#C6BFB0",
  },
  font: { primary: "'Playfair Display', Georgia, serif" },
  ui: { radius: 12, density: "spacious" },
}

const sunsetPreset: ThemeInput = {
  mode: "light",
  personality: "soft",
  color: {
    primary: "#F97316",
    background: "#FFF8F2",
    surface: "#FFFFFF",
    text: "#2B1E17",
    textMuted: "#8B6E5A",
    border: "#F5DFC7",
    borderStrong: "#E9C29A",
  },
  font: { primary: "'Nunito', system-ui, sans-serif" },
  ui: { radius: 16, density: "comfortable" },
}

const nordicPreset: ThemeInput = {
  mode: "light",
  personality: "outlined",
  color: {
    primary: "#475569",
    background: "#F1F5F9",
    surface: "#F8FAFC",
    text: "#0F172A",
    textMuted: "#64748B",
    border: "#CBD5E1",
    borderStrong: "#94A3B8",
  },
  font: { primary: "'Fira Code', ui-monospace, monospace" },
  ui: { radius: 2, density: "compact" },
}

const themePresets: readonly ThemeInput[] = [
  marwesPreset,
  cyberPreset,
  editorialPreset,
  sunsetPreset,
  nordicPreset,
]

export { cyberPreset, editorialPreset, marwesPreset, nordicPreset, sunsetPreset, themePresets }
