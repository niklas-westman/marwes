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
            "data-purpose": "destructive",
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
            "data-purpose": "create",
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
            "data-purpose": "submit",
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
            "data-purpose": "cancel",
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
            "data-purpose": "navigation",
            "data-navigation": "true",
          },
        },
        slots,
      )
    }
  },
})

export type SaveButtonProps = Omit<ButtonProps, "action">

export const SaveButton = defineComponent({
  name: "MarwesSaveButton",
  inheritAttrs: false,
  props: [...buttonPropKeys],
  setup(rawProps, { attrs, slots }) {
    return () => {
      const props = rawProps as unknown as SaveButtonProps
      return h(
        Button,
        {
          ...attrs,
          ...props,
          action: ButtonAction.submit,
          variant: props.variant ?? ButtonVariant.primary,
          iconRight: props.iconRight ?? IconName.Save,
          dataAttributes: {
            ...props.dataAttributes,
            "data-purpose": "save",
            "data-persist": "true",
          },
        },
        slots,
      )
    }
  },
})

export type ConfirmButtonProps = Omit<ButtonProps, "variant" | "action" | "as">

export const ConfirmButton = defineComponent({
  name: "MarwesConfirmButton",
  inheritAttrs: false,
  props: [...buttonPropKeys],
  setup(rawProps, { attrs, slots }) {
    return () => {
      const props = rawProps as unknown as ConfirmButtonProps
      return h(
        Button,
        {
          ...attrs,
          ...props,
          variant: ButtonVariant.success,
          as: "button",
          iconRight: props.iconRight ?? IconName.Check,
          dataAttributes: {
            ...props.dataAttributes,
            "data-purpose": "confirm",
            "data-outcome": "positive",
          },
        },
        slots,
      )
    }
  },
})

export type VerifyButtonProps = Omit<ButtonProps, "variant" | "action" | "as">

export const VerifyButton = defineComponent({
  name: "MarwesVerifyButton",
  inheritAttrs: false,
  props: [...buttonPropKeys],
  setup(rawProps, { attrs, slots }) {
    return () => {
      const props = rawProps as unknown as VerifyButtonProps
      return h(
        Button,
        {
          ...attrs,
          ...props,
          variant: ButtonVariant.success,
          as: "button",
          iconRight: props.iconRight ?? IconName.CheckCircle,
          dataAttributes: {
            ...props.dataAttributes,
            "data-purpose": "verify",
            "data-outcome": "positive",
            "data-verification": "true",
          },
        },
        slots,
      )
    }
  },
})

export type EditButtonProps = Omit<ButtonProps, "action">

export const EditButton = defineComponent({
  name: "MarwesEditButton",
  inheritAttrs: false,
  props: [...buttonPropKeys],
  setup(rawProps, { attrs, slots }) {
    return () => {
      const props = rawProps as unknown as EditButtonProps
      return h(
        Button,
        {
          ...attrs,
          ...props,
          action: ButtonAction.edit,
          variant: props.variant ?? ButtonVariant.secondary,
          iconRight: props.iconRight ?? IconName.Edit,
          dataAttributes: {
            ...props.dataAttributes,
            "data-purpose": "edit",
            "data-edit": "true",
          },
        },
        slots,
      )
    }
  },
})

export type CloseButtonProps = Omit<ButtonProps, "action">

export const CloseButton = defineComponent({
  name: "MarwesCloseButton",
  inheritAttrs: false,
  props: [...buttonPropKeys],
  setup(rawProps, { attrs, slots }) {
    return () => {
      const props = rawProps as unknown as CloseButtonProps
      return h(
        Button,
        {
          ...attrs,
          ...props,
          action: ButtonAction.cancel,
          variant: props.variant ?? ButtonVariant.secondary,
          iconRight: props.iconRight ?? IconName.X,
          dataAttributes: {
            ...props.dataAttributes,
            "data-purpose": "close",
            "data-close": "true",
          },
        },
        slots,
      )
    }
  },
})

export type RefreshButtonProps = Omit<ButtonProps, "action">

export const RefreshButton = defineComponent({
  name: "MarwesRefreshButton",
  inheritAttrs: false,
  props: [...buttonPropKeys],
  setup(rawProps, { attrs, slots }) {
    return () => {
      const props = rawProps as unknown as RefreshButtonProps
      return h(
        Button,
        {
          ...attrs,
          ...props,
          variant: props.variant ?? ButtonVariant.secondary,
          iconRight: props.iconRight ?? IconName.RefreshCw,
          dataAttributes: {
            ...props.dataAttributes,
            "data-purpose": "refresh",
            "data-refresh": "true",
          },
        },
        slots,
      )
    }
  },
})

export type UploadButtonProps = Omit<ButtonProps, "action">

export const UploadButton = defineComponent({
  name: "MarwesUploadButton",
  inheritAttrs: false,
  props: [...buttonPropKeys],
  setup(rawProps, { attrs, slots }) {
    return () => {
      const props = rawProps as unknown as UploadButtonProps
      return h(
        Button,
        {
          ...attrs,
          ...props,
          variant: props.variant ?? ButtonVariant.secondary,
          iconRight: props.iconRight ?? IconName.Upload,
          dataAttributes: {
            ...props.dataAttributes,
            "data-purpose": "upload",
            "data-transfer": "upload",
          },
        },
        slots,
      )
    }
  },
})

export type DownloadButtonProps = Omit<ButtonProps, "action">

export const DownloadButton = defineComponent({
  name: "MarwesDownloadButton",
  inheritAttrs: false,
  props: [...buttonPropKeys],
  setup(rawProps, { attrs, slots }) {
    return () => {
      const props = rawProps as unknown as DownloadButtonProps
      return h(
        Button,
        {
          ...attrs,
          ...props,
          variant: props.variant ?? ButtonVariant.secondary,
          iconRight: props.iconRight ?? IconName.Download,
          dataAttributes: {
            ...props.dataAttributes,
            "data-purpose": "download",
            "data-transfer": "download",
          },
        },
        slots,
      )
    }
  },
})

export type CopyButtonProps = Omit<ButtonProps, "action">

export const CopyButton = defineComponent({
  name: "MarwesCopyButton",
  inheritAttrs: false,
  props: [...buttonPropKeys],
  setup(rawProps, { attrs, slots }) {
    return () => {
      const props = rawProps as unknown as CopyButtonProps
      return h(
        Button,
        {
          ...attrs,
          ...props,
          variant: props.variant ?? ButtonVariant.secondary,
          iconRight: props.iconRight ?? IconName.Copy,
          dataAttributes: {
            ...props.dataAttributes,
            "data-purpose": "copy",
            "data-copy": "true",
          },
        },
        slots,
      )
    }
  },
})

export type SearchButtonProps = Omit<ButtonProps, "action">

export const SearchButton = defineComponent({
  name: "MarwesSearchButton",
  inheritAttrs: false,
  props: [...buttonPropKeys],
  setup(rawProps, { attrs, slots }) {
    return () => {
      const props = rawProps as unknown as SearchButtonProps
      return h(
        Button,
        {
          ...attrs,
          ...props,
          variant: props.variant ?? ButtonVariant.secondary,
          iconRight: props.iconRight ?? IconName.Search,
          dataAttributes: {
            ...props.dataAttributes,
            "data-purpose": "search",
            "data-search": "true",
          },
        },
        slots,
      )
    }
  },
})

export type FilterButtonProps = Omit<ButtonProps, "action">

export const FilterButton = defineComponent({
  name: "MarwesFilterButton",
  inheritAttrs: false,
  props: [...buttonPropKeys],
  setup(rawProps, { attrs, slots }) {
    return () => {
      const props = rawProps as unknown as FilterButtonProps
      return h(
        Button,
        {
          ...attrs,
          ...props,
          variant: props.variant ?? ButtonVariant.secondary,
          iconRight: props.iconRight ?? IconName.Sliders,
          dataAttributes: {
            ...props.dataAttributes,
            "data-purpose": "filter",
            "data-filter": "true",
          },
        },
        slots,
      )
    }
  },
})

export type SortButtonProps = Omit<ButtonProps, "action">

export const SortButton = defineComponent({
  name: "MarwesSortButton",
  inheritAttrs: false,
  props: [...buttonPropKeys],
  setup(rawProps, { attrs, slots }) {
    return () => {
      const props = rawProps as unknown as SortButtonProps
      return h(
        Button,
        {
          ...attrs,
          ...props,
          variant: props.variant ?? ButtonVariant.secondary,
          iconRight: props.iconRight ?? IconName.ChevronsDown,
          dataAttributes: {
            ...props.dataAttributes,
            "data-purpose": "sort",
            "data-sort": "true",
          },
        },
        slots,
      )
    }
  },
})

export type DropdownButtonProps = Omit<ButtonProps, "action">

export const DropdownButton = defineComponent({
  name: "MarwesDropdownButton",
  inheritAttrs: false,
  props: [...buttonPropKeys],
  setup(rawProps, { attrs, slots }) {
    return () => {
      const props = rawProps as unknown as DropdownButtonProps
      return h(
        Button,
        {
          ...attrs,
          ...props,
          variant: props.variant ?? ButtonVariant.secondary,
          iconRight: props.iconRight ?? IconName.ChevronDown,
          dataAttributes: {
            ...props.dataAttributes,
            "data-purpose": "dropdown",
            "data-dropdown": "true",
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

export type SuccessButtonProps = Omit<ButtonProps, "variant" | "as">

export const SuccessButton = defineComponent({
  name: "MarwesSuccessButton",
  inheritAttrs: false,
  props: [...buttonPropKeys],
  setup(rawProps, { attrs, slots }) {
    return () => {
      const props = rawProps as unknown as SuccessButtonProps
      return h(
        Button,
        {
          ...attrs,
          ...props,
          variant: "success",
          as: "button",
          dataAttributes: {
            ...props.dataAttributes,
            "data-purpose": "success",
            "data-outcome": "positive",
          },
        },
        slots,
      )
    }
  },
})
