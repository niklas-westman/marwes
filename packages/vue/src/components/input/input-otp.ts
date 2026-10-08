import {
  type InputOtpOptions,
  createInputOtpRecipe,
  sanitizeInputOtpValue,
  toInputOtpHtmlAttributes,
} from "@marwes-ui/core"
import { computed, defineComponent, h, ref } from "vue"
import { createLocalId } from "../../internal/id"
import { definePropKeys } from "../../internal/prop-keys"
import { mergeClassNames } from "../../internal/render-utils"

/**
 * Props for the bare `InputOtp` atom (Vue).
 *
 * The atom renders only the OTP cells + hidden input — no label, helper,
 * or error region. Use `InputOtpField` for labeled forms; reach for the
 * atom directly only when you need a custom layout.
 */
export type InputOtpProps = Omit<InputOtpOptions, "describedBy"> & {
  modelValue?: string
  onValueChange?: (value: string) => void
  className?: string
  /** ID(s) of elements that describe the input. Pre-merged by `InputOtpField`. */
  describedBy?: string
}

const inputOtpPropKeys = definePropKeys<InputOtpProps>()([
  "id",
  "name",
  "value",
  "modelValue",
  "defaultValue",
  "length",
  "placeholderCharacter",
  "disabled",
  "readOnly",
  "required",
  "invalid",
  "describedBy",
  "ariaLabel",
  "label",
  "ariaLabelledBy",
  "onValueChange",
  "className",
])

/**
 * InputOtp (Atom) — bare OTP cells. Renders the visual cells and a hidden
 * native `<input>` that captures keyboard entry. Pair with `InputOtpField`
 * for label + helper/error wiring.
 */
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

    const kit = computed(() => {
      const recipeOptions: InputOtpOptions = {
        id: id.value,
        value: currentValue.value,
        length: otpLength.value,
      }

      if (props.name) recipeOptions.name = props.name
      if (props.placeholderCharacter !== undefined)
        recipeOptions.placeholderCharacter = props.placeholderCharacter
      if (props.disabled) recipeOptions.disabled = true
      if (props.readOnly) recipeOptions.readOnly = true
      if (props.required) recipeOptions.required = true
      if (props.invalid) recipeOptions.invalid = true
      if (props.describedBy) recipeOptions.describedBy = props.describedBy
      if (props.ariaLabel) recipeOptions.ariaLabel = props.ariaLabel
      if (props.label) recipeOptions.label = props.label
      if (props.ariaLabelledBy) recipeOptions.ariaLabelledBy = props.ariaLabelledBy

      return createInputOtpRecipe(recipeOptions)
    })

    const wrapperClass = computed(() => mergeClassNames(kit.value.className, props.className))

    const handleInput = (event: Event) => {
      const inputElement = event.target as HTMLInputElement
      const nextValue = sanitizeInputOtpValue(inputElement.value, otpLength.value)

      if (externalValue.value === undefined) {
        uncontrolledValue.value = nextValue
      }

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
          "data-invalid": props.invalid ? "true" : undefined,
          "data-disabled": props.disabled ? "true" : undefined,
        },
        [
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
              class: "mw-input-otp__input",
              type: "text",
              ...toInputOtpHtmlAttributes(kit.value.a11y),
              value: kit.value.displayValue,
              onInput: handleInput,
              onChange: (event: Event) => emit("change", event),
            }),
          ]),
        ],
      )
  },
  {
    name: "MarwesInputOtp",
    props: [...inputOtpPropKeys],
    emits: ["update:modelValue", "value-change", "change"],
  },
)
