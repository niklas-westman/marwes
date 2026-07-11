import type { InputOptions, RichTextOptions, SelectOptions, TextareaOptions } from "@marwes-ui/core"
import type { Snippet } from "svelte"

export type { SelectAppearance, SelectOption } from "@marwes-ui/core"

export type SelectFieldVariant = "default" | "date"

export interface InputProps extends Omit<InputOptions, "describedBy"> {
  value?: string
  oninput?: (e: Event & { currentTarget: HTMLInputElement }) => void
  class?: string
  style?: string | undefined
  /** Merged aria-describedby from InputField or user. */
  describedBy?: string | undefined
}

export interface InputFieldProps {
  /** Optional: if omitted, a stable id is generated. */
  id?: string

  /** Field label (required for accessibility). */
  label: string

  /** Optional helper text shown below the input. */
  helperText?: string

  /** Optional error message. When present, input is marked invalid. */
  error?: string

  /** Props forwarded to the Input atom. */
  input?: Omit<InputProps, "value">

  /** Additional aria-describedby IDs to merge with internal helper/error IDs. */
  ariaDescribedBy?: string

  /** Optional leading text symbol displayed inside the input on the left (e.g. "$", "€", "kr"). */
  leadingSymbol?: string

  /** The input value — supports bind:value. */
  value?: string

  class?: string
}

/**
 * Props for the bare `InputOtp` atom (Svelte).
 *
 * The atom renders only the OTP cells + hidden input. Use `InputOtpField`
 * for labeled forms; reach for the atom directly only when you need a
 * custom layout.
 */
export interface InputOtpProps {
  id?: string
  name?: string
  value?: string
  defaultValue?: string
  length?: number
  placeholderCharacter?: string
  disabled?: boolean
  readOnly?: boolean
  required?: boolean
  invalid?: boolean
  ariaLabel?: string
  label?: string
  ariaLabelledBy?: string
  /** ID(s) of elements that describe the input. Pre-merged by InputOtpField. */
  describedBy?: string
  onvaluechange?: (value: string) => void
  class?: string
}

export interface InputOtpFieldProps {
  /** Optional: if omitted, a stable id is generated. */
  id?: string
  /** Field label (required for accessibility). */
  label: string
  /** Optional helper text shown below the cells. */
  helperText?: string
  /** Optional error message. */
  error?: string
  /** Props forwarded to the bare InputOtp atom. */
  inputOtp?: Omit<InputOtpProps, "id" | "ariaLabel" | "label" | "ariaLabelledBy" | "describedBy">
  /** Additional aria-describedby IDs to merge with internal helper/error IDs. */
  ariaDescribedBy?: string
  class?: string
}

export interface RichTextProps extends RichTextOptions {
  onvaluechange?: (value: string) => void
  class?: string
}

export interface RichTextFieldProps {
  id?: string
  label: string
  helperText?: string
  error?: string
  editor: RichTextOptions & { onvaluechange?: (value: string) => void; class?: string }
  ariaDescribedBy?: string
}

export interface SelectProps extends Omit<SelectOptions, "describedBy"> {
  value?: string
  onvaluechange?: (value: string) => void
  onchange?: (e: Event & { currentTarget: HTMLSelectElement }) => void
  class?: string
  style?: string | undefined
  describedBy?: string | undefined
}

export interface SelectFieldProps {
  id?: string
  label: string
  helperText?: string
  error?: string
  select?: SelectProps
  ariaDescribedBy?: string
  value?: string
  variant?: SelectFieldVariant
  class?: string
}

export interface TextareaProps extends Omit<TextareaOptions, "describedBy"> {
  value?: string
  oninput?: (e: Event & { currentTarget: HTMLTextAreaElement }) => void
  class?: string
  style?: string | undefined
  describedBy?: string | undefined
}

export interface TextareaFieldProps {
  id?: string
  label: string
  helperText?: string
  counterText?: string
  error?: string
  textarea?: Omit<TextareaProps, "value">
  ariaDescribedBy?: string
  value?: string
  class?: string
}

export type DropdownFieldProps = Omit<SelectFieldProps, "select"> & {
  select: Omit<SelectProps, "appearance"> & {
    native?: boolean
  }
}

export type SearchFieldProps = Omit<InputFieldProps, "input"> & {
  input?: Omit<InputFieldProps["input"], "type" | "inputMode">
}

export type PasswordFieldProps = Omit<InputFieldProps, "input"> & {
  input?: Omit<InputFieldProps["input"], "type">
}

export type EmailFieldProps = Omit<InputFieldProps, "input"> & {
  input?: Omit<InputFieldProps["input"], "type" | "inputMode" | "autoComplete">
}

export type DateOfBirthFieldProps = Omit<InputFieldProps, "input"> & {
  input?: Omit<InputFieldProps["input"], "type" | "inputMode" | "autoComplete">
}

export type ZipCodeFieldProps = Omit<InputFieldProps, "input"> & {
  input?: Omit<InputFieldProps["input"], "type" | "inputMode" | "autoComplete">
}

export type PhoneFieldProps = Omit<InputFieldProps, "input"> & {
  input?: Omit<InputFieldProps["input"], "type" | "inputMode" | "autoComplete">
}

export type URLFieldProps = Omit<InputFieldProps, "input"> & {
  input?: Omit<InputFieldProps["input"], "type" | "inputMode" | "autoComplete">
}

export type CurrencyFieldProps = InputFieldProps & { currency?: string }
