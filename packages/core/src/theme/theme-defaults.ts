import type { Theme } from "./theme-types"

/**
 * Light theme defaults (default mode).
 * Uses dark text on light backgrounds.
 * Colors mapped from Figma design tokens (node 1:120).
 */
export const lightThemeDefaults: Theme = {
  mode: "light",

  color: {
    // Primary (from Figma: Colours/Primary/Rich Black)
    primary: "#141414",

    // Background & Surface (from Figma: Neutrals)
    background: "#FFFFFF",
    surface: "#F9FAFB",
    surfaceSubtle: "#F3F4F6",
    surfaceElevated: "#FFFFFF",
    surfaceDisabled: "#F3F4F6",
    surfaceInverted: "#141414",

    // Text (from Figma: Colours/Text)
    text: "#141414",
    textMuted: "#9CA3AF",
    textSubtle: "#9CA3AF",
    textDisabled: "rgba(20,20,20,0.4)",
    textInverted: "#F9FAFB",

    // Borders (from Figma: Colours/Border and Neutrals)
    border: "rgba(0,0,0,0.4)",
    borderSubtle: "#00000033",
    borderStrong: "#141414",
    borderDisabled: "rgba(20,20,20,0.16)",

    // Focus color (from Figma: node 120:927 - Accessible blue)
    focus: "#2684FF",

    // Semantic colors
    danger: "#D90429",
    success: "#006633",
    warning: "#FFB703",
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
  typography: {
    h1: {
      fontSize: 44,
      lineHeight: 1.18,
      fontWeight: 700,
      letterSpacing: -1.32,
    },
    h2: {
      fontSize: 32,
      lineHeight: 1.25,
      fontWeight: 700,
      letterSpacing: -0.96,
    },
    h3: {
      fontSize: 24,
      lineHeight: 1.3,
      fontWeight: 600,
      letterSpacing: -0.48,
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
 * Colors are inverted from light theme for optimal dark mode experience.
 */
export const darkThemeDefaults: Theme = {
  mode: "dark",

  color: {
    // Primary — white for dark mode
    primary: "#FFFFFF",

    // Background & Surface - Inverted
    background: "#141414",
    surface: "#141414",
    surfaceSubtle: "#111827",
    surfaceElevated: "#1F2937",
    surfaceDisabled: "#3E3E3E",
    surfaceInverted: "#F9FAFB",

    // Text - Inverted
    text: "#F9FAFB",
    textMuted: "#9CA3AF",
    textSubtle: "#6B7280",
    textDisabled: "rgba(249,250,251,0.4)",
    textInverted: "#141414",

    // Borders - Adjusted for dark mode
    border: "#d9d9d9",
    borderSubtle: "#d4d4d433",
    borderStrong: "#F9FAFB",
    borderDisabled: "rgba(255,255,255,0.16)",

    // Focus color - Same accessible blue works in both modes
    focus: "#2684FF",

    // Semantic colors
    danger: "#D90429",
    success: "#006633",
    warning: "#FFB703",
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

  typography: {
    h1: {
      fontSize: 44,
      lineHeight: 1.18,
      fontWeight: 700,
      letterSpacing: -1.32,
    },
    h2: {
      fontSize: 32,
      lineHeight: 1.25,
      fontWeight: 700,
      letterSpacing: -0.96,
    },
    h3: {
      fontSize: 24,
      lineHeight: 1.3,
      fontWeight: 600,
      letterSpacing: -0.48,
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
