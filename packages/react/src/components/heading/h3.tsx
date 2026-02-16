/**
 * React adapter for Marwes H3 component.
 * - Renders semantic <h3> using the core heading recipe.
 * - Supports size override for visual/semantic mismatch.
 */

import { headingRecipe } from "@marwes-ui/core"
import type { HeadingOptions, HeadingSize } from "@marwes-ui/core"
import type { CssVars } from "@marwes-ui/core"
import type * as React from "react"
import { useTheme } from "../../provider/use-theme"

type StyleWithVars = React.CSSProperties & CssVars

export type H3Props = Omit<HeadingOptions, "level"> & {
  /**
   * Visual size override.
   * Allows using h3 semantics with different visual styling.
   * @default "h3"
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
 * H3 (Heading Level 3)
 *
 * Semantic subsection heading rendered as `<h3>`.
 * Supports visual size override for cases where semantic and visual hierarchy differ.
 *
 * @example Basic usage
 * ```tsx
 * <H3>Subsection Title</H3>
 * ```
 *
 * @example With size override
 * ```tsx
 * <H3 size="h2">Visually larger but semantically h3</H3>
 * ```
 */
export function H3(props: H3Props): React.ReactElement {
  const { children, className: customClassName, style: customStyle, ...opts } = props
  const theme = useTheme()

  const kit = headingRecipe({ ...opts, level: 3 }, theme)

  const style = { ...(kit.vars as StyleWithVars), ...customStyle }
  const className = customClassName ? `${kit.className} ${customClassName}` : kit.className

  return (
    <h3 id={kit.a11y.id} aria-label={kit.a11y.ariaLabel} className={className} style={style}>
      {children}
    </h3>
  )
}
