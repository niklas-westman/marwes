import { buildInputFieldA11yIds } from "@marwes-ui/core"
import { computed, defineComponent, h } from "vue"
import { createLocalId } from "../../internal/id"
import { mergeClassNames } from "../../internal/render-utils"
import { Text } from "../text"
import { Textarea, type TextareaProps } from "./textarea"

export type TextareaFieldProps = {
  id?: string
  label: string
  helperText?: string
  error?: string
  textarea: TextareaProps
  ariaDescribedBy?: string
  modelValue?: string
}

const textareaFieldPropKeys = [
  "id",
  "label",
  "helperText",
  "error",
  "textarea",
  "ariaDescribedBy",
  "modelValue",
] as const

function hasTextContent(value: string | undefined): boolean {
  return value !== undefined && value.trim().length > 0
}

export const TextareaField = defineComponent(
  (props: TextareaFieldProps, { slots, emit }) => {
    const localTextareaId = createLocalId("mw-textarea")
    const id = computed(() => props.id ?? localTextareaId)
    const sourceTextarea = computed<TextareaProps>(() => props.textarea)

    const externalValue = computed(
      () => props.modelValue ?? sourceTextarea.value.modelValue ?? sourceTextarea.value.value,
    )

    const hasHelperText = computed(() => hasTextContent(props.helperText))
    const hasError = computed(() => hasTextContent(props.error))

    const a11yIds = computed(() =>
      buildInputFieldA11yIds({
        id: id.value,
        hasHelperText: hasHelperText.value,
        hasError: hasError.value,
        externalDescribedBy: props.ariaDescribedBy,
      }),
    )

    const disabled = computed(() => sourceTextarea.value.disabled || false)
    const readOnly = computed(() => sourceTextarea.value.readOnly || false)
    const invalid = computed(() => hasError.value || sourceTextarea.value.invalid || false)

    const wrapperClass = computed(() =>
      mergeClassNames(
        "mw-input-field",
        "mw-input-field--textarea",
        disabled.value && "mw-input-field--disabled",
        invalid.value && "mw-input-field--invalid",
        readOnly.value && "mw-input-field--readonly",
      ),
    )

    const mergedTextareaProps = computed<TextareaProps>(() => {
      const nextTextareaProps: TextareaProps = {
        ...sourceTextarea.value,
        id: id.value,
        invalid: invalid.value,
      }

      if (externalValue.value !== undefined) {
        nextTextareaProps.modelValue = externalValue.value
      }

      if (a11yIds.value.describedBy) {
        nextTextareaProps.describedBy = a11yIds.value.describedBy
      }

      const originalOnValueChange = sourceTextarea.value.onValueChange
      nextTextareaProps.onValueChange = (nextValue: string) => {
        originalOnValueChange?.(nextValue)
        emit("update:modelValue", nextValue)
        emit("value-change", nextValue)
      }

      return nextTextareaProps
    })

    const labelContent = () => slots.label?.() ?? [props.label]
    const helperContent = () => slots.helper?.() ?? (props.helperText ? [props.helperText] : [])
    const errorContent = () => slots.error?.() ?? (props.error ? [props.error] : [])

    return () =>
      h("div", { class: wrapperClass.value }, [
        h("label", { class: "mw-input-field__label", for: id.value }, [
          h(Text, { variant: "label" }, { default: labelContent }),
        ]),

        h("div", { class: "mw-input-field__input-wrapper" }, [
          h(Textarea, mergedTextareaProps.value),
        ]),

        hasHelperText.value && !hasError.value
          ? h("div", { class: "mw-input-field__helper", id: a11yIds.value.helperTextId }, [
              h(Text, { variant: "caption" }, { default: helperContent }),
            ])
          : null,

        hasError.value
          ? h(
              "div",
              {
                class: "mw-input-field__error",
                id: a11yIds.value.errorId,
                "aria-live": "polite",
              },
              [h(Text, { variant: "caption" }, { default: errorContent })],
            )
          : null,
      ])
  },
  {
    name: "MarwesTextareaField",
    props: [...textareaFieldPropKeys],
    emits: ["update:modelValue", "value-change"],
  },
)
