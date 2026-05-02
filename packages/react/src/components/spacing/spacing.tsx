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
     * Maps to token values: sp-0=0px, sp-2=2px, sp-4=4px, sp-8=8px,
     * sp-16=16px, sp-24=24px, sp-32=32px, up to sp-120=120px.
     * @default "sp-24"
     */
    size?: SpacingSize

    /**
     * Ergonomic alias for `size`.
     * Prefer this on `Spacer` for readable layout code.
     */
    spacing?: SpacingSize

    /**
     * Additional CSS class names.
     */
    className?: string

    /**
     * Inline styles.
     */
    style?: React.CSSProperties
  }

export type SpacerProps = SpacingProps

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
 * <Spacing size={Spacings.sp24} />
 * <Paragraph>World</Paragraph>
 * ```
 *
 * @example All sizes
 * ```tsx
 * <Spacing size="sp-2" />  // 2px
 * <Spacing size="sp-8" />  // 8px
 * <Spacing size="sp-32" /> // 32px
 * ```
 */
export const Spacing = React.forwardRef<HTMLDivElement, SpacingProps>((props, ref) => {
  const { className: customClassName, scale, size, spacing, style: customStyle } = props
  const resolvedSize = spacing ?? size

  const kit = createSpacingRecipe({
    ...(resolvedSize !== undefined ? { size: resolvedSize } : {}),
    ...(scale !== undefined ? { scale } : {}),
  })

  const style = { ...(kit.vars as StyleWithVars), ...customStyle }
  const className = customClassName ? `${kit.className} ${customClassName}` : kit.className

  return <div ref={ref} {...kit.a11y} {...kit.dataAttributes} className={className} style={style} />
})

Spacing.displayName = "Spacing"

/**
 * Spacer
 *
 * Alias for `Spacing` with a layout-oriented prop name.
 *
 * @example
 * ```tsx
 * <Spacer spacing={Spacings.sp24} />
 * ```
 */
export const Spacer = Spacing
