import type { Theme, ThemeOverrides } from "./theme-types";

export function mergeTheme(
  base: Theme,
  preset?: ThemeOverrides,
  overrides?: ThemeOverrides,
): Theme {
  return {
    mode: base.mode,
    color: {
      ...base.color,
      ...(preset?.color ?? {}),
      ...(overrides?.color ?? {}),
    },
    font: {
      ...base.font,
      ...(preset?.font ?? {}),
      ...(overrides?.font ?? {}),
    },
    ui: {
      ...base.ui,
      ...(preset?.ui ?? {}),
      ...(overrides?.ui ?? {}),
    },
    icon: {
      ...base.icon,
      ...(preset?.icon ?? {}),
      ...(overrides?.icon ?? {}),
    },
    typography: {
      h1: {
        ...base.typography.h1,
        ...(preset?.typography?.h1 ?? {}),
        ...(overrides?.typography?.h1 ?? {}),
      },
      h2: {
        ...base.typography.h2,
        ...(preset?.typography?.h2 ?? {}),
        ...(overrides?.typography?.h2 ?? {}),
      },
      h3: {
        ...base.typography.h3,
        ...(preset?.typography?.h3 ?? {}),
        ...(overrides?.typography?.h3 ?? {}),
      },
      paragraph: {
        sm: {
          ...base.typography.paragraph.sm,
          ...(preset?.typography?.paragraph?.sm ?? {}),
          ...(overrides?.typography?.paragraph?.sm ?? {}),
        },
        md: {
          ...base.typography.paragraph.md,
          ...(preset?.typography?.paragraph?.md ?? {}),
          ...(overrides?.typography?.paragraph?.md ?? {}),
        },
        lg: {
          ...base.typography.paragraph.lg,
          ...(preset?.typography?.paragraph?.lg ?? {}),
          ...(overrides?.typography?.paragraph?.lg ?? {}),
        },
      },
    },
  };
}
