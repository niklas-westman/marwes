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
})
