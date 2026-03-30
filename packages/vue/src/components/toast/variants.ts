import { IconName } from "@marwes-ui/core"
import { defineComponent, h } from "vue"
import { Icon } from "../icon"
import { Toast, type ToastProps } from "./toast"

const toastPropKeys = [
  "variant",
  "ariaLive",
  "onDismiss",
  "className",
  "id",
  "dataAttributes",
] as const

function createPurposeToast(args: {
  name: string
  dataPurpose: string
  iconName: IconName
  defaultVariant: ToastProps["variant"]
  defaultAriaLive: NonNullable<ToastProps["ariaLive"]>
}) {
  return defineComponent({
    name: args.name,
    inheritAttrs: false,
    props: [...toastPropKeys],
    setup(rawProps, { attrs, slots }) {
      const props = rawProps as unknown as ToastProps

      return () => {
        const toastProps: Record<string, unknown> = {
          ...attrs,
          variant: props.variant ?? args.defaultVariant,
          ariaLive: props.ariaLive ?? args.defaultAriaLive,
          dataAttributes: {
            ...props.dataAttributes,
            "data-purpose": args.dataPurpose,
            "data-intent":
              args.dataPurpose === "success-toast"
                ? "success"
                : args.dataPurpose === "error-toast"
                  ? "error"
                  : args.dataPurpose === "warning-toast"
                    ? "warning"
                    : "info",
          },
        }

        if (props.onDismiss !== undefined) {
          toastProps.onDismiss = props.onDismiss
        }

        if (props.className !== undefined) {
          toastProps.className = props.className
        }

        if (props.id !== undefined) {
          toastProps.id = props.id
        }

        return h(Toast as never, toastProps, {
          ...slots,
          icon: slots.icon ?? (() => [h(Icon, { name: args.iconName, decorative: true })]),
        })
      }
    },
  })
}

export type SuccessToastProps = ToastProps
export const SuccessToast = createPurposeToast({
  name: "MarwesSuccessToast",
  dataPurpose: "success-toast",
  iconName: IconName.Check,
  defaultVariant: "outline",
  defaultAriaLive: "polite",
})

export type ErrorToastProps = ToastProps
export const ErrorToast = createPurposeToast({
  name: "MarwesErrorToast",
  dataPurpose: "error-toast",
  iconName: IconName.XCircle,
  defaultVariant: "outline",
  defaultAriaLive: "assertive",
})

export type WarningToastProps = ToastProps
export const WarningToast = createPurposeToast({
  name: "MarwesWarningToast",
  dataPurpose: "warning-toast",
  iconName: IconName.AlertTriangle,
  defaultVariant: "outline",
  defaultAriaLive: "polite",
})

export type InfoToastProps = ToastProps
export const InfoToast = createPurposeToast({
  name: "MarwesInfoToast",
  dataPurpose: "info-toast",
  iconName: IconName.Info,
  defaultVariant: "outline",
  defaultAriaLive: "polite",
})
