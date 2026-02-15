import type { Theme } from "./theme-types"

/**
 * Light theme defaults (default mode).
 * Uses dark text on light backgrounds.
 * Colors mapped from Figma design tokens (node 1:120).
 */
export const lightThemeDefaults: Theme = {
  mode: "light",

  color: {
    // Primary colors (from Figma: Colours/Primary/Rich Black)
    primary: "#141414",
    onPrimary: "#F9FAFB", // Text on primary (from Figma: Colours/Text/Default-inverted)

    // Secondary colors (from Figma: Neutrals/Soft white)
    secondary: "#F9FAFB",
    onSecondary: "#141414", // Text on secondary (from Figma: Colours/Text/Default)

    // Background & Surface (from Figma: Neutrals)
    background: "#FFFFFF", // Default white
    surface: "#F9FAFB", // Updated from #F7F7F8 to match Figma Soft white
    surfaceInverted: "#141414", // From Figma: Colours/Surface/Surface - Inverted

    // Text (from Figma: Colours/Text)
    text: "#141414", // Default
    textMuted: "#9CA3AF", // Updated from #5B5B5F to match Figma Medium grey
    textInverted: "#F9FAFB", // Default-inverted

    // Borders (from Figma: Colours/Border and Neutrals)
    border: "rgba(0,0,0,0.4)", // Updated from #D9D9DE to match Figma Light grey
    borderSubtle: "#00000033", // From Figma: Border Low (20% black opacity)

    // Focus color (from Figma: node 120:927 - Accessible blue)
    focus: "#2684FF",

    // Semantic colors
    danger: "#D90429", // Updated from #D92D20 to match Figma Error (Coral Red)
    onDanger: "#FFFFFF", // Text on danger backgrounds

    success: "#006633", // Updated from #067647 to match Figma Success (Field Green)
    onSuccess: "#FFFFFF", // Text on success backgrounds

    warning: "#FFB703", // Updated from #B54708 to match Figma Warning (Amber Yellow)
    onWarning: "#141414", // Text on warning backgrounds (dark text for contrast)
  },
  font: {
    primary: "'Instrument Sans', Inter, system-ui, sans-serif",
    secondary: "Helvetica",
    mono: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
  },
  ui: {
    radius: 4,
    density: "comfortable",
    variant: "solid",
  },
  icon: {
    size: "sm",
    strokeWidth: "md",
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
    // Primary colors - White for dark mode buttons
    primary: "#FFFFFF",
    onPrimary: "#141414", // Dark text on white primary

    // Secondary colors
    secondary: "#141414",
    onSecondary: "#F9FAFB", // Light text on dark secondary

    // Background & Surface - Inverted
    background: "#141414", // Dark background
    surface: "#141414", // Dark surface (inverted from light)
    surfaceInverted: "#F9FAFB", // Light surface (inverted from dark)

    // Text - Inverted
    text: "#F9FAFB", // Light text
    textMuted: "#9CA3AF", // Same medium grey works in both modes
    textInverted: "#141414", // Dark text (inverted)

    // Borders - Adjusted for dark mode
    border: "#d9d9d9", // Dark grey for visible borders on dark backgrounds
    borderSubtle: "#d4d4d433", // White 20% opacity for subtle borders

    // Focus color - Same accessible blue works in both modes
    focus: "#2684FF",

    // Semantic colors - Same values work on dark backgrounds
    danger: "#D90429", // Coral Red
    onDanger: "#FFFFFF",

    success: "#006633", // Field Green
    onSuccess: "#FFFFFF",

    warning: "#FFB703", // Amber Yellow
    onWarning: "#141414",
  },

  font: {
    primary: "'Instrument Sans', Inter, system-ui, sans-serif",
    secondary: "Helvetica",
    mono: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
  },

  ui: {
    radius: 4,
    density: "comfortable",
    variant: "solid",
  },

  icon: {
    size: "sm",
    strokeWidth: "md",
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
 * Default theme (alias for light theme).
 * Maintained for backward compatibility.
 */
export const defaultTheme = lightThemeDefaults
