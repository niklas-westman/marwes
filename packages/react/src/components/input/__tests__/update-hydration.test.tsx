/**
 * React adapter: wires the shared update and hydration contracts for Input and Select.
 */
import { screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { runInputUpdatesContract } from "../../../../../../tests/contracts/input-updates.contract"
import { runSelectUpdatesContract } from "../../../../../../tests/contracts/select-updates.contract"
import { createUpdateHydrationHarness } from "../../../test-support/update-hydration"
import { Input } from "../input"
import { Select } from "../select"

runInputUpdatesContract("react", {
  ...createUpdateHydrationHarness((props) => <Input {...props} />),
  getTextbox: () => screen.getByRole("textbox") as HTMLInputElement,
  async type(element, text) {
    await userEvent.setup().type(element, text)
  },
})

runSelectUpdatesContract("react", {
  ...createUpdateHydrationHarness((props) => <Select {...props} />),
  getSelect: () => screen.getByRole("combobox") as HTMLSelectElement,
  async selectOption(element, value) {
    await userEvent.setup().selectOptions(element, value)
  },
})
