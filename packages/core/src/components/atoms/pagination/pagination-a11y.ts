import type {
  PaginationA11yProps,
  PaginationControlA11yProps,
  PaginationControlOptions,
  PaginationEllipsisA11yProps,
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
  const fallback = opts.direction === "previous" ? "Previous page" : "Next page"
  const a11y: PaginationControlA11yProps = {
    ariaLabel: opts.label ?? fallback,
  }

  if (opts.disabled) a11y.ariaDisabled = true
  return a11y
}

export function resolvePaginationPageA11y(opts: PaginationPageOptions): PaginationPageA11yProps {
  const a11y: PaginationPageA11yProps = {
    ariaLabel: opts.selected ? `Page ${opts.page}, current page` : `Go to page ${opts.page}`,
  }

  if (opts.selected) a11y.ariaCurrent = "page"
  if (opts.disabled) a11y.ariaDisabled = true
  return a11y
}

export function resolvePaginationEllipsisA11y(): PaginationEllipsisA11yProps {
  return { ariaHidden: true }
}
