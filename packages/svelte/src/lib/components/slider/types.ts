import type { SliderOptions } from "@marwes-ui/core"

export interface SliderProps extends Omit<SliderOptions, "ariaDescribedBy"> {
  value?: number
  oninput?: (e: Event & { currentTarget: HTMLInputElement }) => void
  onvaluechange?: (value: number) => void
  class?: string
  style?: string | undefined
  ariaDescribedBy?: string | undefined
  ariaInvalid?: boolean
}

export interface SliderFieldProps {
  id?: string
  label: string
  description?: string
  helperText?: string
  error?: string
  slider?: Omit<SliderProps, "value">
  ariaDescribedBy?: string
  minValueLabel?: string
  maxValueLabel?: string
  labelPosition?: "top" | "inline"
  showEdgeValues?: boolean
  dataAttributes?: Record<string, string>
  value?: number
  class?: string
}
