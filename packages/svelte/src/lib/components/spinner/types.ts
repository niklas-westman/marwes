import type { SpinnerOptions, SpinnerSize, SpinnerVariant } from "@marwes-ui/core"

export interface SpinnerProps extends SpinnerOptions {
  class?: string
  style?: string | undefined
}

export interface ButtonSpinnerProps extends SpinnerProps {
  inverted?: boolean
}
