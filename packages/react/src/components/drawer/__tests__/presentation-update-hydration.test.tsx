import { screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import {
  type PresentationUpdatesProps,
  runPresentationUpdatesContract,
} from "../../../../../../tests/contracts/presentation-updates.contract"
import { createUpdateHydrationHarness } from "../../../test-support/update-hydration"
import { Drawer } from "../drawer"
runPresentationUpdatesContract("react", "Drawer", {
  ...createUpdateHydrationHarness(({ visible, onAction }: PresentationUpdatesProps) => (
    <div>
      {visible ? <Drawer title="Actions" {...(onAction ? { onClose: onAction } : {})} /> : null}
    </div>
  )),
  getRoot: () => screen.queryByRole("dialog", { name: "Actions" }),
  getAction: () => screen.getByRole("button", { name: "Close drawer" }),
  async click(element) {
    await userEvent.setup().click(element)
  },
})
