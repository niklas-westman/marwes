import { buildInputFieldA11yIds } from "@marwes-ui/core"
import * as React from "react"
import { Text } from "../text"
import { SegmentedControl } from "./segmented-control"
import type { SegmentedControlProps } from "./segmented-control"

export type SegmentedControlFieldProps<T extends string = string> = {
  /** Optional: if omitted, a stable id is generated via useId(). */
  id?: string
  /** Field label (required for accessibility). */
  label: React.ReactNode
  /** Optional description text shown below the label. */
  description?: React.ReactNode
  /** Optional error message. */
  error?: React.ReactNode
  /** Props forwarded to the SegmentedControl atom. */
  segmentedControl: Omit<
    SegmentedControlProps<T>,
    "ariaLabel" | "ariaLabelledBy" | "ariaDescribedBy"
  >
  /** Additional aria-describedby IDs to merge with internal description/error IDs. */
  ariaDescribedBy?: string
  className?: string
}

function cx(...parts: Array<string | false | undefined>): string {
  return parts.filter(Boolean).join(" ")
}

function hasContent(value: React.ReactNode | undefined): boolean {
  if (value === undefined || value === null || value === false) {
    return false
  }
  if (typeof value === "string") {
    return value.trim().length > 0
  }
  return true
}

/**
 * SegmentedControlField (Molecule)
 *
 * A labeled wrapper around `SegmentedControl` that:
 * - renders a visible label wired via aria-labelledby
 * - generates a stable id with useId() when one isn't supplied
 * - optionally renders description and error regions
 * - threads aria-describedby to the radiogroup
 */
export function SegmentedControlField<T extends string = string>(
  props: SegmentedControlFieldProps<T>,
): React.ReactElement {
  const reactId = React.useId()
  const id = props.id ?? `mw-segmented-control-${reactId}`
  const labelId = `${id}-label`

  const hasDescription = hasContent(props.description)
  const hasError = hasContent(props.error)

  const {
    helperTextId: descriptionId,
    errorId,
    describedBy: mergedDescribedBy,
  } = buildInputFieldA11yIds({
    id,
    hasHelperText: hasDescription,
    hasError,
    externalDescribedBy: props.ariaDescribedBy,
  })

  const wrapperClass = cx(
    "mw-segmented-control-field",
    hasError && "mw-segmented-control-field--invalid",
    props.className,
  )

  return (
    <div className={wrapperClass}>
      <span className="mw-segmented-control-field__label" id={labelId}>
        <Text variant="label">{props.label}</Text>
      </span>

      {hasDescription && !hasError && (
        <div className="mw-segmented-control-field__description" id={descriptionId}>
          <Text variant="caption">{props.description}</Text>
        </div>
      )}

      <SegmentedControl
        {...(props.segmentedControl as SegmentedControlProps<T>)}
        ariaLabelledBy={labelId}
        {...(mergedDescribedBy ? { ariaDescribedBy: mergedDescribedBy } : {})}
      />

      {hasError && (
        <div className="mw-segmented-control-field__error" id={errorId} aria-live="polite">
          <Text variant="caption">{props.error}</Text>
        </div>
      )}
    </div>
  )
}
