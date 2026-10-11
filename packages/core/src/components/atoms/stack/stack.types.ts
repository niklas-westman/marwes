/**
 * Core types for the Stack family.
 * - Stack is a flex layout container whose gap and padding accept only spacing tokens.
 * - StackItem is a declared child that carries horizontal/vertical sizing intent.
 * - Every resolved value is emitted as a data attribute so layout can be verified
 *   against design auto layout one-to-one.
 */

import type { CssVars } from "../../../shared/css-vars"
import type { Spacings } from "../spacing"

/** Main axis of the stack. Reverse directions are intentionally not supported yet. */
export type StackDirection = "row" | "column"

/** Cross-axis alignment of the stack's children. */
export type StackAlignItems = "start" | "center" | "end" | "stretch"

/** Main-axis distribution of the stack's children. */
export type StackJustifyContent =
  | "start"
  | "center"
  | "end"
  | "space-between"
  | "space-around"
  | "space-evenly"

/** Whether children wrap onto new lines. */
export type StackWrap = "nowrap" | "wrap"

/**
 * Child sizing intent, mirroring design auto-layout child sizing.
 * - `fix`: the size is owned by the child component's own token-driven size.
 * - `hug`: the child shrinks to its content.
 * - `fill`: the child fills the available space on that axis.
 *
 * Sizing only has an effect when the element's parent is a Stack.
 */
export type StackSizing = "fix" | "hug" | "fill"

/** Elements a Stack may render as. */
export type StackAs =
  | "div"
  | "section"
  | "nav"
  | "header"
  | "footer"
  | "main"
  | "aside"
  | "ul"
  | "ol"

/** Elements a StackItem may render as. Use `li` inside a Stack rendered as `ul` or `ol`. */
export type StackItemAs = "div" | "li"

/** Sizing options shared by Stack (when nested) and StackItem. */
export type StackItemSizingOptions = {
  /** @default "hug" */
  horizontalSizing?: StackSizing
  /** @default "hug" */
  verticalSizing?: StackSizing
}

/** Public options the adapters pass into the Stack recipe. */
export type StackOptions = StackItemSizingOptions & {
  /** @default "column" */
  direction?: StackDirection
  /** Shorthand for both rowGap and columnGap. */
  gap?: Spacings
  /** Wins over `gap` for the row gap. */
  rowGap?: Spacings
  /** Wins over `gap` for the column gap. */
  columnGap?: Spacings
  /** Shorthand for all four sides. */
  padding?: Spacings
  /** Left and right padding; wins over `padding`. */
  paddingX?: Spacings
  /** Top and bottom padding; wins over `padding`. */
  paddingY?: Spacings
  /** Wins over `paddingY` and `padding`. */
  paddingTop?: Spacings
  /** Wins over `paddingX` and `padding`. */
  paddingRight?: Spacings
  /** Wins over `paddingY` and `padding`. */
  paddingBottom?: Spacings
  /** Wins over `paddingX` and `padding`. */
  paddingLeft?: Spacings
  /** @default "start" */
  alignItems?: StackAlignItems
  /** @default "start" */
  justifyContent?: StackJustifyContent
  /** @default "nowrap" */
  wrap?: StackWrap
  /** @default "div" */
  as?: StackAs
}

/** Public options the adapters pass into the StackItem recipe. */
export type StackItemOptions = StackItemSizingOptions & {
  /** @default "div" */
  as?: StackItemAs
}

/** Resolved data attributes emitted by every Stack. */
export type StackDataAttributes = {
  "data-component": "stack"
  "data-direction": StackDirection
  "data-row-gap": Spacings
  "data-column-gap": Spacings
  "data-padding-top": Spacings
  "data-padding-right": Spacings
  "data-padding-bottom": Spacings
  "data-padding-left": Spacings
  "data-align-items": StackAlignItems
  "data-justify-content": StackJustifyContent
  "data-wrap": StackWrap
  "data-horizontal-sizing": StackSizing
  "data-vertical-sizing": StackSizing
}

/** Resolved data attributes emitted by every StackItem. */
export type StackItemDataAttributes = {
  "data-component": "stack-item"
  "data-horizontal-sizing": StackSizing
  "data-vertical-sizing": StackSizing
}

/** Render kit for Stack. */
export type StackRenderKit = {
  tag: StackAs
  className: "mw-stack"
  /** Only --mw-stack-* vars, each exactly `var(--mw-spacing-<token>)`. */
  vars: CssVars
  dataAttributes: StackDataAttributes
}

/** Render kit for StackItem. */
export type StackItemRenderKit = {
  tag: StackItemAs
  className: "mw-stack-item"
  vars: CssVars
  dataAttributes: StackItemDataAttributes
}
