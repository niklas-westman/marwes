import type {
  PaginationA11yProps,
  PaginationControlA11yProps,
  PaginationControlOptions,
  PaginationEllipsisA11yProps,
  PaginationGetItemAriaLabel,
  PaginationItemAriaLabelOptions,
  PaginationListA11yProps,
  PaginationOptions,
  PaginationPageA11yProps,
  PaginationPageOptions,
} from "./pagination-types"

export function resolvePaginationA11y(opts: PaginationOptions): PaginationA11yProps {
  const a11y: PaginationA11yProps = {
    ariaLabel: opts.ariaLabel ?? "Pagination",
  }

  if (opts.disabled) a11y.ariaDisabled = true
  return a11y
}

export function resolvePaginationListA11y(): PaginationListA11yProps {
  return { role: "list" }
}

export function resolvePaginationControlA11y(
  opts: PaginationControlOptions,
): PaginationControlA11yProps {
  const fallbackByDirection = {
    first: "First page",
    previous: "Previous page",
    next: "Next page",
    last: "Last page",
  } satisfies Record<PaginationControlOptions["direction"], string>
  const a11y: PaginationControlA11yProps = {
    ariaLabel: opts.ariaLabel ?? opts.label ?? fallbackByDirection[opts.direction],
  }

  if (opts.disabled) a11y.ariaDisabled = true
  return a11y
}

export function resolvePaginationPageA11y(opts: PaginationPageOptions): PaginationPageA11yProps {
  const a11y: PaginationPageA11yProps = {
    ariaLabel:
      opts.ariaLabel ??
      (opts.selected ? `Page ${opts.page}, current page` : `Go to page ${opts.page}`),
  }

  if (opts.selected) a11y.ariaCurrent = "page"
  if (opts.disabled) a11y.ariaDisabled = true
  return a11y
}

export function resolvePaginationEllipsisA11y(): PaginationEllipsisA11yProps {
  return { ariaHidden: true }
}

export function resolvePaginationItemAriaLabel(
  getItemAriaLabel: PaginationGetItemAriaLabel,
  item: PaginationItemAriaLabelOptions,
): string
export function resolvePaginationItemAriaLabel(
  getItemAriaLabel: undefined,
  item: PaginationItemAriaLabelOptions,
): undefined
export function resolvePaginationItemAriaLabel(
  getItemAriaLabel: PaginationGetItemAriaLabel | undefined,
  item: PaginationItemAriaLabelOptions,
): string | undefined {
  return getItemAriaLabel?.(item)
}
