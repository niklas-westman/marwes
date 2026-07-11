import type { ProgressBarOptions } from "@marwes-ui/core"

export interface ProgressBarProps extends ProgressBarOptions {
  class?: string
  style?: string | undefined
  dataAttributes?: Record<string, string>
}
