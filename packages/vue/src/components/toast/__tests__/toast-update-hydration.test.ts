import userEvent from "@testing-library/user-event"
import { screen, waitFor } from "@testing-library/vue"
import { type Component, defineComponent, h } from "vue"
import {
  type ToastUpdatesProps,
  runToastUpdatesContract,
} from "../../../../../../tests/contracts/toast-updates.contract"
import {
  createUpdateHydrationHarness,
  unmountHydratedApps,
} from "../../../test-support/update-hydration"
import { ToastProvider, useToast } from "../toast-provider"
const ShowToast = defineComponent({
  props: ["duration", "onDismiss"],
  setup: (props) => {
    const controller = useToast()
    return () =>
      h(
        "button",
        {
          type: "button",
          onClick: () =>
            controller.show({
              children: "Saved project",
              duration: props.duration,
              onDismiss: props.onDismiss,
            }),
        },
        "Save project",
      )
  },
})
const Host = defineComponent({
  props: ["duration", "onDismiss"],
  setup: (props) => () => h(ToastProvider, null, { default: () => h(ShowToast, { ...props }) }),
})
runToastUpdatesContract("vue", {
  ...createUpdateHydrationHarness<ToastUpdatesProps>(Host as Component),
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
