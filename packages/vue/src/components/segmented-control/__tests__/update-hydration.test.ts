/**
 * Vue adapter: wires the shared update and hydration contract for SegmentedControl.
 */
import userEvent from "@testing-library/user-event"
import { screen } from "@testing-library/vue"
import type { Component } from "vue"
import { runSegmentedControlUpdatesContract } from "../../../../../../tests/contracts/segmented-control-updates.contract"
import { createUpdateHydrationHarness } from "../../../test-support/update-hydration"
import { SegmentedControl } from "../segmented-control"

runSegmentedControlUpdatesContract("vue", {
  ...createUpdateHydrationHarness(SegmentedControl as Component, ({ value, ...props }) => ({
    ...props,
    ...(value !== undefined ? { modelValue: value } : {}),
  })),
  getItem: (label) => screen.getByRole("radio", { name: label }),
  getAllItems: () => screen.getAllByRole("radio"),
  isSelected: (item) => item.getAttribute("aria-checked") === "true",
  async click(element) {
    await userEvent.setup().click(element)
  },
})
