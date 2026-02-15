// packages/core/src/components/button/button-a11y.ts
import type { ButtonA11yProps, ButtonOptions } from "./button-types"

function isDev(): boolean {
  // Works in Node + bundlers without requiring @types/node
  const p = (
    globalThis as unknown as {
      process?: { env?: Record<string, string | undefined> }
    }
  ).process

  const nodeEnv = p?.env?.NODE_ENV
  if (nodeEnv) return nodeEnv !== "production"

  // Fallback for some bundlers (typed as unknown to avoid depending on Vite types)
  const meta = import.meta as unknown as {
    env?: { MODE?: string; PROD?: boolean }
  }
  if (typeof meta.env?.PROD === "boolean") return !meta.env.PROD
  if (meta.env?.MODE) return meta.env.MODE !== "production"

  // Default to dev-like behavior if unknown
  return true
}

const __DEV__ = isDev()

export function resolveButtonA11y(opts: ButtonOptions): {
  tag: "button" | "a"
  a11y: ButtonA11yProps
  blockClick: boolean
} {
  const tag: "button" | "a" = opts.as === "a" || !!opts.href ? "a" : "button"
  const isDisabled = !!opts.disabled || !!opts.loading

  if (__DEV__) {
    const iconOnly = opts.hasVisibleText === false
    if (iconOnly && !opts.ariaLabel) {
      // Development warning for accessibility
      console.warn("[marwes] Icon-only Button requires ariaLabel.")
    }
  }

  // Build common props without assigning `undefined` (exactOptionalPropertyTypes-safe)
  const common: ButtonA11yProps = {}

  if (opts.ariaLabel) common.ariaLabel = opts.ariaLabel
  if (opts.loading) common.ariaBusy = true
  if (isDisabled) common.ariaDisabled = true

  if (opts.toggle) common.ariaPressed = !!opts.pressed
  if (opts.ariaExpanded !== undefined) common.ariaExpanded = opts.ariaExpanded
  if (opts.ariaControls) common.ariaControls = opts.ariaControls

  if (tag === "button") {
    const a11y: ButtonA11yProps = { ...common, type: "button" }
    if (isDisabled) a11y.disabled = true

    return { tag, a11y, blockClick: false }
  }

  const a11y: ButtonA11yProps = {
    ...common,
    role: "button",
    tabIndex: isDisabled ? -1 : 0,
  }

  if (!isDisabled && opts.href) a11y.href = opts.href

  return { tag: "a", a11y, blockClick: isDisabled }
}
