import { fireEvent, render, screen } from "@testing-library/react"
import type * as React from "react"
import { describe, expect, it, vi } from "vitest"
import { MarwesProvider } from "../../../provider/marwes-provider"
import { Breadcrumb } from "../breadcrumb"

function renderWithProvider(ui: React.ReactElement) {
  return render(<MarwesProvider>{ui}</MarwesProvider>)
}

describe("Breadcrumb", () => {
  it("renders a labelled breadcrumb navigation with links and current page", () => {
    renderWithProvider(
      <Breadcrumb
        homeHref="/"
        items={[
          { label: "Components", href: "/components" },
          { label: "Breadcrumb", href: "/components/breadcrumb" },
        ]}
      />,
    )

    expect(screen.getByRole("navigation", { name: "Breadcrumb" })).toHaveAttribute(
      "data-component",
      "breadcrumb",
    )
    expect(screen.getByRole("link", { name: "Home" })).toHaveAttribute("href", "/")
    expect(screen.getByRole("link", { name: "Components" })).toHaveAttribute("href", "/components")
    expect(screen.getByText("Breadcrumb")).toHaveAttribute("aria-current", "page")
  })

  it("calls onItemSelect for button-backed non-current items", () => {
    const onItemSelect = vi.fn()

    renderWithProvider(
      <Breadcrumb
        items={[
          { value: "library", label: "Library" },
          { value: "breadcrumb", label: "Breadcrumb" },
        ]}
        onItemSelect={onItemSelect}
      />,
    )

    fireEvent.click(screen.getByRole("button", { name: "Library" }))

    expect(onItemSelect).toHaveBeenCalledWith(
      "library",
      expect.objectContaining({ value: "library", label: "Library" }),
      expect.any(Object),
    )
  })

  it("can hide the home item", () => {
    renderWithProvider(<Breadcrumb showHome={false} items={[{ label: "Current" }]} />)

    expect(screen.queryByRole("link", { name: "Home" })).toBeNull()
    expect(screen.queryByRole("button", { name: "Home" })).toBeNull()
    expect(screen.getByText("Current")).toHaveAttribute("aria-current", "page")
  })
})
