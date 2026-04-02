import type { ThemeInput } from "@marwes-ui/core"
import "@fontsource/instrument-sans/400.css"
import "@fontsource/instrument-sans/500.css"
import "@fontsource/instrument-sans/600.css"

// Drop-in ThemeInput for MarwesProvider.
// firstEdition carries an explicit brand primary plus a white label override so
// filled controls render with the preset brand contrast instead of the generic
// WCAG-derived default for this blue.
export const firstEditionTheme: ThemeInput = {
  color: {
    primary: {
      base: "#2F31FC",
      label: "#FFFFFF",
      labelDisabled: "rgba(255,255,255,0.5)",
    },
  },
  font: { primary: "Instrument Sans, system-ui, -apple-system, sans-serif" },
  ui: { radius: 4, density: "comfortable" },
}
