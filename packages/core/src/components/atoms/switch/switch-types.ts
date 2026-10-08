/**
 * Core types for Switch.
 * - Core never renders; it returns a render kit consumed by adapters (React/Vue).
 */

export const SwitchSize = {
  compact: "compact",
  wide: "wide",
  rich: "rich",
} as const
export type SwitchSize = (typeof SwitchSize)[keyof typeof SwitchSize]

export interface SwitchOptions {
  size?: SwitchSize
  checked?: boolean
  disabled?: boolean
  /** Marks the switch as having an error via aria-invalid. */
  invalid?: boolean
  /** Required when no visible label text is provided */
  ariaLabel?: string
  label?: string
  ariaLabelledBy?: string
  ariaDescribedBy?: string
}

export interface SwitchA11yProps {
  role: "switch"
  ariaChecked: boolean
  ariaDisabled?: true
  ariaInvalid?: true
  ariaLabel?: string
  ariaLabelledBy?: string
  ariaDescribedBy?: string
}

export interface SwitchRenderKit {
  tag: "button"
  className: string
  vars: Record<string, string>
  a11y: SwitchA11yProps
}
