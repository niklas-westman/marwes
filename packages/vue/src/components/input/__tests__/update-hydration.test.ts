/**
 * Vue adapter: wires the shared update and hydration contracts for Input and Select.
 */
import userEvent from "@testing-library/user-event"
import { screen } from "@testing-library/vue"
import type { Component } from "vue"
import { runInputUpdatesContract } from "../../../../../../tests/contracts/input-updates.contract"
import { runSelectUpdatesContract } from "../../../../../../tests/contracts/select-updates.contract"
import { createUpdateHydrationHarness } from "../../../test-support/update-hydration"
import { Input } from "../input"
import { Select } from "../select"

runInputUpdatesContract("vue", {
  ...createUpdateHydrationHarness(Input as Component),
  getTextbox: () => screen.getByRole("textbox") as HTMLInputElement,
  async type(element, text) {
    await userEvent.setup().type(element, text)
  },
})

runSelectUpdatesContract("vue", {
  ...createUpdateHydrationHarness(Select as Component),
  getSelect: () => screen.getByRole("combobox") as HTMLSelectElement,
  async selectOption(element, value) {
    await userEvent.setup().selectOptions(element, value)
  },
})
