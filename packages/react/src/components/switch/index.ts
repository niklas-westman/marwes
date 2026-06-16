// `Switch` (the atom) is intentionally NOT re-exported here.
// Use `SwitchField` (or a purpose variant) instead. Internal consumers
// can deep-import from "./switch" directly.

export { SwitchField } from "./switch-field"
export type { SwitchFieldProps } from "./switch-field"

export { FeatureToggle, PreferenceSwitch, PermissionSwitch } from "./variants"
export type {
  FeatureToggleProps,
  PreferenceSwitchProps,
  PermissionSwitchProps,
} from "./variants"
