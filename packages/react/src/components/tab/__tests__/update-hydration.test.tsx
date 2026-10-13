/**
 * React adapter: wires the shared update and hydration contract for TabGroup.
 */
import { screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import type { TabUpdatesProps } from "../../../../../../tests/contracts/tab-updates.contract"
import { runTabUpdatesContract } from "../../../../../../tests/contracts/tab-updates.contract"
import { createUpdateHydrationHarness } from "../../../test-support/update-hydration"
import { TabGroup } from "../tab-group"

runTabUpdatesContract("react", {
  ...createUpdateHydrationHarness((props: TabUpdatesProps) => <TabGroup {...props} />),
  getTab: (name) => screen.getByRole("tab", { name }),
  getAllTabs: () => screen.getAllByRole("tab"),
  getVisiblePanels: () => screen.queryAllByRole("tabpanel"),
  async click(element) {
    await userEvent.setup().click(element)
  },
  async keyboard(text) {
    await userEvent.setup().keyboard(text)
  },
})
