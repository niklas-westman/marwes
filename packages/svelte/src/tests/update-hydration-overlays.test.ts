import {
  type PresentationUpdatesProps,
  runPresentationUpdatesContract,
} from "../../../../tests/contracts/presentation-updates.contract"
import {
  type ToastUpdatesProps,
  runToastUpdatesContract,
} from "../../../../tests/contracts/toast-updates.contract"
import {
  type TooltipUpdatesProps,
  runTooltipUpdatesContract,
} from "../../../../tests/contracts/tooltip-updates.contract"
import ComponentHost from "./type-fixtures/HydrationComponentHost.svelte"
import PresentationHost from "./type-fixtures/PresentationHydrationHost.svelte"
import ToastHost from "./type-fixtures/ToastHydrationHost.svelte"
import "@testing-library/jest-dom/vitest"
import { screen, waitFor } from "@testing-library/svelte"
import userEvent from "@testing-library/user-event"
import { afterEach } from "vitest"
import {
  type DialogModalUpdatesProps,
  runDialogModalUpdatesContract,
} from "../../../../tests/contracts/dialog-modal-updates.contract"
import { unmountHydratedApps } from "./support/hydrate-from-server"
import { createUpdateHydrationHarness } from "./support/update-hydration-harness"
import Host from "./type-fixtures/ModalHydrationHost.svelte"

afterEach(async () => {
  await unmountHydratedApps()
  document.body.innerHTML = ""
})
for (const name of ["DialogModal", "ConfirmDialog", "DestructiveDialog", "InfoDialog"]) {
  runDialogModalUpdatesContract("svelte", name, {
    ...createUpdateHydrationHarness<DialogModalUpdatesProps>({
      component: Host,
      componentPath: "/src/tests/type-fixtures/ModalHydrationHost.svelte",
      toSvelteProps: (props) => ({ ...props, name }),
    }),
    portalModes: ["inline"],
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

for (const name of ["Dialog", "Drawer", "ContextMenu"]) {
  runPresentationUpdatesContract("svelte", name, {
    ...createUpdateHydrationHarness<PresentationUpdatesProps>({
      component: PresentationHost,
      componentPath: "/src/tests/type-fixtures/PresentationHydrationHost.svelte",
      toSvelteProps: (props) => ({ ...props, name }),
    }),
    getRoot: () =>
      screen.queryByRole(name === "ContextMenu" ? "menu" : "dialog", { name: "Actions" }),
    getAction: () =>
      screen.getByRole(name === "ContextMenu" ? "menuitem" : "button", {
        name: name === "ContextMenu" ? "Edit" : name === "Drawer" ? "Close drawer" : "Close dialog",
      }),
    async click(element) {
      await userEvent.setup().click(element)
    },
  })
}
runTooltipUpdatesContract("svelte", {
  ...createUpdateHydrationHarness<TooltipUpdatesProps>({
    component: ComponentHost,
    componentPath: "/src/tests/type-fixtures/HydrationComponentHost.svelte",
    toSvelteProps: ({ onOpenChange, ...props }) => ({
      componentName: "TooltipGroup",
      componentProps: {
        ...props,
        onopenchange: onOpenChange,
        content: "Helpful text",
        triggerLabel: "Help",
      },
    }),
  }),
  getTrigger: () => screen.getByRole("button", { name: "Help" }),
  getTooltip: () => screen.queryByRole("tooltip"),
  async focus(element) {
    element.focus()
  },
  async keyboard(keys) {
    await userEvent.setup().keyboard(keys)
  },
  waitFor: async (assertion) => {
    await waitFor(assertion)
  },
})

runToastUpdatesContract("svelte", {
  ...createUpdateHydrationHarness<ToastUpdatesProps>({
    component: ToastHost,
    componentPath: "/src/tests/type-fixtures/ToastHydrationHost.svelte",
    toSvelteProps: (props) => ({ ...props }),
  }),
  getShowButton: () => screen.getByRole("button", { name: "Save project" }),
  getDismissButton: () => screen.getByRole("button", { name: /dismiss/i }),
  getToast: () => screen.queryByRole("status"),
  async click(element) {
    await userEvent.setup().click(element)
  },
  unmount: unmountHydratedApps,
  waitFor: async (assertion) => {
    await waitFor(assertion)
  },
})
