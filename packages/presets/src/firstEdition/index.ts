import type { ThemeInput } from "@marwes-ui/core"
import "@fontsource/instrument-sans/400.css"
import "@fontsource/instrument-sans/500.css"
import "@fontsource/instrument-sans/600.css"

// Explicit ThemeInput for consumers that still want to import the preset object.
// MarwesProvider uses the same first edition baseline when no theme is provided.
export const firstEditionTheme: ThemeInput = {
  color: {
    primary: {
      base: "#2F31FC",
      label: "#FFFFFF",
      labelDisabled: "rgba(255,255,255,0.5)",
    },
    success: "#00875A",
  },
  font: { primary: "'Instrument Sans', Inter, system-ui, sans-serif" },
  ui: { radius: 4, density: "comfortable" },
}
