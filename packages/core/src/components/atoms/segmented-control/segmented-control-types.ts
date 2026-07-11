/**
 * Core types for SegmentedControl.
 * Uses radiogroup semantics — single-select between options without panels.
 */

export interface SegmentedControlItemState {
  value: string
  disabled?: boolean
}

export interface SegmentedControlOptions {
  /** Selected value */
  value?: string | undefined
  /** Whether the control is disabled */
  disabled?: boolean | undefined
  /** Accessible label for the group */
  ariaLabel?: string | undefined
  /** ID of an element whose text labels the group. Wins over `ariaLabel` if both are set. */
  ariaLabelledBy?: string | undefined
  /** ID(s) of elements that describe the group (helper text, errors). */
  ariaDescribedBy?: string | undefined
  label?: string | undefined
  /** Visual variant */
  variant?: SegmentedControlVariant | undefined
  /** Size variant */
  size?: SegmentedControlSize | undefined
  /** Stretch the control to fill its container. Defaults to inline width. */
  fullWidth?: boolean | undefined
}

export type SegmentedControlVariant = "default" | "inverse" | "pill"
export type SegmentedControlSize = "sm" | "md"

export interface SegmentedControlItemOptions {
  value: string
  selected?: boolean
  disabled?: boolean | undefined
  ariaLabel?: string | undefined
  label?: string | undefined
  iconOnly?: boolean | undefined
}

export interface SegmentedControlA11yProps {
  role: "radiogroup"
  ariaLabel?: string
  ariaLabelledBy?: string
  ariaDescribedBy?: string
  ariaDisabled?: true
}

export interface SegmentedControlItemA11yProps {
  role: "radio"
  ariaChecked: boolean
  ariaDisabled?: true
  ariaLabel?: string
  tabIndex: 0 | -1
}

export interface SegmentedControlRenderKit {
  tag: "div"
  className: string
  vars: Record<string, string>
  a11y: SegmentedControlA11yProps
}

export interface SegmentedControlItemRenderKit {
  tag: "button"
  className: string
  vars: Record<string, string>
  a11y: SegmentedControlItemA11yProps
}
