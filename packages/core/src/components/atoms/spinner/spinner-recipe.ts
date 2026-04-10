import { resolveSpinnerA11y } from "./spinner-a11y"
import { createSpinnerSvgDefinition } from "./spinner-svg"
import { SpinnerVariant, resolveSpinnerSize } from "./spinner-types"
import type {
  SpinnerOptions,
  SpinnerRenderKit,
  SpinnerSize,
  SpinnerVariant as SpinnerVariantValue,
} from "./spinner-types"

function cx(...parts: Array<string | false | undefined>): string {
  return parts.filter(Boolean).join(" ")
}

function resolveSpinnerDataSize(size: SpinnerOptions["size"]): SpinnerSize | "custom" {
  if (typeof size === "number") {
    return "custom"
  }

  return size ?? "sm"
}

export function createSpinnerRecipe(options: SpinnerOptions = {}): SpinnerRenderKit {
  const variant: SpinnerVariantValue = options.variant ?? SpinnerVariant.classic
  const requestedSize = options.size ?? "sm"
  const resolvedSize = resolveSpinnerSize(requestedSize)

  return {
    tag: "span",
    className: cx("mw-spinner", `mw-spinner--${variant}`),
    vars: {
      "--mw-spinner-size": `${resolvedSize}px`,
      "--mw-spinner-rotation-duration": "800ms",
    },
    a11y: resolveSpinnerA11y(options),
    dataAttributes: {
      "data-component": "spinner",
      "data-variant": variant,
      "data-size": resolveSpinnerDataSize(options.size),
    },
    svg: createSpinnerSvgDefinition(variant),
  }
}
