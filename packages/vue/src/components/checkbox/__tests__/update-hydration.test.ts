/**
 * Vue adapter: wires the shared update and hydration contract for Checkbox.
 */
import userEvent from "@testing-library/user-event"
import { screen } from "@testing-library/vue"
import type { Component } from "vue"
import { runCheckboxIndeterminateUpdatesContract } from "../../../../../../tests/contracts/checkbox-indeterminate-updates.contract"
import { runToggleUpdatesContract } from "../../../../../../tests/contracts/toggle-updates.contract"
import { createUpdateHydrationHarness } from "../../../test-support/update-hydration"
import { Checkbox } from "../checkbox"

runToggleUpdatesContract("vue", "Checkbox", {
  ...createUpdateHydrationHarness(Checkbox as Component),
  getControl: () => screen.getByRole("checkbox"),
  isChecked: (control) => (control as HTMLInputElement).checked,
  async click(element) {
    await userEvent.setup().click(element)
  },
})

runCheckboxIndeterminateUpdatesContract("vue", {
  ...createUpdateHydrationHarness(Checkbox as Component),
  getCheckbox: () => screen.getByRole("checkbox") as HTMLInputElement,
})
