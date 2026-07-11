import { fireEvent, render, screen } from "@testing-library/vue"
import { describe, expect, it, vi } from "vitest"
import { defineComponent, h } from "vue"
import { MarwesProvider } from "../../../provider/marwes-provider"
import { Breadcrumb } from "../breadcrumb"

function renderWithProvider(child: () => unknown) {
  return render(
    defineComponent({
      setup() {
        return () =>
          h(MarwesProvider, null, {
            default: child,
          })
      },
    }),
  )
}

describe("Vue Breadcrumb", () => {
  it("renders a labelled breadcrumb navigation with links and current page", () => {
    renderWithProvider(() =>
      h(Breadcrumb, {
        homeHref: "/",
        items: [
          { label: "Components", href: "/components" },
          { label: "Breadcrumb", href: "/components/breadcrumb" },
        ],
      }),
    )

    expect(screen.getByRole("navigation", { name: "Breadcrumb" })).toHaveAttribute(
      "data-component",
      "breadcrumb",
    )
    expect(screen.getByRole("link", { name: "Home" })).toHaveAttribute("href", "/")
    expect(screen.getByRole("link", { name: "Components" })).toHaveAttribute("href", "/components")
    expect(screen.getByText("Breadcrumb")).toHaveAttribute("aria-current", "page")
  })

  it("emits selected item values for button-backed non-current items", async () => {
    const onItemSelect = vi.fn()

    renderWithProvider(() =>
      h(Breadcrumb, {
        items: [
          { value: "library", label: "Library" },
          { value: "breadcrumb", label: "Breadcrumb" },
        ],
        onItemSelect,
      }),
    )

    await fireEvent.click(screen.getByRole("button", { name: "Library" }))

    expect(onItemSelect).toHaveBeenCalledWith(
      "library",
      expect.objectContaining({ value: "library", label: "Library" }),
    )
  })
})
