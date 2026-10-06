import { defineOptionKeys } from "../../../shared/option-keys"
import type { ButtonOptions } from "./button-types"

// Feeds every adapter that needs a runtime list of option names (e.g. Vue props); adding a
// ButtonOptions field fails to compile until it is listed here.
export const buttonOptionKeys = defineOptionKeys<ButtonOptions>({
  as: true,
  href: true,
  type: true,
  size: true,
  variant: true,
  disabled: true,
  loading: true,
  error: true,
  toggle: true,
  pressed: true,
  ariaLabel: true,
  ariaLabelledBy: true,
  label: true,
  hasVisibleText: true,
  ariaExpanded: true,
  ariaControls: true,
  iconLeft: true,
  iconRight: true,
  iconOnly: true,
  action: true,
  tooltip: true,
  confirmation: true,
  dataAttributes: true,
})
