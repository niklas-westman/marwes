/**
 * React adapter for Marwes Radio.
 * - Renders a native <input type="radio"> using the core render kit.
 * - Applies strict a11y fields and modifier classes.
 */

import { radioRecipe, toRadioHtmlAttributes } from "@marwes-ui/core"
import type { RadioOptions } from "@marwes-ui/core"
import type * as React from "react"
import { toReactAttributes } from "../../internal/react-attributes"

export type RadioProps = RadioOptions & {
  /**
   * Called with the next checked value when the user selects this radio.
   * In a group, only the newly selected radio fires `true`.
   */
  onCheckedChange?: (checked: boolean) => void
  /** Raw event access escape hatch. */
  onChange?: React.ChangeEventHandler<HTMLInputElement>
}

/**
 * Radio (Atom)
 *
 * Low-level radio control built on a native `<input type="radio">`.
 * Use this when you need custom layout or when the label/grouping is handled
 * elsewhere (e.g. inside a list item, table row, or custom field wrapper).
 *
 * For most forms, prefer `RadioGroupField`, which composes `Radio` with
 * group label/description/error wiring, selection state, and consistent spacing.
 *
 * **AI Context:**
 * - Renders a native `<input type="radio">` using the core `radioRecipe`
 * - Applies strict a11y attributes: `aria-label`, `aria-labelledby`, `aria-describedby`, `aria-invalid`
 * - Supports controlled (`checked` + `onCheckedChange`) and uncontrolled (`defaultChecked`) modes
 * - Modifier classes: `mw-radio`, `mw-radio--disabled`, `mw-radio--invalid`
 *
 * Accessibility:
 * - Provide **either** `ariaLabel` **or** `ariaLabelledBy` (or wrap with a `<label htmlFor>`).
 * - Use the same `name` attribute on all radios in a group for native keyboard navigation.
 * - Use `ariaDescribedBy` to connect supporting text (help/error).
 *
 * @example Basic (uncontrolled)
 * ```tsx
 * <Radio ariaLabel="Option A" name="preference" defaultChecked />
 * ```
 *
 * @example Controlled
 * ```tsx
 * const [selected, setSelected] = React.useState("a");
 *
 * <Radio
 *   name="color"
 *   value="a"
 *   checked={selected === "a"}
 *   onCheckedChange={(checked) => { if (checked) setSelected("a"); }}
 *   ariaLabel="Red"
 * />
 * ```
 *
 * @example With external label
 * ```tsx
 * const id = "opt-1";
 *
 * <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
 *   <Radio id={id} name="group" value="a" />
 *   <label htmlFor={id}>Option A</label>
 * </div>
 * ```
 *
 * @example In a group (manual)
 * ```tsx
 * const [selected, setSelected] = React.useState("a");
 * const options = [
 *   { value: "a", label: "Option A" },
 *   { value: "b", label: "Option B" },
 * ];
 *
 * <div role="radiogroup" aria-label="Preference">
 *   {options.map(({ value, label }) => (
 *     <label key={value}>
 *       <Radio
 *         name="preference"
 *         value={value}
 *         checked={selected === value}
 *         onCheckedChange={(checked) => { if (checked) setSelected(value); }}
 *       />
 *       {label}
 *     </label>
 *   ))}
 * </div>
 * ```
 */

export function Radio(props: RadioProps): React.ReactElement {
  const { onCheckedChange, onChange, ...coreProps } = props
  const kit = radioRecipe(coreProps)
  const { a11y } = kit

  const handleChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    onChange?.(e)
    onCheckedChange?.(e.currentTarget.checked)
  }

  const htmlAttributes = toReactAttributes(toRadioHtmlAttributes(a11y))

  return (
    <input
      {...htmlAttributes}
      type="radio"
      className={kit.className}
      checked={kit.checked}
      defaultChecked={kit.defaultChecked}
      onChange={handleChange}
    />
  )
}
