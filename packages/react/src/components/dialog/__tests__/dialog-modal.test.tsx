import { render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import * as React from "react"
import { describe, expect, it } from "vitest"
import { MarwesProvider } from "../../../provider/marwes-provider"
import { DialogModal } from "../dialog-modal"

function renderWithProvider(ui: React.ReactElement) {
  return render(<MarwesProvider>{ui}</MarwesProvider>)
}

describe("DialogModal", () => {
  it("renders a labeled modal dialog with description and footer actions", () => {
    renderWithProvider(
      <DialogModal
        open
        title="Archive project"
        description="Archiving hides the project from active views."
        footer={
          <>
            <button type="button">Cancel</button>
            <button type="button">Archive</button>
          </>
        }
      >
        <p>Project Phoenix will move to the archive.</p>
      </DialogModal>,
    )

    const dialog = screen.getByRole("dialog", { name: /archive project/i })
    expect(dialog.getAttribute("aria-describedby")).toContain("description")
    expect(screen.getByText("Project Phoenix will move to the archive.")).toBeTruthy()
    expect(screen.getByRole("button", { name: /close dialog/i })).toBeTruthy()
    expect(dialog.querySelector(".mw-dialog__footer")).not.toBeNull()
  })

  it("supports backdrop dismissal and restores focus to the trigger", async () => {
    const user = userEvent.setup()

    function Example(): React.ReactElement {
      const [open, setOpen] = React.useState(false)

      return (
        <>
          <button type="button" onClick={() => setOpen(true)}>
            Open dialog
          </button>
          <DialogModal
            open={open}
            onOpenChange={setOpen}
            title="Invite teammate"
            description="Send an email invitation."
            footer={<button type="button">Done</button>}
          >
            <p>Choose a role before sending the invite.</p>
          </DialogModal>
        </>
      )
    }

    renderWithProvider(<Example />)

    const trigger = screen.getByRole("button", { name: /open dialog/i })
    trigger.focus()

    await user.click(trigger)

    expect(screen.getByRole("dialog", { name: /invite teammate/i })).toBeTruthy()

    const scrim = document.querySelector(".mw-dialog-modal__scrim")
    if (!(scrim instanceof HTMLElement)) {
      throw new Error("Expected dialog scrim to exist")
    }

    await user.click(scrim)

    await waitFor(() => {
      expect(screen.queryByRole("dialog", { name: /invite teammate/i })).toBeNull()
      expect(document.activeElement).toBe(trigger)
    })
  })

  it("supports escape dismissal", async () => {
    const user = userEvent.setup()

    function Example(): React.ReactElement {
      const [open, setOpen] = React.useState(true)

      return (
        <DialogModal
          open={open}
          onOpenChange={setOpen}
          title="Rename workspace"
          description="Update the workspace name for all collaborators."
          footer={<button type="button">Save</button>}
        >
          <input aria-label="Workspace name" defaultValue="Acme" />
        </DialogModal>
      )
    }

    renderWithProvider(<Example />)

    expect(screen.getByRole("dialog", { name: /rename workspace/i })).toBeTruthy()

    await user.keyboard("{Escape}")

    await waitFor(() => {
      expect(screen.queryByRole("dialog", { name: /rename workspace/i })).toBeNull()
    })
  })
})
