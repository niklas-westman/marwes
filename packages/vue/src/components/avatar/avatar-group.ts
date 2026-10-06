import {
  createAvatarGroupRecipe,
  toAvatarGroupCounterHtmlAttributes,
  toAvatarGroupHtmlAttributes,
} from "@marwes-ui/core"
import { computed, defineComponent, h, useAttrs } from "vue"
import { definePropKeys } from "../../internal/prop-keys"
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

const avatarGroupPropKeys = definePropKeys<AvatarGroupProps>()([
  "items",
  "overflowCount",
  "overflowLabel",
  "ariaLabel",
  "label",
  "className",
  "dataAttributes",
])

export const AvatarGroup = defineComponent(
  (props: AvatarGroupProps) => {
    const attrs = useAttrs()
    const nativeAriaLabel =
      typeof attrs["aria-label"] === "string" ? (attrs["aria-label"] as string) : undefined
    const kit = computed(() => {
      const ariaLabel = props.ariaLabel ?? nativeAriaLabel
      return createAvatarGroupRecipe({
        ...(props.overflowCount !== undefined ? { overflowCount: props.overflowCount } : {}),
        ...(props.overflowLabel !== undefined ? { overflowLabel: props.overflowLabel } : {}),
        ...(ariaLabel !== undefined ? { ariaLabel } : {}),
        ...(props.label !== undefined ? { label: props.label } : {}),
      })
    })
    const wrapperClass = computed(() =>
      mergeClassNames(kit.value.className, props.className, attrs.class),
    )

    return () => {
      const passthroughAttrs = omitAttrs(attrs as Record<string, unknown>, ["class", "aria-label"])

      return h(
        "fieldset",
        {
          ...passthroughAttrs,
          ...(props.dataAttributes ?? {}),
          class: wrapperClass.value,
          ...kit.value.dataAttributes,
          ...toAvatarGroupHtmlAttributes(kit.value.a11y),
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
          kit.value.counter.visible
            ? h(
                "span",
                {
                  class: "mw-avatar-group__counter",
                  ...toAvatarGroupCounterHtmlAttributes(kit.value.counter.a11y),
                },
                kit.value.counter.text,
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
