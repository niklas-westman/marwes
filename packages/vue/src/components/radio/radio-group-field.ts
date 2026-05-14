import { buildRadioGroupFieldA11yIds } from "@marwes-ui/core"
import { computed, defineComponent, h, ref } from "vue"
import { createLocalId } from "../../internal/id"
import { mergeClassNames } from "../../internal/render-utils"
import { Paragraph } from "../paragraph"
import { Radio } from "./radio"

export interface RadioGroupFieldOption {
  value: string
  label: string
  disabled?: boolean
}

export interface RadioGroupFieldProps {
  name: string
  label: string
  description?: string
  error?: string
  value?: string
  onChange?: (value: string) => void
  defaultValue?: string
  options: RadioGroupFieldOption[]
  disabled?: boolean
  required?: boolean
  id?: string
  ariaDescribedBy?: string
  dataAttributes?: Record<string, string>
  modelValue?: string
}

const radioGroupFieldPropKeys = [
  "name",
  "label",
  "description",
  "error",
  "value",
  "onChange",
  "defaultValue",
  "options",
  "disabled",
  "required",
  "id",
  "ariaDescribedBy",
  "dataAttributes",
  "modelValue",
] as const

function hasTextContent(value: string | undefined): boolean {
  return value !== undefined && value.trim().length > 0
}

export const RadioGroupField = defineComponent(
  (props: RadioGroupFieldProps, { slots, emit }) => {
    const localGroupId = createLocalId("mw-radio-group")
    const id = computed(() => props.id ?? localGroupId)

    const hasDescription = computed(() => hasTextContent(props.description))
    const hasError = computed(() => hasTextContent(props.error))

    const a11yIds = computed(() =>
      buildRadioGroupFieldA11yIds({
        id: id.value,
        hasDescription: hasDescription.value,
        hasError: hasError.value,
        externalDescribedBy: props.ariaDescribedBy,
      }),
    )

    const isControlled = computed(() => props.modelValue !== undefined || props.value !== undefined)
    const internalValue = ref(props.defaultValue)
    const selectedValue = computed(() => {
      if (props.modelValue !== undefined) return props.modelValue
      if (props.value !== undefined) return props.value
      return internalValue.value
    })

    const wrapperClass = computed(() =>
      mergeClassNames(
        "mw-radio-group-field",
        props.disabled && "mw-radio-group-field--disabled",
        hasError.value && "mw-radio-group-field--invalid",
      ),
    )

    function handleSelect(nextValue: string): void {
      if (!isControlled.value) {
        internalValue.value = nextValue
      }

      props.onChange?.(nextValue)
      emit("update:modelValue", nextValue)
      emit("change", nextValue)
    }

    const labelContent = () => slots.label?.() ?? [props.label]
    const descriptionContent = () =>
      slots.description?.() ?? (props.description ? [props.description] : [])
    const errorContent = () => slots.error?.() ?? (props.error ? [props.error] : [])

    return () =>
      h(
        "div",
        {
          class: wrapperClass.value,
          ...(props.dataAttributes ?? {}),
        },
        [
          h("div", { class: "mw-radio-group-field__label", id: a11yIds.value.labelId }, [
            h(Paragraph, { size: "sm" }, { default: labelContent }),
          ]),

          hasDescription.value
            ? h(
                "div",
                { class: "mw-radio-group-field__description", id: a11yIds.value.descriptionId },
                [h(Paragraph, { size: "sm" }, { default: descriptionContent })],
              )
            : null,

          h(
            "div",
            {
              role: "radiogroup",
              "aria-labelledby": a11yIds.value.labelId,
              "aria-describedby": a11yIds.value.describedBy,
              "aria-invalid": hasError.value ? true : undefined,
              "aria-required": props.required ? true : undefined,
              class: "mw-radio-group-field__options",
            },
            props.options.map((option) => {
              const optionId = `${id.value}-option-${option.value}`
              const isOptionDisabled = props.disabled || option.disabled || false

              return h(
                "label",
                {
                  class: "mw-radio-group-field__option",
                  for: optionId,
                  key: option.value,
                },
                [
                  h(Radio, {
                    id: optionId,
                    name: props.name,
                    value: option.value,
                    checked: selectedValue.value === option.value,
                    disabled: isOptionDisabled,
                    invalid: hasError.value,
                    ...(props.required ? { required: true } : {}),
                    onCheckedChange: (checked: boolean) => {
                      if (checked) {
                        handleSelect(option.value)
                      }
                    },
                  }),
                  h(Paragraph, { size: "sm" }, { default: () => [option.label] }),
                ],
              )
            }),
          ),

          hasError.value
            ? h(
                "div",
                {
                  class: "mw-radio-group-field__error",
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
    name: "MarwesRadioGroupField",
    props: [...radioGroupFieldPropKeys],
    emits: ["update:modelValue", "change"],
  },
)
