import { IconName } from "@marwes-ui/core"
import type * as React from "react"
import { Icon } from "../icon"
import { Toast, type ToastProps } from "./toast"

function getDefaultIcon(iconName: IconName): React.ReactNode {
  return <Icon name={iconName} decorative />
}

export type SuccessToastProps = ToastProps

export function SuccessToast(props: SuccessToastProps): React.ReactElement {
  return (
    <Toast
      {...props}
      variant={props.variant ?? "outline"}
      ariaLive={props.ariaLive ?? "polite"}
      icon={props.icon ?? getDefaultIcon(IconName.Check)}
      dataAttributes={{
        ...props.dataAttributes,
        "data-purpose": "success-toast",
        "data-intent": "success",
      }}
    />
  )
}

export type ErrorToastProps = ToastProps

export function ErrorToast(props: ErrorToastProps): React.ReactElement {
  return (
    <Toast
      {...props}
      variant={props.variant ?? "outline"}
      ariaLive={props.ariaLive ?? "assertive"}
      icon={props.icon ?? getDefaultIcon(IconName.XCircle)}
      dataAttributes={{
        ...props.dataAttributes,
        "data-purpose": "error-toast",
        "data-intent": "error",
      }}
    />
  )
}

export type WarningToastProps = ToastProps

export function WarningToast(props: WarningToastProps): React.ReactElement {
  return (
    <Toast
      {...props}
      variant={props.variant ?? "outline"}
      ariaLive={props.ariaLive ?? "polite"}
      icon={props.icon ?? getDefaultIcon(IconName.AlertTriangle)}
      dataAttributes={{
        ...props.dataAttributes,
        "data-purpose": "warning-toast",
        "data-intent": "warning",
      }}
    />
  )
}

export type InfoToastProps = ToastProps

export function InfoToast(props: InfoToastProps): React.ReactElement {
  return (
    <Toast
      {...props}
      variant={props.variant ?? "outline"}
      ariaLive={props.ariaLive ?? "polite"}
      icon={props.icon ?? getDefaultIcon(IconName.Info)}
      dataAttributes={{
        ...props.dataAttributes,
        "data-purpose": "info-toast",
        "data-intent": "info",
      }}
    />
  )
}
