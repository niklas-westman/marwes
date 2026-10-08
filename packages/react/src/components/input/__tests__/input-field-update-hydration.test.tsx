/**
 * React adapter: wires the shared field wiring contract for InputField.
 */
import { screen } from "@testing-library/react"
import { runFieldWiringUpdatesContract } from "../../../../../../tests/contracts/field-wiring-updates.contract"
import { createUpdateHydrationHarness } from "../../../test-support/update-hydration"
import { InputField } from "../input-field"

runFieldWiringUpdatesContract("react", "InputField", {
  ...createUpdateHydrationHarness(({ helper, ...props }) => (
    <InputField {...props} input={{}} {...(helper ? { helperText: helper } : {})} />
  )),
  getControl: (label) => screen.getByRole("textbox", { name: label }),
  marksErrorAsInvalid: true,
})
