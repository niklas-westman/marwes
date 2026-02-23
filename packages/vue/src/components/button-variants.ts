import { ButtonAction, ButtonVariant, IconName } from "@marwes-ui/core"
import { defineComponent, h } from "vue"
import { Button, type ButtonProps } from "./button"

export type DangerButtonProps = Omit<ButtonProps, "variant" | "action"> & {
  confirmation?: boolean
}

export const DangerButton = defineComponent({
  name: "MarwesDangerButton",
  props: ["confirmation"],
  setup(rawProps, { attrs, slots }) {
    const props = {
      ...(attrs as Record<string, unknown>),
      ...(rawProps as Record<string, unknown>),
    } as DangerButtonProps

    return () =>
      h(
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
  },
})

export type CreateButtonProps = Omit<ButtonProps, "action">

export const CreateButton = defineComponent({
  name: "MarwesCreateButton",
  setup(_, { attrs, slots }) {
    const props = attrs as unknown as CreateButtonProps

    return () =>
      h(
        Button,
        {
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
  },
})

export type SubmitButtonProps = Omit<ButtonProps, "action" | "as">

export const SubmitButton = defineComponent({
  name: "MarwesSubmitButton",
  setup(_, { attrs, slots }) {
    const props = attrs as unknown as SubmitButtonProps

    return () =>
      h(
        Button,
        {
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
  },
})

export type CancelButtonProps = Omit<ButtonProps, "action">

export const CancelButton = defineComponent({
  name: "MarwesCancelButton",
  setup(_, { attrs, slots }) {
    const props = attrs as unknown as CancelButtonProps

    return () =>
      h(
        Button,
        {
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
  },
})

export type LinkButtonProps = Omit<ButtonProps, "action" | "as"> & {
  href: string
}

export const LinkButton = defineComponent({
  name: "MarwesLinkButton",
  setup(_, { attrs, slots }) {
    const props = attrs as unknown as LinkButtonProps

    return () =>
      h(
        Button,
        {
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
  },
})

export type PrimaryButtonProps = Omit<ButtonProps, "variant" | "as">

export const PrimaryButton = defineComponent({
  name: "MarwesPrimaryButton",
  setup(_, { attrs, slots }) {
    const props = attrs as unknown as PrimaryButtonProps
    return () => h(Button, { ...props, variant: "primary", as: "button" }, slots)
  },
})

export type SecondaryButtonProps = Omit<ButtonProps, "variant" | "as">

export const SecondaryButton = defineComponent({
  name: "MarwesSecondaryButton",
  setup(_, { attrs, slots }) {
    const props = attrs as unknown as SecondaryButtonProps
    return () => h(Button, { ...props, variant: "secondary", as: "button" }, slots)
  },
})

export type TextButtonProps = Omit<ButtonProps, "variant" | "as">

export const TextButton = defineComponent({
  name: "MarwesTextButton",
  setup(_, { attrs, slots }) {
    const props = attrs as unknown as TextButtonProps
    return () => h(Button, { ...props, variant: "text", as: "button" }, slots)
  },
})
