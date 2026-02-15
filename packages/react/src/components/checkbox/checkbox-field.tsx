import * as React from "react"
import { Checkbox } from "."
import type { CheckboxProps } from "."
import { Paragraph } from "../paragraph"

export type CheckboxFieldProps = {
  /** Optional: if omitted, we generate one via useId(). */
  id?: string

  /** Field content (rendered by adapter). */
  label: React.ReactNode
  description?: React.ReactNode
  error?: React.ReactNode

  /** Props forwarded to the Checkbox atom. */
  checkbox: CheckboxProps

  /** Additional aria-describedby IDs to merge with internal description/error IDs. */
  ariaDescribedBy?: string
}

function cx(...parts: Array<string | false>): string {
  return parts.filter(Boolean).join(" ")
}

/**
 * CheckboxField (Molecule) — Recommended
 *
 * A convenient, accessible wrapper around `Checkbox` that provides:
 * - a clickable `<label>` wired via `htmlFor`/`id`
 * - optional `description` and `error` regions
 * - automatic `aria-describedby` wiring (description + error + any external ids)
 * - automatic invalid state when `error` is present
 *
 * Use `CheckboxField` for most forms. Use `Checkbox` directly only when you need
 * a highly custom layout (tables, list rows, compound list items, etc.).
 *
 * Accessibility
 * - Generates a stable `id` via `useId()` when `id` is not provided.
 * - Always renders a real `<label>` element connected to the checkbox control.
 * - When `description` and/or `error` are present, it sets `aria-describedby`
 *   on the checkbox to reference their ids.
 * - When `error` is present, the checkbox is marked invalid (aria-invalid via core).
 *
 * @example Minimal (recommended)
 * ```tsx
 * <CheckboxField
 *   label="Subscribe to updates"
 *   checkbox={{ defaultChecked: true }}
 * />
 * ```
 *
 * @example With description
 * ```tsx
 * <CheckboxField
 *   label="Subscribe to updates"
 *   description="We'll only email you about important product changes."
 *   checkbox={{}}
 * />
 * ```
 *
 * @example With error (invalid state)
 * ```tsx
 * <CheckboxField
 *   label="Accept terms"
 *   error="You must accept the terms to continue."
 *   checkbox={{ required: true }}
 * />
 * ```
 *
 * @example Controlled
 * ```tsx
 * const [checked, setChecked] = React.useState(false);
 *
 * <CheckboxField
 *   label="Accept terms"
 *   checkbox={{
 *     checked,
 *     onCheckedChange: setChecked,
 *   }}
 * />
 * ```
 *
 * @example Indeterminate (mixed)
 * ```tsx
 * const [checked, setChecked] = React.useState(false);
 * const [mixed, setMixed] = React.useState(true);
 *
 * <CheckboxField
 *   label="Select all"
 *   description="Applies to all items in the current view."
 *   checkbox={{
 *     checked,
 *     indeterminate: mixed,
 *     onCheckedChange: (next) => {
 *       setMixed(false);
 *       setChecked(next);
 *     },
 *   }}
 * />
 * ```
 *
 * @example Custom describedBy (merge with internal description/error)
 * ```tsx
 * <CheckboxField
 *   ariaDescribedBy="my-extra-help"
 *   label="Enable telemetry"
 *   description="Helps us improve the product."
 *   checkbox={{}}
 * />
 *
 * <div id="my-extra-help">This setting can be changed later.</div>
 * ```
 */

export function CheckboxField(props: CheckboxFieldProps): React.ReactElement {
  const reactId = React.useId()
  const id = props.id ?? `mw-checkbox-${reactId}`

  const hasDescription = props.description !== undefined
  const hasError = props.error !== undefined

  const descId = hasDescription ? `${id}-desc` : undefined
  const errorId = hasError ? `${id}-error` : undefined

  // Merge aria-describedby from multiple sources
  const describedByParts = [props.ariaDescribedBy, descId, errorId].filter(Boolean)
  const mergedDescribedBy = describedByParts.length > 0 ? describedByParts.join(" ") : undefined

  const disabled = props.checkbox.disabled || false
  const invalid = hasError || props.checkbox.invalid || false

  const wrapperClass = cx(
    "mw-checkbox-field",
    disabled && "mw-checkbox-field--disabled",
    invalid && "mw-checkbox-field--invalid",
  )

  // Prepare checkbox props with proper ariaDescribedBy merging
  const checkboxProps: CheckboxProps = {
    ...props.checkbox,
    id,
    invalid,
  }

  if (mergedDescribedBy) {
    checkboxProps.ariaDescribedBy = mergedDescribedBy
  }

  return (
    <div className={wrapperClass}>
      <div className="mw-checkbox-field__row">
        <Checkbox {...checkboxProps} />

        <label className="mw-checkbox-field__label" htmlFor={id}>
          <Paragraph size="md">{props.label}</Paragraph>
        </label>
      </div>

      {hasDescription && (
        <div className="mw-checkbox-field__description" id={descId}>
          <Paragraph size="sm">{props.description}</Paragraph>
        </div>
      )}

      {hasError && (
        <div className="mw-checkbox-field__error" id={errorId} aria-live="polite">
          <Paragraph size="sm">{props.error}</Paragraph>
        </div>
      )}
    </div>
  )
}
