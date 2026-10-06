import type {
  TooltipA11yProps,
  TooltipGroupContentA11yProps,
  TooltipOptions,
  TooltipTriggerA11yProps,
} from "./tooltip-types"

export function resolveTooltipA11y(options: TooltipOptions = {}): TooltipA11yProps {
  return {
    ...(options.id ? { id: options.id } : {}),
    role: "tooltip",
  }
}

export const DEFAULT_TOOLTIP_TRIGGER_LABEL = "Show tooltip"

export function resolveTooltipGroupA11y(args: {
  tooltipId: string
  open: boolean
  triggerLabel?: string | undefined
}): { trigger: TooltipTriggerA11yProps; content: TooltipGroupContentA11yProps } {
  const trigger: TooltipTriggerA11yProps = {
    ariaLabel: args.triggerLabel ?? DEFAULT_TOOLTIP_TRIGGER_LABEL,
  }
  if (args.open) trigger.ariaDescribedBy = args.tooltipId

  return { trigger, content: args.open ? {} : { ariaHidden: true } }
}
