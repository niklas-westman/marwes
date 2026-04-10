import type { CssVars } from "@marwes-ui/core"
import type * as React from "react"
import { Spinner, type SpinnerProps } from "./spinner"

type StyleWithVars = React.CSSProperties & CssVars

export type ButtonSpinnerProps = SpinnerProps & {
  inverted?: boolean
}

export function ButtonSpinner(props: ButtonSpinnerProps): React.ReactElement {
  const { inverted = false, style, dataAttributes, ...spinnerProps } = props

  const spinnerStyle: StyleWithVars = {
    "--mw-spinner-track-color": inverted
      ? "rgba(255, 255, 255, 0.8)"
      : "color-mix(in srgb, currentColor 35%, transparent)",
    "--mw-spinner-indicator-color": inverted ? "#ffffff" : "currentColor",
    ...(style as StyleWithVars | undefined),
  }

  return (
    <Spinner
      {...spinnerProps}
      variant={props.variant ?? "classic"}
      size={props.size ?? "xs"}
      decorative={props.decorative ?? true}
      style={spinnerStyle}
      dataAttributes={{
        ...dataAttributes,
        "data-purpose": "button-loading",
        "data-context": "button-loading",
      }}
    />
  )
}

export type EmptyStateSpinnerProps = SpinnerProps

export function EmptyStateSpinner(props: EmptyStateSpinnerProps): React.ReactElement {
  return (
    <Spinner
      {...props}
      variant={props.variant ?? "dots-round"}
      size={props.size ?? "lg"}
      decorative={props.decorative ?? true}
      dataAttributes={{
        ...props.dataAttributes,
        "data-purpose": "empty-state",
        "data-context": "empty-state",
      }}
    />
  )
}
