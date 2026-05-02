import { render, screen } from "@testing-library/react"
import type * as React from "react"
import { describe, expect, it } from "vitest"
import { MarwesProvider } from "../../../provider/marwes-provider"
import { ButtonSpinner, EmptyStateSpinner } from "../variants"

function renderWithProvider(ui: React.ReactElement) {
  return render(<MarwesProvider>{ui}</MarwesProvider>)
}

describe("Spinner purpose components", () => {
  it("ButtonSpinner adds button-loading metadata and classic loading defaults", () => {
    renderWithProvider(<ButtonSpinner ariaLabel="Loading action" decorative={false} />)

    const spinnerElement = screen.getByRole("status", { name: /loading action/i })
    expect(spinnerElement.getAttribute("data-purpose")).toBe("button-loading")
    expect(spinnerElement.getAttribute("data-context")).toBe("button-loading")
    expect(spinnerElement.getAttribute("data-variant")).toBe("classic")
    expect(spinnerElement.getAttribute("data-size")).toBe("xs")
  })

  it("EmptyStateSpinner adds empty-state metadata and dots-round large defaults", () => {
    renderWithProvider(<EmptyStateSpinner ariaLabel="Loading dashboard" decorative={false} />)

    const spinnerElement = screen.getByRole("status", { name: /loading dashboard/i })
    expect(spinnerElement.getAttribute("data-purpose")).toBe("empty-state")
    expect(spinnerElement.getAttribute("data-context")).toBe("empty-state")
    expect(spinnerElement.getAttribute("data-variant")).toBe("dots-round")
    expect(spinnerElement.getAttribute("data-size")).toBe("lg")
  })
})
