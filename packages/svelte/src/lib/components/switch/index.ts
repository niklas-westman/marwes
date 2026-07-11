// `Switch` (the atom) is intentionally NOT re-exported here.
// Use `SwitchField` (or a purpose variant) instead. Internal consumers
// can deep-import "./Switch.svelte" directly.

export { default as SwitchField } from "./SwitchField.svelte"
export { default as FeatureToggle } from "./FeatureToggle.svelte"
export { default as PreferenceSwitch } from "./PreferenceSwitch.svelte"
export { default as PermissionSwitch } from "./PermissionSwitch.svelte"
export type {
  SwitchFieldProps,
  FeatureToggleProps,
  PreferenceSwitchProps,
  PermissionSwitchProps,
} from "./types.js"
