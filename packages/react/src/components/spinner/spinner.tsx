import {
  type CssVars,
  type SpinnerOptions,
  type SpinnerSvgNode,
  createSpinnerRecipe,
} from "@marwes-ui/core"
import type * as React from "react"

type StyleWithVars = React.CSSProperties & CssVars

export interface SpinnerProps
  extends SpinnerOptions,
    Omit<React.HTMLAttributes<HTMLSpanElement>, "children"> {
  dataAttributes?: Record<string, string>
}

function renderSpinnerSvgNode(
  spinnerSvgNode: SpinnerSvgNode,
  nodeIndex: number,
): React.ReactElement {
  const TagName = spinnerSvgNode.tag

  return <TagName key={nodeIndex} {...(spinnerSvgNode.attrs as React.SVGAttributes<SVGElement>)} />
}

export function Spinner(props: SpinnerProps): React.ReactElement {
  const {
    className,
    style,
    dataAttributes,
    variant,
    size,
    decorative,
    ariaLabel,
    id,
    ...nativeSpanProps
  } = props

  const resolvedAriaLabel =
    ariaLabel ??
    (typeof nativeSpanProps["aria-label"] === "string"
      ? (nativeSpanProps["aria-label"] as string)
      : undefined)

  const spinnerOptions: SpinnerOptions = {
    ...(variant !== undefined ? { variant } : {}),
    ...(size !== undefined ? { size } : {}),
    ...(decorative !== undefined ? { decorative } : {}),
    ...(resolvedAriaLabel !== undefined ? { ariaLabel: resolvedAriaLabel } : {}),
    ...(id !== undefined ? { id } : {}),
  }

  const renderKit = createSpinnerRecipe(spinnerOptions)
  const mergedClassName = [renderKit.className, className].filter(Boolean).join(" ")
  const mergedStyle = { ...(renderKit.vars as StyleWithVars), ...style }

  return (
    <span
      {...nativeSpanProps}
      {...renderKit.dataAttributes}
      {...dataAttributes}
      className={mergedClassName}
      style={mergedStyle}
      role={renderKit.a11y.role}
      id={renderKit.a11y.id}
      aria-hidden={renderKit.a11y.ariaHidden ? "true" : undefined}
      aria-label={renderKit.a11y.ariaLabel}
      aria-live={renderKit.a11y.ariaLive}
    >
      <svg
        className="mw-spinner__svg"
        viewBox={renderKit.svg.viewBox}
        aria-hidden="true"
        focusable="false"
      >
        {renderKit.svg.nodes.map(renderSpinnerSvgNode)}
      </svg>
    </span>
  )
}
