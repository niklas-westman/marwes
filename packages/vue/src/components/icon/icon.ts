import {
  type IconColor,
  type IconSize,
  type IconStrokeWidth,
  createIconRecipe,
  type iconRegistry,
  toIconHtmlAttributes,
} from "@marwes-ui/core"
import { defineComponent, h, useAttrs } from "vue"
import { definePropKeys } from "../../internal/prop-keys"

type IconName = keyof typeof iconRegistry

export type IconProps = {
  name: IconName
  size?: IconSize | number
  strokeWidth?: IconStrokeWidth | number
  color?: IconColor
  className?: string
  ariaLabel?: string
  ariaHidden?: boolean
  decorative?: boolean
}

const iconPropKeys = definePropKeys<IconProps>()([
  "name",
  "size",
  "strokeWidth",
  "color",
  "className",
  "ariaLabel",
  "ariaHidden",
  "decorative",
])

export const Icon = defineComponent(
  (props: IconProps) => {
    const attrs = useAttrs()

    return () => {
      const ariaLabelFromAttrs =
        typeof attrs["aria-label"] === "string" ? (attrs["aria-label"] as string) : undefined
      const ariaLabel = props.ariaLabel ?? ariaLabelFromAttrs
      const kit = createIconRecipe({
        name: props.name,
        ...(props.size !== undefined ? { size: props.size } : {}),
        ...(props.strokeWidth !== undefined ? { strokeWidth: props.strokeWidth } : {}),
        ...(props.color !== undefined ? { color: props.color } : {}),
        ...(ariaLabel !== undefined ? { ariaLabel } : {}),
        ...(props.ariaHidden !== undefined ? { ariaHidden: props.ariaHidden } : {}),
        ...(props.decorative !== undefined ? { decorative: props.decorative } : {}),
      })

      return h(
        "svg",
        {
          ...attrs,
          width: kit.svg.width,
          height: kit.svg.height,
          viewBox: kit.svg.viewBox,
          fill: "none",
          stroke: "currentColor",
          "stroke-width": kit.vars["--mw-icon-stroke-width"],
          "stroke-linecap": "round",
          "stroke-linejoin": "round",
          class: [kit.className, props.className, attrs.class],
          style: [kit.vars, attrs.style],
          ...toIconHtmlAttributes(kit.a11y),
          focusable: "false",
        },
        kit.svg.nodes.map((iconNode) => h(iconNode.tag, iconNode.attrs)),
      )
    }
  },
  {
    name: "MarwesIcon",
    inheritAttrs: false,
    props: [...iconPropKeys],
  },
)
