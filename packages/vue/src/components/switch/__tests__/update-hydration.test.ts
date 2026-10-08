/**
 * Vue adapter: wires the shared update and hydration contract for Switch.
 */
import userEvent from "@testing-library/user-event"
import { screen } from "@testing-library/vue"
import type { Component } from "vue"
import { runToggleUpdatesContract } from "../../../../../../tests/contracts/toggle-updates.contract"
import { createUpdateHydrationHarness } from "../../../test-support/update-hydration"
import { Switch } from "../switch"

runToggleUpdatesContract("vue", "Switch", {
  ...createUpdateHydrationHarness(Switch as Component),
  getControl: () => screen.getByRole("switch"),
  isChecked: (control) => control.getAttribute("aria-checked") === "true",
  async click(element) {
    await userEvent.setup().click(element)
  },
})
