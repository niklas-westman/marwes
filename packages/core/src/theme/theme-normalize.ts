import { defaultTheme } from "./theme-defaults"
import type { Theme } from "./theme-types"

// For now this is intentionally minimal.
// Later we can generate derived values (hover/active/soft) and add dev warnings.
export function normalizeTheme(theme: Theme): Theme {
  return {
    mode: theme.mode ?? defaultTheme.mode,
    color: { ...defaultTheme.color, ...theme.color },
    font: { ...defaultTheme.font, ...theme.font },
    ui: { ...defaultTheme.ui, ...theme.ui },
    icon: { ...defaultTheme.icon, ...theme.icon },
    typography: {
      h1: { ...defaultTheme.typography.h1, ...theme.typography.h1 },
      h2: { ...defaultTheme.typography.h2, ...theme.typography.h2 },
      h3: { ...defaultTheme.typography.h3, ...theme.typography.h3 },
      paragraph: {
        sm: {
          ...defaultTheme.typography.paragraph.sm,
          ...theme.typography.paragraph?.sm,
        },
        md: {
          ...defaultTheme.typography.paragraph.md,
          ...theme.typography.paragraph?.md,
        },
        lg: {
          ...defaultTheme.typography.paragraph.lg,
          ...theme.typography.paragraph?.lg,
        },
      },
    },
  }
}
