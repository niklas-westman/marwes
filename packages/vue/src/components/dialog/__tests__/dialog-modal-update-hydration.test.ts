import userEvent from "@testing-library/user-event"
import { screen, waitFor } from "@testing-library/vue"
import { type Component, defineComponent, h } from "vue"
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
  const Host = defineComponent({
    props: ["open", "title", "onOpenChange", "portalMode"],
    setup: (props) => () => [
      h("button", { type: "button" }, "Launch"),
      h("div", { id: "modal-portal-target" }),
      h(
        Modal as never,
        {
          open: props.open,
          title: props.title,
          onOpenChange: props.onOpenChange,
          dismissible: false,
          portalTarget:
            props.portalMode === "inline"
              ? null
              : props.portalMode === "custom"
                ? "#modal-portal-target"
                : undefined,
        },
        {
          default: () => [
            h("input", { "aria-label": "Project name" }),
            h("button", { type: "button" }, "Done"),
          ],
        },
      ),
    ],
  })
  runDialogModalUpdatesContract("vue", name, {
    ...createUpdateHydrationHarness<DialogModalUpdatesProps>(Host as Component),

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
