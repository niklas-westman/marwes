import type { PaginationControlDisplay, PaginationGetItemAriaLabel } from "@marwes-ui/core"

export interface PaginationProps {
  pageCount: number
  page?: number
  defaultPage?: number
  siblingCount?: number
  boundaryCount?: number
  maxVisibleItems?: number
  controlDisplay?: PaginationControlDisplay
  adaptive?: boolean
  showPrevNext?: boolean
  showFirstLast?: boolean
  disabled?: boolean
  firstLabel?: string
  previousLabel?: string
  nextLabel?: string
  lastLabel?: string
  ariaLabel?: string
  ariaLabelledBy?: string
  ariaDescribedBy?: string
  getItemAriaLabel?: PaginationGetItemAriaLabel
  onpagechange?: (page: number) => void
  class?: string
  id?: string
}

export interface PaginationFieldProps {
  /** Optional: if omitted, a stable id is generated. */
  id?: string
  /** Field label (required for accessibility). */
  label: string
  /** Optional description text. */
  description?: string
  /** Optional error message. */
  error?: string
  /** Props forwarded to the Pagination atom. */
  pagination: Omit<PaginationProps, "ariaLabel" | "ariaLabelledBy" | "ariaDescribedBy">
  /** Additional aria-describedby IDs to merge with internal description/error IDs. */
  ariaDescribedBy?: string
  class?: string
}
