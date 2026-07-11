import { buildInputFieldA11yIds } from "@marwes-ui/core"
import { computed, defineComponent, h } from "vue"
import { createLocalId } from "../../internal/id"
import { mergeClassNames } from "../../internal/render-utils"
import { Text } from "../text"
import { SegmentedControl, type SegmentedControlPropsVue } from "./segmented-control"

export type SegmentedControlFieldProps = {
  id?: string
  label: string
  description?: string
  error?: string
  segmentedControl: Omit<
    SegmentedControlPropsVue,
    "ariaLabel" | "ariaLabelledBy" | "ariaDescribedBy"
  >
  ariaDescribedBy?: string
  className?: string
}

const segmentedControlFieldPropKeys = [
  "id",
  "label",
  "description",
  "error",
  "segmentedControl",
  "ariaDescribedBy",
  "className",
] as const

function hasTextContent(value: string | undefined): boolean {
  return value !== undefined && value.trim().length > 0
}

/**
 * SegmentedControlField (Molecule)
 *
 * A labeled wrapper around `SegmentedControl`.
 */
export const SegmentedControlField = defineComponent(
  (props: SegmentedControlFieldProps) => {
    const localId = createLocalId("mw-segmented-control")
    const id = computed(() => props.id ?? localId)
    const labelId = computed(() => `${id.value}-label`)

    const hasDescription = computed(() => hasTextContent(props.description))
    const hasError = computed(() => hasTextContent(props.error))

    const a11yIds = computed(() =>
      buildInputFieldA11yIds({
        id: id.value,
        hasHelperText: hasDescription.value,
        hasError: hasError.value,
        externalDescribedBy: props.ariaDescribedBy,
      }),
    )

    const wrapperClass = computed(() =>
      mergeClassNames(
        "mw-segmented-control-field",
        hasError.value && "mw-segmented-control-field--invalid",
        props.className,
      ),
    )

    return () => {
      const sc: SegmentedControlPropsVue = {
        ...(props.segmentedControl as SegmentedControlPropsVue),
        ariaLabelledBy: labelId.value,
      }
      if (a11yIds.value.describedBy) {
        sc.ariaDescribedBy = a11yIds.value.describedBy
      }

      return h("div", { class: wrapperClass.value }, [
        h(
          "span",
          { class: "mw-segmented-control-field__label", id: labelId.value },
          h(Text, { variant: "label" }, () => [props.label]),
        ),
        hasDescription.value && !hasError.value
          ? h(
              "div",
              {
                class: "mw-segmented-control-field__description",
                id: a11yIds.value.helperTextId,
              },
              h(Text, { variant: "caption" }, () => [props.description]),
            )
          : null,
        h(SegmentedControl, sc),
        hasError.value
          ? h(
              "div",
              {
                class: "mw-segmented-control-field__error",
                id: a11yIds.value.errorId,
                "aria-live": "polite",
              },
              h(Text, { variant: "caption" }, () => [props.error]),
            )
          : null,
      ])
    }
  },
  {
    name: "MarwesSegmentedControlField",
    props: [...segmentedControlFieldPropKeys],
  },
)
