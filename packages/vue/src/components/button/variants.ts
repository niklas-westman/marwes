import { ButtonAction, ButtonVariant, IconName } from "@marwes-ui/core"
import { defineComponent, h } from "vue"
import { Button, type ButtonProps } from "./button"

// Shared button prop keys (subset from ButtonProps, excluding the ones we override)
const buttonPropKeys = [
  "as",
  "href",
  "size",
  "variant",
  "disabled",
  "loading",
  "error",
  "toggle",
  "pressed",
  "ariaLabel",
  "hasVisibleText",
  "ariaExpanded",
  "ariaControls",
  "iconLeft",
  "iconRight",
  "iconOnly",
  "action",
  "tooltip",
  "confirmation",
  "dataAttributes",
  "onClick",
  "className",
] as const

export type DangerButtonProps = Omit<ButtonProps, "variant" | "action"> & {
  confirmation?: boolean
}

export const DangerButton = defineComponent({
  name: "MarwesDangerButton",
  inheritAttrs: false,
  props: [...buttonPropKeys],
  setup(rawProps, { attrs, slots }) {
    return () => {
      const props = rawProps as unknown as DangerButtonProps
      return h(
        Button,
        {
          ...attrs,
          ...props,
          variant: ButtonVariant.primary,
          action: ButtonAction.delete,
          iconRight: IconName.Minus,
          confirmation: props.confirmation ?? true,
          dataAttributes: {
            ...props.dataAttributes,
            "data-destructive": "true",
            "data-confirmation-required": props.confirmation === false ? "false" : "true",
          },
        },
        slots,
      )
    }
  },
})

export type CreateButtonProps = Omit<ButtonProps, "action">

export const CreateButton = defineComponent({
  name: "MarwesCreateButton",
  inheritAttrs: false,
  props: [...buttonPropKeys],
  setup(rawProps, { attrs, slots }) {
    return () => {
      const props = rawProps as unknown as CreateButtonProps
      return h(
        Button,
        {
          ...attrs,
          ...props,
          action: "create",
          variant: props.variant ?? "primary",
          dataAttributes: {
            ...props.dataAttributes,
            "data-creative": "true",
          },
        },
        slots,
      )
    }
  },
})

export type SubmitButtonProps = Omit<ButtonProps, "action" | "as">

export const SubmitButton = defineComponent({
  name: "MarwesSubmitButton",
  inheritAttrs: false,
  props: [...buttonPropKeys],
  setup(rawProps, { attrs, slots }) {
    return () => {
      const props = rawProps as unknown as SubmitButtonProps
      return h(
        Button,
        {
          ...attrs,
          ...props,
          as: "button",
          action: "submit",
          dataAttributes: {
            "data-context": "form-submit",
            ...props.dataAttributes,
          },
        },
        slots,
      )
    }
  },
})

export type CancelButtonProps = Omit<ButtonProps, "action">

export const CancelButton = defineComponent({
  name: "MarwesCancelButton",
  inheritAttrs: false,
  props: [...buttonPropKeys],
  setup(rawProps, { attrs, slots }) {
    return () => {
      const props = rawProps as unknown as CancelButtonProps
      return h(
        Button,
        {
          ...attrs,
          ...props,
          action: "cancel",
          variant: props.variant ?? "secondary",
          dataAttributes: {
            ...props.dataAttributes,
            "data-cancel": "true",
          },
        },
        slots,
      )
    }
  },
})

export type LinkButtonProps = Omit<ButtonProps, "action" | "as"> & {
  href: string
}

export const LinkButton = defineComponent({
  name: "MarwesLinkButton",
  inheritAttrs: false,
  props: [...buttonPropKeys],
  setup(rawProps, { attrs, slots }) {
    return () => {
      const props = rawProps as unknown as LinkButtonProps
      return h(
        Button,
        {
          ...attrs,
          ...props,
          as: "a",
          action: "navigate",
          dataAttributes: {
            ...props.dataAttributes,
            "data-navigation": "true",
          },
        },
        slots,
      )
    }
  },
})

export type PrimaryButtonProps = Omit<ButtonProps, "variant" | "as">

export const PrimaryButton = defineComponent({
  name: "MarwesPrimaryButton",
  inheritAttrs: false,
  props: [...buttonPropKeys],
  setup(rawProps, { attrs, slots }) {
    return () => {
      const props = rawProps as unknown as PrimaryButtonProps
      return h(Button, { ...attrs, ...props, variant: "primary", as: "button" }, slots)
    }
  },
})

export type SecondaryButtonProps = Omit<ButtonProps, "variant" | "as">

export const SecondaryButton = defineComponent({
  name: "MarwesSecondaryButton",
  inheritAttrs: false,
  props: [...buttonPropKeys],
  setup(rawProps, { attrs, slots }) {
    return () => {
      const props = rawProps as unknown as SecondaryButtonProps
      return h(Button, { ...attrs, ...props, variant: "secondary", as: "button" }, slots)
    }
  },
})

export type TextButtonProps = Omit<ButtonProps, "variant" | "as">

export const TextButton = defineComponent({
  name: "MarwesTextButton",
  inheritAttrs: false,
  props: [...buttonPropKeys],
  setup(rawProps, { attrs, slots }) {
    return () => {
      const props = rawProps as unknown as TextButtonProps
      return h(Button, { ...attrs, ...props, variant: "text", as: "button" }, slots)
    }
  },
})
