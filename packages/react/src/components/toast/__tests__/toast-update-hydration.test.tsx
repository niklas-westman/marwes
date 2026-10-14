import { screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import {
  type ToastUpdatesProps,
  runToastUpdatesContract,
} from "../../../../../../tests/contracts/toast-updates.contract"
import {
  createUpdateHydrationHarness,
  unmountHydratedApps,
} from "../../../test-support/update-hydration"
import { ToastProvider, useToast } from "../toast-provider"
function ShowToast(props: ToastUpdatesProps): React.ReactElement {
  const controller = useToast()
  return (
    <button
      type="button"
      onClick={() =>
        controller.show({
          children: "Saved project",
          duration: props.duration,
          ...(props.onDismiss ? { onDismiss: props.onDismiss } : {}),
        })
      }
    >
      Save project
    </button>
  )
}
runToastUpdatesContract("react", {
  ...createUpdateHydrationHarness((props: ToastUpdatesProps) => (
    <ToastProvider>
      <ShowToast {...props} />
    </ToastProvider>
  )),
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
