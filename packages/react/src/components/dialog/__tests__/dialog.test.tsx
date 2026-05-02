import { render, screen } from "@testing-library/react"
import type * as React from "react"
import { describe, expect, it } from "vitest"
import { MarwesProvider } from "../../../provider/marwes-provider"
import { Dialog } from "../dialog"

function renderWithProvider(ui: React.ReactElement) {
  return render(<MarwesProvider>{ui}</MarwesProvider>)
}

describe("Dialog", () => {
  it("uses the visible title and description as the accessible name and description", () => {
    renderWithProvider(
      <Dialog
        title="Dialog title"
        description="Describe the purpose of the dialog."
        footer={<button type="button">Confirm</button>}
      >
        <p>Custom content goes here.</p>
      </Dialog>,
    )

    const dialog = screen.getByRole("dialog", { name: /dialog title/i })

    expect(dialog.getAttribute("aria-describedby")).toContain("description")
    expect(dialog).not.toHaveAttribute("aria-modal")
  })

  it("falls back to aria-label when no visible title is provided", () => {
    renderWithProvider(
      <Dialog ariaLabel="Unsaved changes" dismissible={false} showFooter={false}>
        <p>Review the pending changes before closing.</p>
      </Dialog>,
    )

    const dialog = screen.getByRole("dialog", { name: /unsaved changes/i })

    expect(dialog).toHaveAttribute("aria-label", "Unsaved changes")
    expect(dialog).not.toHaveAttribute("aria-labelledby")
  })

  it("only applies aria-modal when modal is enabled explicitly", () => {
    renderWithProvider(
      <Dialog modal title="Managed modal shell" dismissible={false} showFooter={false}>
        <p>Parent overlay code owns the modal boundary.</p>
      </Dialog>,
    )

    expect(screen.getByRole("dialog", { name: /managed modal shell/i })).toHaveAttribute(
      "aria-modal",
      "true",
    )
  })
})
