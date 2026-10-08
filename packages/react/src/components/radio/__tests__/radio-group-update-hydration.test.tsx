/**
 * React adapter: wires the shared update and hydration contract for RadioGroupField.
 */
import { screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { runRadioGroupUpdatesContract } from "../../../../../../tests/contracts/radio-group-updates.contract"
import { createUpdateHydrationHarness } from "../../../test-support/update-hydration"
import { RadioGroupField } from "../radio-group-field"

runRadioGroupUpdatesContract("react", {
  ...createUpdateHydrationHarness(({ onValueChange, ...props }) => (
    <RadioGroupField {...props} {...(onValueChange ? { onChange: onValueChange } : {})} />
  )),
  getRadio: (label) => screen.getByRole("radio", { name: label }) as HTMLInputElement,
  getAllRadios: () => screen.getAllByRole("radio") as HTMLInputElement[],
  async click(element) {
    await userEvent.setup().click(element)
  },
})
