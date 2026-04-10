import type { SpinnerA11yProps, SpinnerOptions } from "./spinner-types"

export function resolveSpinnerA11y(options: SpinnerOptions = {}): SpinnerA11yProps {
  if (options.decorative === true) {
    return {
      ...(options.id ? { id: options.id } : {}),
      ariaHidden: true,
    }
  }

  if (options.ariaLabel) {
    return {
      ...(options.id ? { id: options.id } : {}),
      role: "status",
      ariaLabel: options.ariaLabel,
      ariaLive: "polite",
    }
  }

  return {
    ...(options.id ? { id: options.id } : {}),
    ariaHidden: true,
  }
}
