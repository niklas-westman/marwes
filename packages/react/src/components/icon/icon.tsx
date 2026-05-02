import {
  type IconSize,
  type IconStrokeWidth,
  iconRegistry,
  resolveIconA11y,
  resolveIconSize,
  resolveIconStrokeWidth,
} from "@marwes-ui/core"
import type * as React from "react"

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
  "aria-label"?: string
  decorative?: boolean
}

export function Icon({
  name,
  size,
  strokeWidth,
  className,
  "aria-label": ariaLabel,
  decorative,
}: IconProps) {
  const px = resolveIconSize(size ?? "sm")
  const sw = resolveIconStrokeWidth(strokeWidth ?? "md")

  const def = iconRegistry[name]
  const a11y = resolveIconA11y({
    ...(ariaLabel !== undefined ? { ariaLabel } : {}),
    ...(decorative !== undefined ? { decorative } : {}),
  })

  return (
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
      aria-hidden={a11y.ariaHidden ? "true" : undefined}
      aria-label={a11y.ariaLabel}
      role={a11y.role}
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
