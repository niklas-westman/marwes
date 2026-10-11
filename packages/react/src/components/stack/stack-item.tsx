/**
 * React adapter for the Marwes StackItem.
 * - A declared Stack child that carries horizontal/vertical sizing (fix | hug | fill).
 * - Sizing only has an effect when the parent is a Stack.
 */

import { createStackItemRecipe } from "@marwes-ui/core"
import type { CssVars, StackItemOptions } from "@marwes-ui/core"
import * as React from "react"

type StyleWithVars = React.CSSProperties & CssVars

export type StackItemProps = StackItemOptions &
  Omit<React.HTMLAttributes<HTMLElement>, "color"> & {
    children?: React.ReactNode
  }

/**
 * StackItem
 *
 * @example
 * ```tsx
 * <Stack as="ul" gap="sp-8">
 *   <StackItem as="li" horizontalSizing="fill">First</StackItem>
 * </Stack>
 * ```
 */
export const StackItem = React.forwardRef<HTMLElement, StackItemProps>((props, ref) => {
  const {
    as,
    horizontalSizing,
    verticalSizing,
    className: customClassName,
    style: customStyle,
    children,
    ...nativeProps
  } = props

  const kit = createStackItemRecipe({
    ...(as !== undefined ? { as } : {}),
    ...(horizontalSizing !== undefined ? { horizontalSizing } : {}),
    ...(verticalSizing !== undefined ? { verticalSizing } : {}),
  })

  const className = customClassName ? `${kit.className} ${customClassName}` : kit.className
  const style: StyleWithVars = { ...customStyle, ...(kit.vars as StyleWithVars) }

  return React.createElement(
    kit.tag,
    { ...nativeProps, ...kit.dataAttributes, className, style, ref },
    children,
  )
})

StackItem.displayName = "StackItem"
