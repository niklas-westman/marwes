/**
 * React adapter for Marwes Text component.
 * - Renders non-heading typography styles without creating document outline.
 */

import { textRecipe, toTextHtmlAttributes } from "@marwes-ui/core"
import type { CssVars, TextAs, TextOptions, TextVariant } from "@marwes-ui/core"
import type * as React from "react"
import { toReactAttributes } from "../../internal/react-attributes"
import { useTheme } from "../../provider/use-theme"

type StyleWithVars = React.CSSProperties & CssVars

export type TextProps = TextOptions & {
  /**
   * Visual typography variant.
   * @default "caption"
   */
  variant?: TextVariant

  /**
   * Rendered HTML element.
   * @default "span"
   */
  as?: TextAs

  /**
   * Content of the text node.
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

export function Text(props: TextProps): React.ReactElement {
  const { children, className: customClassName, style: customStyle, ...opts } = props
  const theme = useTheme()
  const kit = textRecipe(opts, theme)
  const Tag = kit.tag

  const style = { ...(kit.vars as StyleWithVars), ...customStyle }
  const className = customClassName ? `${kit.className} ${customClassName}` : kit.className

  return (
    <Tag {...toReactAttributes(toTextHtmlAttributes(kit.a11y))} className={className} style={style}>
      {children}
    </Tag>
  )
}

export type TextComponent = typeof Text
export const TypographyText = Text
