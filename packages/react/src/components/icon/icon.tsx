import {
  type IconColor,
  type IconSize,
  type IconStrokeWidth,
  createIconRecipe,
  type iconRegistry,
  toIconHtmlAttributes,
} from "@marwes-ui/core"
import type * as React from "react"
import { toReactAttributes } from "../../internal/react-attributes"

type IconName = keyof typeof iconRegistry

export type IconProps = {
  name: IconName

  /**
   * Icon scale token ("xs"|"sm"|"md"|"lg") or an explicit pixel size.
   * Defaults to "sm".
   */
  size?: IconSize | number

  /**
   * Stroke-width token ("xs"|"sm"|"md"|"lg") or an explicit numeric stroke width.
   * Defaults to "md".
   */
  strokeWidth?: IconStrokeWidth | number

  /** Stroke colour token. Defaults to "currentColor". */
  color?: IconColor

  /**
   * Common props
   */
  className?: string
  ariaLabel?: string
  ariaHidden?: boolean
  decorative?: boolean
}

export function Icon({
  name,
  size,
  strokeWidth,
  color,
  className,
  ariaLabel,
  ariaHidden,
  decorative,
}: IconProps) {
  const kit = createIconRecipe({
    name,
    ...(size !== undefined ? { size } : {}),
    ...(strokeWidth !== undefined ? { strokeWidth } : {}),
    ...(color !== undefined ? { color } : {}),
    ...(ariaLabel !== undefined ? { ariaLabel } : {}),
    ...(ariaHidden !== undefined ? { ariaHidden } : {}),
    ...(decorative !== undefined ? { decorative } : {}),
  })

  return (
    // biome-ignore lint/a11y/noSvgWithoutTitle: aria-label, aria-hidden and role come from the spread a11y attributes
    <svg
      width={kit.svg.width}
      height={kit.svg.height}
      viewBox={kit.svg.viewBox}
      fill="none"
      stroke="currentColor"
      strokeWidth={kit.vars["--mw-icon-stroke-width"]}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={[kit.className, className].filter(Boolean).join(" ")}
      style={kit.vars as React.CSSProperties}
      {...toReactAttributes(toIconHtmlAttributes(kit.a11y))}
      focusable="false"
    >
      {kit.svg.nodes.map((iconNode, nodeIndex) => {
        const TagName = iconNode.tag
        // biome-ignore lint/suspicious/noArrayIndexKey: Icon nodes are static and never reordered
        return <TagName key={nodeIndex} {...(iconNode.attrs as React.SVGAttributes<SVGElement>)} />
      })}
    </svg>
  )
}
