import type { TooltipA11yProps, TooltipOptions } from "./tooltip-types"

export function resolveTooltipA11y(options: TooltipOptions = {}): TooltipA11yProps {
  return {
    ...(options.id ? { id: options.id } : {}),
    role: "tooltip",
  }
}
