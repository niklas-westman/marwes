import { buildInputFieldA11yIds } from "@marwes-ui/core"
import { computed, defineComponent, h } from "vue"
import { createLocalId } from "../../internal/id"
import { mergeClassNames } from "../../internal/render-utils"
import { Text } from "../text"
import { DatePicker, type DatePickerProps } from "./date-picker"

export type DatePickerFieldProps = {
  id?: string
  label: string
  helperText?: string
  error?: string
  datePicker?: Omit<DatePickerProps, "ariaLabel" | "ariaLabelledBy" | "calendarLabel">
  ariaDescribedBy?: string
  className?: string
}

const datePickerFieldPropKeys = [
  "id",
  "label",
  "helperText",
  "error",
  "datePicker",
  "ariaDescribedBy",
  "className",
] as const

function hasTextContent(value: string | undefined): boolean {
  return value !== undefined && value.trim().length > 0
}

/**
 * DatePickerField (Molecule)
 *
 * A labeled wrapper around `DatePicker` that:
 * - renders a visible label wired via `aria-labelledby`
 * - generates a stable id with createLocalId when one isn't supplied
 * - optionally renders helper text and error messages
 * - threads `aria-describedby` to the calendar landmark
 */
export const DatePickerField = defineComponent(
  (props: DatePickerFieldProps) => {
    const localId = createLocalId("mw-date-picker")
    const id = computed(() => props.id ?? localId)
    const labelId = computed(() => `${id.value}-label`)

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

    const wrapperClass = computed(() =>
      mergeClassNames(
        "mw-date-picker-field",
        hasError.value && "mw-date-picker-field--invalid",
        props.className,
      ),
    )

    return () => {
      const datePickerProps: DatePickerProps = {
        ...(props.datePicker ?? {}),
        ariaLabelledBy: labelId.value,
      }
      if (a11yIds.value.describedBy) {
        datePickerProps.ariaDescribedBy = a11yIds.value.describedBy
      }

      return h("div", { class: wrapperClass.value }, [
        h(
          "span",
          { class: "mw-date-picker-field__label", id: labelId.value },
          h(Text, { variant: "label" }, () => [props.label]),
        ),
        h(DatePicker, datePickerProps),
        hasHelperText.value && !hasError.value
          ? h(
              "div",
              { class: "mw-date-picker-field__helper", id: a11yIds.value.helperTextId },
              h(Text, { variant: "caption" }, () => [props.helperText]),
            )
          : null,
        hasError.value
          ? h(
              "div",
              {
                class: "mw-date-picker-field__error",
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
    name: "MarwesDatePickerField",
    props: [...datePickerFieldPropKeys],
  },
)
