import { computed, defineComponent, h } from "vue"
import { createLocalId } from "../../internal/id"
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

const badgeGroupPropKeys = ["label", "className", "id", "dataAttributes"] as const

export const BadgeGroup = defineComponent(
  (props: BadgeGroupProps, { slots }) => {
    const localId = createLocalId("mw-badge-group")
    const id = computed(() => props.id ?? localId)
    const labelId = computed(() => `${id.value}-label`)

    const wrapperClass = computed(() => mergeClassNames("mw-badge-group", props.className))

    return () =>
      h(
        "fieldset",
        {
          class: wrapperClass.value,
          "aria-labelledby": labelId.value,
          ...(props.dataAttributes ?? {}),
        },
        [
          h("legend", { class: "mw-badge-group__label", id: labelId.value }, [
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
