/**
 * React adapter for the Marwes Stack layout primitive.
 * - Renders a flex container whose gap and padding come only from spacing tokens.
 * - Emits every resolved layout value as a data attribute.
 * - Kit vars are merged after the consumer style so --mw-stack-* cannot be overridden.
 */

import { createStackRecipe } from "@marwes-ui/core"
import type { CssVars, StackOptions } from "@marwes-ui/core"
import * as React from "react"

type StyleWithVars = React.CSSProperties & CssVars

export type StackProps = StackOptions &
  Omit<React.HTMLAttributes<HTMLElement>, "color"> & {
    /** Stack content, ideally StackItem or nested Stack children. */
    children?: React.ReactNode
  }

/**
 * Stack
 *
 * Flex layout container. Gap and padding accept only `Spacings` tokens.
 *
 * @example
 * ```tsx
 * <Stack direction="row" gap="sp-16" padding="sp-24" alignItems="center">
 *   <StackItem horizontalSizing="fill">…</StackItem>
 *   <StackItem>…</StackItem>
 * </Stack>
 * ```
 */
export const Stack = React.forwardRef<HTMLElement, StackProps>((props, ref) => {
  const {
    direction,
    gap,
    rowGap,
    columnGap,
    padding,
    paddingX,
    paddingY,
    paddingTop,
    paddingRight,
    paddingBottom,
    paddingLeft,
    alignItems,
    justifyContent,
    wrap,
    as,
    horizontalSizing,
    verticalSizing,
    className: customClassName,
    style: customStyle,
    children,
    ...nativeProps
  } = props

  const kit = createStackRecipe({
    ...(direction !== undefined ? { direction } : {}),
    ...(gap !== undefined ? { gap } : {}),
    ...(rowGap !== undefined ? { rowGap } : {}),
    ...(columnGap !== undefined ? { columnGap } : {}),
    ...(padding !== undefined ? { padding } : {}),
    ...(paddingX !== undefined ? { paddingX } : {}),
    ...(paddingY !== undefined ? { paddingY } : {}),
    ...(paddingTop !== undefined ? { paddingTop } : {}),
    ...(paddingRight !== undefined ? { paddingRight } : {}),
    ...(paddingBottom !== undefined ? { paddingBottom } : {}),
    ...(paddingLeft !== undefined ? { paddingLeft } : {}),
    ...(alignItems !== undefined ? { alignItems } : {}),
    ...(justifyContent !== undefined ? { justifyContent } : {}),
    ...(wrap !== undefined ? { wrap } : {}),
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

Stack.displayName = "Stack"
