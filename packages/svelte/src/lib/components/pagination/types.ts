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
  getItemAriaLabel?: PaginationGetItemAriaLabel
  onpagechange?: (page: number) => void
  class?: string
  id?: string
}
