/**
 * Core types for Checkbox.
 * - Core never renders; it returns a render kit consumed by adapters (React/Vue).
 * - `indeterminate` is a DOM property (not an HTML attribute) and must be applied by the adapter.
 */

import type { CssVars } from "../../../shared/css-vars"

/** Checkbox state model used by core. */
export type CheckboxState = "checked" | "unchecked" | "mixed"

/** Public props the adapter can pass into core. */
export type CheckboxProps = {
  /**
   * Visual variant hooks (mapped to class modifiers in recipe).
   * Keep minimal; presets decide styling.
   */
  size?: "sm" | "md" | "lg"

  /**
   * Controlled state.
   * If omitted, adapter can use defaultChecked or uncontrolled behavior.
   */
  checked?: boolean

  /** Uncontrolled initial state. */
  defaultChecked?: boolean

  /** Indeterminate / mixed state. */
  indeterminate?: boolean

  disabled?: boolean
  required?: boolean
  invalid?: boolean

  id?: string
  name?: string
  value?: string

  /** Connects to external label/description elements. */
  ariaLabel?: string
  ariaLabelledBy?: string
  ariaDescribedBy?: string
}

/** Strict a11y output (no loose attr maps). */
export type CheckboxA11y = {
  /** Always "checkbox". */
  type: "checkbox"

  /** Standard form attrs. */
  id?: string
  name?: string
  value?: string
  disabled?: true
  required?: true

  /** ARIA wiring. */
  ariaLabel?: string
  ariaLabelledBy?: string
  ariaDescribedBy?: string

  /**
   * Only set when needed. For mixed state we set "mixed".
   * For checked/unchecked we omit and rely on native input semantics.
   */
  ariaChecked?: "mixed"

  /**
   * Only set when invalid. Using aria-invalid is broadly supported.
   * (Preset/adapters can also add data attrs if desired later.)
   */
  ariaInvalid?: true
}

/** Render kit returned from core recipe. */
export type CheckboxRenderKit = {
  tag: "input"
  className: string
  vars: CssVars
  a11y: CheckboxA11y

  /**
   * Adapter must set: el.indeterminate = true/false
   * (No corresponding HTML attribute.)
   */
  indeterminate: boolean

  /**
   * For adapters: if both are set, controlled should win.
   * Core exposes both so adapters can wire either pattern.
   */
  checked?: boolean
  defaultChecked?: boolean
}
