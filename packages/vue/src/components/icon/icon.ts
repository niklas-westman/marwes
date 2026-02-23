import {
  type IconSize,
  type IconStrokeWidth,
  iconRegistry,
  resolveIconSize,
  resolveIconStrokeWidth,
} from "@marwes-ui/core"
import { defineComponent, h, useAttrs } from "vue"
import { useTheme } from "../../provider/use-theme"

type IconName = keyof typeof iconRegistry

export type IconProps = {
  name: IconName
  size?: IconSize | number
  strokeWidth?: IconStrokeWidth | number
  className?: string
  ariaLabel?: string
  decorative?: boolean
}

export const Icon = defineComponent({
  name: "MarwesIcon",
  inheritAttrs: false,
  props: ["name", "size", "strokeWidth", "className", "ariaLabel", "decorative"],
  setup(rawProps) {
    const props = rawProps as unknown as IconProps
    const attrs = useAttrs()
    const theme = useTheme()

    return () => {
      const themeIcon = theme.value.icon
      const px = resolveIconSize(props.size ?? themeIcon.size)
      const strokeWidth = resolveIconStrokeWidth(props.strokeWidth ?? themeIcon.strokeWidth)
      const iconDefinition = iconRegistry[props.name]
      const ariaLabelFromAttrs =
        typeof attrs["aria-label"] === "string" ? (attrs["aria-label"] as string) : undefined
      const ariaLabel = props.ariaLabel ?? ariaLabelFromAttrs
      const isDecorative = props.decorative || !ariaLabel

      return h(
        "svg",
        {
          ...attrs,
          width: px,
          height: px,
          viewBox: iconDefinition.viewBox,
          fill: "none",
          stroke: "currentColor",
          strokeWidth,
          strokeLinecap: "round",
          strokeLinejoin: "round",
          class: [props.className, attrs.class],
          "aria-hidden": isDecorative ? "true" : undefined,
          "aria-label": ariaLabel,
          role: isDecorative ? undefined : "img",
          focusable: "false",
        },
        iconDefinition.nodes.map((iconNode) => h(iconNode.tag, iconNode.attrs)),
      )
    }
  },
})
