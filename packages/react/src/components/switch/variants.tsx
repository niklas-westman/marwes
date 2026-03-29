import type * as React from "react"
import { SwitchField, type SwitchFieldProps } from "./switch-field"

export type FeatureToggleProps = SwitchFieldProps

export function FeatureToggle(props: FeatureToggleProps): React.ReactElement {
  return (
    <SwitchField
      {...props}
      dataAttributes={{
        ...props.dataAttributes,
        "data-purpose": "feature-toggle",
      }}
    />
  )
}

export type PreferenceSwitchProps = SwitchFieldProps

export function PreferenceSwitch(props: PreferenceSwitchProps): React.ReactElement {
  return (
    <SwitchField
      {...props}
      dataAttributes={{
        ...props.dataAttributes,
        "data-purpose": "preference",
      }}
    />
  )
}

export type PermissionSwitchProps = SwitchFieldProps

export function PermissionSwitch(props: PermissionSwitchProps): React.ReactElement {
  return (
    <SwitchField
      {...props}
      dataAttributes={{
        ...props.dataAttributes,
        "data-purpose": "permission",
      }}
    />
  )
}
