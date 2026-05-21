export type PaginationItem =
  | {
      type: "page"
      page: number
      key: string
      selected: boolean
    }
  | {
      type: "ellipsis"
      key: string
    }

export interface PaginationOptions {
  page?: number
  pageCount: number
  siblingCount?: number
  boundaryCount?: number
  maxVisibleItems?: number
  showPrevNext?: boolean
  disabled?: boolean
  ariaLabel?: string
  previousLabel?: string
  nextLabel?: string
}

export interface PaginationA11yProps {
  ariaLabel: string
  ariaDisabled?: true
}

export interface PaginationListA11yProps {
  role: "list"
}

export interface PaginationControlOptions {
  direction: "previous" | "next"
  disabled?: boolean
  label?: string
}

export interface PaginationControlA11yProps {
  ariaLabel: string
  ariaDisabled?: true
}

export interface PaginationPageOptions {
  page: number
  selected?: boolean
  disabled?: boolean
}

export interface PaginationPageA11yProps {
  ariaLabel: string
  ariaCurrent?: "page"
  ariaDisabled?: true
}

export interface PaginationEllipsisA11yProps {
  ariaHidden: true
}

export interface PaginationRenderKit {
  tag: "nav"
  className: string
  vars: Record<string, string>
  a11y: PaginationA11yProps
  items: PaginationItem[]
  showPrevNext: boolean
}

export interface PaginationListRenderKit {
  tag: "ul"
  className: string
  vars: Record<string, string>
  a11y: PaginationListA11yProps
}

export interface PaginationListItemRenderKit {
  tag: "li"
  className: string
  vars: Record<string, string>
}

export interface PaginationControlRenderKit {
  tag: "button"
  className: string
  vars: Record<string, string>
  a11y: PaginationControlA11yProps
}

export interface PaginationPageRenderKit {
  tag: "button"
  className: string
  vars: Record<string, string>
  a11y: PaginationPageA11yProps
}

export interface PaginationEllipsisRenderKit {
  tag: "span"
  className: string
  vars: Record<string, string>
  a11y: PaginationEllipsisA11yProps
}
