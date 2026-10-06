import type { ButtonOptions } from "./button-types"

// Exhaustive on purpose: adding a ButtonOptions field fails to compile until it is listed here,
// which in turn feeds every adapter that needs a runtime list of option names (e.g. Vue props).
const BUTTON_OPTION_KEY_SET = {
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
} as const satisfies Record<keyof ButtonOptions, true>

export const buttonOptionKeys = Object.keys(BUTTON_OPTION_KEY_SET) as ReadonlyArray<
  keyof ButtonOptions
>
