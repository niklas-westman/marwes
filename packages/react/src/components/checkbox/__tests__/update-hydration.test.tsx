/**
 * React adapter: wires the shared update and hydration contract for Checkbox.
 */
import { screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { runToggleUpdatesContract } from "../../../../../../tests/contracts/toggle-updates.contract"
import { createUpdateHydrationHarness } from "../../../test-support/update-hydration"
import { Checkbox } from "../checkbox"

runToggleUpdatesContract("react", "Checkbox", {
  ...createUpdateHydrationHarness((props) => <Checkbox {...props} />),
  getControl: () => screen.getByRole("checkbox"),
  isChecked: (control) => (control as HTMLInputElement).checked,
  async click(element) {
    await userEvent.setup().click(element)
  },
})
