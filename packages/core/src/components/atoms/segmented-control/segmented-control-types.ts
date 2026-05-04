export const SegmentedControlVariant = {
  surface: "surface",
  contrast: "contrast",
} as const
export type SegmentedControlVariantName =
  (typeof SegmentedControlVariant)[keyof typeof SegmentedControlVariant]

export interface SegmentedControlOptions {
  variant?: SegmentedControlVariantName
  disabled?: boolean
  ariaLabel?: string
  ariaLabelledby?: string
  ariaDescribedBy?: string
}

export interface SegmentedControlItemOptions {
  selected?: boolean
  disabled?: boolean
  variant?: SegmentedControlVariantName
  ariaLabel?: string
}

export interface SegmentedControlA11yProps {
  role: "radiogroup"
  ariaLabel?: string
  ariaLabelledby?: string
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
  dataAttributes: Record<string, string>
}

export interface SegmentedControlItemRenderKit {
  tag: "button"
  className: string
  vars: Record<string, string>
  a11y: SegmentedControlItemA11yProps
  dataAttributes: Record<string, string>
}

export interface SegmentedControlItemState {
  value: string
  disabled?: boolean
}

export interface SegmentedControlA11yIds {
  groupId: string
  labelId?: string
  itemIds: Record<string, string>
}
