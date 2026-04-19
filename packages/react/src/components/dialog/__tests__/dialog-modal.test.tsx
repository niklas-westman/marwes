import { render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import * as React from "react"
import { describe, expect, it } from "vitest"
import { runDialogModalContract } from "../../../../../../tests/contracts/dialog-modal.contract"
import { MarwesProvider } from "../../../provider/marwes-provider"
import { DialogModal } from "../dialog-modal"

function renderWithProvider(ui: React.ReactElement) {
  return render(<MarwesProvider>{ui}</MarwesProvider>)
}

runDialogModalContract("react", {
  renderOpenDialogModal(args = {}) {
    renderWithProvider(
      <>
        <button type="button">Outside</button>
        <DialogModal
          open
          portalTarget={null}
          title={args.title}
          description={args.description}
          ariaLabel={args.ariaLabel}
          dismissible={args.dismissible}
          closeOnEscape={args.closeOnEscape}
          closeOnScrimClick={args.closeOnScrimClick}
          onOpenChange={args.onOpenChange}
          footer={
            args.showFooter === false ? undefined : (
              <>
                <button type="button">Cancel</button>
                <button type="button">Confirm</button>
              </>
            )
          }
        >
          {args.includeInput ? (
            <input aria-label="Workspace name" defaultValue="Acme" />
          ) : (
            <p>Dialog content</p>
          )}
        </DialogModal>
        <button type="button">After dialog</button>
      </>,
    )
  },
  renderTriggerDialogModal(args = {}) {
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
            portalTarget={null}
            title={args.title}
            description={args.description}
            restoreFocus={args.restoreFocus}
            closeOnScrimClick={args.closeOnScrimClick}
            footer={<button type="button">Done</button>}
          >
            <p>Dialog content</p>
          </DialogModal>
        </>
      )
    }

    renderWithProvider(<Example />)
  },
  getByRole(role, options) {
    return screen.getByRole(role, options)
  },
  queryByRole(role, options) {
    return screen.queryByRole(role, options)
  },
  getScrim() {
    const scrim = document.querySelector(".mw-dialog-modal__scrim")

    if (!(scrim instanceof HTMLElement)) {
      throw new Error("Expected dialog scrim to exist")
    }

    return scrim
  },
  async click(element) {
    await userEvent.setup().click(element)
  },
  async tab(options) {
    await userEvent.setup().tab(options)
  },
  async keyboard(text) {
    await userEvent.setup().keyboard(text)
  },
  waitFor(assertion) {
    return waitFor(assertion)
  },
})

describe("DialogModal specifics", () => {
  it("does not request close on Escape when escape dismissal is disabled", async () => {
    const emittedValues: boolean[] = []

    renderWithProvider(
      <DialogModal
        open
        portalTarget={null}
        title="Rename workspace"
        closeOnEscape={false}
        onOpenChange={(open) => {
          emittedValues.push(open)
        }}
        footer={<button type="button">Save</button>}
      >
        <input aria-label="Workspace name" defaultValue="Acme" />
      </DialogModal>,
    )

    await userEvent.setup().keyboard("{Escape}")

    expect(emittedValues).toEqual([])
    expect(screen.getByRole("dialog", { name: /rename workspace/i })).toBeInTheDocument()
  })

  it("does not request close on scrim click when scrim dismissal is disabled", async () => {
    const emittedValues: boolean[] = []

    renderWithProvider(
      <DialogModal
        open
        portalTarget={null}
        title="Invite teammate"
        closeOnScrimClick={false}
        onOpenChange={(open) => {
          emittedValues.push(open)
        }}
        footer={<button type="button">Done</button>}
      >
        <p>Choose a role before sending the invite.</p>
      </DialogModal>,
    )

    const scrim = document.querySelector(".mw-dialog-modal__scrim")
    if (!(scrim instanceof HTMLElement)) {
      throw new Error("Expected dialog scrim to exist")
    }

    await userEvent.setup().click(scrim)

    expect(emittedValues).toEqual([])
    expect(screen.getByRole("dialog", { name: /invite teammate/i })).toBeInTheDocument()
  })
})
