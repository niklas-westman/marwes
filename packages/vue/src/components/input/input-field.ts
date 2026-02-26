import { buildInputFieldA11yIds } from "@marwes-ui/core"
import { computed, defineComponent, h, ref } from "vue"
import { createLocalId } from "../../internal/id"
import { mergeClassNames } from "../../internal/render-utils"
import { Icon } from "../icon"
import { Paragraph } from "../paragraph"
import { Input, type InputProps } from "./input"

export type InputFieldProps = {
  id?: string
  label: string
  helperText?: string
  error?: string
  input?: InputProps
  ariaDescribedBy?: string
  modelValue?: string
}

const inputFieldPropKeys = [
  "id",
  "label",
  "helperText",
  "error",
  "input",
  "ariaDescribedBy",
  "modelValue",
] as const

function hasTextContent(value: string | undefined): boolean {
  return value !== undefined && value.trim().length > 0
}

export const InputField = defineComponent(
  (props: InputFieldProps, { slots, emit }) => {
    const localInputId = createLocalId("mw-input")
    const id = computed(() => props.id ?? localInputId)
    const sourceInput = computed<InputProps>(() => props.input ?? {})

    const showPassword = ref(false)
    const searchValue = ref(
      String(
        sourceInput.value.modelValue ??
          sourceInput.value.value ??
          sourceInput.value.defaultValue ??
          "",
      ),
    )

    const isPasswordField = computed(() => sourceInput.value.type === "password")
    const isSearchField = computed(() => sourceInput.value.type === "search")

    const externalValue = computed(
      () => props.modelValue ?? sourceInput.value.modelValue ?? sourceInput.value.value,
    )
    const hasSearchValue = computed(() => {
      if (!isSearchField.value) {
        return false
      }

      if (externalValue.value !== undefined) {
        return String(externalValue.value).length > 0
      }

      return String(searchValue.value).length > 0
    })

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

    const disabled = computed(() => sourceInput.value.disabled || false)
    const readOnly = computed(() => sourceInput.value.readOnly || false)
    const invalid = computed(() => hasError.value || sourceInput.value.invalid || false)

    const wrapperClass = computed(() =>
      mergeClassNames(
        "mw-input-field",
        disabled.value && "mw-input-field--disabled",
        invalid.value && "mw-input-field--invalid",
        readOnly.value && "mw-input-field--readonly",
      ),
    )

    const mergedInputProps = computed<InputProps>(() => {
      const nextInputProps: InputProps = {
        ...sourceInput.value,
        id: id.value,
        invalid: invalid.value,
      }

      if (externalValue.value !== undefined) {
        nextInputProps.modelValue = externalValue.value
      }

      if (isPasswordField.value && showPassword.value) {
        nextInputProps.type = "text"
      }

      if (isSearchField.value) {
        if (externalValue.value === undefined) {
          nextInputProps.modelValue = searchValue.value
        }
      }

      if (a11yIds.value.describedBy) {
        nextInputProps.describedBy = a11yIds.value.describedBy
      }

      const originalOnValueChange = sourceInput.value.onValueChange
      nextInputProps.onValueChange = (nextValue: string) => {
        if (isSearchField.value) {
          searchValue.value = nextValue
        }
        originalOnValueChange?.(nextValue)
        emit("update:modelValue", nextValue)
        emit("value-change", nextValue)
      }

      return nextInputProps
    })

    const labelContent = () => slots.label?.() ?? [props.label]
    const helperContent = () => slots.helper?.() ?? (props.helperText ? [props.helperText] : [])
    const errorContent = () => slots.error?.() ?? (props.error ? [props.error] : [])

    return () =>
      h("div", { class: wrapperClass.value }, [
        h("label", { class: "mw-input-field__label", for: id.value }, [
          h(Paragraph, { size: "md" }, { default: labelContent }),
        ]),

        h("div", { class: "mw-input-field__input-wrapper" }, [
          h(Input, mergedInputProps.value),

          isPasswordField.value
            ? h(
                "button",
                {
                  type: "button",
                  class: "mw-input-field__toggle-password",
                  onClick: () => {
                    showPassword.value = !showPassword.value
                  },
                  "aria-label": showPassword.value ? "Hide password" : "Show password",
                  tabIndex: 0,
                },
                [
                  h(Icon, {
                    name: showPassword.value ? "eyeOff" : "eye",
                    size: "xs",
                    decorative: true,
                  }),
                ],
              )
            : null,

          hasSearchValue.value
            ? h(
                "button",
                {
                  type: "button",
                  class: "mw-input-field__clear-search",
                  onClick: () => {
                    searchValue.value = ""
                    sourceInput.value.onValueChange?.("")
                    emit("update:modelValue", "")
                    emit("value-change", "")
                  },
                  "aria-label": "Clear search",
                  tabIndex: 0,
                },
                [h(Icon, { name: "x", size: "xs", decorative: true })],
              )
            : null,
        ]),

        hasHelperText.value && !hasError.value
          ? h("div", { class: "mw-input-field__helper", id: a11yIds.value.helperTextId }, [
              h(Paragraph, { size: "sm" }, { default: helperContent }),
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
              [h(Paragraph, { size: "sm" }, { default: errorContent })],
            )
          : null,
      ])
  },
  {
    name: "MarwesInputField",
    props: [...inputFieldPropKeys],
    emits: ["update:modelValue", "value-change"],
  },
)
