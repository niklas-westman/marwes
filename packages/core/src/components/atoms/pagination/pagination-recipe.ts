import {
  resolvePaginationA11y,
  resolvePaginationControlA11y,
  resolvePaginationEllipsisA11y,
  resolvePaginationListA11y,
  resolvePaginationPageA11y,
} from "./pagination-a11y"
import type {
  PaginationControlOptions,
  PaginationControlRenderKit,
  PaginationEllipsisRenderKit,
  PaginationItem,
  PaginationListItemRenderKit,
  PaginationListRenderKit,
  PaginationOptions,
  PaginationPageOptions,
  PaginationPageRenderKit,
  PaginationRenderKit,
} from "./pagination-types"

function cx(...parts: Array<string | false | undefined>): string {
  return parts.filter(Boolean).join(" ")
}

function normalizeCount(value: number | undefined, fallback: number): number {
  if (value === undefined) return fallback
  if (!Number.isFinite(value)) return fallback
  return Math.max(0, Math.floor(value))
}

function range(start: number, end: number): number[] {
  if (end < start) return []
  return Array.from({ length: end - start + 1 }, (_, index) => start + index)
}

function toPageItem(pageNumber: number, currentPage: number): PaginationItem {
  return {
    type: "page",
    page: pageNumber,
    key: `page-${pageNumber}`,
    selected: pageNumber === currentPage,
  }
}

export function clampPaginationPage(page: number | undefined, pageCount: number): number {
  const normalizedPageCount = normalizeCount(pageCount, 0)
  if (normalizedPageCount <= 0) return 0

  if (page === undefined || !Number.isFinite(page)) return 1
  return Math.min(Math.max(1, Math.floor(page)), normalizedPageCount)
}

function createFixedPaginationItems(opts: PaginationOptions): PaginationItem[] {
  const pageCount = normalizeCount(opts.pageCount, 0)
  if (pageCount <= 0) return []

  const page = clampPaginationPage(opts.page, pageCount)
  const siblingCount = normalizeCount(opts.siblingCount, 1)
  const boundaryCount = normalizeCount(opts.boundaryCount, 1)
  const slotsWithoutEllipsis = boundaryCount * 2 + siblingCount * 2 + 1
  const slotsWithEllipsis = slotsWithoutEllipsis + 2

  if (pageCount <= slotsWithEllipsis) {
    return range(1, pageCount).map((pageNumber) => toPageItem(pageNumber, page))
  }

  const items: PaginationItem[] = []
  const startPages = range(1, Math.min(boundaryCount, pageCount))
  const endPages = range(Math.max(pageCount - boundaryCount + 1, boundaryCount + 1), pageCount)
  const leftSibling = Math.max(page - siblingCount, boundaryCount + 1)
  const rightSibling = Math.min(page + siblingCount, pageCount - boundaryCount)

  for (const pageNumber of startPages) items.push(toPageItem(pageNumber, page))

  if (leftSibling > boundaryCount + 1) {
    items.push({ type: "ellipsis", key: "ellipsis-start" })
  } else {
    for (const pageNumber of range(boundaryCount + 1, leftSibling - 1)) {
      items.push(toPageItem(pageNumber, page))
    }
  }

  for (const pageNumber of range(leftSibling, rightSibling)) {
    items.push(toPageItem(pageNumber, page))
  }

  if (rightSibling < pageCount - boundaryCount) {
    items.push({ type: "ellipsis", key: "ellipsis-end" })
  } else {
    for (const pageNumber of range(rightSibling + 1, pageCount - boundaryCount)) {
      items.push(toPageItem(pageNumber, page))
    }
  }

  for (const pageNumber of endPages) items.push(toPageItem(pageNumber, page))

  return items
}

function createCompactPaginationItems(
  opts: PaginationOptions,
  maxVisibleItems: number,
): PaginationItem[] {
  const pageCount = normalizeCount(opts.pageCount, 0)
  const page = clampPaginationPage(opts.page, pageCount)

  if (pageCount <= 0 || maxVisibleItems <= 0) return []
  if (maxVisibleItems === 1 || pageCount === 1) return [toPageItem(page, page)]

  if (maxVisibleItems === 2) {
    const edgePage = page === pageCount ? 1 : pageCount
    return [page, edgePage].sort((a, b) => a - b).map((pageNumber) => toPageItem(pageNumber, page))
  }

  if (maxVisibleItems === 3) {
    return Array.from(new Set([1, page, pageCount]))
      .slice(0, maxVisibleItems)
      .map((pageNumber) => toPageItem(pageNumber, page))
  }

  if (page <= 2) {
    return [
      toPageItem(1, page),
      toPageItem(2, page),
      { type: "ellipsis", key: "ellipsis-end" },
      toPageItem(pageCount, page),
    ]
  }

  if (page >= pageCount - 1) {
    return [
      toPageItem(1, page),
      { type: "ellipsis", key: "ellipsis-start" },
      toPageItem(pageCount - 1, page),
      toPageItem(pageCount, page),
    ]
  }

  return [
    toPageItem(1, page),
    { type: "ellipsis", key: "ellipsis-start" },
    toPageItem(page, page),
    toPageItem(pageCount, page),
  ]
}

export function createPaginationItems(opts: PaginationOptions): PaginationItem[] {
  const pageCount = normalizeCount(opts.pageCount, 0)
  const maxVisibleItems = normalizeCount(opts.maxVisibleItems, 0)

  if (pageCount <= 0) return []
  if (maxVisibleItems <= 0) return createFixedPaginationItems(opts)
  if (pageCount <= maxVisibleItems) return createFixedPaginationItems(opts)

  const siblingCount = normalizeCount(opts.siblingCount, 1)
  const boundaryCount = normalizeCount(opts.boundaryCount, 1)

  for (let nextBoundaryCount = boundaryCount; nextBoundaryCount >= 1; nextBoundaryCount -= 1) {
    for (let nextSiblingCount = siblingCount; nextSiblingCount >= 0; nextSiblingCount -= 1) {
      const items = createFixedPaginationItems({
        ...opts,
        boundaryCount: nextBoundaryCount,
        siblingCount: nextSiblingCount,
      })

      if (items.length <= maxVisibleItems) return items
    }
  }

  return createCompactPaginationItems(opts, maxVisibleItems)
}

export function createPaginationRecipe(opts: PaginationOptions): PaginationRenderKit {
  return {
    tag: "nav",
    className: cx("mw-pagination", opts.disabled && "mw-pagination--disabled"),
    vars: {},
    a11y: resolvePaginationA11y(opts),
    items: createPaginationItems(opts),
    showPrevNext: opts.showPrevNext ?? true,
  }
}

export function createPaginationListRecipe(): PaginationListRenderKit {
  return {
    tag: "ul",
    className: "mw-pagination__list",
    vars: {},
    a11y: resolvePaginationListA11y(),
  }
}

export function createPaginationListItemRecipe(): PaginationListItemRenderKit {
  return {
    tag: "li",
    className: "mw-pagination__list-item",
    vars: {},
  }
}

export function createPaginationControlRecipe(
  opts: PaginationControlOptions,
): PaginationControlRenderKit {
  return {
    tag: "button",
    className: cx(
      "mw-pagination__control",
      `mw-pagination__control--${opts.direction}`,
      opts.disabled && "mw-pagination__control--disabled",
    ),
    vars: {},
    a11y: resolvePaginationControlA11y(opts),
  }
}

export function createPaginationPageRecipe(opts: PaginationPageOptions): PaginationPageRenderKit {
  return {
    tag: "button",
    className: cx(
      "mw-pagination__page",
      opts.selected && "mw-pagination__page--selected",
      opts.disabled && "mw-pagination__page--disabled",
    ),
    vars: {},
    a11y: resolvePaginationPageA11y(opts),
  }
}

export function createPaginationEllipsisRecipe(): PaginationEllipsisRenderKit {
  return {
    tag: "span",
    className: "mw-pagination__ellipsis",
    vars: {},
    a11y: resolvePaginationEllipsisA11y(),
  }
}
