/**
 * React adapter: wires the shared update and hydration contract for Checkbox.
 */
import { screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import type { CheckboxIndeterminateProps } from "../../../../../../tests/contracts/checkbox-indeterminate-updates.contract"
import { runCheckboxIndeterminateUpdatesContract } from "../../../../../../tests/contracts/checkbox-indeterminate-updates.contract"
import type { ToggleUpdatesProps } from "../../../../../../tests/contracts/toggle-updates.contract"
import { runToggleUpdatesContract } from "../../../../../../tests/contracts/toggle-updates.contract"
import { createUpdateHydrationHarness } from "../../../test-support/update-hydration"
import { Checkbox } from "../checkbox"

runToggleUpdatesContract("react", "Checkbox", {
  ...createUpdateHydrationHarness((props: ToggleUpdatesProps) => <Checkbox {...props} />),
  getControl: () => screen.getByRole("checkbox"),
  isChecked: (control) => (control as HTMLInputElement).checked,
  async click(element) {
    await userEvent.setup().click(element)
  },
})

runCheckboxIndeterminateUpdatesContract("react", {
  ...createUpdateHydrationHarness((props: CheckboxIndeterminateProps) => <Checkbox {...props} />),
  getCheckbox: () => screen.getByRole("checkbox") as HTMLInputElement,
})
