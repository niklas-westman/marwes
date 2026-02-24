import { buildCurrencyHelperText } from "@marwes-ui/core"
import { defineComponent, h } from "vue"
import type { InputProps } from "./input"
import { InputField, type InputFieldProps } from "./input-field"

// Shared field prop keys (from InputFieldProps)
const fieldPropKeys = [
  "id",
  "label",
  "helperText",
  "error",
  "input",
  "ariaDescribedBy",
  "modelValue",
] as const

export type SearchFieldProps = Omit<InputFieldProps, "input"> & {
  input?: Omit<InputProps, "type">
}

export const SearchField = defineComponent({
  name: "MarwesSearchField",
  inheritAttrs: false,
  props: [...fieldPropKeys],
  emits: ["update:modelValue", "value-change"],
  setup(_, { attrs, slots, emit }) {
    return () => {
      const props = attrs as unknown as SearchFieldProps
      return h("div", { "data-purpose": "search" }, [
        h(
          InputField,
          {
            ...props,
            input: {
              ...props.input,
              type: "search",
              inputMode: "search",
            },
            "onValue-change": (value: string) => emit("value-change", value),
            "onUpdate:modelValue": (value: string) => emit("update:modelValue", value),
          },
          slots,
        ),
      ])
    }
  },
})

export type PasswordFieldProps = Omit<InputFieldProps, "input"> & {
  input?: Omit<InputProps, "type">
  autoComplete?: "current-password" | "new-password"
}

const passwordFieldPropKeys = [...fieldPropKeys, "autoComplete"] as const

export const PasswordField = defineComponent({
  name: "MarwesPasswordField",
  inheritAttrs: false,
  props: [...passwordFieldPropKeys],
  emits: ["update:modelValue", "value-change"],
  setup(_, { attrs, slots, emit }) {
    return () => {
      const props = attrs as unknown as PasswordFieldProps
      const autoComplete = props.autoComplete ?? "current-password"
      return h("div", { "data-purpose": "password" }, [
        h(
          InputField,
          {
            ...props,
            input: {
              ...props.input,
              type: "password",
              autoComplete,
            },
            "onValue-change": (value: string) => emit("value-change", value),
            "onUpdate:modelValue": (value: string) => emit("update:modelValue", value),
          },
          slots,
        ),
      ])
    }
  },
})

export type EmailFieldProps = Omit<InputFieldProps, "input"> & {
  input?: Omit<InputProps, "type" | "inputMode" | "autoComplete">
}

export const EmailField = defineComponent({
  name: "MarwesEmailField",
  inheritAttrs: false,
  props: [...fieldPropKeys],
  emits: ["update:modelValue", "value-change"],
  setup(_, { attrs, slots, emit }) {
    return () => {
      const props = attrs as unknown as EmailFieldProps
      return h("div", { "data-purpose": "email" }, [
        h(
          InputField,
          {
            ...props,
            input: {
              ...props.input,
              type: "email",
              inputMode: "email",
              autoComplete: "email",
            },
            "onValue-change": (value: string) => emit("value-change", value),
            "onUpdate:modelValue": (value: string) => emit("update:modelValue", value),
          },
          slots,
        ),
      ])
    }
  },
})

export type PhoneFieldProps = Omit<InputFieldProps, "input"> & {
  input?: Omit<InputProps, "type" | "inputMode" | "autoComplete">
}

export const PhoneField = defineComponent({
  name: "MarwesPhoneField",
  inheritAttrs: false,
  props: [...fieldPropKeys],
  emits: ["update:modelValue", "value-change"],
  setup(_, { attrs, slots, emit }) {
    return () => {
      const props = attrs as unknown as PhoneFieldProps
      return h("div", { "data-purpose": "phone" }, [
        h(
          InputField,
          {
            ...props,
            input: {
              ...props.input,
              type: "tel",
              inputMode: "tel",
              autoComplete: "tel",
            },
            "onValue-change": (value: string) => emit("value-change", value),
            "onUpdate:modelValue": (value: string) => emit("update:modelValue", value),
          },
          slots,
        ),
      ])
    }
  },
})

export type URLFieldProps = Omit<InputFieldProps, "input"> & {
  input?: Omit<InputProps, "type" | "inputMode" | "autoComplete">
}

export const URLField = defineComponent({
  name: "MarwesURLField",
  inheritAttrs: false,
  props: [...fieldPropKeys],
  emits: ["update:modelValue", "value-change"],
  setup(_, { attrs, slots, emit }) {
    return () => {
      const props = attrs as unknown as URLFieldProps
      return h("div", { "data-purpose": "url" }, [
        h(
          InputField,
          {
            ...props,
            input: {
              ...props.input,
              type: "url",
              inputMode: "url",
              autoComplete: "url",
            },
            "onValue-change": (value: string) => emit("value-change", value),
            "onUpdate:modelValue": (value: string) => emit("update:modelValue", value),
          },
          slots,
        ),
      ])
    }
  },
})

export type CurrencyFieldProps = Omit<InputFieldProps, "input"> & {
  input?: Omit<InputProps, "type" | "inputMode">
  currency?: string
}

const currencyFieldPropKeys = [...fieldPropKeys, "currency"] as const

export const CurrencyField = defineComponent({
  name: "MarwesCurrencyField",
  inheritAttrs: false,
  props: [...currencyFieldPropKeys],
  emits: ["update:modelValue", "value-change"],
  setup(_, { attrs, slots, emit }) {
    return () => {
      const props = attrs as unknown as CurrencyFieldProps
      return h("div", { "data-purpose": "currency", "data-currency": props.currency }, [
        h(
          InputField,
          {
            ...props,
            helperText: buildCurrencyHelperText(props.helperText, props.currency) ?? "",
            input: {
              ...props.input,
              type: "text",
              inputMode: "decimal",
            },
            "onValue-change": (value: string) => emit("value-change", value),
            "onUpdate:modelValue": (value: string) => emit("update:modelValue", value),
          },
          slots,
        ),
      ])
    }
  },
})
