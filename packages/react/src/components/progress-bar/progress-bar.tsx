import {
  type CssVars,
  type ProgressBarOptions,
  createProgressBarRecipe,
  toProgressBarHtmlAttributes,
} from "@marwes-ui/core"
import type * as React from "react"
import { useRenderKitDebug } from "../../hooks/use-renderkit-debug"
import { toReactAttributes } from "../../internal/react-attributes"

type StyleWithVars = React.CSSProperties & CssVars

export interface ProgressBarProps
  extends ProgressBarOptions,
    Omit<React.HTMLAttributes<HTMLDivElement>, "children"> {
  dataAttributes?: Record<string, string>
}

export function ProgressBar(props: ProgressBarProps): React.ReactElement {
  const {
    className,
    style,
    dataAttributes,
    id,
    label,
    value,
    min,
    max,
    size,
    state,
    disabled,
    showLabel,
    showPercentage,
    valueLabel,
    ariaLabel,
    ariaLabelledBy,
    ariaDescribedBy,
    ...nativeDivProps
  } = props

  const resolvedAriaLabel =
    ariaLabel ??
    (typeof nativeDivProps["aria-label"] === "string"
      ? (nativeDivProps["aria-label"] as string)
      : undefined)

  const kit = createProgressBarRecipe({
    ...(id !== undefined ? { id } : {}),
    ...(label !== undefined ? { label } : {}),
    ...(value !== undefined ? { value } : {}),
    ...(min !== undefined ? { min } : {}),
    ...(max !== undefined ? { max } : {}),
    ...(size !== undefined ? { size } : {}),
    ...(state !== undefined ? { state } : {}),
    ...(disabled !== undefined ? { disabled } : {}),
    ...(showLabel !== undefined ? { showLabel } : {}),
    ...(showPercentage !== undefined ? { showPercentage } : {}),
    ...(valueLabel !== undefined ? { valueLabel } : {}),
    ...(resolvedAriaLabel !== undefined ? { ariaLabel: resolvedAriaLabel } : {}),
    ...(ariaLabelledBy !== undefined ? { ariaLabelledBy } : {}),
    ...(ariaDescribedBy !== undefined ? { ariaDescribedBy } : {}),
  })

  useRenderKitDebug(kit, "ProgressBar")

  const mergedClassName = [kit.className, className].filter(Boolean).join(" ")
  const mergedStyle = { ...(kit.vars as StyleWithVars), ...style }
  const hasLabelRow = kit.showLabel || kit.showPercentage

  return (
    <div
      {...nativeDivProps}
      {...kit.dataAttributes}
      {...dataAttributes}
      {...toReactAttributes(toProgressBarHtmlAttributes(kit.a11y))}
      className={mergedClassName}
      style={mergedStyle}
    >
      {hasLabelRow ? (
        <div className="mw-progress-bar__label-row">
          {kit.showLabel ? (
            <span id={kit.labelId} className={kit.labelClassName}>
              {kit.label}
            </span>
          ) : null}
          {kit.showPercentage ? (
            <span className={kit.percentageClassName}>{kit.percentageLabel}</span>
          ) : null}
        </div>
      ) : null}

      <div className={kit.trackClassName} aria-hidden="true">
        <span className={kit.fillClassName} />
      </div>
    </div>
  )
}
