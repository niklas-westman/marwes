/**
 * Vue adapter: wires the shared update and hydration contract for TabGroup.
 */
import userEvent from "@testing-library/user-event"
import { screen } from "@testing-library/vue"
import type { Component } from "vue"
import { runTabUpdatesContract } from "../../../../../../tests/contracts/tab-updates.contract"
import { createUpdateHydrationHarness } from "../../../test-support/update-hydration"
import { TabGroup } from "../tab-group"

runTabUpdatesContract("vue", {
  ...createUpdateHydrationHarness(TabGroup as Component, ({ onActiveTabChange, ...props }) => ({
    ...props,
    ...(onActiveTabChange ? { "onUpdate:activeTab": onActiveTabChange } : {}),
  })),
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
