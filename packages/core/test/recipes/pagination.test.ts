import { describe, expect, it } from "vitest"
import {
  clampPaginationPage,
  createPaginationControlRecipe,
  createPaginationEllipsisRecipe,
  createPaginationItems,
  createPaginationPageRecipe,
  createPaginationRecipe,
} from "../../src/components/atoms/pagination"

describe("pagination recipe", () => {
  it("creates the Figma-style first page range with siblingCount=2", () => {
    expect(createPaginationItems({ page: 1, pageCount: 10, siblingCount: 2 })).toEqual([
      { type: "page", page: 1, key: "page-1", selected: true },
      { type: "page", page: 2, key: "page-2", selected: false },
      { type: "page", page: 3, key: "page-3", selected: false },
      { type: "ellipsis", key: "ellipsis-end" },
      { type: "page", page: 10, key: "page-10", selected: false },
    ])
  })

  it("creates a middle range with both ellipses", () => {
    expect(createPaginationItems({ page: 5, pageCount: 10, siblingCount: 1 })).toEqual([
      { type: "page", page: 1, key: "page-1", selected: false },
      { type: "ellipsis", key: "ellipsis-start" },
      { type: "page", page: 4, key: "page-4", selected: false },
      { type: "page", page: 5, key: "page-5", selected: true },
      { type: "page", page: 6, key: "page-6", selected: false },
      { type: "ellipsis", key: "ellipsis-end" },
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

  it("returns a nav render kit with defaults", () => {
    const kit = createPaginationRecipe({ page: 1, pageCount: 10 })

    expect(kit.tag).toBe("nav")
    expect(kit.className).toBe("mw-pagination")
    expect(kit.a11y.ariaLabel).toBe("Pagination")
    expect(kit.showPrevNext).toBe(true)
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

  it("hides ellipsis from assistive technology", () => {
    expect(createPaginationEllipsisRecipe().a11y.ariaHidden).toBe(true)
  })
})
