/**
 * React adapter for Marwes H2 component.
 * - Renders semantic <h2> using the core heading recipe.
 * - Supports size override for visual/semantic mismatch.
 */

import { headingRecipe } from "@marwes-ui/core"
import type { HeadingOptions, HeadingSize } from "@marwes-ui/core"
import type { CssVars } from "@marwes-ui/core"
import type * as React from "react"
import { useTheme } from "../../provider/use-theme"

type StyleWithVars = React.CSSProperties & CssVars

export type H2Props = Omit<HeadingOptions, "level"> & {
  /**
   * Visual size override.
   * Allows using h2 semantics with different visual styling.
   * @default "h2"
   */
  size?: HeadingSize

  /**
   * Content of the heading.
   */
  children?: React.ReactNode

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
 * H2 (Heading Level 2)
 *
 * Semantic section heading rendered as `<h2>`.
 * Supports visual size override for cases where semantic and visual hierarchy differ.
 *
 * @example Basic usage
 * ```tsx
 * <H2>Section Title</H2>
 * ```
 *
 * @example With size override
 * ```tsx
 * <H2 size="h1">Visually larger but semantically h2</H2>
 * ```
 */
export function H2(props: H2Props): React.ReactElement {
  const { children, className: customClassName, style: customStyle, ...opts } = props
  const theme = useTheme()

  const kit = headingRecipe({ ...opts, level: 2 }, theme)

  const style = { ...(kit.vars as StyleWithVars), ...customStyle }
  const className = customClassName ? `${kit.className} ${customClassName}` : kit.className

  return (
    <h2 id={kit.a11y.id} aria-label={kit.a11y.ariaLabel} className={className} style={style}>
      {children}
    </h2>
  )
}
