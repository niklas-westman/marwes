import { type CssVars, type TooltipOptions, createTooltipRecipe } from "@marwes-ui/core"
import type * as React from "react"

type StyleWithVars = React.CSSProperties & CssVars

export interface TooltipProps
  extends TooltipOptions,
    Omit<React.HTMLAttributes<HTMLSpanElement>, "children"> {
  children: React.ReactNode
  dataAttributes?: Record<string, string>
}

export function Tooltip(props: TooltipProps): React.ReactElement {
  const { children, className, style, dataAttributes, id, ...nativeSpanProps } = props
  const tooltipOptions: TooltipOptions = {}

  if (id !== undefined) {
    tooltipOptions.id = id
  }

  const kit = createTooltipRecipe(tooltipOptions)
  const mergedClassName = [kit.className, className].filter(Boolean).join(" ")
  const mergedStyle = { ...(kit.vars as StyleWithVars), ...style }

  return (
    <span
      {...nativeSpanProps}
      {...kit.dataAttributes}
      {...dataAttributes}
      id={kit.a11y.id}
      className={mergedClassName}
      style={mergedStyle}
      role={kit.a11y.role}
    >
      {children}
    </span>
  )
}
