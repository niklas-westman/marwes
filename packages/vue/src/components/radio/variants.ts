import { computed, defineComponent, h } from "vue"
import { RadioGroupField, type RadioGroupFieldProps } from "./radio-group-field"

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

export type YesNoRadioGroupProps = Omit<RadioGroupFieldProps, "options"> & {
  yesLabel?: string
  noLabel?: string
}

export const YesNoRadioGroup = defineComponent({
  name: "MarwesYesNoRadioGroup",
  inheritAttrs: false,
  props: [...radioGroupFieldPropKeys, "yesLabel", "noLabel"],
  setup(rawProps, { attrs, slots }) {
    const props = rawProps as unknown as YesNoRadioGroupProps

    const options = computed(() => [
      { value: "yes", label: props.yesLabel ?? "Yes" },
      { value: "no", label: props.noLabel ?? "No" },
    ])

    return () =>
      h(
        RadioGroupField,
        {
          ...attrs,
          ...props,
          options: options.value,
          dataAttributes: {
            ...props.dataAttributes,
            "data-purpose": "binary-choice",
          },
        },
        slots,
      )
  },
})

export type RatingRadioGroupProps = Omit<RadioGroupFieldProps, "options"> & {
  min?: number
  max?: number
  labelFn?: (value: number) => string
}

export const RatingRadioGroup = defineComponent({
  name: "MarwesRatingRadioGroup",
  inheritAttrs: false,
  props: [...radioGroupFieldPropKeys, "min", "max", "labelFn"],
  setup(rawProps, { attrs, slots }) {
    const props = rawProps as unknown as RatingRadioGroupProps

    const options = computed(() => {
      const min = props.min ?? 1
      const max = props.max ?? 5
      const labelFn = props.labelFn ?? String

      return Array.from({ length: max - min + 1 }, (_, index) => {
        const value = min + index
        return { value: String(value), label: labelFn(value) }
      })
    })

    return () =>
      h(
        RadioGroupField,
        {
          ...attrs,
          ...props,
          options: options.value,
          dataAttributes: {
            ...props.dataAttributes,
            "data-purpose": "rating",
          },
        },
        slots,
      )
  },
})

export type OptionRadioGroupProps = RadioGroupFieldProps

export const OptionRadioGroup = defineComponent({
  name: "MarwesOptionRadioGroup",
  inheritAttrs: false,
  props: [...radioGroupFieldPropKeys],
  setup(rawProps, { attrs, slots }) {
    const props = rawProps as unknown as OptionRadioGroupProps

    return () =>
      h(
        RadioGroupField,
        {
          ...attrs,
          ...props,
          dataAttributes: {
            ...props.dataAttributes,
            "data-purpose": "selection",
          },
        },
        slots,
      )
  },
})
