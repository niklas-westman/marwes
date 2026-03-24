import type * as React from "react"
import { RadioGroupField, type RadioGroupFieldProps } from "./radio-group-field"

/**
 * Context Variant Radio Groups - AI-Friendly Components
 *
 * These variants encode common radio group patterns and automatically set
 * AI-friendly metadata, making it easier for both developers and AI tools
 * to understand the purpose of each radio group.
 */

// ============================================================================
// YES/NO RADIO GROUP - Binary Choice
// ============================================================================

export type YesNoRadioGroupProps = Omit<RadioGroupFieldProps, "options"> & {
  /** Label for the "Yes" option. Defaults to "Yes". */
  yesLabel?: React.ReactNode
  /** Label for the "No" option. Defaults to "No". */
  noLabel?: React.ReactNode
}

/**
 * YesNoRadioGroup - For binary yes/no choices.
 *
 * **AI Context:**
 * - Pre-built options with values `"yes"` and `"no"`
 * - Adds `data-purpose="binary-choice"` for AI parsing
 * - Labels customizable via `yesLabel` / `noLabel`
 *
 * @example
 * ```tsx
 * import { YesNoRadioGroup } from "@marwes-ui/react";
 *
 * export function Example() {
 *   return (
 *     <YesNoRadioGroup
 *       name="accept-terms"
 *       label="Do you accept the terms?"
 *       defaultValue="no"
 *     />
 *   );
 * }
 * ```
 *
 * @example Custom labels
 * ```tsx
 * <YesNoRadioGroup
 *   name="newsletter"
 *   label="Subscribe to newsletter?"
 *   yesLabel="Subscribe"
 *   noLabel="No thanks"
 * />
 * ```
 */
export function YesNoRadioGroup(props: YesNoRadioGroupProps): React.ReactElement {
  const { yesLabel = "Yes", noLabel = "No", ...restProps } = props

  const options = [
    { value: "yes", label: yesLabel },
    { value: "no", label: noLabel },
  ]

  return (
    <RadioGroupField
      {...restProps}
      options={options}
      dataAttributes={{
        ...props.dataAttributes,
        "data-purpose": "binary-choice",
      }}
    />
  )
}

// ============================================================================
// RATING RADIO GROUP - Numeric Scale
// ============================================================================

export type RatingRadioGroupProps = Omit<RadioGroupFieldProps, "options"> & {
  /** Minimum value (inclusive). Defaults to 1. */
  min?: number
  /** Maximum value (inclusive). Defaults to 5. */
  max?: number
  /** Custom label function. Receives the numeric value, returns a label. Defaults to `String(value)`. */
  labelFn?: (value: number) => React.ReactNode
}

/**
 * RatingRadioGroup - For numeric scale selections.
 *
 * **AI Context:**
 * - Generates options from `min` to `max` (default 1–5)
 * - Values are string representations of numbers ("1", "2", etc.)
 * - Adds `data-purpose="rating"` for AI parsing
 * - Custom labels via `labelFn`
 *
 * @example
 * ```tsx
 * import { RatingRadioGroup } from "@marwes-ui/react";
 *
 * export function Example() {
 *   return (
 *     <RatingRadioGroup
 *       name="satisfaction"
 *       label="How satisfied are you?"
 *       defaultValue="3"
 *     />
 *   );
 * }
 * ```
 *
 * @example Custom range and labels
 * ```tsx
 * <RatingRadioGroup
 *   name="priority"
 *   label="Priority level"
 *   min={1}
 *   max={3}
 *   labelFn={(v) => ["Low", "Medium", "High"][v - 1]}
 * />
 * ```
 */
export function RatingRadioGroup(props: RatingRadioGroupProps): React.ReactElement {
  const { min = 1, max = 5, labelFn = String, ...restProps } = props

  const options = Array.from({ length: max - min + 1 }, (_, i) => {
    const value = min + i
    return { value: String(value), label: labelFn(value) }
  })

  return (
    <RadioGroupField
      {...restProps}
      options={options}
      dataAttributes={{
        ...props.dataAttributes,
        "data-purpose": "rating",
      }}
    />
  )
}

// ============================================================================
// OPTION RADIO GROUP - General Labeled Options
// ============================================================================

export type OptionRadioGroupProps = RadioGroupFieldProps

/**
 * OptionRadioGroup - For general labeled option selection.
 *
 * **AI Context:**
 * - Same API as `RadioGroupField` with `data-purpose="selection"` for AI parsing
 * - Use when no more specific context variant fits
 * - Preferences, categories, modes, or any custom option list
 *
 * @example
 * ```tsx
 * import { OptionRadioGroup } from "@marwes-ui/react";
 *
 * export function Example() {
 *   return (
 *     <OptionRadioGroup
 *       name="theme"
 *       label="Select theme"
 *       options={[
 *         { value: "light", label: "Light" },
 *         { value: "dark", label: "Dark" },
 *         { value: "system", label: "System" },
 *       ]}
 *       defaultValue="system"
 *     />
 *   );
 * }
 * ```
 */
export function OptionRadioGroup(props: OptionRadioGroupProps): React.ReactElement {
  return (
    <RadioGroupField
      {...props}
      dataAttributes={{
        ...props.dataAttributes,
        "data-purpose": "selection",
      }}
    />
  )
}
