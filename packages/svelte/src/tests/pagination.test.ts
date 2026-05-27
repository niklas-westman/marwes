import { fireEvent, render, screen } from "@testing-library/svelte"
import { describe, expect, it, vi } from "vitest"
import Pagination from "../lib/components/pagination/Pagination.svelte"

describe("Svelte Pagination", () => {
  it("renders nav and page items", () => {
    render(Pagination, { props: { page: 1, pageCount: 10, siblingCount: 2 } })

    expect(screen.getByRole("navigation", { name: "Pagination" })).not.toBeNull()
    expect(screen.getByRole("button", { name: "Page 1, current page" })).not.toBeNull()
    expect(screen.getByRole("button", { name: "Go to page 10" })).not.toBeNull()
  })

  it("marks the current page with aria-current", () => {
    render(Pagination, { props: { page: 3, pageCount: 10 } })

    expect(
      screen.getByRole("button", { name: "Page 3, current page" }).getAttribute("aria-current"),
    ).toBe("page")
  })

  it("calls onpagechange when selecting a page", async () => {
    const onpagechange = vi.fn()
    render(Pagination, { props: { page: 1, pageCount: 10, onpagechange } })

    await fireEvent.click(screen.getByRole("button", { name: "Go to page 2" }))

    expect(onpagechange).toHaveBeenCalledWith(2)
  })

  it("disables previous and next controls at the edges", () => {
    const first = render(Pagination, { props: { page: 1, pageCount: 10 } })
    expect((screen.getByRole("button", { name: "Previous" }) as HTMLButtonElement).disabled).toBe(
      true,
    )
    first.unmount()

    render(Pagination, { props: { page: 10, pageCount: 10 } })
    expect((screen.getByRole("button", { name: "Next" }) as HTMLButtonElement).disabled).toBe(true)
  })

  it("can hide previous and next controls", () => {
    render(Pagination, { props: { page: 1, pageCount: 10, showPrevNext: false } })

    expect(screen.queryByRole("button", { name: "Previous" })).toBeNull()
    expect(screen.queryByRole("button", { name: "Next" })).toBeNull()
  })

  it("can show first and last controls", async () => {
    const onpagechange = vi.fn()
    render(Pagination, {
      props: { page: 5, pageCount: 10, showFirstLast: true, onpagechange },
    })

    await fireEvent.click(screen.getByRole("button", { name: "First" }))
    await fireEvent.click(screen.getByRole("button", { name: "Last" }))

    expect(onpagechange).toHaveBeenNthCalledWith(1, 1)
    expect(onpagechange).toHaveBeenNthCalledWith(2, 10)
  })

  it("uses custom item aria labels", () => {
    render(Pagination, {
      props: {
        page: 1,
        pageCount: 10,
        showFirstLast: true,
        getItemAriaLabel: (item) =>
          item.type === "page" ? `Open page ${item.page}` : `Open ${item.type}`,
      },
    })

    expect(screen.getByRole("button", { name: "Open page 1" }).getAttribute("aria-current")).toBe(
      "page",
    )
    expect(screen.getByRole("button", { name: "Open next" })).not.toBeNull()
    expect(screen.getByRole("button", { name: "Open last" })).not.toBeNull()
  })

  it("reserves page-list width from the visible item budget", () => {
    render(Pagination, {
      props: { page: 4, pageCount: 10, siblingCount: 2, maxVisibleItems: 6 },
    })
    const nav = screen.getByRole("navigation", { name: "Pagination" })

    expect(nav.style.getPropertyValue("--mw-pagination-list-width")).toBe(
      "calc(7 * var(--mw-pagination-size) + 6 * var(--mw-pagination-gap))",
    )
  })

  it("can force icon-only controls while preserving accessible labels", () => {
    render(Pagination, {
      props: { page: 2, pageCount: 10, controlDisplay: "icon" },
    })
    const nav = screen.getByRole("navigation", { name: "Pagination" })

    expect(nav.getAttribute("data-control-display")).toBe("icon")
    expect(screen.getByRole("button", { name: "Previous" })).not.toBeNull()
    expect(screen.getByRole("button", { name: "Next" })).not.toBeNull()
  })

  it("can force label controls", () => {
    render(Pagination, {
      props: { page: 2, pageCount: 10, controlDisplay: "label" },
    })

    expect(
      screen.getByRole("navigation", { name: "Pagination" }).getAttribute("data-control-display"),
    ).toBe("label")
  })
})
