/**
 * React adapter for Marwes Checkbox.
 * - Renders a native <input type="checkbox"> using the core render kit.
 * - Applies strict a11y fields and CSS vars.
 * - Sets `indeterminate` via DOM property (not an HTML attribute).
 */

import { checkboxRecipe } from "@marwes/core"
import type { CheckboxProps as CoreCheckboxProps } from "@marwes/core"
import * as React from "react"
import { useTheme } from "../../provider/use-theme"

export type CheckboxProps = CoreCheckboxProps & {
  /**
   * Called with the next checked value when the user toggles the checkbox.
   * For indeterminate state: browser toggling typically results in `checked=true` and `indeterminate=false`
   * unless you keep controlling it.
   */
  onCheckedChange?: (checked: boolean) => void

  /**
   * Escape hatch for consumers that want raw event access.
   * (Optional – keep if you want parity with other components.)
   */
  onChange?: React.ChangeEventHandler<HTMLInputElement>
}

/**
 * Checkbox (Atom)
 *
 * Low-level checkbox control built on a native `<input type="checkbox">`.
 * Use this when you need custom layout or when the label/description is handled
 * elsewhere (e.g. inside a list item, table row, or custom field wrapper).
 *
 * For most forms, prefer `CheckboxField`, which composes `Checkbox` with
 * label/description/error wiring and consistent spacing.
 *
 * Accessibility
 * - Provide **either** `ariaLabel` **or** `ariaLabelledBy` (or use `CheckboxField` which wires a `<label>`).
 * - Use `ariaDescribedBy` to connect supporting text (help/error).
 * - `indeterminate` is applied via a DOM property, not an HTML attribute.
 *
 * @example Basic (uncontrolled)
 * ```tsx
 * <Checkbox ariaLabel="Subscribe to updates" defaultChecked />
 * ```
 *
 * @example Controlled
 * ```tsx
 * const [checked, setChecked] = React.useState(false);
 *
 * <Checkbox
 *   ariaLabel="Accept terms"
 *   checked={checked}
 *   onCheckedChange={setChecked}
 * />
 * ```
 *
 * @example Indeterminate (mixed)
 * ```tsx
 * const [checked, setChecked] = React.useState(false);
 * const [mixed, setMixed] = React.useState(true);
 *
 * <Checkbox
 *   ariaLabel="Select all"
 *   checked={checked}
 *   indeterminate={mixed}
 *   onCheckedChange={(next) => {
 *     setMixed(false);   // first interaction clears mixed state
 *     setChecked(next);
 *   }}
 * />
 * ```
 *
 * @example With external label + description
 * ```tsx
 * const id = "terms";
 * const descId = "terms-desc";
 *
 * <>
 *   <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
 *     <Checkbox id={id} ariaDescribedBy={descId} />
 *     <label htmlFor={id}>I accept the terms</label>
 *   </div>
 *   <div id={descId}>Required to continue.</div>
 * </>
 * ```
 */

export function Checkbox(props: CheckboxProps): React.ReactElement {
  const { onCheckedChange, onChange, ...coreProps } = props

  const theme = useTheme()

  const kit = checkboxRecipe({ ...coreProps, theme })

  const inputRef = React.useRef<HTMLInputElement | null>(null)

  // Keep DOM property in sync.
  React.useLayoutEffect(() => {
    const el = inputRef.current
    if (!el) return
    el.indeterminate = kit.indeterminate
  }, [kit.indeterminate])

  const handleChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    onChange?.(e)
    onCheckedChange?.(e.currentTarget.checked)
  }

  const { a11y } = kit

  return (
    <input
      ref={inputRef}
      type="checkbox"
      className={kit.className}
      style={kit.vars}
      id={a11y.id}
      name={a11y.name}
      value={a11y.value}
      disabled={a11y.disabled === true}
      required={a11y.required === true}
      aria-label={a11y.ariaLabel}
      aria-labelledby={a11y.ariaLabelledBy}
      aria-describedby={a11y.ariaDescribedBy}
      aria-checked={a11y.ariaChecked}
      aria-invalid={a11y.ariaInvalid === true ? true : undefined}
      checked={kit.checked}
      defaultChecked={kit.defaultChecked}
      onChange={handleChange}
    />
  )
}
