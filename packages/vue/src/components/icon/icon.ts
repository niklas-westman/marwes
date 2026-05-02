import {
  type IconSize,
  type IconStrokeWidth,
  iconRegistry,
  resolveIconA11y,
  resolveIconSize,
  resolveIconStrokeWidth,
} from "@marwes-ui/core"
import { defineComponent, h, useAttrs } from "vue"

type IconName = keyof typeof iconRegistry

export type IconProps = {
  name: IconName
  size?: IconSize | number
  strokeWidth?: IconStrokeWidth | number
  className?: string
  ariaLabel?: string
  decorative?: boolean
}

const iconPropKeys = [
  "name",
  "size",
  "strokeWidth",
  "className",
  "ariaLabel",
  "decorative",
] as const

export const Icon = defineComponent(
  (props: IconProps) => {
    const attrs = useAttrs()

    return () => {
      const px = resolveIconSize(props.size ?? "sm")
      const strokeWidth = resolveIconStrokeWidth(props.strokeWidth ?? "md")
      const iconDefinition = iconRegistry[props.name]
      const ariaLabelFromAttrs =
        typeof attrs["aria-label"] === "string" ? (attrs["aria-label"] as string) : undefined
      const ariaLabel = props.ariaLabel ?? ariaLabelFromAttrs
      const a11y = resolveIconA11y({
        ...(ariaLabel !== undefined ? { ariaLabel } : {}),
        ...(props.decorative !== undefined ? { decorative: props.decorative } : {}),
      })

      return h(
        "svg",
        {
          ...attrs,
          width: px,
          height: px,
          viewBox: iconDefinition.viewBox,
          fill: "none",
          stroke: "currentColor",
          "stroke-width": strokeWidth,
          "stroke-linecap": "round",
          "stroke-linejoin": "round",
          class: [props.className, attrs.class],
          "aria-hidden": a11y.ariaHidden ? "true" : undefined,
          "aria-label": a11y.ariaLabel,
          role: a11y.role,
          focusable: "false",
        },
        iconDefinition.nodes.map((iconNode) => h(iconNode.tag, iconNode.attrs)),
      )
    }
  },
  {
    name: "MarwesIcon",
    inheritAttrs: false,
    props: [...iconPropKeys],
  },
)
