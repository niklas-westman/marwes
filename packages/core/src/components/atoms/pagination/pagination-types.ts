export type PaginationControlDirection = "first" | "previous" | "next" | "last"

export type PaginationControlDisplay = "auto" | "label" | "icon"

export type PaginationResolvedControlDisplay = Exclude<PaginationControlDisplay, "auto">

export type PaginationItemType = "page" | "start-ellipsis" | "end-ellipsis"

export type PaginationItem =
  | {
      type: "page"
      page: number
      key: string
      selected: boolean
    }
  | {
      type: "start-ellipsis" | "end-ellipsis"
      key: string
    }

export interface PaginationItemAriaLabelOptions {
  type: PaginationItemType | PaginationControlDirection
  page: number | null
  selected: boolean
}

export type PaginationGetItemAriaLabel = (item: PaginationItemAriaLabelOptions) => string

export interface PaginationOptions {
  page?: number
  pageCount: number
  siblingCount?: number
  boundaryCount?: number
  maxVisibleItems?: number
  controlDisplay?: PaginationControlDisplay
  showPrevNext?: boolean
  showFirstLast?: boolean
  disabled?: boolean
  ariaLabel?: string
  /** ID of an element whose text labels the pagination nav. Wins over `ariaLabel` if both are set. */
  ariaLabelledBy?: string
  firstLabel?: string
  previousLabel?: string
  nextLabel?: string
  lastLabel?: string
  getItemAriaLabel?: PaginationGetItemAriaLabel
}

export interface PaginationAdaptiveMaxVisibleItemsOptions {
  containerWidth: number
  controlWidth?: number
  controlCount?: number
  itemSize?: number
  itemGap?: number
  sectionGap?: number
}

export interface PaginationAdaptiveProfileOptions extends PaginationReservedItemCountOptions {
  containerWidth: number
  labelControlWidth?: number
  iconControlWidth?: number
  controlCount?: number
  itemSize?: number
  itemGap?: number
  sectionGap?: number
  controlDisplay?: PaginationControlDisplay
}

export interface PaginationAdaptiveProfile {
  controlDisplay: PaginationResolvedControlDisplay
  maxVisibleItems: number | undefined
  reservedItemCount: number
}

export interface PaginationReservedItemCountOptions {
  pageCount: number
  siblingCount?: number
  boundaryCount?: number
  maxVisibleItems?: number
}

export interface PaginationA11yProps {
  ariaLabel?: string
  ariaLabelledBy?: string
  ariaDisabled?: true
}

export interface PaginationListA11yProps {
  role: "list"
}

export interface PaginationControlOptions {
  direction: PaginationControlDirection
  disabled?: boolean
  label?: string
  ariaLabel?: string
}

export interface PaginationControlA11yProps {
  ariaLabel: string
  ariaDisabled?: true
}

export interface PaginationPageOptions {
  page: number
  selected?: boolean
  disabled?: boolean
  ariaLabel?: string
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
  reservedItemCount: number
  controlDisplay: PaginationResolvedControlDisplay
  showPrevNext: boolean
  showFirstLast: boolean
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
