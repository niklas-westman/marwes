import { createBadgeGroupRecipe, toBadgeGroupHtmlAttributes } from "@marwes-ui/core"
import { computed, defineComponent, h } from "vue"
import { createLocalId } from "../../internal/id"
import { definePropKeys } from "../../internal/prop-keys"
import { mergeClassNames } from "../../internal/render-utils"
import { Text } from "../text"

export interface BadgeGroupProps {
  /** Visible label for the badge group. */
  label: string

  /** Additional CSS class names. */
  className?: string

  /** Explicit ID. If omitted, generated via createLocalId(). */
  id?: string

  /** Data attributes for AI-friendly metadata (used by context variants). */
  dataAttributes?: Record<string, string>
}

const badgeGroupPropKeys = definePropKeys<BadgeGroupProps>()([
  "label",
  "className",
  "id",
  "dataAttributes",
])

export const BadgeGroup = defineComponent(
  (props: BadgeGroupProps, { slots }) => {
    const localId = createLocalId("mw-badge-group")
    const id = computed(() => props.id ?? localId)
    const kit = computed(() => createBadgeGroupRecipe({ id: id.value }))

    const wrapperClass = computed(() => mergeClassNames(kit.value.className, props.className))

    return () =>
      h(
        "fieldset",
        {
          class: wrapperClass.value,
          ...toBadgeGroupHtmlAttributes(kit.value.a11y),
          ...(props.dataAttributes ?? {}),
        },
        [
          h("legend", { class: "mw-badge-group__label", id: kit.value.labelId }, [
            h(Text, { variant: "caption" }, { default: () => [props.label] }),
          ]),
          h("div", { class: "mw-badge-group__items" }, slots.default?.()),
        ],
      )
  },
  {
    name: "MarwesBadgeGroup",
    inheritAttrs: false,
    props: [...badgeGroupPropKeys],
  },
)
