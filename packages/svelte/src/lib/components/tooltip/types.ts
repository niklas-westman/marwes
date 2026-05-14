import type { IconNameType, TooltipOptions } from "@marwes-ui/core"
import type { Snippet } from "svelte"

export interface TooltipProps extends TooltipOptions {
  children?: Snippet
  class?: string
  style?: string
  dataAttributes?: Record<string, string>
}

export interface TooltipGroupProps {
  content: Snippet | string
  icon?: IconNameType
  triggerLabel?: string
  open?: boolean
  defaultOpen?: boolean
  onopenchange?: (open: boolean) => void
  tooltipId?: string
  tooltipClass?: string
  triggerClass?: string
  dataAttributes?: Record<string, string>
  class?: string
  id?: string
}
