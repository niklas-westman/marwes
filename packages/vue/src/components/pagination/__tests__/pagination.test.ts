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
})
