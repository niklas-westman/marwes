import { screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import {
  type TooltipUpdatesProps,
  runTooltipUpdatesContract,
} from "../../../../../../tests/contracts/tooltip-updates.contract"
import { createUpdateHydrationHarness } from "../../../test-support/update-hydration"
import { TooltipGroup } from "../tooltip-group"
runTooltipUpdatesContract("react", {
  ...createUpdateHydrationHarness((props: TooltipUpdatesProps) => (
    <TooltipGroup {...props} content="Helpful text" triggerLabel="Help" />
  )),
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
