import type { ButtonOptions, ButtonVariant, IconName } from "@marwes-ui/core"
import type { Snippet } from "svelte"

export interface ButtonProps extends ButtonOptions {
  children?: Snippet
  onclick?: (e: MouseEvent) => void
  class?: string
  style?: string
}

export interface IconButtonProps
  extends Omit<ButtonProps, "children" | "hasVisibleText" | "iconLeft" | "iconOnly" | "iconRight"> {
  icon: IconName
  /** Accessible name — required for icon-only buttons. Prefer `label`; `ariaLabel` also accepted. */
  label?: string
  ariaLabel?: string
  variant?: ButtonVariant
}

export type PrimaryButtonProps = Omit<ButtonProps, "variant" | "as">
export type SecondaryButtonProps = Omit<ButtonProps, "variant" | "as">
export type TextButtonProps = Omit<ButtonProps, "variant" | "as">
export type SuccessButtonProps = Omit<ButtonProps, "variant" | "action" | "as">
export type DestructiveButtonProps = Omit<ButtonProps, "variant" | "action" | "as">
export type SubmitButtonProps = Omit<ButtonProps, "variant" | "action" | "as">
export type CancelButtonProps = Omit<ButtonProps, "action">
export type CreateButtonProps = Omit<ButtonProps, "variant" | "action">
export type LinkButtonProps = Omit<ButtonProps, "variant" | "action" | "as">
export type SaveButtonProps = Omit<ButtonProps, "variant" | "action">
export type ConfirmButtonProps = Omit<ButtonProps, "variant" | "action" | "as">
export type VerifyButtonProps = Omit<ButtonProps, "variant" | "action" | "as">
export type EditButtonProps = Omit<ButtonProps, "variant" | "action">
export type CloseButtonProps = Omit<ButtonProps, "variant" | "action">
export type RefreshButtonProps = Omit<ButtonProps, "variant" | "action">
export type UploadButtonProps = Omit<ButtonProps, "variant" | "action">
export type DownloadButtonProps = Omit<ButtonProps, "variant" | "action">
export type CopyButtonProps = Omit<ButtonProps, "variant" | "action">
export type SearchButtonProps = Omit<ButtonProps, "variant" | "action">
export type FilterButtonProps = Omit<ButtonProps, "variant" | "action">
export type SortButtonProps = Omit<ButtonProps, "variant" | "action">
export type DropdownButtonProps = Omit<ButtonProps, "variant" | "action">
