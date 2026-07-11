import { fireEvent, render, screen } from "@testing-library/vue"
import { describe, expect, it, vi } from "vitest"
import { defineComponent, h } from "vue"
import { MarwesProvider } from "../../../provider/marwes-provider"
import { Pagination } from "../pagination"
import type { PaginationPropsVue } from "../pagination"

type PaginationTestProps = PaginationPropsVue & {
  "onUpdate:modelValue"?: (value: number) => void
}

function renderWithProvider(props: PaginationTestProps) {
  return render(
    defineComponent({
      setup() {
        return () =>
          h(MarwesProvider, null, {
            default: () => h(Pagination, props),
          })
      },
    }),
  )
}

describe("Vue Pagination", () => {
  it("renders nav and page items", () => {
    renderWithProvider({ modelValue: 1, pageCount: 10, siblingCount: 2 })

    expect(screen.getByRole("navigation", { name: "Pagination" })).not.toBeNull()
    expect(screen.getByRole("button", { name: "Page 1, current page" })).not.toBeNull()
    expect(screen.getByRole("button", { name: "Go to page 10" })).not.toBeNull()
  })

  it("marks the current page with aria-current", () => {
    renderWithProvider({ modelValue: 3, pageCount: 10 })

    expect(screen.getByRole("button", { name: "Page 3, current page" })).toHaveAttribute(
      "aria-current",
      "page",
    )
  })

  it("emits update when selecting a page", async () => {
    const onUpdate = vi.fn()
    renderWithProvider({ modelValue: 1, pageCount: 10, "onUpdate:modelValue": onUpdate })

    await fireEvent.click(screen.getByRole("button", { name: "Go to page 2" }))

    expect(onUpdate).toHaveBeenCalledWith(2)
  })

  it("disables previous and next controls at the edges", () => {
    const first = renderWithProvider({ modelValue: 1, pageCount: 10 })
    expect(screen.getByRole("button", { name: "Previous" })).toBeDisabled()
    first.unmount()

    renderWithProvider({ modelValue: 10, pageCount: 10 })
    expect(screen.getByRole("button", { name: "Next" })).toBeDisabled()
  })

  it("can hide previous and next controls", () => {
    renderWithProvider({ modelValue: 1, pageCount: 10, showPrevNext: false })

    expect(screen.queryByRole("button", { name: "Previous" })).toBeNull()
    expect(screen.queryByRole("button", { name: "Next" })).toBeNull()
  })

  it("can show first and last controls", async () => {
    const onUpdate = vi.fn()
    renderWithProvider({
      modelValue: 5,
      pageCount: 10,
      showFirstLast: true,
      "onUpdate:modelValue": onUpdate,
    })

    await fireEvent.click(screen.getByRole("button", { name: "First" }))
    await fireEvent.click(screen.getByRole("button", { name: "Last" }))

    expect(onUpdate).toHaveBeenNthCalledWith(1, 1)
    expect(onUpdate).toHaveBeenNthCalledWith(2, 10)
  })

  it("uses custom item aria labels", () => {
    renderWithProvider({
      modelValue: 1,
      pageCount: 10,
      showFirstLast: true,
      getItemAriaLabel: (item) =>
        item.type === "page" ? `Open page ${item.page}` : `Open ${item.type}`,
    })

    expect(screen.getByRole("button", { name: "Open page 1" })).toHaveAttribute(
      "aria-current",
      "page",
    )
    expect(screen.getByRole("button", { name: "Open next" })).not.toBeNull()
    expect(screen.getByRole("button", { name: "Open last" })).not.toBeNull()
  })

  it("reserves page-list width from the visible item budget", () => {
    renderWithProvider({ modelValue: 4, pageCount: 10, siblingCount: 2, maxVisibleItems: 6 })
    const nav = screen.getByRole("navigation", { name: "Pagination" })

    expect(nav.style.getPropertyValue("--mw-pagination-list-width")).toBe(
      "calc(7 * var(--mw-pagination-size) + 6 * var(--mw-pagination-gap))",
    )
  })

  it("can force icon-only controls while preserving accessible labels", () => {
    renderWithProvider({ modelValue: 2, pageCount: 10, controlDisplay: "icon" })
    const nav = screen.getByRole("navigation", { name: "Pagination" })

    expect(nav).toHaveAttribute("data-control-display", "icon")
    expect(screen.getByRole("button", { name: "Previous" })).not.toBeNull()
    expect(screen.getByRole("button", { name: "Next" })).not.toBeNull()
  })

  it("can force label controls", () => {
    renderWithProvider({ modelValue: 2, pageCount: 10, controlDisplay: "label" })

    expect(screen.getByRole("navigation", { name: "Pagination" })).toHaveAttribute(
      "data-control-display",
      "label",
    )
  })
})
