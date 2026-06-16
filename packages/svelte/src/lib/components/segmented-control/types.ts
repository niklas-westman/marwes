import type { SegmentedControlSize, SegmentedControlVariant } from "@marwes-ui/core"
import type { Snippet } from "svelte"

export interface SegmentedControlItem<T extends string = string> {
  value: T
  label?: string
  icon?: Snippet
  disabled?: boolean
  ariaLabel?: string
}

export interface SegmentedControlProps<T extends string = string> {
  items: SegmentedControlItem<T>[]
  value?: T
  defaultValue?: T
  onvaluechange?: (value: T) => void
  variant?: SegmentedControlVariant
  size?: SegmentedControlSize
  disabled?: boolean
  ariaLabel?: string
  ariaLabelledBy?: string
  fullWidth?: boolean
  label?: string
  class?: string
  id?: string
  style?: string
}
