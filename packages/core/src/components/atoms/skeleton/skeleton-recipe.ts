import { resolveSkeletonA11y } from "./skeleton-a11y"
import { SkeletonAnimation, SkeletonVariant } from "./skeleton-types"
import type {
  SkeletonAnimation as SkeletonAnimationValue,
  SkeletonDimension,
  SkeletonOptions,
  SkeletonRenderKit,
  SkeletonVariant as SkeletonVariantValue,
} from "./skeleton-types"

const FIGMA_TEXT_WIDTH = 120
const FIGMA_TEXT_HEIGHT = 12
const FIGMA_CIRCULAR_SIZE = 40
const FIGMA_RECTANGULAR_SIZE = 120
const FIGMA_RADIUS = 4

function cx(...parts: Array<string | false | undefined>): string {
  return parts.filter(Boolean).join(" ")
}

function toCssDimension(value: SkeletonDimension | undefined): string | undefined {
  if (value === undefined) return undefined
  return typeof value === "number" ? `${value}px` : value
}

function resolveDefaultWidth(variant: SkeletonVariantValue): string {
  if (variant === SkeletonVariant.circular) return `${FIGMA_CIRCULAR_SIZE}px`
  return `${variant === SkeletonVariant.text ? FIGMA_TEXT_WIDTH : FIGMA_RECTANGULAR_SIZE}px`
}

function resolveDefaultHeight(variant: SkeletonVariantValue): string {
  if (variant === SkeletonVariant.text) return `${FIGMA_TEXT_HEIGHT}px`
  if (variant === SkeletonVariant.circular) return `${FIGMA_CIRCULAR_SIZE}px`
  return `${FIGMA_RECTANGULAR_SIZE}px`
}

function resolveRadius(
  variant: SkeletonVariantValue,
  radius: SkeletonDimension | undefined,
): string {
  if (variant === SkeletonVariant.circular) return "9999px"
  return toCssDimension(radius) ?? `${FIGMA_RADIUS}px`
}

export function createSkeletonRecipe(options: SkeletonOptions = {}): SkeletonRenderKit {
  const variant: SkeletonVariantValue = options.variant ?? SkeletonVariant.text
  const animation: SkeletonAnimationValue = options.animation ?? SkeletonAnimation.pulse

  return {
    tag: "span",
    className: cx(
      "mw-skeleton",
      `mw-skeleton--${variant}`,
      animation !== SkeletonAnimation.none && `mw-skeleton--${animation}`,
    ),
    vars: {
      "--mw-skeleton-width": toCssDimension(options.width) ?? resolveDefaultWidth(variant),
      "--mw-skeleton-height": toCssDimension(options.height) ?? resolveDefaultHeight(variant),
      "--mw-skeleton-radius": resolveRadius(variant, options.radius),
    },
    a11y: resolveSkeletonA11y(options),
    dataAttributes: {
      "data-component": "skeleton",
      "data-variant": variant,
      "data-animation": animation,
    },
  }
}
