import { buildCheckboxFieldA11yIds } from "@marwes-ui/core"
import { computed, defineComponent, h } from "vue"
import { createLocalId } from "../../internal/id"
import { mergeClassNames } from "../../internal/render-utils"
import { Paragraph } from "../paragraph"
import { Checkbox, type CheckboxProps } from "./checkbox"

export type CheckboxFieldProps = {
  id?: string
  label: string
  description?: string
  error?: string
  checkbox?: CheckboxProps
  ariaDescribedBy?: string
  modelValue?: boolean
}

const checkboxFieldPropKeys = [
  "id",
  "label",
  "description",
  "error",
  "checkbox",
  "ariaDescribedBy",
  "modelValue",
] as const

export const CheckboxField = defineComponent(
  (props: CheckboxFieldProps, { slots, emit }) => {
    const localCheckboxId = createLocalId("mw-checkbox")
    const id = computed(() => props.id ?? localCheckboxId)
    const sourceCheckbox = computed<CheckboxProps>(() => props.checkbox ?? {})

    const hasDescription = computed(() => props.description !== undefined)
    const hasError = computed(() => props.error !== undefined)
    const ids = computed(() =>
      buildCheckboxFieldA11yIds({
        id: id.value,
        hasDescription: hasDescription.value,
        hasError: hasError.value,
        externalDescribedBy: props.ariaDescribedBy,
      }),
    )

    const disabled = computed(() => sourceCheckbox.value.disabled || false)
    const invalid = computed(() => hasError.value || sourceCheckbox.value.invalid || false)
    const wrapperClass = computed(() =>
      mergeClassNames(
        "mw-checkbox-field",
        disabled.value && "mw-checkbox-field--disabled",
        invalid.value && "mw-checkbox-field--invalid",
      ),
    )

    const mergedCheckboxProps = computed<CheckboxProps>(() => {
      const nextCheckboxProps: CheckboxProps = {
        ...sourceCheckbox.value,
        id: id.value,
        invalid: invalid.value,
      }

      if (props.modelValue !== undefined) {
        nextCheckboxProps.modelValue = props.modelValue
      }

      if (ids.value.describedBy) {
        nextCheckboxProps.ariaDescribedBy = ids.value.describedBy
      }

      const originalOnCheckedChange = sourceCheckbox.value.onCheckedChange
      nextCheckboxProps.onCheckedChange = (nextChecked: boolean) => {
        originalOnCheckedChange?.(nextChecked)
        emit("update:modelValue", nextChecked)
        emit("checked-change", nextChecked)
      }

      return nextCheckboxProps
    })

    const labelContent = () => slots.label?.() ?? [props.label]
    const descriptionContent = () =>
      slots.description?.() ?? (props.description ? [props.description] : [])
    const errorContent = () => slots.error?.() ?? (props.error ? [props.error] : [])

    return () =>
      h("div", { class: wrapperClass.value }, [
        h("div", { class: "mw-checkbox-field__row" }, [
          h(Checkbox, mergedCheckboxProps.value),
          h("label", { class: "mw-checkbox-field__label", for: id.value }, [
            h(Paragraph, { size: "md" }, { default: labelContent }),
          ]),
        ]),

        hasDescription.value
          ? h("div", { class: "mw-checkbox-field__description", id: ids.value.descriptionId }, [
              h(Paragraph, { size: "sm" }, { default: descriptionContent }),
            ])
          : null,

        hasError.value
          ? h(
              "div",
              {
                class: "mw-checkbox-field__error",
                id: ids.value.errorId,
                "aria-live": "polite",
              },
              [h(Paragraph, { size: "sm" }, { default: errorContent })],
            )
          : null,
      ])
  },
  {
    name: "MarwesCheckboxField",
    props: [...checkboxFieldPropKeys],
    emits: ["update:modelValue", "checked-change"],
  },
)
