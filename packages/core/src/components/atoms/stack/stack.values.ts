/**
 * Allowed value sets for the Stack family.
 * - Shared by the recipe guard, Storybook controls and the cross-adapter contract.
 */

import { Spacings } from "../spacing"
import type {
  StackAlignItems,
  StackAs,
  StackDirection,
  StackItemAs,
  StackJustifyContent,
  StackSizing,
  StackWrap,
} from "./stack.types"

export const stackDirections: readonly StackDirection[] = ["row", "column"]

export const stackAlignItemsValues: readonly StackAlignItems[] = ["start", "center", "end"]

export const stackJustifyContentValues: readonly StackJustifyContent[] = [
  "start",
  "center",
  "end",
  "space-between",
  "space-around",
  "space-evenly",
]

export const stackWraps: readonly StackWrap[] = ["nowrap", "wrap"]

export const stackSizings: readonly StackSizing[] = ["fix", "hug", "fill"]

export const stackAsValues: readonly StackAs[] = [
  "div",
  "section",
  "nav",
  "header",
  "footer",
  "main",
  "aside",
  "ul",
  "ol",
]

export const stackItemAsValues: readonly StackItemAs[] = ["div", "li"]

/** The hyphenated spacing token names (sp-0 … sp-120); the camel-case keys map to the same values. */
export const stackSpacingValues: readonly Spacings[] = [...new Set(Object.values(Spacings))]

/**
 * Throws when a value is outside its allowed set.
 * Layout must stay on the shared token and enum vocabulary, so an unknown value is a
 * programming error rather than something to silently fall back from (Icon precedent).
 */
export function assertStackValue<T extends string>(
  prop: string,
  value: unknown,
  allowed: readonly T[],
  component: "Stack" | "StackItem" = "Stack",
): asserts value is T {
  if (!(allowed as readonly unknown[]).includes(value)) {
    throw new TypeError(
      `${component} ${prop} must be one of ${allowed.join(", ")}, got ${String(value)}`,
    )
  }
}
