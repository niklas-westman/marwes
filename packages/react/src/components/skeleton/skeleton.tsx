import {
  type CssVars,
  type SkeletonOptions,
  createSkeletonRecipe,
  toSkeletonHtmlAttributes,
} from "@marwes-ui/core"
import type * as React from "react"
import { toReactAttributes } from "../../internal/react-attributes"

type StyleWithVars = React.CSSProperties & CssVars

export interface SkeletonProps
  extends SkeletonOptions,
    Omit<React.HTMLAttributes<HTMLSpanElement>, "children"> {
  dataAttributes?: Record<string, string>
}

export function Skeleton(props: SkeletonProps): React.ReactElement {
  const {
    className,
    style,
    dataAttributes,
    variant,
    width,
    height,
    radius,
    animation,
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

  const skeletonOptions: SkeletonOptions = {
    ...(variant !== undefined ? { variant } : {}),
    ...(width !== undefined ? { width } : {}),
    ...(height !== undefined ? { height } : {}),
    ...(radius !== undefined ? { radius } : {}),
    ...(animation !== undefined ? { animation } : {}),
    ...(decorative !== undefined ? { decorative } : {}),
    ...(resolvedAriaLabel !== undefined ? { ariaLabel: resolvedAriaLabel } : {}),
    ...(id !== undefined ? { id } : {}),
  }

  const renderKit = createSkeletonRecipe(skeletonOptions)
  const mergedClassName = [renderKit.className, className].filter(Boolean).join(" ")
  const mergedStyle = { ...(renderKit.vars as StyleWithVars), ...style }

  return (
    <span
      {...nativeSpanProps}
      {...renderKit.dataAttributes}
      {...dataAttributes}
      className={mergedClassName}
      style={mergedStyle}
      {...toReactAttributes(toSkeletonHtmlAttributes(renderKit.a11y))}
    />
  )
}
