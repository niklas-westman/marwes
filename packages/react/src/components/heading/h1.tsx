/**
 * React adapter for Marwes H1 component.
 * - Renders semantic <h1> using the core heading recipe.
 * - Supports size override for visual/semantic mismatch.
 */

import { headingRecipe } from "@marwes-ui/core"
import type { HeadingOptions, HeadingSize } from "@marwes-ui/core"
import type { CssVars } from "@marwes-ui/core"
import type * as React from "react"
import { useTheme } from "../../provider/use-theme"

type StyleWithVars = React.CSSProperties & CssVars

export type H1Props = Omit<HeadingOptions, "level"> & {
  /**
   * Visual size override.
   * Allows using h1 semantics with different visual styling.
   * @default "h1"
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
 * H1 (Heading Level 1)
 *
 * Semantic top-level heading rendered as `<h1>`.
 * Supports visual size override for cases where semantic and visual hierarchy differ.
 *
 * @example Basic usage
 * ```tsx
 * <H1>Page Title</H1>
 * ```
 *
 * @example With size override
 * ```tsx
 * <H1 size="h2">Visually smaller but semantically h1</H1>
 * ```
 *
 * @example With ID for anchor linking
 * ```tsx
 * <H1 id="introduction">Introduction</H1>
 * ```
 */
export function H1(props: H1Props): React.ReactElement {
  const { children, className: customClassName, style: customStyle, ...opts } = props
  const theme = useTheme()

  const kit = headingRecipe({ ...opts, level: 1 }, theme)

  const style = { ...(kit.vars as StyleWithVars), ...customStyle }
  const className = customClassName ? `${kit.className} ${customClassName}` : kit.className

  return (
    <h1 id={kit.a11y.id} aria-label={kit.a11y.ariaLabel} className={className} style={style}>
      {children}
    </h1>
  )
}
