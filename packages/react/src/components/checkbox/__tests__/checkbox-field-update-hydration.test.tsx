/**
 * React adapter: wires the shared field wiring contract for CheckboxField.
 */
import { screen } from "@testing-library/react"
import { runFieldWiringUpdatesContract } from "../../../../../../tests/contracts/field-wiring-updates.contract"
import { createUpdateHydrationHarness } from "../../../test-support/update-hydration"
import { CheckboxField } from "../checkbox-field"

runFieldWiringUpdatesContract("react", "CheckboxField", {
  ...createUpdateHydrationHarness(({ helper, ...props }) => (
    <CheckboxField {...props} checkbox={{}} {...(helper ? { description: helper } : {})} />
  )),
  getControl: (label) => screen.getByRole("checkbox", { name: label }),
  marksErrorAsInvalid: true,
})
