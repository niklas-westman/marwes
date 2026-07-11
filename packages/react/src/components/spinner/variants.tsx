import type { CssVars } from "@marwes-ui/core"
import type * as React from "react"
import { Spinner, type SpinnerProps } from "./spinner"

type StyleWithVars = React.CSSProperties & CssVars

export type ButtonSpinnerProps = SpinnerProps & {
  inverted?: boolean
}

/**
 * ButtonSpinner — purpose variant of Spinner for in-button loading states.
 *
 * Defaults (`variant="classic"`, `size="xs"`, `decorative=true`) are
 * intentionally overridable: the `Button` atom forwards
 * `loading.spinnerVariant` through this prop. If you want a different
 * loading look, just override the prop; use the base `Spinner` directly
 * only when you need to escape the button-loading data-attributes.
 */
export function ButtonSpinner(props: ButtonSpinnerProps): React.ReactElement {
  const { inverted = false, style, dataAttributes, ...spinnerProps } = props

  const spinnerStyle: StyleWithVars = {
    "--mw-spinner-track-color": inverted
      ? "color-mix(in srgb, currentColor 80%, transparent)"
      : "color-mix(in srgb, currentColor 35%, transparent)",
    "--mw-spinner-indicator-color": "currentColor",
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

/**
 * EmptyStateSpinner — purpose variant of Spinner for empty/loading-state regions.
 *
 * Defaults (`variant="dots-round"`, `size="lg"`, `decorative=true`) are
 * intentionally overridable — same rationale as `ButtonSpinner`.
 */
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
