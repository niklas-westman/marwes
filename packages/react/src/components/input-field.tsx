import * as React from "react"
import { Input } from "./input"
import type { InputProps } from "./input"
import { Paragraph } from "./paragraph"

export type InputFieldProps = {
  /** Optional: if omitted, we generate one via useId(). */
  id?: string

  /** Field label (required for accessibility). */
  label: React.ReactNode

  /** Optional helper text shown below the input. */
  helperText?: React.ReactNode

  /** Optional error message. When present, input is marked invalid. */
  error?: React.ReactNode

  /** Props forwarded to the Input atom. */
  input: InputProps

  /** Additional aria-describedby IDs to merge with internal helper/error IDs. */
  ariaDescribedBy?: string
}

function cx(...parts: Array<string | false>): string {
  return parts.filter(Boolean).join(" ")
}

/**
 * InputField (Molecule) — Recommended
 *
 * A convenient, accessible wrapper around `Input` that provides:
 * - a visible `<label>` wired via `htmlFor`/`id`
 * - optional `helperText` and `error` regions
 * - automatic `aria-describedby` wiring (helperText + error + any external ids)
 * - automatic invalid state when `error` is present
 *
 * Use `InputField` for most forms. Use `Input` directly only when you need
 * a highly custom layout or composite inputs.
 *
 * Accessibility
 * - Generates a stable `id` via `useId()` when `id` is not provided.
 * - Always renders a visible `<label>` element connected to the input control.
 * - When `helperText` and/or `error` are present, it sets `aria-describedby`
 *   on the input to reference their ids.
 * - When `error` is present, the input is marked invalid (aria-invalid).
 * - Error region has `aria-live="polite"` for screen reader announcements.
 *
 * @example Minimal (recommended)
 * ```tsx
 * <InputField
 *   label="Email address"
 *   input={{ type: "email", placeholder: "you@example.com" }}
 * />
 * ```
 *
 * @example With helper text
 * ```tsx
 * <InputField
 *   label="Username"
 *   helperText="Choose a unique username between 3-20 characters."
 *   input={{ type: "text", placeholder: "johnsmith" }}
 * />
 * ```
 *
 * @example With error (invalid state)
 * ```tsx
 * <InputField
 *   label="Password"
 *   error="Password must be at least 8 characters."
 *   input={{ type: "password", required: true }}
 * />
 * ```
 *
 * @example Controlled
 * ```tsx
 * const [email, setEmail] = React.useState("");
 *
 * <InputField
 *   label="Email"
 *   input={{
 *     type: "email",
 *     value: email,
 *     onValueChange: setEmail,
 *   }}
 * />
 * ```
 *
 * @example Disabled
 * ```tsx
 * <InputField
 *   label="Account ID"
 *   helperText="This value cannot be changed."
 *   input={{ value: "ACC-12345", disabled: true }}
 * />
 * ```
 *
 * @example Read-only
 * ```tsx
 * <InputField
 *   label="Account created"
 *   input={{ value: "January 15, 2026", readOnly: true }}
 * />
 * ```
 *
 * @example Custom describedBy (merge with internal helper/error)
 * ```tsx
 * <InputField
 *   ariaDescribedBy="my-extra-help"
 *   label="API Key"
 *   helperText="Your key is stored securely."
 *   input={{ type: "password" }}
 * />
 *
 * <div id="my-extra-help">This can be regenerated from your settings.</div>
 * ```
 */
export function InputField(props: InputFieldProps): React.ReactElement {
  const reactId = React.useId()
  const id = props.id ?? `mw-input-${reactId}`

  const hasHelperText = props.helperText !== undefined
  const hasError = props.error !== undefined

  const helperTextId = hasHelperText ? `${id}-helper` : undefined
  const errorId = hasError ? `${id}-error` : undefined

  // Merge aria-describedby from multiple sources
  const describedByParts = [props.ariaDescribedBy, helperTextId, errorId].filter(Boolean)
  const mergedDescribedBy = describedByParts.length > 0 ? describedByParts.join(" ") : undefined

  const disabled = props.input.disabled || false
  const readOnly = props.input.readOnly || false
  const invalid = hasError || props.input.invalid || false

  const wrapperClass = cx(
    "mw-input-field",
    disabled && "mw-input-field--disabled",
    invalid && "mw-input-field--invalid",
    readOnly && "mw-input-field--readonly",
  )

  // Prepare input props with proper describedBy merging
  const inputProps: InputProps = {
    ...props.input,
    id,
    invalid,
  }

  if (mergedDescribedBy) {
    inputProps.describedBy = mergedDescribedBy
  }

  return (
    <div className={wrapperClass}>
      <label className="mw-input-field__label" htmlFor={id}>
        <Paragraph size="md">{props.label}</Paragraph>
      </label>

      <Input {...inputProps} />

      {hasHelperText && !hasError && (
        <div className="mw-input-field__helper" id={helperTextId}>
          <Paragraph size="sm">{props.helperText}</Paragraph>
        </div>
      )}

      {hasError && (
        <div className="mw-input-field__error" id={errorId} aria-live="polite">
          <Paragraph size="sm">{props.error}</Paragraph>
        </div>
      )}
    </div>
  )
}
