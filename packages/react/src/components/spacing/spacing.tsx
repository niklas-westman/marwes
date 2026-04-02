/**
 * React adapter for Marwes Spacing component.
 * - Renders a decorative, aria-hidden div using the core spacing recipe.
 * - Inserts a fixed vertical gap driven by the --mw-spacing-* token scale.
 */

import { createSpacingRecipe } from "@marwes-ui/core"
import type { SpacingOptions, SpacingSize } from "@marwes-ui/core"
import type { CssVars } from "@marwes-ui/core"
import * as React from "react"

type StyleWithVars = React.CSSProperties & CssVars

export type SpacingProps = SpacingOptions &
  Omit<React.HTMLAttributes<HTMLDivElement>, "children"> & {
    /**
     * Size variant for the spacing.
     * Maps to token values: xxxs=2px, xxs=4px, xs=8px, sm=16px, md=24px,
     * lg=32px, xl=40px, xxl=48px, xxxl=56px
     * @default "md"
     */
    size?: SpacingSize

    /**
     * Additional CSS class names.
     */
    className?: string

    /**
     * Inline styles.
     */
    style?: React.CSSProperties
  }

/**
 * Spacing
 *
 * Pure layout primitive that inserts a fixed vertical gap between elements.
 * Driven by the design token scale — no magic numbers required.
 *
 * @example Basic usage (24px gap)
 * ```tsx
 * <Spacing />
 * ```
 *
 * @example Semantic size
 * ```tsx
 * <H1>Hello</H1>
 * <Spacing size={Spacings.md} />
 * <Paragraph>World</Paragraph>
 * ```
 *
 * @example All sizes
 * ```tsx
 * <Spacing size="xxxs" /> // 2px
 * <Spacing size="xs" />   // 8px
 * <Spacing size="lg" />   // 32px
 * ```
 */
export const Spacing = React.forwardRef<HTMLDivElement, SpacingProps>((props, ref) => {
  const { className: customClassName, style: customStyle, ...opts } = props

  const kit = createSpacingRecipe(opts)

  const style = { ...(kit.vars as StyleWithVars), ...customStyle }
  const className = customClassName ? `${kit.className} ${customClassName}` : kit.className

  return <div ref={ref} {...kit.a11y} {...kit.dataAttributes} className={className} style={style} />
})

Spacing.displayName = "Spacing"
