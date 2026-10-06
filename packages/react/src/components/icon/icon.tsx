import {
  type IconSize,
  type IconStrokeWidth,
  iconRegistry,
  resolveIconA11y,
  resolveIconSize,
  resolveIconStrokeWidth,
  toIconHtmlAttributes,
} from "@marwes-ui/core"
import type * as React from "react"
import { toReactAttributes } from "../../internal/react-attributes"

type IconName = keyof typeof iconRegistry

export type IconProps = {
  name: IconName

  /**
   * Icon scale token ("xs"|"sm"|"md"|"lg") or an explicit pixel size.
   * Defaults to system.theme.icon.size
   */
  size?: IconSize | number

  /**
   * Stroke-width token ("xs"|"sm"|"md"|"lg") or an explicit numeric stroke width.
   * Defaults to system.theme.icon.strokeWidth
   */
  strokeWidth?: IconStrokeWidth | number

  /**
   * Common props
   */
  className?: string
  ariaLabel?: string
  decorative?: boolean
}

export function Icon({ name, size, strokeWidth, className, ariaLabel, decorative }: IconProps) {
  const px = resolveIconSize(size ?? "sm")
  const sw = resolveIconStrokeWidth(strokeWidth ?? "md")

  const def = iconRegistry[name]
  const a11y = resolveIconA11y({
    ...(ariaLabel !== undefined ? { ariaLabel } : {}),
    ...(decorative !== undefined ? { decorative } : {}),
  })

  return (
    // biome-ignore lint/a11y/noSvgWithoutTitle: aria-label, aria-hidden and role come from the spread a11y attributes
    <svg
      width={px}
      height={px}
      viewBox={def.viewBox}
      fill="none"
      stroke="currentColor"
      strokeWidth={sw}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...toReactAttributes(toIconHtmlAttributes(a11y))}
      focusable="false"
    >
      {def.nodes.map((iconNode, nodeIndex) => {
        const TagName = iconNode.tag
        // biome-ignore lint/suspicious/noArrayIndexKey: Icon nodes are static and never reordered
        return <TagName key={nodeIndex} {...(iconNode.attrs as React.SVGAttributes<SVGElement>)} />
      })}
    </svg>
  )
}
