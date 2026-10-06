/**
 * React adapter for Marwes H2 component.
 * - Renders semantic <h2> using the core heading recipe.
 * - Supports size override for visual/semantic mismatch.
 */

import { headingRecipe, toHeadingHtmlAttributes } from "@marwes-ui/core"
import type { HeadingOptions, HeadingSize } from "@marwes-ui/core"
import type { CssVars } from "@marwes-ui/core"
import type * as React from "react"
import { toReactAttributes } from "../../internal/react-attributes"
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
 * @remarks
 * Marwes officially styles H1-H3 only. For semantic H4-H6, use
 * `<Text headingLevel={4..6} variant="..." />`.
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
    <h2
      {...toReactAttributes(toHeadingHtmlAttributes(kit.a11y))}
      className={className}
      style={style}
    >
      {children}
    </h2>
  )
}
