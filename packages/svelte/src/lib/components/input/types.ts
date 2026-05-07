import type { InputOptions } from "@marwes-ui/core"
import type { Snippet } from "svelte"

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
