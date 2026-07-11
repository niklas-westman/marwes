import { buildInputFieldA11yIds } from "@marwes-ui/core"
import * as React from "react"
import { Text } from "../text"
import { Pagination } from "./pagination"
import type { PaginationProps } from "./pagination"

export type PaginationFieldProps = {
  /** Optional: if omitted, a stable id is generated via useId(). */
  id?: string
  /** Field label (required for accessibility). */
  label: React.ReactNode
  /** Optional description text shown below the label. */
  description?: React.ReactNode
  /** Optional error message. */
  error?: React.ReactNode
  /** Props forwarded to the Pagination atom. */
  pagination: Omit<PaginationProps, "ariaLabel" | "ariaLabelledBy" | "ariaDescribedBy">
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
 * PaginationField (Molecule)
 *
 * A labeled wrapper around `Pagination` that:
 * - renders a visible label wired via aria-labelledby
 * - generates a stable id with useId() when one isn't supplied
 * - optionally renders description and error regions
 * - threads aria-describedby to the pagination nav
 */
export function PaginationField(props: PaginationFieldProps): React.ReactElement {
  const reactId = React.useId()
  const id = props.id ?? `mw-pagination-${reactId}`
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
    "mw-pagination-field",
    hasError && "mw-pagination-field--invalid",
    props.className,
  )

  return (
    <div className={wrapperClass}>
      <span className="mw-pagination-field__label" id={labelId}>
        <Text variant="label">{props.label}</Text>
      </span>

      {hasDescription && !hasError && (
        <div className="mw-pagination-field__description" id={descriptionId}>
          <Text variant="caption">{props.description}</Text>
        </div>
      )}

      <Pagination
        {...props.pagination}
        ariaLabelledBy={labelId}
        {...(mergedDescribedBy ? { ariaDescribedBy: mergedDescribedBy } : {})}
      />

      {hasError && (
        <div className="mw-pagination-field__error" id={errorId} aria-live="polite">
          <Text variant="caption">{props.error}</Text>
        </div>
      )}
    </div>
  )
}
