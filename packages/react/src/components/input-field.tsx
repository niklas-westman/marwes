import { buildInputFieldA11yIds } from "@marwes-ui/core"
import * as React from "react"
import { Icon } from "./icon"
import { Input } from "./input"
import type { InputProps } from "./input"
import { Paragraph } from "./paragraph"

export type InputFieldProps = {
  /** Optional: if omitted, we generate one via useId(). */
  id?: string

  /** Field label (required for accessibility). */
  label: string

  /** Optional helper text shown below the input. */
  helperText?: string

  /** Optional error message. When present, input is marked invalid. */
  error?: string

  /** Props forwarded to the Input atom. */
  input: InputProps

  /** Additional aria-describedby IDs to merge with internal helper/error IDs. */
  ariaDescribedBy?: string
}

function cx(...parts: Array<string | false>): string {
  return parts.filter(Boolean).join(" ")
}

function hasTextContent(value: string | undefined): boolean {
  return value !== undefined && value.trim().length > 0
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

  // Password visibility toggle
  const isPasswordField = props.input.type === "password"
  const [showPassword, setShowPassword] = React.useState(false)

  // Search clear button - track if search has value
  const isSearchField = props.input.type === "search"
  const [searchValue, setSearchValue] = React.useState(
    props.input.value || props.input.defaultValue || "",
  )

  // Determine if clear button should show based on controlled vs uncontrolled
  const hasSearchValue =
    isSearchField &&
    (props.input.value !== undefined
      ? String(props.input.value).length > 0
      : String(searchValue).length > 0)

  const hasHelperText = hasTextContent(props.helperText)
  const hasError = hasTextContent(props.error)

  const {
    helperTextId,
    errorId,
    describedBy: mergedDescribedBy,
  } = buildInputFieldA11yIds({
    id,
    hasHelperText,
    hasError,
    externalDescribedBy: props.ariaDescribedBy,
  })

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

  // Override type when showing password
  if (isPasswordField && showPassword) {
    inputProps.type = "text"
  }

  // Track search value changes and make search inputs controlled
  if (isSearchField) {
    const originalOnValueChange = props.input.onValueChange

    // Use parent's value if controlled, otherwise use local state
    if (props.input.value === undefined) {
      inputProps.value = searchValue
    }

    inputProps.onValueChange = (value: string) => {
      setSearchValue(value)
      originalOnValueChange?.(value)
    }
  }

  if (mergedDescribedBy) {
    inputProps.describedBy = mergedDescribedBy
  }

  const handleTogglePassword = () => {
    setShowPassword((prev) => !prev)
  }

  const handleClearSearch = () => {
    // For controlled inputs: notify parent to update state
    // For uncontrolled: update local state
    setSearchValue("")
    props.input.onValueChange?.("")
  }

  return (
    <div className={wrapperClass}>
      <label className="mw-input-field__label" htmlFor={id}>
        <Paragraph size="md">{props.label}</Paragraph>
      </label>

      <div className="mw-input-field__input-wrapper">
        <Input {...inputProps} />

        {isPasswordField && (
          <button
            type="button"
            className="mw-input-field__toggle-password"
            onClick={handleTogglePassword}
            aria-label={showPassword ? "Hide password" : "Show password"}
            tabIndex={0}
          >
            <Icon name={showPassword ? "eyeOff" : "eye"} size="xs" decorative />
          </button>
        )}

        {hasSearchValue && (
          <button
            type="button"
            className="mw-input-field__clear-search"
            onClick={handleClearSearch}
            aria-label="Clear search"
            tabIndex={0}
          >
            <Icon name="x" size="xs" decorative />
          </button>
        )}
      </div>

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
