import { ButtonAction, ButtonVariant, IconName } from "@marwes-ui/core"
import { defineComponent, h } from "vue"
import { omitAttrs } from "../../internal/render-utils"
import { Button, type ButtonProps } from "./button"

type PurposeButtonForbiddenProp = "variant" | "action" | "as"

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

const purposeButtonPropKeys = [
  "as",
  "href",
  "size",
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
  "tooltip",
  "confirmation",
  "dataAttributes",
  "onClick",
  "className",
] as const

const fixedModePurposeButtonPropKeys = [
  "size",
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
  "tooltip",
  "confirmation",
  "dataAttributes",
  "onClick",
  "className",
] as const

const anchorPurposeButtonPropKeys = ["href", ...fixedModePurposeButtonPropKeys] as const

function isDevelopmentEnvironment(): boolean {
  const nodeProcess = (
    globalThis as unknown as {
      process?: { env?: Record<string, string | undefined> }
    }
  ).process

  const nodeEnv = nodeProcess?.env?.NODE_ENV
  if (nodeEnv) {
    return nodeEnv !== "production"
  }

  const meta = import.meta as unknown as {
    env?: { MODE?: string; PROD?: boolean }
  }

  if (typeof meta.env?.PROD === "boolean") {
    return !meta.env.PROD
  }

  if (meta.env?.MODE) {
    return meta.env.MODE !== "production"
  }

  return true
}

function warnForForbiddenPurposeProps(
  componentName: string,
  rawProps: Record<string, unknown>,
  attrs: Record<string, unknown>,
  forbiddenProps: readonly PurposeButtonForbiddenProp[],
): void {
  if (!isDevelopmentEnvironment()) {
    return
  }

  const warningByProp: Record<PurposeButtonForbiddenProp, string> = {
    variant: "Use Button if you need a custom visual treatment.",
    action: "Use Button if you need a custom semantic action.",
    as: "Use Button if you need a custom element mode.",
  }

  for (const forbiddenProp of forbiddenProps) {
    const wasProvidedViaProps = Object.prototype.hasOwnProperty.call(rawProps, forbiddenProp)
    const wasProvidedViaAttrs = Object.prototype.hasOwnProperty.call(attrs, forbiddenProp)

    if (!wasProvidedViaProps && !wasProvidedViaAttrs) {
      continue
    }

    console.warn(
      `[marwes] ${componentName} does not support \`${forbiddenProp}\`. ${warningByProp[forbiddenProp]}`,
    )
  }
}

function filterForwardedAttrs(
  attrs: Record<string, unknown>,
  omittedKeys: readonly string[],
): Record<string, unknown> {
  return omitAttrs(attrs, omittedKeys)
}

// DESTRUCTIVE BUTTON - Destructive Actions

export type DestructiveButtonProps = Omit<ButtonProps, "variant" | "action" | "as" | "href"> & {
  confirmation?: boolean
}

export const DestructiveButton = defineComponent({
  name: "MarwesDestructiveButton",
  inheritAttrs: false,
  props: [...fixedModePurposeButtonPropKeys],
  setup(rawProps, { attrs, slots }) {
    return () => {
      const props = rawProps as unknown as DestructiveButtonProps
      const rawAttrs = attrs as Record<string, unknown>

      warnForForbiddenPurposeProps("DestructiveButton", rawProps, rawAttrs, [
        "variant",
        "action",
        "as",
      ])

      return h(
        Button,
        {
          ...filterForwardedAttrs(rawAttrs, ["variant", "action", "as", "href"]),
          ...props,
          as: "button",
          variant: ButtonVariant.primary,
          action: ButtonAction.delete,
          error: true,
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

export type CreateButtonProps = Omit<ButtonProps, "variant" | "action">

export const CreateButton = defineComponent({
  name: "MarwesCreateButton",
  inheritAttrs: false,
  props: [...purposeButtonPropKeys],
  setup(rawProps, { attrs, slots }) {
    return () => {
      const props = rawProps as unknown as CreateButtonProps
      const rawAttrs = attrs as Record<string, unknown>

      warnForForbiddenPurposeProps("CreateButton", rawProps, rawAttrs, ["variant", "action"])

      return h(
        Button,
        {
          ...filterForwardedAttrs(rawAttrs, ["variant", "action"]),
          ...props,
          action: ButtonAction.create,
          variant: ButtonVariant.primary,
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

export type SubmitButtonProps = Omit<ButtonProps, "variant" | "action" | "as" | "href">

export const SubmitButton = defineComponent({
  name: "MarwesSubmitButton",
  inheritAttrs: false,
  props: [...fixedModePurposeButtonPropKeys],
  setup(rawProps, { attrs, slots }) {
    return () => {
      const props = rawProps as unknown as SubmitButtonProps
      const rawAttrs = attrs as Record<string, unknown>

      warnForForbiddenPurposeProps("SubmitButton", rawProps, rawAttrs, ["variant", "action", "as"])

      return h(
        Button,
        {
          ...filterForwardedAttrs(rawAttrs, ["variant", "action", "as", "href"]),
          ...props,
          as: "button",
          action: ButtonAction.submit,
          variant: ButtonVariant.primary,
          dataAttributes: {
            ...props.dataAttributes,
            "data-purpose": "submit",
            "data-context": "form-submit",
          },
        },
        slots,
      )
    }
  },
})

export type CancelButtonProps = Omit<ButtonProps, "variant" | "action">

export const CancelButton = defineComponent({
  name: "MarwesCancelButton",
  inheritAttrs: false,
  props: [...purposeButtonPropKeys],
  setup(rawProps, { attrs, slots }) {
    return () => {
      const props = rawProps as unknown as CancelButtonProps
      const rawAttrs = attrs as Record<string, unknown>

      warnForForbiddenPurposeProps("CancelButton", rawProps, rawAttrs, ["variant", "action"])

      return h(
        Button,
        {
          ...filterForwardedAttrs(rawAttrs, ["variant", "action"]),
          ...props,
          action: ButtonAction.cancel,
          variant: ButtonVariant.neutral,
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

export type LinkButtonProps = Omit<ButtonProps, "variant" | "action" | "as"> & {
  href: string
}

export const LinkButton = defineComponent({
  name: "MarwesLinkButton",
  inheritAttrs: false,
  props: [...anchorPurposeButtonPropKeys],
  setup(rawProps, { attrs, slots }) {
    return () => {
      const props = rawProps as unknown as LinkButtonProps
      const rawAttrs = attrs as Record<string, unknown>

      warnForForbiddenPurposeProps("LinkButton", rawProps, rawAttrs, ["variant", "action", "as"])

      return h(
        Button,
        {
          ...filterForwardedAttrs(rawAttrs, ["variant", "action", "as"]),
          ...props,
          as: "a",
          action: ButtonAction.navigate,
          variant: ButtonVariant.text,
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

export type SaveButtonProps = Omit<ButtonProps, "variant" | "action">

export const SaveButton = defineComponent({
  name: "MarwesSaveButton",
  inheritAttrs: false,
  props: [...purposeButtonPropKeys],
  setup(rawProps, { attrs, slots }) {
    return () => {
      const props = rawProps as unknown as SaveButtonProps
      const rawAttrs = attrs as Record<string, unknown>

      warnForForbiddenPurposeProps("SaveButton", rawProps, rawAttrs, ["variant", "action"])

      return h(
        Button,
        {
          ...filterForwardedAttrs(rawAttrs, ["variant", "action"]),
          ...props,
          action: ButtonAction.submit,
          variant: ButtonVariant.primary,
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

export type ConfirmButtonProps = Omit<ButtonProps, "variant" | "action" | "as" | "href">

export const ConfirmButton = defineComponent({
  name: "MarwesConfirmButton",
  inheritAttrs: false,
  props: [...fixedModePurposeButtonPropKeys],
  setup(rawProps, { attrs, slots }) {
    return () => {
      const props = rawProps as unknown as ConfirmButtonProps
      const rawAttrs = attrs as Record<string, unknown>

      warnForForbiddenPurposeProps("ConfirmButton", rawProps, rawAttrs, ["variant", "action", "as"])

      return h(
        Button,
        {
          ...filterForwardedAttrs(rawAttrs, ["variant", "action", "as", "href"]),
          ...props,
          variant: ButtonVariant.success,
          as: "button",
          action: ButtonAction.button,
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

export type VerifyButtonProps = Omit<ButtonProps, "variant" | "action" | "as" | "href">

export const VerifyButton = defineComponent({
  name: "MarwesVerifyButton",
  inheritAttrs: false,
  props: [...fixedModePurposeButtonPropKeys],
  setup(rawProps, { attrs, slots }) {
    return () => {
      const props = rawProps as unknown as VerifyButtonProps
      const rawAttrs = attrs as Record<string, unknown>

      warnForForbiddenPurposeProps("VerifyButton", rawProps, rawAttrs, ["variant", "action", "as"])

      return h(
        Button,
        {
          ...filterForwardedAttrs(rawAttrs, ["variant", "action", "as", "href"]),
          ...props,
          variant: ButtonVariant.secondary,
          as: "button",
          action: ButtonAction.button,
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

export type EditButtonProps = Omit<ButtonProps, "variant" | "action">

export const EditButton = defineComponent({
  name: "MarwesEditButton",
  inheritAttrs: false,
  props: [...purposeButtonPropKeys],
  setup(rawProps, { attrs, slots }) {
    return () => {
      const props = rawProps as unknown as EditButtonProps
      const rawAttrs = attrs as Record<string, unknown>

      warnForForbiddenPurposeProps("EditButton", rawProps, rawAttrs, ["variant", "action"])

      return h(
        Button,
        {
          ...filterForwardedAttrs(rawAttrs, ["variant", "action"]),
          ...props,
          action: ButtonAction.edit,
          variant: ButtonVariant.secondary,
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

export type CloseButtonProps = Omit<ButtonProps, "variant" | "action">

export const CloseButton = defineComponent({
  name: "MarwesCloseButton",
  inheritAttrs: false,
  props: [...purposeButtonPropKeys],
  setup(rawProps, { attrs, slots }) {
    return () => {
      const props = rawProps as unknown as CloseButtonProps
      const rawAttrs = attrs as Record<string, unknown>

      warnForForbiddenPurposeProps("CloseButton", rawProps, rawAttrs, ["variant", "action"])

      return h(
        Button,
        {
          ...filterForwardedAttrs(rawAttrs, ["variant", "action"]),
          ...props,
          action: ButtonAction.cancel,
          variant: ButtonVariant.neutral,
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

export type RefreshButtonProps = Omit<ButtonProps, "variant" | "action">

export const RefreshButton = defineComponent({
  name: "MarwesRefreshButton",
  inheritAttrs: false,
  props: [...purposeButtonPropKeys],
  setup(rawProps, { attrs, slots }) {
    return () => {
      const props = rawProps as unknown as RefreshButtonProps
      const rawAttrs = attrs as Record<string, unknown>

      warnForForbiddenPurposeProps("RefreshButton", rawProps, rawAttrs, ["variant", "action"])

      return h(
        Button,
        {
          ...filterForwardedAttrs(rawAttrs, ["variant", "action"]),
          ...props,
          action: ButtonAction.button,
          variant: ButtonVariant.neutral,
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

export type UploadButtonProps = Omit<ButtonProps, "variant" | "action">

export const UploadButton = defineComponent({
  name: "MarwesUploadButton",
  inheritAttrs: false,
  props: [...purposeButtonPropKeys],
  setup(rawProps, { attrs, slots }) {
    return () => {
      const props = rawProps as unknown as UploadButtonProps
      const rawAttrs = attrs as Record<string, unknown>

      warnForForbiddenPurposeProps("UploadButton", rawProps, rawAttrs, ["variant", "action"])

      return h(
        Button,
        {
          ...filterForwardedAttrs(rawAttrs, ["variant", "action"]),
          ...props,
          action: ButtonAction.button,
          variant: ButtonVariant.secondary,
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

export type DownloadButtonProps = Omit<ButtonProps, "variant" | "action">

export const DownloadButton = defineComponent({
  name: "MarwesDownloadButton",
  inheritAttrs: false,
  props: [...purposeButtonPropKeys],
  setup(rawProps, { attrs, slots }) {
    return () => {
      const props = rawProps as unknown as DownloadButtonProps
      const rawAttrs = attrs as Record<string, unknown>

      warnForForbiddenPurposeProps("DownloadButton", rawProps, rawAttrs, ["variant", "action"])

      return h(
        Button,
        {
          ...filterForwardedAttrs(rawAttrs, ["variant", "action"]),
          ...props,
          action: ButtonAction.button,
          variant: ButtonVariant.secondary,
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

export type CopyButtonProps = Omit<ButtonProps, "variant" | "action">

export const CopyButton = defineComponent({
  name: "MarwesCopyButton",
  inheritAttrs: false,
  props: [...purposeButtonPropKeys],
  setup(rawProps, { attrs, slots }) {
    return () => {
      const props = rawProps as unknown as CopyButtonProps
      const rawAttrs = attrs as Record<string, unknown>

      warnForForbiddenPurposeProps("CopyButton", rawProps, rawAttrs, ["variant", "action"])

      return h(
        Button,
        {
          ...filterForwardedAttrs(rawAttrs, ["variant", "action"]),
          ...props,
          action: ButtonAction.button,
          variant: ButtonVariant.neutral,
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

export type SearchButtonProps = Omit<ButtonProps, "variant" | "action">

export const SearchButton = defineComponent({
  name: "MarwesSearchButton",
  inheritAttrs: false,
  props: [...purposeButtonPropKeys],
  setup(rawProps, { attrs, slots }) {
    return () => {
      const props = rawProps as unknown as SearchButtonProps
      const rawAttrs = attrs as Record<string, unknown>

      warnForForbiddenPurposeProps("SearchButton", rawProps, rawAttrs, ["variant", "action"])

      return h(
        Button,
        {
          ...filterForwardedAttrs(rawAttrs, ["variant", "action"]),
          ...props,
          action: ButtonAction.button,
          variant: ButtonVariant.primary,
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

export type FilterButtonProps = Omit<ButtonProps, "variant" | "action">

export const FilterButton = defineComponent({
  name: "MarwesFilterButton",
  inheritAttrs: false,
  props: [...purposeButtonPropKeys],
  setup(rawProps, { attrs, slots }) {
    return () => {
      const props = rawProps as unknown as FilterButtonProps
      const rawAttrs = attrs as Record<string, unknown>

      warnForForbiddenPurposeProps("FilterButton", rawProps, rawAttrs, ["variant", "action"])

      return h(
        Button,
        {
          ...filterForwardedAttrs(rawAttrs, ["variant", "action"]),
          ...props,
          action: ButtonAction.button,
          variant: ButtonVariant.neutral,
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

export type SortButtonProps = Omit<ButtonProps, "variant" | "action">

export const SortButton = defineComponent({
  name: "MarwesSortButton",
  inheritAttrs: false,
  props: [...purposeButtonPropKeys],
  setup(rawProps, { attrs, slots }) {
    return () => {
      const props = rawProps as unknown as SortButtonProps
      const rawAttrs = attrs as Record<string, unknown>

      warnForForbiddenPurposeProps("SortButton", rawProps, rawAttrs, ["variant", "action"])

      return h(
        Button,
        {
          ...filterForwardedAttrs(rawAttrs, ["variant", "action"]),
          ...props,
          action: ButtonAction.button,
          variant: ButtonVariant.neutral,
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

export type DropdownButtonProps = Omit<ButtonProps, "variant" | "action">

export const DropdownButton = defineComponent({
  name: "MarwesDropdownButton",
  inheritAttrs: false,
  props: [...purposeButtonPropKeys],
  setup(rawProps, { attrs, slots }) {
    return () => {
      const props = rawProps as unknown as DropdownButtonProps
      const rawAttrs = attrs as Record<string, unknown>

      warnForForbiddenPurposeProps("DropdownButton", rawProps, rawAttrs, ["variant", "action"])

      return h(
        Button,
        {
          ...filterForwardedAttrs(rawAttrs, ["variant", "action"]),
          ...props,
          action: ButtonAction.button,
          variant: ButtonVariant.secondary,
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
