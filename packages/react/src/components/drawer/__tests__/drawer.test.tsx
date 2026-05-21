/**
 * React adapter: tests Drawer a11y wiring, optional chrome, and close behavior.
 */
import { fireEvent, render, screen } from "@testing-library/react"
import type * as React from "react"
import { describe, expect, it, vi } from "vitest"
import { MarwesProvider } from "../../../provider/marwes-provider"
import { Drawer } from "../drawer"

function renderWithProvider(ui: React.ReactElement) {
  return render(<MarwesProvider>{ui}</MarwesProvider>)
}

describe("Drawer", () => {
  it("uses the visible title and description as the accessible name and description", () => {
    renderWithProvider(
      <Drawer
        title="Drawer title"
        description="Drawer content supports secondary workflows."
        footer={<button type="button">Apply</button>}
      >
        <p>Custom content goes here.</p>
      </Drawer>,
    )

    const drawer = screen.getByRole("dialog", { name: /drawer title/i })

    expect(drawer.getAttribute("aria-describedby")).toContain("description")
    expect(drawer).not.toHaveAttribute("aria-modal")
    expect(drawer).toHaveAttribute("data-component", "drawer")
    expect(drawer).toHaveAttribute("data-size", "medium")
    expect(drawer).toHaveAttribute("data-placement", "right")
  })

  it("falls back to aria-label when no visible title is provided", () => {
    renderWithProvider(
      <Drawer ariaLabel="Filters" dismissible={false} showFooter={false}>
        <p>Choose filters before applying the table view.</p>
      </Drawer>,
    )

    const drawer = screen.getByRole("dialog", { name: /filters/i })

    expect(drawer).toHaveAttribute("aria-label", "Filters")
    expect(drawer).not.toHaveAttribute("aria-labelledby")
  })

  it("renders size, placement, footer, and scrim state from the core recipe", () => {
    renderWithProvider(
      <Drawer title="Panel" size="large" placement="left" showScrim={false} showFooter={false}>
        <p>Panel body</p>
      </Drawer>,
    )

    const root = screen.getByRole("dialog", { name: /panel/i }).parentElement

    expect(root).toHaveClass("mw-drawer--large")
    expect(root).toHaveClass("mw-drawer--left")
    expect(root).toHaveClass("mw-drawer--without-footer")
    expect(root).toHaveAttribute("data-scrim", "false")
    expect(document.querySelector(".mw-drawer__scrim")).toBeNull()
  })

  it("calls onClose from the close button and dismissible scrim", () => {
    const onClose = vi.fn()

    renderWithProvider(
      <Drawer title="Close me" onClose={onClose}>
        <p>Closeable content.</p>
      </Drawer>,
    )

    fireEvent.click(screen.getByRole("button", { name: /close drawer/i }))
    fireEvent.click(document.querySelector(".mw-drawer__scrim") as HTMLElement)

    expect(onClose).toHaveBeenCalledTimes(2)
  })
})
