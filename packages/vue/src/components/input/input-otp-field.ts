import { buildInputFieldA11yIds } from "@marwes-ui/core"
import { computed, defineComponent, h } from "vue"
import { createLocalId } from "../../internal/id"
import { mergeClassNames } from "../../internal/render-utils"
import { Text } from "../text"
import { InputOtp, type InputOtpProps } from "./input-otp"

export type InputOtpFieldProps = {
  id?: string
  label: string
  helperText?: string
  error?: string
  inputOtp?: Omit<InputOtpProps, "id" | "ariaLabel" | "ariaLabelledBy" | "describedBy">
  ariaDescribedBy?: string
  className?: string
}

const inputOtpFieldPropKeys = [
  "id",
  "label",
  "helperText",
  "error",
  "inputOtp",
  "ariaDescribedBy",
  "className",
] as const

function hasTextContent(value: string | undefined): boolean {
  return value !== undefined && value.trim().length > 0
}

/**
 * InputOtpField (Molecule)
 *
 * Labeled wrapper around the `InputOtp` atom.
 */
export const InputOtpField = defineComponent(
  (props: InputOtpFieldProps) => {
    const localId = createLocalId("mw-input-otp")
    const id = computed(() => props.id ?? localId)
    const labelId = computed(() => `${id.value}-label`)

    const inputOtp = computed<InputOtpProps>(() => (props.inputOtp ?? {}) as InputOtpProps)
    const hasHelperText = computed(() => hasTextContent(props.helperText))
    const hasError = computed(() => hasTextContent(props.error))
    const invalid = computed(() => hasError.value || inputOtp.value.invalid === true)

    const a11yIds = computed(() =>
      buildInputFieldA11yIds({
        id: id.value,
        hasHelperText: hasHelperText.value,
        hasError: hasError.value,
        externalDescribedBy: props.ariaDescribedBy,
      }),
    )

    const wrapperClass = computed(() =>
      mergeClassNames(
        "mw-input-otp-field",
        hasError.value && "mw-input-otp-field--invalid",
        inputOtp.value.disabled && "mw-input-otp-field--disabled",
        props.className,
      ),
    )

    return () => {
      const otpProps: InputOtpProps = {
        ...inputOtp.value,
        id: id.value,
        invalid: invalid.value,
        ariaLabelledBy: labelId.value,
      }
      if (a11yIds.value.describedBy) {
        otpProps.describedBy = a11yIds.value.describedBy
      }

      return h("div", { class: wrapperClass.value }, [
        h(
          "label",
          { class: "mw-input-otp-field__label", for: id.value, id: labelId.value },
          h(Text, { variant: "label" }, () => [props.label]),
        ),
        h(InputOtp, otpProps),
        hasError.value
          ? h(
              "div",
              {
                class: "mw-input-otp-field__error",
                id: a11yIds.value.errorId,
                "aria-live": "polite",
              },
              h(Text, { variant: "caption" }, () => [props.error]),
            )
          : hasHelperText.value
            ? h(
                "div",
                { class: "mw-input-otp-field__helper", id: a11yIds.value.helperTextId },
                h(Text, { variant: "caption" }, () => [props.helperText]),
              )
            : null,
      ])
    }
  },
  {
    name: "MarwesInputOtpField",
    props: [...inputOtpFieldPropKeys],
  },
)
