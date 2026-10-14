import { screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import {
  type PresentationUpdatesProps,
  runPresentationUpdatesContract,
} from "../../../../../../tests/contracts/presentation-updates.contract"
import { createUpdateHydrationHarness } from "../../../test-support/update-hydration"
import { Dialog } from "../dialog"
runPresentationUpdatesContract("react", "Dialog", {
  ...createUpdateHydrationHarness(({ visible, onAction }: PresentationUpdatesProps) => (
    <div>
      {visible ? <Dialog title="Actions" {...(onAction ? { onClose: onAction } : {})} /> : null}
    </div>
  )),
  getRoot: () => screen.queryByRole("dialog", { name: "Actions" }),
  getAction: () => screen.getByRole("button", { name: "Close dialog" }),
  async click(element) {
    await userEvent.setup().click(element)
  },
})
