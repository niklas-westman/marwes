import { fireEvent, render, screen } from "@testing-library/react"
import type * as React from "react"
import { describe, expect, it, vi } from "vitest"
import { MarwesProvider } from "../../../provider/marwes-provider"
import { Pagination } from "../pagination"

function renderWithProvider(ui: React.ReactElement) {
  return render(<MarwesProvider>{ui}</MarwesProvider>)
}

describe("Pagination", () => {
  it("renders nav and page items", () => {
    renderWithProvider(<Pagination page={1} pageCount={10} siblingCount={2} />)

    expect(screen.getByRole("navigation", { name: "Pagination" })).not.toBeNull()
    expect(screen.getByRole("button", { name: "Page 1, current page" })).not.toBeNull()
    expect(screen.getByRole("button", { name: "Go to page 10" })).not.toBeNull()
  })

  it("marks the current page with aria-current", () => {
    renderWithProvider(<Pagination page={3} pageCount={10} />)

    expect(screen.getByRole("button", { name: "Page 3, current page" })).toHaveAttribute(
      "aria-current",
      "page",
    )
  })

  it("calls onPageChange when selecting a page", () => {
    const onPageChange = vi.fn()
    renderWithProvider(<Pagination page={1} pageCount={10} onPageChange={onPageChange} />)

    fireEvent.click(screen.getByRole("button", { name: "Go to page 2" }))

    expect(onPageChange).toHaveBeenCalledWith(2)
  })

  it("disables previous and next controls at the edges", () => {
    const { rerender } = renderWithProvider(<Pagination page={1} pageCount={10} />)

    expect(screen.getByRole("button", { name: "Previous" })).toBeDisabled()

    rerender(
      <MarwesProvider>
        <Pagination page={10} pageCount={10} />
      </MarwesProvider>,
    )

    expect(screen.getByRole("button", { name: "Next" })).toBeDisabled()
  })

  it("can hide previous and next controls", () => {
    renderWithProvider(<Pagination page={1} pageCount={10} showPrevNext={false} />)

    expect(screen.queryByRole("button", { name: "Previous" })).toBeNull()
    expect(screen.queryByRole("button", { name: "Next" })).toBeNull()
  })

  it("can show first and last controls", () => {
    const onPageChange = vi.fn()
    renderWithProvider(
      <Pagination page={5} pageCount={10} showFirstLast onPageChange={onPageChange} />,
    )

    fireEvent.click(screen.getByRole("button", { name: "First" }))
    fireEvent.click(screen.getByRole("button", { name: "Last" }))

    expect(onPageChange).toHaveBeenNthCalledWith(1, 1)
    expect(onPageChange).toHaveBeenNthCalledWith(2, 10)
  })

  it("uses custom item aria labels", () => {
    renderWithProvider(
      <Pagination
        page={1}
        pageCount={10}
        showFirstLast
        getItemAriaLabel={(item) =>
          item.type === "page" ? `Open page ${item.page}` : `Open ${item.type}`
        }
      />,
    )

    expect(screen.getByRole("button", { name: "Open page 1" })).toHaveAttribute(
      "aria-current",
      "page",
    )
    expect(screen.getByRole("button", { name: "Open next" })).not.toBeNull()
    expect(screen.getByRole("button", { name: "Open last" })).not.toBeNull()
  })

  it("reserves page-list width from the visible item budget", () => {
    renderWithProvider(<Pagination page={4} pageCount={10} siblingCount={2} maxVisibleItems={6} />)

    const nav = screen.getByRole("navigation", { name: "Pagination" })

    expect(nav.style.getPropertyValue("--mw-pagination-list-width")).toBe(
      "calc(7 * var(--mw-pagination-size) + 6 * var(--mw-pagination-gap))",
    )
  })

  it("can force icon-only controls while preserving accessible labels", () => {
    renderWithProvider(<Pagination page={2} pageCount={10} controlDisplay="icon" />)
    const nav = screen.getByRole("navigation", { name: "Pagination" })

    expect(nav).toHaveAttribute("data-control-display", "icon")
    expect(screen.getByRole("button", { name: "Previous" })).not.toBeNull()
    expect(screen.getByRole("button", { name: "Next" })).not.toBeNull()
  })

  it("can force label controls", () => {
    renderWithProvider(<Pagination page={2} pageCount={10} controlDisplay="label" />)

    expect(screen.getByRole("navigation", { name: "Pagination" })).toHaveAttribute(
      "data-control-display",
      "label",
    )
  })
})
