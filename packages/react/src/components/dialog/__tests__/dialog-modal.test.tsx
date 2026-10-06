/**
 * React adapter: Tests the DialogModal component — wires the shared dialog-modal contract
 * for modal overlay behavior, focus management, and escape dismissal.
 */
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
    const dialogProps = {
      open: true,
      portalTarget: null,
      ...(args.title !== undefined ? { title: args.title } : {}),
      ...(args.description !== undefined ? { description: args.description } : {}),
      ...(args.ariaLabel !== undefined ? { ariaLabel: args.ariaLabel } : {}),
      ...(args.dismissible !== undefined ? { dismissible: args.dismissible } : {}),
      ...(args.closeLabel !== undefined ? { closeLabel: args.closeLabel } : {}),
      ...(args.closeOnEscape !== undefined ? { closeOnEscape: args.closeOnEscape } : {}),
      ...(args.closeOnScrimClick !== undefined
        ? { closeOnScrimClick: args.closeOnScrimClick }
        : {}),
      ...(args.surfaceWidth !== undefined ? { surfaceWidth: args.surfaceWidth } : {}),
      ...(args.tone !== undefined ? { tone: args.tone } : {}),
      ...(args.divider !== undefined ? { divider: args.divider } : {}),
      ...(args.onOpenChange !== undefined ? { onOpenChange: args.onOpenChange } : {}),
      ...(args.showFooter === false
        ? {}
        : {
            footer: (
              <>
                <button type="button">Cancel</button>
                <button type="button">Confirm</button>
              </>
            ),
          }),
    }

    renderWithProvider(
      <>
        <button type="button">Outside</button>
        <DialogModal {...dialogProps}>
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
      const dialogProps = {
        open,
        onOpenChange: setOpen,
        portalTarget: null,
        ...(args.title !== undefined ? { title: args.title } : {}),
        ...(args.description !== undefined ? { description: args.description } : {}),
        ...(args.restoreFocus !== undefined ? { restoreFocus: args.restoreFocus } : {}),
        ...(args.closeOnScrimClick !== undefined
          ? { closeOnScrimClick: args.closeOnScrimClick }
          : {}),
        footer: <button type="button">Done</button>,
      }

      return (
        <>
          <button type="button" onClick={() => setOpen(true)}>
            Open dialog
          </button>
          <DialogModal {...dialogProps}>
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
