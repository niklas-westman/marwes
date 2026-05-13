export type TokenPointer = {
  selector: string
  varName: string
}

type BadgeVariant = "neutral" | "info" | "success" | "warning" | "error"
type ButtonSize = "xs" | "sm" | "md" | "lg"
type ButtonVariant = "primary" | "secondary" | "neutral" | "text" | "success"
type CheckboxSize = "sm" | "md" | "lg"
type DividerSize = "xxs" | "xs" | "sm" | "md" | "lg" | "xl" | "xxl"
type SkeletonVariant = "text" | "circular" | "rectangular"
type AvatarSize = "small" | "medium" | "large"
type AvatarType = "initials" | "icon" | "image"
type IconSize = "xs" | "sm" | "md" | "lg"
type IconColor = "currentColor" | "primary" | "secondary" | "muted"

export const firstEditionThemeVarPaths: Record<string, string> = {
  "--mw-ui-radius": "ui.radius",
  "--mw-font-primary": "font.primary",
  "--mw-color-surface": "color.surface",
  "--mw-color-surface-subtle": "color.surfaceSubtle",
  "--mw-color-surface-elevated": "color.surfaceElevated",
  "--mw-color-border": "color.border",
  "--mw-color-border-subtle": "color.borderSubtle",
  "--mw-color-text": "color.text",
  "--mw-color-text-muted": "color.textMuted",
  "--mw-color-text-inverted": "color.textInverted",
  "--mw-color-primary-base": "color.primary.base",
  "--mw-color-primary-hover": "color.primary.hover",
  "--mw-color-primary-pressed": "color.primary.pressed",
  "--mw-color-primary-disabled": "color.primary.disabled",
  "--mw-color-primary-label": "color.primary.label",
  "--mw-color-primary-label-disabled": "color.primary.labelDisabled",
  "--mw-color-secondary-base": "color.secondary.base",
  "--mw-color-secondary-hover": "color.secondary.hover",
  "--mw-color-secondary-pressed": "color.secondary.pressed",
  "--mw-color-secondary-disabled": "color.secondary.disabled",
  "--mw-color-secondary-label": "color.secondary.label",
  "--mw-color-secondary-border": "color.secondary.border",
  "--mw-color-danger-base": "color.danger.base",
  "--mw-color-danger-label": "color.danger.label",
  "--mw-color-success-base": "color.success.base",
  "--mw-color-success-label": "color.success.label",
  "--mw-color-status-info-background": "color.status.info.background",
  "--mw-color-status-info-border": "color.status.info.border",
  "--mw-color-status-info-text": "color.status.info.text",
  "--mw-color-status-success-background": "color.status.success.background",
  "--mw-color-status-success-border": "color.status.success.border",
  "--mw-color-status-success-text": "color.status.success.text",
  "--mw-color-status-warning-background": "color.status.warning.background",
  "--mw-color-status-warning-border": "color.status.warning.border",
  "--mw-color-status-warning-text": "color.status.warning.text",
  "--mw-color-status-error-background": "color.status.error.background",
  "--mw-color-status-error-border": "color.status.error.border",
  "--mw-color-status-error-text": "color.status.error.text",
}

export const badgeTokens = {
  sourceCss: "packages/presets/src/firstEdition/badge.css",
  base: {
    radius: { selector: ".mw-badge", varName: "--mw-badge-radius" },
    paddingX: { selector: ".mw-badge", varName: "--mw-badge-padding-x" },
    paddingY: { selector: ".mw-badge", varName: "--mw-badge-padding-y" },
    gap: { selector: ".mw-badge", varName: "--mw-badge-gap" },
    fontFamily: { selector: ".mw-badge", varName: "--mw-badge-font-family" },
    fontSize: { selector: ".mw-badge", varName: "--mw-badge-font-size" },
    fontWeight: { selector: ".mw-badge", varName: "--mw-badge-font-weight" },
    lineHeight: { selector: ".mw-badge", varName: "--mw-badge-line-height" },
  } satisfies Record<string, TokenPointer>,
  tones: {
    neutral: {
      surface: { selector: ".mw-badge--neutral", varName: "--mw-badge-surface" },
      border: { selector: ".mw-badge--neutral", varName: "--mw-badge-border" },
      label: { selector: ".mw-badge--neutral", varName: "--mw-badge-label" },
    },
    info: {
      surface: { selector: ".mw-badge--info", varName: "--mw-badge-surface" },
      border: { selector: ".mw-badge--info", varName: "--mw-badge-border" },
      label: { selector: ".mw-badge--info", varName: "--mw-badge-label" },
    },
    success: {
      surface: { selector: ".mw-badge--success", varName: "--mw-badge-surface" },
      border: { selector: ".mw-badge--success", varName: "--mw-badge-border" },
      label: { selector: ".mw-badge--success", varName: "--mw-badge-label" },
    },
    warning: {
      surface: { selector: ".mw-badge--warning", varName: "--mw-badge-surface" },
      border: { selector: ".mw-badge--warning", varName: "--mw-badge-border" },
      label: { selector: ".mw-badge--warning", varName: "--mw-badge-label" },
    },
    error: {
      surface: { selector: ".mw-badge--error", varName: "--mw-badge-surface" },
      border: { selector: ".mw-badge--error", varName: "--mw-badge-border" },
      label: { selector: ".mw-badge--error", varName: "--mw-badge-label" },
    },
  } satisfies Record<BadgeVariant, Record<string, TokenPointer>>,
}

export const checkboxTokens = {
  sourceCss: "packages/presets/src/firstEdition/checkbox.css",
  sizes: {
    sm: { size: { selector: ".mw-checkbox--sm", varName: "--mw-checkbox-size" } },
    md: { size: { selector: ".mw-checkbox--md", varName: "--mw-checkbox-size" } },
    lg: { size: { selector: ".mw-checkbox--lg", varName: "--mw-checkbox-size" } },
  } satisfies Record<CheckboxSize, Record<string, TokenPointer>>,
  box: {
    radius: { selector: ".mw-checkbox", varName: "--mw-checkbox-radius" },
    radiusMultiplier: { selector: ".mw-checkbox", varName: "--mw-checkbox-radius-multiplier" },
    border: { selector: ".mw-checkbox", varName: "--mw-checkbox-border" },
    background: { selector: ".mw-checkbox", varName: "--mw-checkbox-bg" },
    checkedBackground: { selector: ".mw-checkbox", varName: "--mw-checkbox-checked-bg" },
    check: { selector: ".mw-checkbox", varName: "--mw-checkbox-check" },
    disabledOpacity: { selector: ".mw-checkbox", varName: "--mw-checkbox-disabled-opacity" },
    invalidBorder: { selector: ".mw-checkbox", varName: "--mw-checkbox-invalid-border" },
  } satisfies Record<string, TokenPointer>,
}

export const dividerTokens = {
  sourceCss: "packages/presets/src/firstEdition/divider.css",
  base: {
    color: { selector: ".mw-divider", varName: "--mw-divider-native-color" },
    lineThickness: { selector: ".mw-divider", varName: "--mw-divider-line-thickness" },
  } satisfies Record<string, TokenPointer>,
  sizes: {
    xxs: { spacing: { selector: ".mw-divider--xxs", varName: "--mw-divider-spacing" } },
    xs: { spacing: { selector: ".mw-divider--xs", varName: "--mw-divider-spacing" } },
    sm: { spacing: { selector: ".mw-divider--sm", varName: "--mw-divider-spacing" } },
    md: { spacing: { selector: ".mw-divider--md", varName: "--mw-divider-spacing" } },
    lg: { spacing: { selector: ".mw-divider--lg", varName: "--mw-divider-spacing" } },
    xl: { spacing: { selector: ".mw-divider--xl", varName: "--mw-divider-spacing" } },
    xxl: { spacing: { selector: ".mw-divider--xxl", varName: "--mw-divider-spacing" } },
  } satisfies Record<DividerSize, Record<string, TokenPointer>>,
}

export const buttonTokens = {
  sourceCss: "packages/presets/src/firstEdition/button.css",
  base: {
    gap: { selector: ".mw-btn", varName: "--mw-btn-gap" },
    radius: { selector: ".mw-btn", varName: "--mw-btn-radius" },
    fontFamily: { selector: ".mw-btn", varName: "--mw-btn-font-family" },
    fontWeight: { selector: ".mw-btn", varName: "--mw-btn-font-weight" },
    disabledOpacityLight: { selector: ".mw-btn", varName: "--mw-btn-disabled-opacity-light" },
    disabledOpacityDark: { selector: ".mw-btn", varName: "--mw-btn-disabled-opacity-dark" },
  } satisfies Record<string, TokenPointer>,
  sizes: {
    xs: {
      height: { selector: ".mw-btn--xs", varName: "--mw-btn-height" },
      paddingX: { selector: ".mw-btn--xs", varName: "--mw-btn-padding-x" },
      paddingY: { selector: ".mw-btn--xs", varName: "--mw-btn-padding-y" },
      fontSize: { selector: ".mw-btn--xs", varName: "--mw-btn-font-size" },
    },
    sm: {
      height: { selector: ".mw-btn--sm", varName: "--mw-btn-height" },
      paddingX: { selector: ".mw-btn--sm", varName: "--mw-btn-padding-x" },
      paddingY: { selector: ".mw-btn--sm", varName: "--mw-btn-padding-y" },
      fontSize: { selector: ".mw-btn--sm", varName: "--mw-btn-font-size" },
    },
    md: {
      height: { selector: ".mw-btn--md", varName: "--mw-btn-height" },
      paddingX: { selector: ".mw-btn--md", varName: "--mw-btn-padding-x" },
      paddingY: { selector: ".mw-btn--md", varName: "--mw-btn-padding-y" },
      fontSize: { selector: ".mw-btn--md", varName: "--mw-btn-font-size" },
    },
    lg: {
      height: { selector: ".mw-btn--lg", varName: "--mw-btn-height" },
      paddingX: { selector: ".mw-btn--lg", varName: "--mw-btn-padding-x" },
      paddingY: { selector: ".mw-btn--lg", varName: "--mw-btn-padding-y" },
      fontSize: { selector: ".mw-btn--lg", varName: "--mw-btn-font-size" },
    },
  } satisfies Record<ButtonSize, Record<string, TokenPointer>>,
  variants: {
    primary: {
      surface: { selector: ".mw-btn--primary", varName: "--mw-btn-surface" },
      label: { selector: ".mw-btn--primary", varName: "--mw-btn-label" },
      border: { selector: ".mw-btn--primary", varName: "--mw-btn-border" },
      pressedOpacity: { selector: ".mw-btn--primary", varName: "--mw-btn-pressed-opacity" },
    },
    secondary: {
      surface: { selector: ".mw-btn--secondary", varName: "--mw-btn-surface" },
      label: { selector: ".mw-btn--secondary", varName: "--mw-btn-label" },
      border: { selector: ".mw-btn--secondary", varName: "--mw-btn-border" },
      pressedSurface: { selector: ".mw-btn--secondary", varName: "--mw-btn-pressed-surface" },
    },
    neutral: {
      surface: { selector: ".mw-btn--neutral", varName: "--mw-btn-surface" },
      label: { selector: ".mw-btn--neutral", varName: "--mw-btn-label" },
      border: { selector: ".mw-btn--neutral", varName: "--mw-btn-border" },
      pressedSurface: { selector: ".mw-btn--neutral", varName: "--mw-btn-pressed-surface" },
    },
    text: {
      surface: { selector: ".mw-btn.mw-btn--text", varName: "--mw-btn-surface" },
      label: { selector: ".mw-btn.mw-btn--text", varName: "--mw-btn-label" },
      border: { selector: ".mw-btn.mw-btn--text", varName: "--mw-btn-border" },
      pressedSurface: { selector: ".mw-btn.mw-btn--text", varName: "--mw-btn-pressed-surface" },
    },
    success: {
      surface: { selector: ".mw-btn--success", varName: "--mw-btn-surface" },
      label: { selector: ".mw-btn--success", varName: "--mw-btn-label" },
      border: { selector: ".mw-btn--success", varName: "--mw-btn-border" },
      pressedOpacity: { selector: ".mw-btn--success", varName: "--mw-btn-pressed-opacity" },
    },
  } satisfies Record<ButtonVariant, Record<string, TokenPointer>>,
}

export const spinnerTokens = {
  sourceCss: "packages/presets/src/firstEdition/spinner.css",
  base: {
    size: { selector: ".mw-spinner", varName: "--mw-spinner-size" },
  } satisfies Record<string, TokenPointer>,
  colors: {
    track: { selector: ".mw-spinner", varName: "--mw-spinner-track-color" },
    indicator: { selector: ".mw-spinner", varName: "--mw-spinner-indicator-color" },
  } satisfies Record<string, TokenPointer>,
  motion: {
    rotationDurationMs: { selector: ".mw-spinner", varName: "--mw-spinner-rotation-duration" },
  } satisfies Record<string, TokenPointer>,
}

export const skeletonTokens = {
  sourceCss: "packages/presets/src/firstEdition/skeleton.css",
  base: {
    baseColor: { selector: ".mw-skeleton", varName: "--mw-skeleton-native-base-color" },
    highlightColor: { selector: ".mw-skeleton", varName: "--mw-skeleton-native-highlight-color" },
    radius: { selector: ".mw-skeleton", varName: "--mw-skeleton-radius-default" },
    circularRadius: { selector: ".mw-skeleton", varName: "--mw-skeleton-radius-circular" },
    pulseDurationMs: { selector: ".mw-skeleton", varName: "--mw-skeleton-pulse-duration" },
    waveDurationMs: { selector: ".mw-skeleton", varName: "--mw-skeleton-wave-duration" },
    pulseMinOpacity: { selector: ".mw-skeleton", varName: "--mw-skeleton-pulse-min-opacity" },
  } satisfies Record<string, TokenPointer>,
  variants: {
    text: {
      width: { selector: ".mw-skeleton", varName: "--mw-skeleton-text-width" },
      height: { selector: ".mw-skeleton", varName: "--mw-skeleton-text-height" },
    },
    circular: {
      width: { selector: ".mw-skeleton", varName: "--mw-skeleton-circular-size" },
      height: { selector: ".mw-skeleton", varName: "--mw-skeleton-circular-size" },
    },
    rectangular: {
      width: { selector: ".mw-skeleton", varName: "--mw-skeleton-rectangular-size" },
      height: { selector: ".mw-skeleton", varName: "--mw-skeleton-rectangular-size" },
    },
  } satisfies Record<SkeletonVariant, Record<string, TokenPointer>>,
}

export const avatarTokens = {
  sourceCss: "packages/presets/src/firstEdition/avatar.css",
  base: {
    fontFamily: { selector: ".mw-avatar", varName: "--mw-avatar-font-family" },
    fontWeight: { selector: ".mw-avatar", varName: "--mw-avatar-font-weight" },
    radius: { selector: ".mw-avatar", varName: "--mw-avatar-radius" },
  } satisfies Record<string, TokenPointer>,
  sizes: {
    small: {
      size: { selector: ".mw-avatar--small", varName: "--mw-avatar-size" },
      fontSize: { selector: ".mw-avatar--small", varName: "--mw-avatar-font-size" },
      lineHeight: { selector: ".mw-avatar--small", varName: "--mw-avatar-line-height" },
      letterSpacing: { selector: ".mw-avatar--small", varName: "--mw-avatar-letter-spacing" },
      iconSize: { selector: ".mw-avatar--small", varName: "--mw-avatar-icon-size" },
    },
    medium: {
      size: { selector: ".mw-avatar--medium", varName: "--mw-avatar-size" },
      fontSize: { selector: ".mw-avatar--medium", varName: "--mw-avatar-font-size" },
      lineHeight: { selector: ".mw-avatar--medium", varName: "--mw-avatar-line-height" },
      letterSpacing: { selector: ".mw-avatar--medium", varName: "--mw-avatar-letter-spacing" },
      iconSize: { selector: ".mw-avatar--medium", varName: "--mw-avatar-icon-size" },
    },
    large: {
      size: { selector: ".mw-avatar--large", varName: "--mw-avatar-size" },
      fontSize: { selector: ".mw-avatar--large", varName: "--mw-avatar-font-size" },
      lineHeight: { selector: ".mw-avatar--large", varName: "--mw-avatar-line-height" },
      letterSpacing: { selector: ".mw-avatar--large", varName: "--mw-avatar-letter-spacing" },
      iconSize: { selector: ".mw-avatar--large", varName: "--mw-avatar-icon-size" },
    },
  } satisfies Record<AvatarSize, Record<string, TokenPointer>>,
  types: {
    initials: {
      surface: { selector: ".mw-avatar", varName: "--mw-avatar-surface" },
      borderWidth: { selector: ".mw-avatar", varName: "--mw-avatar-border-width" },
      borderColor: { selector: ".mw-avatar", varName: "--mw-avatar-border-color" },
      label: { selector: ".mw-avatar", varName: "--mw-avatar-label" },
    },
    icon: {
      surface: { selector: ".mw-avatar--icon", varName: "--mw-avatar-surface" },
      borderWidth: { selector: ".mw-avatar--icon", varName: "--mw-avatar-border-width" },
      borderColor: { selector: ".mw-avatar--icon", varName: "--mw-avatar-border-color" },
      label: { selector: ".mw-avatar--icon", varName: "--mw-avatar-label" },
    },
    image: {
      surface: { selector: ".mw-avatar--image", varName: "--mw-avatar-surface" },
      borderWidth: { selector: ".mw-avatar--image", varName: "--mw-avatar-border-width" },
      borderColor: { selector: ".mw-avatar--image", varName: "--mw-avatar-border-color" },
      label: { selector: ".mw-avatar", varName: "--mw-avatar-label" },
    },
  } satisfies Record<AvatarType, Record<string, TokenPointer>>,
}

export const iconTokens = {
  sourceCss: "packages/presets/src/firstEdition/icon.css",
  base: {
    strokeWidth: { selector: ".mw-icon", varName: "--mw-icon-stroke-width" },
  } satisfies Record<string, TokenPointer>,
  sizes: {
    xs: { size: { selector: ".mw-icon--xs", varName: "--mw-icon-size" } },
    sm: { size: { selector: ".mw-icon--sm", varName: "--mw-icon-size" } },
    md: { size: { selector: ".mw-icon--md", varName: "--mw-icon-size" } },
    lg: { size: { selector: ".mw-icon--lg", varName: "--mw-icon-size" } },
  } satisfies Record<IconSize, Record<string, TokenPointer>>,
  colors: {
    currentColor: { color: { selector: ".mw-icon--currentColor", varName: "--mw-icon-color" } },
    primary: { color: { selector: ".mw-icon--primary", varName: "--mw-icon-color" } },
    secondary: { color: { selector: ".mw-icon--secondary", varName: "--mw-icon-color" } },
    muted: { color: { selector: ".mw-icon--muted", varName: "--mw-icon-color" } },
  } satisfies Record<IconColor, Record<string, TokenPointer>>,
}
