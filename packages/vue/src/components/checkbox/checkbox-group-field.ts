import { buildCheckboxGroupFieldA11yIds } from "@marwes-ui/core"
import { computed, defineComponent, h, ref } from "vue"
import { createLocalId } from "../../internal/id"
import { mergeClassNames } from "../../internal/render-utils"
import { Paragraph } from "../paragraph"
import { Checkbox, type CheckboxProps } from "./checkbox"

export interface CheckboxGroupFieldOption {
  value: string
  label: string
  disabled?: boolean
  indeterminate?: boolean
}

export type CheckboxGroupFieldCheckboxProps = Omit<
  CheckboxProps,
  | "ariaDescribedBy"
  | "ariaLabel"
  | "ariaLabelledBy"
  | "checked"
  | "className"
  | "defaultChecked"
  | "disabled"
  | "id"
  | "indeterminate"
  | "invalid"
  | "modelValue"
  | "name"
  | "onChange"
  | "onCheckedChange"
  | "required"
  | "value"
>

export interface CheckboxGroupFieldProps {
  label: string
  options: CheckboxGroupFieldOption[]
  description?: string
  error?: string
  value?: string[]
  defaultValue?: string[]
  checkbox?: CheckboxGroupFieldCheckboxProps
  disabled?: boolean
  required?: boolean
  name?: string
  id?: string
  ariaDescribedBy?: string
  dataAttributes?: Record<string, string>
  modelValue?: string[]
}

const checkboxGroupFieldPropKeys = [
  "label",
  "options",
  "description",
  "error",
  "value",
  "defaultValue",
  "checkbox",
  "disabled",
  "required",
  "name",
  "id",
  "ariaDescribedBy",
  "dataAttributes",
  "modelValue",
] as const

function hasTextContent(value: string | undefined): boolean {
  return value !== undefined && value.trim().length > 0
}

function orderSelectedValues(values: string[], options: CheckboxGroupFieldOption[]): string[] {
  const optionValues = new Set(options.map((option) => option.value))
  const selectedValues = new Set(values)
  const knownValues = options
    .map((option) => option.value)
    .filter((value) => selectedValues.has(value))
  const unknownValues = values.filter((value) => !optionValues.has(value))
  return [...knownValues, ...unknownValues]
}

export const CheckboxGroupField = defineComponent(
  (props: CheckboxGroupFieldProps, { slots, emit }) => {
    const localId = createLocalId("mw-checkbox-group")
    const id = computed(() => props.id ?? localId)

    const hasDescription = computed(() => hasTextContent(props.description))
    const hasError = computed(() => hasTextContent(props.error))

    const a11yIds = computed(() =>
      buildCheckboxGroupFieldA11yIds({
        id: id.value,
        hasDescription: hasDescription.value,
        hasError: hasError.value,
        externalDescribedBy: props.ariaDescribedBy,
      }),
    )

    const isControlled = computed(() => props.modelValue !== undefined || props.value !== undefined)
    const internalValue = ref<string[]>(
      orderSelectedValues(props.defaultValue ?? [], props.options),
    )
    const selectedValues = computed(() => {
      if (props.modelValue !== undefined) {
        return orderSelectedValues(props.modelValue, props.options)
      }

      if (props.value !== undefined) {
        return orderSelectedValues(props.value, props.options)
      }

      return orderSelectedValues(internalValue.value, props.options)
    })

    const wrapperClass = computed(() =>
      mergeClassNames(
        "mw-checkbox-group-field",
        props.disabled && "mw-checkbox-group-field--disabled",
        hasError.value && "mw-checkbox-group-field--invalid",
      ),
    )

    function handleToggle(nextValue: string): void {
      const selectedValueSet = new Set(selectedValues.value)
      const rawNextValue = selectedValueSet.has(nextValue)
        ? selectedValues.value.filter((value) => value !== nextValue)
        : [...selectedValues.value, nextValue]
      const orderedNextValue = orderSelectedValues(rawNextValue, props.options)

      if (!isControlled.value) {
        internalValue.value = orderedNextValue
      }

      emit("update:modelValue", orderedNextValue)
      emit("change", orderedNextValue)
    }

    const labelContent = () => slots.label?.() ?? [props.label]
    const descriptionContent = () =>
      slots.description?.() ?? (props.description ? [props.description] : [])
    const errorContent = () => slots.error?.() ?? (props.error ? [props.error] : [])

    return () =>
      h(
        "fieldset",
        {
          class: wrapperClass.value,
          "aria-labelledby": a11yIds.value.labelId,
          "aria-describedby": a11yIds.value.describedBy,
          "aria-invalid": hasError.value ? true : undefined,
          "aria-required": props.required ? true : undefined,
          disabled: props.disabled ? true : undefined,
          ...(props.dataAttributes ?? {}),
        },
        [
          h("legend", { class: "mw-checkbox-group-field__label", id: a11yIds.value.labelId }, [
            h(Paragraph, { size: "md" }, { default: labelContent }),
          ]),

          h(
            "div",
            { class: "mw-checkbox-group-field__options" },
            props.options.map((option, index) => {
              const optionId = `${id.value}-option-${index}`
              const isOptionDisabled = props.disabled || option.disabled || false
              const isChecked = selectedValues.value.includes(option.value)
              const checkboxProps: Record<string, unknown> = {
                ...(props.checkbox ?? {}),
                id: optionId,
                value: option.value,
                checked: isChecked,
                disabled: isOptionDisabled,
                invalid: hasError.value,
                "onUpdate:modelValue": (nextChecked: boolean) => {
                  if (nextChecked !== isChecked) {
                    handleToggle(option.value)
                  }
                },
              }

              if (props.name !== undefined) {
                checkboxProps.name = props.name
              }

              if (option.indeterminate !== undefined) {
                checkboxProps.indeterminate = option.indeterminate
              }

              return h(
                "label",
                {
                  class: "mw-checkbox-group-field__option",
                  for: optionId,
                  key: option.value,
                },
                [
                  h(Checkbox, checkboxProps),
                  h(Paragraph, { size: "sm" }, { default: () => [option.label] }),
                ],
              )
            }),
          ),

          hasDescription.value
            ? h(
                "div",
                { class: "mw-checkbox-group-field__description", id: a11yIds.value.descriptionId },
                [h(Paragraph, { size: "sm" }, { default: descriptionContent })],
              )
            : null,

          hasError.value
            ? h(
                "div",
                {
                  class: "mw-checkbox-group-field__error",
                  id: a11yIds.value.errorId,
                  "aria-live": "polite",
                },
                [h(Paragraph, { size: "sm" }, { default: errorContent })],
              )
            : null,
        ],
      )
  },
  {
    name: "MarwesCheckboxGroupField",
    props: [...checkboxGroupFieldPropKeys],
    emits: ["update:modelValue", "change"],
  },
)
