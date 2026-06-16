import type { SegmentedControlSize, SegmentedControlVariant } from "@marwes-ui/core"
import type { Snippet } from "svelte"

export interface SegmentedControlItem {
  value: string
  label?: string
  icon?: Snippet
  disabled?: boolean
  ariaLabel?: string
}

export interface SegmentedControlProps {
  items: SegmentedControlItem[]
  value?: string
  defaultValue?: string
  onvaluechange?: (value: string) => void
  variant?: SegmentedControlVariant
  size?: SegmentedControlSize
  disabled?: boolean
  ariaLabel?: string
  ariaLabelledBy?: string
  label?: string
  class?: string
  id?: string
  style?: string
}
