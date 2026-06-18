import { createHeadingComponent } from "./create-heading"

/**
 * H1 (Heading Level 1) — semantic top-level heading rendered as `<h1>`.
 *
 * @remarks
 * Marwes officially styles H1-H3 only. For semantic H4-H6 (deep section
 * nesting, accessibility outlines), render `<Text :headingLevel="4"
 * variant="..." />` — it produces the correct heading tag while letting
 * the consumer pick the visual variant. Type your wrappers against
 * `SemanticHeadingLevel` from `@marwes-ui/core`.
 */
export const H1 = createHeadingComponent(1)

/**
 * H2 (Heading Level 2) — semantic section heading rendered as `<h2>`.
 *
 * @remarks
 * For semantic H4-H6, use `<Text :headingLevel="4..6" variant="..." />`.
 */
export const H2 = createHeadingComponent(2)

/**
 * H3 (Heading Level 3) — semantic subsection heading rendered as `<h3>`.
 *
 * @remarks
 * H3 is the deepest blessed rung. For H4-H6, use
 * `<Text :headingLevel="4..6" variant="..." />`.
 */
export const H3 = createHeadingComponent(3)
