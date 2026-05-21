import { createBannerRecipe } from "@marwes-ui/core"
import type { BannerOptions } from "@marwes-ui/core"
import { computed, defineComponent, h, useAttrs } from "vue"
import { mergeClassNames, omitAttrs } from "../../internal/render-utils"

export type BannerProps = BannerOptions & {
  className?: string
  id?: string
}

const bannerPropKeys = [
  "variant",
  "showIcon",
  "showAction",
  "dismissible",
  "ariaLabel",
  "className",
  "id",
] as const

export const Banner = defineComponent(
  (props: BannerProps, { slots, emit }) => {
    const attrs = useAttrs()

    const kit = computed(() => {
      const opts: BannerOptions = {}
      if (props.variant !== undefined) opts.variant = props.variant
      if (props.showIcon !== undefined) opts.showIcon = props.showIcon
      if (props.dismissible !== undefined) opts.dismissible = props.dismissible
      if (props.ariaLabel !== undefined) opts.ariaLabel = props.ariaLabel
      opts.showAction = props.showAction ?? Boolean(slots.action)
      return createBannerRecipe(opts)
    })

    return () => {
      const renderKit = kit.value
      const passthroughAttrs = omitAttrs(attrs as Record<string, unknown>, ["class", "style"])
      const className = mergeClassNames(renderKit.root.className, props.className, attrs.class)

      const contentChildren = []

      // Icon slot
      if (renderKit.icon.visible) {
        const iconContent = slots.icon?.() ?? [
          h("svg", {
            xmlns: "http://www.w3.org/2000/svg",
            width: "12",
            height: "12",
            viewBox: "0 0 24 24",
            fill: "currentColor",
            "aria-hidden": "true",
            innerHTML:
              '<path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/>',
          }),
        ]
        contentChildren.push(h("span", { class: renderKit.icon.className }, iconContent))
      }

      // Message
      contentChildren.push(h("span", { class: renderKit.message.className }, slots.default?.()))

      const rootChildren = [h("div", { class: renderKit.content.className }, contentChildren)]

      // Action slot
      if (renderKit.action.visible && slots.action) {
        rootChildren.push(h("div", { class: renderKit.action.className }, slots.action()))
      }

      // Dismiss button
      if (renderKit.dismiss.visible) {
        rootChildren.push(
          h("button", {
            type: "button",
            class: renderKit.dismiss.className,
            "aria-label": renderKit.dismiss.ariaLabel,
            onClick: () => emit("dismiss"),
          }),
        )
      }

      return h(
        "div",
        {
          ...passthroughAttrs,
          ...renderKit.root.dataAttributes,
          id: props.id,
          class: className,
          role: renderKit.root.a11y.role,
          "aria-label": renderKit.root.a11y.ariaLabel,
          "aria-live": renderKit.root.a11y.ariaLive,
        },
        rootChildren,
      )
    }
  },
  {
    name: "MarwesBanner",
    inheritAttrs: false,
    props: [...bannerPropKeys],
    emits: ["dismiss"],
  },
)
