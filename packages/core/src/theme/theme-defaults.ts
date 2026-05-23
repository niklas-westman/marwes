import { type Theme, ThemeMode, defaultThemeBreakpoints } from "./theme-types"

/**
 * Light theme defaults (default mode).
 * Uses dark text on light backgrounds.
 * Colors mapped from docs/marwes-colors.json.
 */
export const lightThemeDefaults: Theme = {
  mode: ThemeMode.light,

  color: {
    // Primary (firstEdition brand blue)
    primary: "#2F31FC",

    // Background & Surface
    background: "#FFFFFF",
    surface: "#F8F8F8",
    surfaceSubtle: "#F5F5F5",
    surfaceElevated: "#FFFFFF",
    surfaceDisabled: "#F5F5F5",
    surfaceInverted: "#141414",

    // Text
    text: "#141414",
    textMuted: "#595959",
    textSubtle: "#737373",
    textDisabled: "#737373",
    textInverted: "#FFFFFF",
    textBrand: "#2F31FC",

    // Borders
    border: "#D8D8D8",
    borderSubtle: "#D8D8D8",
    borderStrong: "#A3A3A3",
    borderDisabled: "#D8D8D8",
    borderBrand: "#2F31FC",

    // Focus
    focus: "#2F31FC",

    // Semantic colors
    danger: "#D90429",
    success: "#006633",
    warning: "#B45309",
    status: {
      success: {
        background: "#E6F4ED",
        text: "#006633",
        icon: "#006D48",
        border: "#90CAAD",
        borderStrong: "#2E9970",
      },
      warning: {
        background: "#FFF8E6",
        text: "#B45309",
        icon: "#D97706",
        border: "#FDE08A",
        borderStrong: "#E46F00",
      },
      error: {
        background: "#FFE8EB",
        text: "#A8031F",
        icon: "#D90429",
        border: "#FF8A95",
        borderStrong: "#FF2847",
      },
      info: {
        background: "#EEEEFF",
        text: "#1B1D97",
        icon: "#2F31FC",
        border: "#ABABFD",
        borderStrong: "#5859FC",
      },
    },
  },
  font: {
    primary: "'Instrument Sans', Inter, system-ui, sans-serif",
    secondary: "Helvetica",
    mono: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
  },
  ui: {
    radius: 4,
    density: "comfortable",
  },
  breakpoint: defaultThemeBreakpoints,
  typography: {
    h1: {
      fontSize: 32,
      lineHeight: 1.1875,
      fontWeight: 700,
      letterSpacing: -0.96,
    },
    h2: {
      fontSize: 24,
      lineHeight: 1.25,
      fontWeight: 500,
      letterSpacing: -0.72,
    },
    h3: {
      fontSize: 20,
      lineHeight: 1.3,
      fontWeight: 500,
      letterSpacing: -0.6,
    },
    paragraph: {
      sm: {
        fontSize: 14,
        lineHeight: 1.5,
      },
      md: {
        fontSize: 16,
        lineHeight: 1.6,
      },
      lg: {
        fontSize: 18,
        lineHeight: 1.7,
      },
    },
  },
}

/**
 * Dark theme defaults.
 * Uses light text on dark backgrounds.
 * Colors mapped from docs/marwes-colors.json.
 */
export const darkThemeDefaults: Theme = {
  mode: ThemeMode.dark,

  color: {
    // Primary
    primary: "#5859FC",

    // Background & Surface
    background: "#0F0F0F",
    surface: "#1A1A1A",
    surfaceSubtle: "#050505",
    surfaceElevated: "#2B2B2B",
    surfaceDisabled: "#1A1A1A",
    surfaceInverted: "#FFFFFF",

    // Text
    text: "#F9FAFB",
    textMuted: "#A3A3A3",
    textSubtle: "#595959",
    textDisabled: "#595959",
    textInverted: "#141414",
    textBrand: "#8182FC",

    // Borders
    border: "#474747",
    borderSubtle: "#474747",
    borderStrong: "#A3A3A3",
    borderDisabled: "#474747",
    borderBrand: "#5859FC",

    // Focus
    focus: "#8182FC",

    // Semantic colors
    danger: "#FF002C",
    success: "#90CAAD",
    warning: "#FCC94A",
    status: {
      success: {
        background: "#001A0C",
        text: "#90CAAD",
        icon: "#5DB189",
        border: "#5DB189",
        borderStrong: "#006D48",
      },
      warning: {
        background: "#221004",
        text: "#FCC94A",
        icon: "#F9B21A",
        border: "#E46F00",
        borderStrong: "#B45308",
      },
      error: {
        background: "#240006",
        text: "#FF5566",
        icon: "#FF2847",
        border: "#FF2847",
        borderStrong: "#FF2847",
      },
      info: {
        background: "#040519",
        text: "#ABABFD",
        icon: "#8182FC",
        border: "#8182FC",
        borderStrong: "#252599",
      },
    },
  },

  font: {
    primary: "'Instrument Sans', Inter, system-ui, sans-serif",
    secondary: "Helvetica",
    mono: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
  },

  ui: {
    radius: 4,
    density: "comfortable",
  },

  breakpoint: defaultThemeBreakpoints,

  typography: {
    h1: {
      fontSize: 32,
      lineHeight: 1.1875,
      fontWeight: 700,
      letterSpacing: -0.96,
    },
    h2: {
      fontSize: 24,
      lineHeight: 1.25,
      fontWeight: 500,
      letterSpacing: -0.72,
    },
    h3: {
      fontSize: 20,
      lineHeight: 1.3,
      fontWeight: 500,
      letterSpacing: -0.6,
    },
    paragraph: {
      sm: {
        fontSize: 14,
        lineHeight: 1.5,
      },
      md: {
        fontSize: 16,
        lineHeight: 1.6,
      },
      lg: {
        fontSize: 18,
        lineHeight: 1.7,
      },
    },
  },
}
