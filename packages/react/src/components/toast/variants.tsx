import { IconName, createPurposeSemanticAttributes } from "@marwes-ui/core"
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
        ...createPurposeSemanticAttributes("success-toast"),
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
        ...createPurposeSemanticAttributes("error-toast"),
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
        ...createPurposeSemanticAttributes("warning-toast"),
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
        ...createPurposeSemanticAttributes("info-toast"),
      }}
    />
  )
}
