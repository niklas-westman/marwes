import { buildSwitchFieldA11yIds } from "@marwes-ui/core"
import * as React from "react"
import { Text } from "../text"
import { Switch } from "./switch"
import type { SwitchProps } from "./switch"

export type SwitchFieldProps = {
  id?: string
  label: React.ReactNode
  description?: React.ReactNode
  error?: React.ReactNode
  switch: SwitchProps
  ariaDescribedBy?: string
  dataAttributes?: Record<string, string>
}

function cx(...parts: Array<string | false | undefined>): string {
  return parts.filter(Boolean).join(" ")
}

function hasContent(value: React.ReactNode | undefined): boolean {
  if (value === undefined || value === null || value === false) {
    return false
  }

  if (typeof value === "string") {
    return value.trim().length > 0
  }

  return true
}

export function SwitchField(props: SwitchFieldProps): React.ReactElement {
  const reactId = React.useId()
  const id = props.id ?? `mw-switch-${reactId}`
  const hasDescription = hasContent(props.description)
  const hasError = hasContent(props.error)
  const { labelId, descriptionId, errorId, describedBy } = buildSwitchFieldA11yIds({
    id,
    hasDescription,
    hasError,
    externalDescribedBy: props.ariaDescribedBy,
  })

  const disabled = props.switch.disabled || false
  const invalid = hasError
  const wrapperClass = cx(
    "mw-switch-field",
    disabled && "mw-switch-field--disabled",
    invalid && "mw-switch-field--invalid",
  )
  const {
    ariaLabel: _ignoredAriaLabel,
    ariaLabelledBy: _ignoredAriaLabelledby,
    ariaDescribedBy: _ignoredAriaDescribedBy,
    children: _ignoredChildren,
    ...switchProps
  } = props.switch

  return (
    <div className={wrapperClass} {...props.dataAttributes}>
      <div className="mw-switch-field__row">
        <Switch
          {...switchProps}
          id={id}
          ariaLabelledBy={labelId}
          {...(describedBy ? { ariaDescribedBy: describedBy } : {})}
        />

        <span className="mw-switch-field__label" id={labelId}>
          <Text variant="label">{props.label}</Text>
        </span>
      </div>

      {hasDescription && (
        <div className="mw-switch-field__description" id={descriptionId}>
          <Text variant="caption">{props.description}</Text>
        </div>
      )}

      {hasError && (
        <div className="mw-switch-field__error" id={errorId} aria-live="polite">
          <Text variant="caption">{props.error}</Text>
        </div>
      )}
    </div>
  )
}
