import type { InputOptions, RichTextOptions, SelectOptions, TextareaOptions } from "@marwes-ui/core"
import type { Snippet } from "svelte"

export type { SelectOption } from "@marwes-ui/core"

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

export interface InputOtpProps {
  id?: string
  name?: string
  label: string
  helperText?: string
  error?: string
  ariaDescribedBy?: string
  value?: string
  defaultValue?: string
  length?: number
  placeholderCharacter?: string
  disabled?: boolean
  readOnly?: boolean
  required?: boolean
  invalid?: boolean
  ariaLabel?: string
  onvaluechange?: (value: string) => void
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
  error?: string
  textarea?: Omit<TextareaProps, "value">
  ariaDescribedBy?: string
  value?: string
  class?: string
}
