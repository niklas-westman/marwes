import {
  type InputOtpOptions,
  buildInputFieldA11yIds,
  createInputOtpRecipe,
  sanitizeInputOtpValue,
} from "@marwes-ui/core"
import { computed, defineComponent, h, ref } from "vue"
import { createLocalId } from "../../internal/id"
import { mergeClassNames } from "../../internal/render-utils"
import { Paragraph } from "../paragraph"

export type InputOtpProps = Omit<InputOtpOptions, "describedBy"> & {
  label: string
  helperText?: string
  error?: string
  ariaDescribedBy?: string
  modelValue?: string
  onValueChange?: (value: string) => void
  className?: string
}

const inputOtpPropKeys = [
  "id",
  "name",
  "value",
  "modelValue",
  "defaultValue",
  "label",
  "helperText",
  "error",
  "length",
  "placeholderCharacter",
  "disabled",
  "readOnly",
  "required",
  "invalid",
  "ariaDescribedBy",
  "ariaLabel",
  "onValueChange",
  "className",
] as const

function hasTextContent(value: string | undefined): boolean {
  return value !== undefined && value.trim().length > 0
}

export const InputOtp = defineComponent(
  (props: InputOtpProps, { emit }) => {
    const localInputId = createLocalId("mw-input-otp")
    const id = computed(() => props.id ?? localInputId)
    const otpLength = computed(() => Math.max(1, props.length ?? 6))
    const uncontrolledValue = ref(sanitizeInputOtpValue(props.defaultValue, otpLength.value))
    const externalValue = computed(() => props.modelValue ?? props.value)
    const currentValue = computed(() => {
      const sourceValue = externalValue.value ?? uncontrolledValue.value
      return sanitizeInputOtpValue(sourceValue, otpLength.value)
    })

    const hasHelperText = computed(() => hasTextContent(props.helperText))
    const hasError = computed(() => hasTextContent(props.error))
    const invalid = computed(() => hasError.value || props.invalid === true)

    const a11yIds = computed(() =>
      buildInputFieldA11yIds({
        id: id.value,
        hasHelperText: hasHelperText.value,
        hasError: hasError.value,
        externalDescribedBy: props.ariaDescribedBy,
      }),
    )

    const kit = computed(() => {
      const recipeOptions: InputOtpOptions = {
        id: id.value,
        value: currentValue.value,
        length: otpLength.value,
        invalid: invalid.value,
      }

      if (props.name) {
        recipeOptions.name = props.name
      }

      if (props.placeholderCharacter) {
        recipeOptions.placeholderCharacter = props.placeholderCharacter
      }

      if (props.disabled) {
        recipeOptions.disabled = true
      }

      if (props.readOnly) {
        recipeOptions.readOnly = true
      }

      if (props.required) {
        recipeOptions.required = true
      }

      if (a11yIds.value.describedBy) {
        recipeOptions.describedBy = a11yIds.value.describedBy
      }

      if (props.ariaLabel) {
        recipeOptions.ariaLabel = props.ariaLabel
      }

      return createInputOtpRecipe(recipeOptions)
    })

    const wrapperClass = computed(() => mergeClassNames(kit.value.className, props.className))

    const handleInput = (event: Event) => {
      const inputElement = event.target as HTMLInputElement
      const nextValue = sanitizeInputOtpValue(inputElement.value, otpLength.value)

      if (externalValue.value === undefined) {
        uncontrolledValue.value = nextValue
      }

      props.onValueChange?.(nextValue)
      emit("update:modelValue", nextValue)
      emit("value-change", nextValue)
    }

    return () =>
      h(
        "div",
        {
          class: wrapperClass.value,
          style: kit.value.vars,
          "data-component": "input-otp",
          "data-invalid": invalid.value ? "true" : undefined,
          "data-disabled": props.disabled ? "true" : undefined,
        },
        [
          h("label", { class: "mw-input-otp__label", for: id.value }, [
            h(Paragraph, { size: "md" }, { default: () => [props.label] }),
          ]),

          h("div", { class: "mw-input-otp__cells" }, [
            ...kit.value.displayCells.map((displayCell) =>
              h(
                "span",
                {
                  key: displayCell.key,
                  class: mergeClassNames(
                    "mw-input-otp__cell",
                    displayCell.filled && "mw-input-otp__cell--filled",
                  ),
                  "aria-hidden": "true",
                },
                displayCell.character,
              ),
            ),
            h("input", {
              id: kit.value.a11y.id,
              class: "mw-input-otp__input",
              type: "text",
              name: kit.value.a11y.name,
              inputMode: kit.value.a11y.inputMode,
              autoComplete: kit.value.a11y.autoComplete,
              maxLength: kit.value.a11y.maxLength,
              pattern: kit.value.a11y.pattern,
              disabled: kit.value.a11y.disabled,
              readOnly: kit.value.a11y.readOnly,
              required: kit.value.a11y.required,
              "aria-label": kit.value.a11y.ariaLabel,
              "aria-invalid": kit.value.a11y.ariaInvalid,
              "aria-describedby": kit.value.a11y.ariaDescribedBy,
              value: kit.value.displayValue,
              onInput: handleInput,
              onChange: (event: Event) => emit("change", event),
            }),
          ]),

          hasError.value
            ? h(
                "div",
                {
                  class: "mw-input-otp__error",
                  id: a11yIds.value.errorId,
                  "aria-live": "polite",
                },
                [h(Paragraph, { size: "sm" }, { default: () => [props.error ?? ""] })],
              )
            : hasHelperText.value
              ? h("div", { class: "mw-input-otp__helper", id: a11yIds.value.helperTextId }, [
                  h(Paragraph, { size: "sm" }, { default: () => [props.helperText ?? ""] }),
                ])
              : null,
        ],
      )
  },
  {
    name: "MarwesInputOtp",
    props: [...inputOtpPropKeys],
    emits: ["update:modelValue", "value-change", "change"],
  },
)
