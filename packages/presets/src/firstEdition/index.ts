import type { ThemeInput } from "@marwes-ui/core"
import "@fontsource/instrument-sans/400.css"
import "@fontsource/instrument-sans/500.css"
import "@fontsource/instrument-sans/600.css"

// Drop-in ThemeInput for MarwesProvider.
// Color is intentionally omitted so resolveThemeInput picks the correct per-mode default.
export const firstEditionTheme: ThemeInput = {
  font: { primary: "Instrument Sans, system-ui, -apple-system, sans-serif" },
  ui: { radius: 4, density: "comfortable" },
}
