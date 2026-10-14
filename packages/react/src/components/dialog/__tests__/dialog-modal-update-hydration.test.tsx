import { screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import {
  type DialogModalUpdatesProps,
  runDialogModalUpdatesContract,
} from "../../../../../../tests/contracts/dialog-modal-updates.contract"
import { createUpdateHydrationHarness } from "../../../test-support/update-hydration"
import { ConfirmDialog, DestructiveDialog, DialogModal, InfoDialog } from "../index"

for (const [name, Modal] of Object.entries({
  DialogModal,
  ConfirmDialog,
  DestructiveDialog,
  InfoDialog,
})) {
  runDialogModalUpdatesContract("react", name, {
    ...createUpdateHydrationHarness(({ portalMode, ...props }: DialogModalUpdatesProps) => (
      <>
        <button type="button">Launch</button>
        <div id="modal-portal-target" />
        <Modal
          {...props}
          dismissible={false}
          {...(portalMode === "inline"
            ? { portalTarget: null }
            : portalMode === "custom"
              ? { portalTarget: document.getElementById("modal-portal-target") }
              : {})}
        >
          <input aria-label="Project name" />
          <button type="button">Done</button>
        </Modal>
      </>
    )),

    portalModes: ["inline", "default", "custom"],
    getDialog: () => screen.queryByRole("dialog", { name: "Archive project" }),
    getTrigger: () => screen.getByRole("button", { name: "Launch" }),
    getScrim: () => document.querySelector<HTMLElement>(".mw-dialog-modal__scrim") as HTMLElement,
    async click(element) {
      await userEvent.setup().click(element)
    },
    async keyboard(keys) {
      await userEvent.setup().keyboard(keys)
    },
    waitFor: async (assertion) => {
      await waitFor(assertion)
    },
  })
}
