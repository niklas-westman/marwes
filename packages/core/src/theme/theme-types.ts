export type Density = "compact" | "comfortable" | "spacious"
export type UiVariant = "solid" | "soft" | "outline" | "ghost"
export type IconStrokeWidth = "xs" | "sm" | "md" | "lg"
export type IconSize = "xs" | "sm" | "md" | "lg"
export type HeadingSize = "h1" | "h2" | "h3"
export type ParagraphSize = "sm" | "md" | "lg"

/**
 * Theme mode determines which default color palette is used.
 * - 'light': Uses light mode color defaults (dark text on light backgrounds)
 * - 'dark': Uses dark mode color defaults (light text on dark backgrounds)
 */
export type ThemeMode = "light" | "dark"

export type Theme = {
  /**
   * The current theme mode. This determines which color defaults are applied.
   * Changing the mode will swap color values (e.g., surface ↔ surfaceInverted).
   */
  mode: ThemeMode

  color: {
    // Primary colors
    primary: string
    onPrimary: string

    // Secondary colors
    secondary: string
    onSecondary: string

    // Background & Surface
    background: string
    surface: string
    surfaceInverted: string

    // Text
    text: string
    textMuted: string
    textInverted: string

    // Borders
    border: string
    borderSubtle: string

    /**
     * Focus color used for focus-visible outlines on interactive elements.
     * Accessible blue (#2684FF) from Figma node 120:927.
     */
    focus: string

    // Semantic colors
    danger: string
    onDanger: string

    success: string
    onSuccess: string

    warning: string
    onWarning: string
  }
  font: {
    primary: string
    secondary: string
    mono: string
  }
  ui: {
    radius: number
    density: Density
    variant: UiVariant
  }
  icon: {
    size: IconSize
    strokeWidth: IconStrokeWidth
  }
  typography: {
    h1: {
      fontSize: number
      lineHeight: number
      fontWeight: number
      letterSpacing: number
    }
    h2: {
      fontSize: number
      lineHeight: number
      fontWeight: number
      letterSpacing: number
    }
    h3: {
      fontSize: number
      lineHeight: number
      fontWeight: number
      letterSpacing: number
    }
    paragraph: {
      sm: {
        fontSize: number
        lineHeight: number
      }
      md: {
        fontSize: number
        lineHeight: number
      }
      lg: {
        fontSize: number
        lineHeight: number
      }
    }
  }
}

export type ThemeOverrides = {
  mode?: ThemeMode
  color?: Partial<Theme["color"]>
  font?: Partial<Theme["font"]>
  ui?: Partial<Theme["ui"]>
  icon?: Partial<Theme["icon"]>
  typography?: Partial<{
    h1?: Partial<Theme["typography"]["h1"]>
    h2?: Partial<Theme["typography"]["h2"]>
    h3?: Partial<Theme["typography"]["h3"]>
    paragraph?: Partial<{
      sm?: Partial<Theme["typography"]["paragraph"]["sm"]>
      md?: Partial<Theme["typography"]["paragraph"]["md"]>
      lg?: Partial<Theme["typography"]["paragraph"]["lg"]>
    }>
  }>
}

export type Preset = {
  name: string
  theme?: ThemeOverrides
}

export type System = {
  theme: Theme
  preset: Preset
}
