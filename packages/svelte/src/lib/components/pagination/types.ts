export interface PaginationProps {
  pageCount: number
  page?: number
  defaultPage?: number
  siblingCount?: number
  boundaryCount?: number
  showPrevNext?: boolean
  disabled?: boolean
  previousLabel?: string
  nextLabel?: string
  ariaLabel?: string
  onpagechange?: (page: number) => void
  class?: string
  id?: string
}
