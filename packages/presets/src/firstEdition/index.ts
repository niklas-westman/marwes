import type { ThemeInput } from "@marwes-ui/core"
import "@fontsource/instrument-sans/400.css"
import "@fontsource/instrument-sans/500.css"
import "@fontsource/instrument-sans/600.css"
import "@fontsource/instrument-sans/700.css"

export {
  cyberPreset,
  editorialPreset,
  marwesPreset,
  nordicPreset,
  sunsetPreset,
  themePresets,
} from "./presets"

// Explicit ThemeInput for consumers that still want to import the preset object.
// MarwesProvider uses the same first edition baseline when no theme is provided.
export const firstEditionTheme: ThemeInput = {
  color: {
    primary: {
      base: "#2F31FC",
      hover: "#2527CA",
      pressed: "#1B1D97",
      disabled: "#8182FC",
      label: "#FFFFFF",
      labelDisabled: "rgba(255,255,255,0.5)",
    },
    danger: {
      base: "#D90429",
      hover: "#A8031F",
      pressed: "#780215",
      disabled: "#FF8A95",
      label: "#FFFFFF",
      labelDisabled: "rgba(255,255,255,0.5)",
    },
    success: "#006633",
    warning: "#B45309",
    background: "#FFFFFF",
    surface: "#F8F8F8",
    surfaceSubtle: "#F5F5F5",
    surfaceElevated: "#FFFFFF",
    surfaceDisabled: "#F5F5F5",
    surfaceInverted: "#141414",
    text: "#141414",
    textMuted: "#595959",
    textSubtle: "#737373",
    textDisabled: "#737373",
    textInverted: "#FFFFFF",
    border: "#D8D8D8",
    borderSubtle: "#D8D8D8",
    borderStrong: "#A3A3A3",
    borderDisabled: "#D8D8D8",
    focus: "#2F31FC",
  },
  font: { primary: "'Instrument Sans', Inter, system-ui, sans-serif" },
  ui: { radius: 4, density: "comfortable" },
}
