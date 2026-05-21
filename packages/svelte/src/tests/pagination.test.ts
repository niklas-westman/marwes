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
})
