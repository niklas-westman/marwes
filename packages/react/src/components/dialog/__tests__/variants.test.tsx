/**
 * React adapter: Tests Dialog purpose/variant components — verifies that each
 * purpose wrapper renders with the correct semantic defaults and metadata.
 */
import { render, screen } from "@testing-library/react"
import type * as React from "react"
import { describe, expect, it } from "vitest"
import { runDialogContract } from "../../../../../../tests/contracts/dialog.contract"
import { MarwesProvider } from "../../../provider/marwes-provider"
import { ConfirmDialog, DestructiveDialog, InfoDialog } from "../variants"

function renderWithProvider(ui: React.ReactElement) {
  return render(<MarwesProvider>{ui}</MarwesProvider>)
}

runDialogContract("react", {
  renderConfirm() {
    renderWithProvider(
      <ConfirmDialog
        open
        title="Publish update"
        description="This notifies subscribers immediately."
      >
        <p>Review the release notes before confirming.</p>
      </ConfirmDialog>,
    )
  },
  renderDestructive() {
    renderWithProvider(
      <DestructiveDialog open title="Delete workspace" description="This cannot be undone.">
        <p>All projects and members will be removed.</p>
      </DestructiveDialog>,
    )
  },
  renderInfo() {
    renderWithProvider(
      <InfoDialog
        open
        title="Maintenance notice"
        description="The workspace will be read-only for 10 minutes."
      >
        <p>Save your work before the maintenance window begins.</p>
      </InfoDialog>,
    )
  },
  getByRole(role, options) {
    return screen.getByRole(role, options)
  },
})

describe("ConfirmDialog", () => {
  it("adds confirm metadata and default actions", () => {
    renderWithProvider(
      <ConfirmDialog
        open
        title="Publish update"
        description="This notifies subscribers immediately."
      >
        <p>Review the release notes before confirming.</p>
      </ConfirmDialog>,
    )

    const dialog = screen.getByRole("dialog", { name: /publish update/i })
    expect(dialog.getAttribute("data-purpose")).toBe("confirm-dialog")
    expect(dialog.getAttribute("data-intent")).toBe("confirm")
    expect(screen.getByRole("button", { name: /cancel/i })).toBeTruthy()
    expect(screen.getByRole("button", { name: /confirm/i })).toBeTruthy()
  })
})

describe("DestructiveDialog", () => {
  it("adds destructive metadata and a danger action", () => {
    renderWithProvider(
      <DestructiveDialog open title="Delete workspace" description="This cannot be undone.">
        <p>All projects and members will be removed.</p>
      </DestructiveDialog>,
    )

    const dialog = screen.getByRole("dialog", { name: /delete workspace/i })
    expect(dialog.getAttribute("data-purpose")).toBe("destructive-dialog")
    expect(dialog.getAttribute("data-intent")).toBe("destructive")
    expect(screen.getByRole("button", { name: /delete/i })).toBeTruthy()
  })
})

describe("InfoDialog", () => {
  it("adds info metadata and a single acknowledgement action", () => {
    renderWithProvider(
      <InfoDialog
        open
        title="Maintenance notice"
        description="The workspace will be read-only for 10 minutes."
      >
        <p>Save your work before the maintenance window begins.</p>
      </InfoDialog>,
    )

    const dialog = screen.getByRole("dialog", { name: /maintenance notice/i })
    expect(dialog.getAttribute("data-purpose")).toBe("info-dialog")
    expect(dialog.getAttribute("data-intent")).toBe("info")
    expect(screen.getByRole("button", { name: /okay/i })).toBeTruthy()
  })
})
