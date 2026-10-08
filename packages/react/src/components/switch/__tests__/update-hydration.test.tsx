/**
 * React adapter: wires the shared update and hydration contract for Switch.
 */
import { screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { runToggleUpdatesContract } from "../../../../../../tests/contracts/toggle-updates.contract"
import { createUpdateHydrationHarness } from "../../../test-support/update-hydration"
import { Switch } from "../switch"

runToggleUpdatesContract("react", "Switch", {
  ...createUpdateHydrationHarness((props) => <Switch {...props} />),
  getControl: () => screen.getByRole("switch"),
  isChecked: (control) => control.getAttribute("aria-checked") === "true",
  async click(element) {
    await userEvent.setup().click(element)
  },
})
