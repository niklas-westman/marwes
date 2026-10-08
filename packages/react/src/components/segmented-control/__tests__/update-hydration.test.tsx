/**
 * React adapter: wires the shared update and hydration contract for SegmentedControl.
 */
import { screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { runSegmentedControlUpdatesContract } from "../../../../../../tests/contracts/segmented-control-updates.contract"
import { createUpdateHydrationHarness } from "../../../test-support/update-hydration"
import { SegmentedControl } from "../segmented-control"

runSegmentedControlUpdatesContract("react", {
  ...createUpdateHydrationHarness((props) => <SegmentedControl {...props} />),
  getItem: (label) => screen.getByRole("radio", { name: label }),
  getAllItems: () => screen.getAllByRole("radio"),
  isSelected: (item) => item.getAttribute("aria-checked") === "true",
  async click(element) {
    await userEvent.setup().click(element)
  },
})
