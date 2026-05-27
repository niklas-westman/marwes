import { describe, expect, it } from "vitest"
import {
  clampPaginationPage,
  createPaginationControlRecipe,
  createPaginationEllipsisRecipe,
  createPaginationItems,
  createPaginationPageRecipe,
  createPaginationRecipe,
  resolvePaginationAdaptiveMaxVisibleItems,
  resolvePaginationAdaptiveProfile,
  resolvePaginationReservedItemCount,
} from "../../src/components/atoms/pagination"

describe("pagination recipe", () => {
  it("creates the Figma-style first page range with siblingCount=2", () => {
    expect(createPaginationItems({ page: 1, pageCount: 10, siblingCount: 2 })).toEqual([
      { type: "page", page: 1, key: "page-1", selected: true },
      { type: "page", page: 2, key: "page-2", selected: false },
      { type: "page", page: 3, key: "page-3", selected: false },
      { type: "end-ellipsis", key: "ellipsis-end" },
      { type: "page", page: 10, key: "page-10", selected: false },
    ])
  })

  it("creates a middle range with both ellipses", () => {
    expect(createPaginationItems({ page: 5, pageCount: 10, siblingCount: 1 })).toEqual([
      { type: "page", page: 1, key: "page-1", selected: false },
      { type: "start-ellipsis", key: "ellipsis-start" },
      { type: "page", page: 4, key: "page-4", selected: false },
      { type: "page", page: 5, key: "page-5", selected: true },
      { type: "page", page: 6, key: "page-6", selected: false },
      { type: "end-ellipsis", key: "ellipsis-end" },
      { type: "page", page: 10, key: "page-10", selected: false },
    ])
  })

  it("reduces sibling pages to stay within a max visible item count", () => {
    expect(
      createPaginationItems({ page: 7, pageCount: 10, siblingCount: 2, maxVisibleItems: 5 }),
    ).toEqual([
      { type: "page", page: 1, key: "page-1", selected: false },
      { type: "start-ellipsis", key: "ellipsis-start" },
      { type: "page", page: 7, key: "page-7", selected: true },
      { type: "end-ellipsis", key: "ellipsis-end" },
      { type: "page", page: 10, key: "page-10", selected: false },
    ])
  })

  it("preserves one adjacent sibling for the MUI-style middle range", () => {
    expect(
      createPaginationItems({ page: 6, pageCount: 10, siblingCount: 2, maxVisibleItems: 6 }),
    ).toEqual([
      { type: "page", page: 1, key: "page-1", selected: false },
      { type: "start-ellipsis", key: "ellipsis-start" },
      { type: "page", page: 5, key: "page-5", selected: false },
      { type: "page", page: 6, key: "page-6", selected: true },
      { type: "page", page: 7, key: "page-7", selected: false },
      { type: "end-ellipsis", key: "ellipsis-end" },
      { type: "page", page: 10, key: "page-10", selected: false },
    ])
  })

  it("keeps the requested range when it already fits max visible items", () => {
    expect(
      createPaginationItems({ page: 1, pageCount: 10, siblingCount: 2, maxVisibleItems: 5 }),
    ).toEqual([
      { type: "page", page: 1, key: "page-1", selected: true },
      { type: "page", page: 2, key: "page-2", selected: false },
      { type: "page", page: 3, key: "page-3", selected: false },
      { type: "end-ellipsis", key: "ellipsis-end" },
      { type: "page", page: 10, key: "page-10", selected: false },
    ])
  })

  it("fills edge ranges to the reserved adaptive slot count", () => {
    expect(
      createPaginationItems({ page: 1, pageCount: 10, siblingCount: 2, maxVisibleItems: 7 }),
    ).toEqual([
      { type: "page", page: 1, key: "page-1", selected: true },
      { type: "page", page: 2, key: "page-2", selected: false },
      { type: "page", page: 3, key: "page-3", selected: false },
      { type: "page", page: 4, key: "page-4", selected: false },
      { type: "page", page: 5, key: "page-5", selected: false },
      { type: "end-ellipsis", key: "ellipsis-end" },
      { type: "page", page: 10, key: "page-10", selected: false },
    ])

    expect(
      createPaginationItems({ page: 10, pageCount: 10, siblingCount: 2, maxVisibleItems: 7 }),
    ).toEqual([
      { type: "page", page: 1, key: "page-1", selected: false },
      { type: "start-ellipsis", key: "ellipsis-start" },
      { type: "page", page: 6, key: "page-6", selected: false },
      { type: "page", page: 7, key: "page-7", selected: false },
      { type: "page", page: 8, key: "page-8", selected: false },
      { type: "page", page: 9, key: "page-9", selected: false },
      { type: "page", page: 10, key: "page-10", selected: true },
    ])
  })

  it("can compact below the ellipsis-rich range for very narrow containers", () => {
    expect(
      createPaginationItems({ page: 7, pageCount: 10, siblingCount: 2, maxVisibleItems: 3 }),
    ).toEqual([
      { type: "page", page: 1, key: "page-1", selected: false },
      { type: "page", page: 7, key: "page-7", selected: true },
      { type: "page", page: 10, key: "page-10", selected: false },
    ])
  })

  it("does not render ellipses for small page counts", () => {
    expect(createPaginationItems({ page: 2, pageCount: 4 }).map((item) => item.key)).toEqual([
      "page-1",
      "page-2",
      "page-3",
      "page-4",
    ])
  })

  it("clamps invalid pages into the valid range", () => {
    expect(clampPaginationPage(undefined, 10)).toBe(1)
    expect(clampPaginationPage(-10, 10)).toBe(1)
    expect(clampPaginationPage(100, 10)).toBe(10)
    expect(clampPaginationPage(1, 0)).toBe(0)
  })

  it("supports boundaryCount=0 with sibling-only ellipsis ranges", () => {
    expect(
      createPaginationItems({ page: 6, pageCount: 11, boundaryCount: 0, siblingCount: 0 }).map(
        (item) => (item.type === "page" ? item.page : item.type),
      ),
    ).toEqual(["start-ellipsis", 6, "end-ellipsis"])

    expect(
      createPaginationItems({ page: 6, pageCount: 11, boundaryCount: 0, siblingCount: 1 }).map(
        (item) => (item.type === "page" ? item.page : item.type),
      ),
    ).toEqual(["start-ellipsis", 5, 6, 7, "end-ellipsis"])
  })

  it("returns a nav render kit with defaults", () => {
    const kit = createPaginationRecipe({ page: 1, pageCount: 10 })

    expect(kit.tag).toBe("nav")
    expect(kit.className).toBe("mw-pagination mw-pagination--controls-label")
    expect(kit.a11y.ariaLabel).toBe("Pagination")
    expect(kit.reservedItemCount).toBe(7)
    expect(kit.controlDisplay).toBe("label")
    expect(kit.vars).toEqual({
      "--mw-pagination-list-width":
        "calc(7 * var(--mw-pagination-size) + 6 * var(--mw-pagination-gap))",
    })
    expect(kit.showPrevNext).toBe(true)
    expect(kit.showFirstLast).toBe(false)
  })

  it("can opt into first and last controls", () => {
    expect(
      createPaginationRecipe({ page: 1, pageCount: 10, showFirstLast: true }).showFirstLast,
    ).toBe(true)
  })

  it("marks the selected page with aria-current", () => {
    const kit = createPaginationPageRecipe({ page: 3, selected: true })

    expect(kit.className).toBe("mw-pagination__page mw-pagination__page--selected")
    expect(kit.a11y.ariaCurrent).toBe("page")
    expect(kit.a11y.ariaLabel).toBe("Page 3, current page")
  })

  it("marks disabled controls", () => {
    const kit = createPaginationControlRecipe({ direction: "previous", disabled: true })

    expect(kit.className).toBe(
      "mw-pagination__control mw-pagination__control--previous mw-pagination__control--disabled",
    )
    expect(kit.a11y.ariaDisabled).toBe(true)
    expect(kit.a11y.ariaLabel).toBe("Previous page")
  })

  it("supports all pagination control directions", () => {
    expect(createPaginationControlRecipe({ direction: "first", label: "First" }).className).toBe(
      "mw-pagination__control mw-pagination__control--first",
    )
    expect(createPaginationControlRecipe({ direction: "last", label: "Last" }).a11y.ariaLabel).toBe(
      "Last",
    )
  })

  it("uses explicit aria labels for pages and controls", () => {
    expect(createPaginationPageRecipe({ page: 4, ariaLabel: "Open page 4" }).a11y.ariaLabel).toBe(
      "Open page 4",
    )
    expect(
      createPaginationControlRecipe({
        direction: "next",
        label: "Next",
        ariaLabel: "Open next result page",
      }).a11y.ariaLabel,
    ).toBe("Open next result page")
  })

  it("calculates adaptive max visible items from measured layout values", () => {
    expect(
      resolvePaginationAdaptiveMaxVisibleItems({
        containerWidth: 300,
        controlWidth: 120,
        controlCount: 2,
        itemSize: 32,
        itemGap: 2,
        sectionGap: 12,
      }),
    ).toBe(4)
    expect(resolvePaginationAdaptiveMaxVisibleItems({ containerWidth: 0 })).toBeUndefined()
  })

  it("chooses label controls when the preferred range fits", () => {
    expect(
      resolvePaginationAdaptiveProfile({
        containerWidth: 500,
        labelControlWidth: 120,
        iconControlWidth: 64,
        controlCount: 2,
        itemSize: 32,
        itemGap: 2,
        sectionGap: 12,
        pageCount: 10,
        siblingCount: 2,
      }),
    ).toEqual({
      controlDisplay: "label",
      maxVisibleItems: 9,
      reservedItemCount: 9,
    })
  })

  it("switches to icon controls before reducing page items", () => {
    expect(
      resolvePaginationAdaptiveProfile({
        containerWidth: 400,
        labelControlWidth: 120,
        iconControlWidth: 64,
        controlCount: 2,
        itemSize: 32,
        itemGap: 2,
        sectionGap: 12,
        pageCount: 10,
        siblingCount: 2,
      }),
    ).toEqual({
      controlDisplay: "icon",
      maxVisibleItems: 9,
      reservedItemCount: 9,
    })
  })

  it("reduces page items only after icon controls cannot fit the preferred range", () => {
    expect(
      resolvePaginationAdaptiveProfile({
        containerWidth: 350,
        labelControlWidth: 120,
        iconControlWidth: 64,
        controlCount: 2,
        itemSize: 32,
        itemGap: 2,
        sectionGap: 12,
        pageCount: 10,
        siblingCount: 2,
      }),
    ).toEqual({
      controlDisplay: "icon",
      maxVisibleItems: 7,
      reservedItemCount: 7,
    })
  })

  it("reserves the configured visible slot count for stable list width", () => {
    expect(
      resolvePaginationReservedItemCount({
        pageCount: 10,
        siblingCount: 2,
        maxVisibleItems: 6,
      }),
    ).toBe(7)
    expect(resolvePaginationReservedItemCount({ pageCount: 10, siblingCount: 2 })).toBe(9)
    expect(resolvePaginationReservedItemCount({ pageCount: 4, siblingCount: 2 })).toBe(4)
  })

  it("hides ellipsis from assistive technology", () => {
    expect(createPaginationEllipsisRecipe().a11y.ariaHidden).toBe(true)
  })
})
