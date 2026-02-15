/**
 * React adapter for Marwes Divider component.
 * - Renders semantic <hr> using the core divider recipe.
 * - Supports 7 size variants: xxs/xs/sm/md/lg/xl/xxl.
 * - Supports horizontal and vertical orientation.
 * - Figma reference: node-id=1-932
 */

import { createDividerRecipe } from "@marwes/core"
import type { DividerOptions, DividerOrientation, DividerSize } from "@marwes/core"
import type { CssVars } from "@marwes/core"
import * as React from "react"
import { useTheme } from "../provider/use-theme"

type StyleWithVars = React.CSSProperties & CssVars

export type DividerProps = DividerOptions &
  Omit<React.HTMLAttributes<HTMLHRElement>, "children"> & {
    /**
     * Size variant for the divider.
     * Maps to pixel values: xxs=1px, xs=8px, sm=16px, md=32px, lg=48px, xl=64px, xxl=80px
     * @default "md"
     */
    size?: DividerSize

    /**
     * Orientation of the divider.
     * @default "horizontal"
     */
    orientation?: DividerOrientation

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
 * Divider
 *
 * Semantic separator rendered as `<hr>`.
 * Supports size variants and both horizontal and vertical orientations.
 *
 * @example Basic usage (horizontal, medium size)
 * ```tsx
 * <Divider />
 * ```
 *
 * @example Different sizes
 * ```tsx
 * <Divider size="xxs" /> //  1px hairline
 * <Divider size="sm" />  // 16px
 * <Divider size="lg" />  // 48px
 * ```
 *
 * @example Vertical divider
 * ```tsx
 * <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
 *   <span>Left content</span>
 *   <Divider orientation="vertical" size="sm" />
 *   <span>Right content</span>
 * </div>
 * ```
 *
 * @example With custom ID
 * ```tsx
 * <Divider id="section-break" />
 * ```
 */

export const Divider = React.forwardRef<HTMLHRElement, DividerProps>((props, ref) => {
  const { className: customClassName, style: customStyle, ...opts } = props

  const theme = useTheme()

  const kit = createDividerRecipe(theme, opts)

  const style = { ...(kit.vars as StyleWithVars), ...customStyle }
  const className = customClassName ? `${kit.className} ${customClassName}` : kit.className

  return <hr ref={ref} {...kit.a11y} {...kit.dataAttributes} className={className} style={style} />
})

Divider.displayName = "Divider"
