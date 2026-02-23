import { buildCurrencyHelperText } from "@marwes-ui/core"
import { defineComponent, h } from "vue"
import type { InputProps } from "./input"
import { InputField, type InputFieldProps } from "./input-field"

export type SearchFieldProps = Omit<InputFieldProps, "input"> & {
  input?: Omit<InputProps, "type">
}

export const SearchField = defineComponent({
  name: "MarwesSearchField",
  props: ["id", "label", "helperText", "error", "input", "ariaDescribedBy", "modelValue"],
  emits: ["update:modelValue", "value-change"],
  setup(rawProps, { slots, emit }) {
    const props = rawProps as unknown as SearchFieldProps

    return () =>
      h("div", { "data-purpose": "search" }, [
        h(
          InputField,
          {
            ...props,
            input: {
              ...props.input,
              type: "search",
              inputMode: "search",
            },
            onValueChange: (value: string) => emit("value-change", value),
            "onUpdate:modelValue": (value: string) => emit("update:modelValue", value),
          } as unknown as Record<string, unknown>,
          slots,
        ),
      ])
  },
})

export type PasswordFieldProps = Omit<InputFieldProps, "input"> & {
  input?: Omit<InputProps, "type">
  autoComplete?: "current-password" | "new-password"
}

export const PasswordField = defineComponent({
  name: "MarwesPasswordField",
  props: [
    "id",
    "label",
    "helperText",
    "error",
    "input",
    "ariaDescribedBy",
    "modelValue",
    "autoComplete",
  ],
  emits: ["update:modelValue", "value-change"],
  setup(rawProps, { slots, emit }) {
    const props = rawProps as unknown as PasswordFieldProps
    const autoComplete = props.autoComplete ?? "current-password"

    return () =>
      h("div", { "data-purpose": "password" }, [
        h(
          InputField,
          {
            ...props,
            input: {
              ...props.input,
              type: "password",
              autoComplete,
            },
            onValueChange: (value: string) => emit("value-change", value),
            "onUpdate:modelValue": (value: string) => emit("update:modelValue", value),
          } as unknown as Record<string, unknown>,
          slots,
        ),
      ])
  },
})

export type EmailFieldProps = Omit<InputFieldProps, "input"> & {
  input?: Omit<InputProps, "type" | "inputMode" | "autoComplete">
}

export const EmailField = defineComponent({
  name: "MarwesEmailField",
  props: ["id", "label", "helperText", "error", "input", "ariaDescribedBy", "modelValue"],
  emits: ["update:modelValue", "value-change"],
  setup(rawProps, { slots, emit }) {
    const props = rawProps as unknown as EmailFieldProps
    return () =>
      h("div", { "data-purpose": "email" }, [
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
            onValueChange: (value: string) => emit("value-change", value),
            "onUpdate:modelValue": (value: string) => emit("update:modelValue", value),
          } as unknown as Record<string, unknown>,
          slots,
        ),
      ])
  },
})

export type PhoneFieldProps = Omit<InputFieldProps, "input"> & {
  input?: Omit<InputProps, "type" | "inputMode" | "autoComplete">
}

export const PhoneField = defineComponent({
  name: "MarwesPhoneField",
  props: ["id", "label", "helperText", "error", "input", "ariaDescribedBy", "modelValue"],
  emits: ["update:modelValue", "value-change"],
  setup(rawProps, { slots, emit }) {
    const props = rawProps as unknown as PhoneFieldProps
    return () =>
      h("div", { "data-purpose": "phone" }, [
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
            onValueChange: (value: string) => emit("value-change", value),
            "onUpdate:modelValue": (value: string) => emit("update:modelValue", value),
          } as unknown as Record<string, unknown>,
          slots,
        ),
      ])
  },
})

export type URLFieldProps = Omit<InputFieldProps, "input"> & {
  input?: Omit<InputProps, "type" | "inputMode" | "autoComplete">
}

export const URLField = defineComponent({
  name: "MarwesURLField",
  props: ["id", "label", "helperText", "error", "input", "ariaDescribedBy", "modelValue"],
  emits: ["update:modelValue", "value-change"],
  setup(rawProps, { slots, emit }) {
    const props = rawProps as unknown as URLFieldProps
    return () =>
      h("div", { "data-purpose": "url" }, [
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
            onValueChange: (value: string) => emit("value-change", value),
            "onUpdate:modelValue": (value: string) => emit("update:modelValue", value),
          } as unknown as Record<string, unknown>,
          slots,
        ),
      ])
  },
})

export type CurrencyFieldProps = Omit<InputFieldProps, "input"> & {
  input?: Omit<InputProps, "type" | "inputMode">
  currency?: string
}

export const CurrencyField = defineComponent({
  name: "MarwesCurrencyField",
  props: [
    "id",
    "label",
    "helperText",
    "error",
    "input",
    "ariaDescribedBy",
    "modelValue",
    "currency",
  ],
  emits: ["update:modelValue", "value-change"],
  setup(rawProps, { slots, emit }) {
    const props = rawProps as unknown as CurrencyFieldProps

    return () =>
      h("div", { "data-purpose": "currency", "data-currency": props.currency }, [
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
            onValueChange: (value: string) => emit("value-change", value),
            "onUpdate:modelValue": (value: string) => emit("update:modelValue", value),
          } as unknown as Record<string, unknown>,
          slots,
        ),
      ])
  },
})
