import { computed, defineComponent, h, useAttrs } from "vue"
import { mergeClassNames, omitAttrs } from "../../internal/render-utils"
import { Avatar, type AvatarProps } from "./avatar"

export interface AvatarGroupItem extends Omit<AvatarProps, "size" | "className" | "style"> {
  id?: string
}

export type AvatarGroupProps = {
  items: AvatarGroupItem[]
  overflowCount?: number
  overflowLabel?: string
  ariaLabel?: string
  label?: string
  className?: string
  dataAttributes?: Record<string, string>
}

const avatarGroupPropKeys = [
  "items",
  "overflowCount",
  "overflowLabel",
  "ariaLabel",
  "label",
  "className",
  "dataAttributes",
] as const

export const AvatarGroup = defineComponent(
  (props: AvatarGroupProps) => {
    const attrs = useAttrs()
    const nativeAriaLabel =
      typeof attrs["aria-label"] === "string" ? (attrs["aria-label"] as string) : undefined
    const groupLabel = computed(
      () => props.ariaLabel ?? props.label ?? nativeAriaLabel ?? "Avatar group",
    )
    const wrapperClass = computed(() =>
      mergeClassNames("mw-avatar-group", props.className, attrs.class),
    )
    const shouldRenderOverflowCounter = computed(
      () => props.overflowCount !== undefined && props.overflowCount > 0,
    )
    const resolvedOverflowLabel = computed(
      () => props.overflowLabel ?? `${props.overflowCount} more people`,
    )

    return () => {
      const passthroughAttrs = omitAttrs(attrs as Record<string, unknown>, ["class", "aria-label"])

      return h(
        "fieldset",
        {
          ...passthroughAttrs,
          ...(props.dataAttributes ?? {}),
          class: wrapperClass.value,
          "data-component": "avatar-group",
          "aria-label": groupLabel.value,
        },
        [
          ...props.items.map((item, itemIndex) =>
            h(
              "span",
              {
                class: "mw-avatar-group__item",
                key: item.id ?? `${itemIndex}-${item.initials ?? item.alt ?? "avatar"}`,
              },
              [
                h(Avatar, {
                  ...item,
                  size: "medium",
                }),
              ],
            ),
          ),
          shouldRenderOverflowCounter.value
            ? h(
                "span",
                {
                  class: "mw-avatar-group__counter",
                  role: "img",
                  "aria-label": resolvedOverflowLabel.value,
                },
                `+${props.overflowCount}`,
              )
            : null,
        ],
      )
    }
  },
  {
    name: "MarwesAvatarGroup",
    inheritAttrs: false,
    props: [...avatarGroupPropKeys],
  },
)
