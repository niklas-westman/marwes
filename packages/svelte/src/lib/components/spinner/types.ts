import type { SpinnerOptions, SpinnerSize, SpinnerVariant } from "@marwes-ui/core"

export interface SpinnerProps extends SpinnerOptions {
  class?: string
  style?: string | undefined
  dataAttributes?: Record<string, string>
}

export interface ButtonSpinnerProps extends SpinnerProps {
  inverted?: boolean
}

export type EmptyStateSpinnerProps = SpinnerProps
