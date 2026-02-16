import type { Preset } from "@marwes-ui/core"
import "@fontsource/instrument-sans/400.css"
import "@fontsource/instrument-sans/500.css"
import "@fontsource/instrument-sans/600.css"

export const firstEdition: Preset = {
  name: "firstEdition",
  theme: {
    ui: {
      radius: 4,
      density: "comfortable",
      variant: "solid",
    },
    font: {
      primary: "Instrument Sans, system-ui, -apple-system, sans-serif",
    },
    icon: {
      size: "sm",
      strokeWidth: "sm",
    },
  },
}
