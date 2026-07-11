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
  ariaDescribedBy?: string
  fullWidth?: boolean
  label?: string
  class?: string
  id?: string
  style?: string
}

export interface SegmentedControlFieldProps<T extends string = string> {
  /** Optional: if omitted, a stable id is generated. */
  id?: string
  /** Field label (required for accessibility). */
  label: string
  /** Optional description text. */
  description?: string
  /** Optional error message. */
  error?: string
  /** Props forwarded to the SegmentedControl atom. */
  segmentedControl: Omit<
    SegmentedControlProps<T>,
    "ariaLabel" | "ariaLabelledBy" | "ariaDescribedBy"
  >
  /** Additional aria-describedby IDs to merge with internal description/error IDs. */
  ariaDescribedBy?: string
  class?: string
}
