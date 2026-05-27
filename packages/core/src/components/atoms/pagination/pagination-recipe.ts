import {
  resolvePaginationA11y,
  resolvePaginationControlA11y,
  resolvePaginationEllipsisA11y,
  resolvePaginationListA11y,
  resolvePaginationPageA11y,
} from "./pagination-a11y"
import type {
  PaginationAdaptiveMaxVisibleItemsOptions,
  PaginationAdaptiveProfile,
  PaginationAdaptiveProfileOptions,
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
  PaginationReservedItemCountOptions,
  PaginationResolvedControlDisplay,
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

export function resolvePaginationAdaptiveMaxVisibleItems(
  opts: PaginationAdaptiveMaxVisibleItemsOptions,
): number | undefined {
  const containerWidth = Math.max(0, opts.containerWidth)
  if (containerWidth <= 0) return undefined

  const itemSize = opts.itemSize ?? 32
  const itemGap = opts.itemGap ?? 2
  const sectionGap = opts.sectionGap ?? 12
  const controlWidth = opts.controlWidth ?? 0
  const controlCount = opts.controlCount ?? 0
  const controlGaps = controlCount > 0 ? sectionGap * controlCount : 0
  const availableItemWidth = Math.max(0, containerWidth - controlWidth - controlGaps)

  return Math.max(1, Math.floor((availableItemWidth + itemGap) / (itemSize + itemGap)))
}

function resolvePaginationListWidth(itemCount: number, itemSize: number, itemGap: number): number {
  if (itemCount <= 0) return 0
  return itemCount * itemSize + Math.max(0, itemCount - 1) * itemGap
}

function resolvePaginationLayoutWidth(
  itemCount: number,
  controlWidth: number,
  controlCount: number,
  itemSize: number,
  itemGap: number,
  sectionGap: number,
): number {
  const controlGaps = controlCount > 0 ? sectionGap * controlCount : 0

  return controlWidth + controlGaps + resolvePaginationListWidth(itemCount, itemSize, itemGap)
}

function resolvePaginationReducedItemCount(
  opts: PaginationAdaptiveProfileOptions,
  controlWidth: number,
): number | undefined {
  return resolvePaginationAdaptiveMaxVisibleItems({
    containerWidth: opts.containerWidth,
    controlWidth,
    ...(opts.controlCount !== undefined ? { controlCount: opts.controlCount } : {}),
    ...(opts.itemSize !== undefined ? { itemSize: opts.itemSize } : {}),
    ...(opts.itemGap !== undefined ? { itemGap: opts.itemGap } : {}),
    ...(opts.sectionGap !== undefined ? { sectionGap: opts.sectionGap } : {}),
  })
}

function createPaginationAdaptiveProfile(
  opts: PaginationAdaptiveProfileOptions,
  controlDisplay: PaginationResolvedControlDisplay,
  maxVisibleItems: number | undefined,
): PaginationAdaptiveProfile {
  return {
    controlDisplay,
    maxVisibleItems,
    reservedItemCount: resolvePaginationReservedItemCount({
      pageCount: opts.pageCount,
      ...(opts.siblingCount !== undefined ? { siblingCount: opts.siblingCount } : {}),
      ...(opts.boundaryCount !== undefined ? { boundaryCount: opts.boundaryCount } : {}),
      ...(maxVisibleItems !== undefined ? { maxVisibleItems } : {}),
    }),
  }
}

export function resolvePaginationAdaptiveProfile(
  opts: PaginationAdaptiveProfileOptions,
): PaginationAdaptiveProfile {
  const containerWidth = Math.max(0, opts.containerWidth)
  const pageCount = normalizeCount(opts.pageCount, 0)
  const controlDisplay = opts.controlDisplay ?? "auto"

  if (containerWidth <= 0 || pageCount <= 0) {
    return createPaginationAdaptiveProfile(
      opts,
      controlDisplay === "icon" ? "icon" : "label",
      undefined,
    )
  }

  const itemSize = opts.itemSize ?? 32
  const itemGap = opts.itemGap ?? 2
  const sectionGap = opts.sectionGap ?? 12
  const controlCount = opts.controlCount ?? 0
  const labelControlWidth = opts.labelControlWidth ?? opts.iconControlWidth ?? 0
  const iconControlWidth = opts.iconControlWidth ?? labelControlWidth
  const preferredItemCount = resolvePaginationReservedItemCount(opts)
  const preferredMaxVisibleItems = preferredItemCount > 0 ? preferredItemCount : undefined
  const labelWidth = resolvePaginationLayoutWidth(
    preferredItemCount,
    labelControlWidth,
    controlCount,
    itemSize,
    itemGap,
    sectionGap,
  )
  const iconWidth = resolvePaginationLayoutWidth(
    preferredItemCount,
    iconControlWidth,
    controlCount,
    itemSize,
    itemGap,
    sectionGap,
  )

  if (controlDisplay === "label") {
    const maxVisibleItems =
      labelWidth <= containerWidth
        ? preferredMaxVisibleItems
        : resolvePaginationReducedItemCount(opts, labelControlWidth)

    return createPaginationAdaptiveProfile(opts, "label", maxVisibleItems)
  }

  if (controlDisplay === "icon") {
    const maxVisibleItems =
      iconWidth <= containerWidth
        ? preferredMaxVisibleItems
        : resolvePaginationReducedItemCount(opts, iconControlWidth)

    return createPaginationAdaptiveProfile(opts, "icon", maxVisibleItems)
  }

  if (labelWidth <= containerWidth) {
    return createPaginationAdaptiveProfile(opts, "label", preferredMaxVisibleItems)
  }

  if (iconWidth <= containerWidth) {
    return createPaginationAdaptiveProfile(opts, "icon", preferredMaxVisibleItems)
  }

  return createPaginationAdaptiveProfile(
    opts,
    "icon",
    resolvePaginationReducedItemCount(opts, iconControlWidth),
  )
}

export function resolvePaginationReservedItemCount(
  opts: PaginationReservedItemCountOptions,
): number {
  const pageCount = normalizeCount(opts.pageCount, 0)
  if (pageCount <= 0) return 0

  const maxVisibleItems = resolvePaginationEffectiveMaxVisibleItems(opts)
  if (maxVisibleItems > 0) return Math.min(pageCount, maxVisibleItems)

  const siblingCount = normalizeCount(opts.siblingCount, 1)
  const boundaryCount = normalizeCount(opts.boundaryCount, 1)
  const slotsWithEllipsis = boundaryCount * 2 + siblingCount * 2 + 3

  return Math.min(pageCount, slotsWithEllipsis)
}

function resolvePaginationEffectiveMaxVisibleItems(
  opts: PaginationReservedItemCountOptions,
): number {
  const maxVisibleItems = normalizeCount(opts.maxVisibleItems, 0)
  if (maxVisibleItems <= 0) return 0

  const siblingCount = normalizeCount(opts.siblingCount, 1)
  if (maxVisibleItems < 6 || siblingCount < 1) return maxVisibleItems

  const pageCount = normalizeCount(opts.pageCount, 0)
  const boundaryCount = normalizeCount(opts.boundaryCount, 1)
  const muiMiddleRangeCount = boundaryCount * 2 + 5

  return Math.min(pageCount, Math.max(maxVisibleItems, muiMiddleRangeCount))
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
    items.push({ type: "start-ellipsis", key: "ellipsis-start" })
  } else {
    for (const pageNumber of range(boundaryCount + 1, leftSibling - 1)) {
      items.push(toPageItem(pageNumber, page))
    }
  }

  for (const pageNumber of range(leftSibling, rightSibling)) {
    items.push(toPageItem(pageNumber, page))
  }

  if (rightSibling < pageCount - boundaryCount) {
    items.push({ type: "end-ellipsis", key: "ellipsis-end" })
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
      { type: "end-ellipsis", key: "ellipsis-end" },
      toPageItem(pageCount, page),
    ]
  }

  if (page >= pageCount - 1) {
    return [
      toPageItem(1, page),
      { type: "start-ellipsis", key: "ellipsis-start" },
      toPageItem(pageCount - 1, page),
      toPageItem(pageCount, page),
    ]
  }

  return [
    toPageItem(1, page),
    { type: "start-ellipsis", key: "ellipsis-start" },
    toPageItem(page, page),
    toPageItem(pageCount, page),
  ]
}

function fillEdgePaginationItems(
  opts: PaginationOptions,
  maxVisibleItems: number,
  items: PaginationItem[],
): PaginationItem[] {
  const pageCount = normalizeCount(opts.pageCount, 0)
  const boundaryCount = normalizeCount(opts.boundaryCount, 1)
  const hasStartEllipsis = items.some((item) => item.type === "start-ellipsis")
  const hasEndEllipsis = items.some((item) => item.type === "end-ellipsis")

  if (items.length >= maxVisibleItems || pageCount <= maxVisibleItems) return items
  if (hasStartEllipsis === hasEndEllipsis) return items

  const page = clampPaginationPage(opts.page, pageCount)
  const edgePageCount = Math.max(boundaryCount + 1, maxVisibleItems - boundaryCount - 1)

  if (hasEndEllipsis) {
    const leadingPages = range(1, Math.min(edgePageCount, pageCount - boundaryCount - 1))

    return [
      ...leadingPages.map((pageNumber) => toPageItem(pageNumber, page)),
      { type: "end-ellipsis", key: "ellipsis-end" },
      ...range(Math.max(pageCount - boundaryCount + 1, edgePageCount + 1), pageCount).map(
        (pageNumber) => toPageItem(pageNumber, page),
      ),
    ]
  }

  const trailingPages = range(Math.max(pageCount - edgePageCount + 1, boundaryCount + 2), pageCount)

  return [
    ...range(1, Math.min(boundaryCount, pageCount)).map((pageNumber) =>
      toPageItem(pageNumber, page),
    ),
    { type: "start-ellipsis", key: "ellipsis-start" },
    ...trailingPages.map((pageNumber) => toPageItem(pageNumber, page)),
  ]
}

export function createPaginationItems(opts: PaginationOptions): PaginationItem[] {
  const pageCount = normalizeCount(opts.pageCount, 0)
  const maxVisibleItems = resolvePaginationEffectiveMaxVisibleItems(opts)

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

      if (items.length <= maxVisibleItems) {
        return fillEdgePaginationItems(opts, maxVisibleItems, items)
      }
    }
  }

  return createCompactPaginationItems(opts, maxVisibleItems)
}

export function createPaginationRecipe(opts: PaginationOptions): PaginationRenderKit {
  const reservedItemCount = resolvePaginationReservedItemCount(opts)
  const controlDisplay = opts.controlDisplay === "icon" ? "icon" : "label"

  return {
    tag: "nav",
    className: cx(
      "mw-pagination",
      `mw-pagination--controls-${controlDisplay}`,
      opts.disabled && "mw-pagination--disabled",
    ),
    vars:
      reservedItemCount > 0
        ? {
            "--mw-pagination-list-width": `calc(${reservedItemCount} * var(--mw-pagination-size) + ${Math.max(
              0,
              reservedItemCount - 1,
            )} * var(--mw-pagination-gap))`,
          }
        : {},
    a11y: resolvePaginationA11y(opts),
    items: createPaginationItems(opts),
    reservedItemCount,
    controlDisplay,
    showPrevNext: opts.showPrevNext ?? true,
    showFirstLast: opts.showFirstLast ?? false,
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
