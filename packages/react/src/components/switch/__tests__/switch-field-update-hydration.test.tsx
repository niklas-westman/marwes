/**
 * React adapter: wires the shared field wiring contract for SwitchField.
 */
import { screen } from "@testing-library/react"
import { runFieldWiringUpdatesContract } from "../../../../../../tests/contracts/field-wiring-updates.contract"
import { createUpdateHydrationHarness } from "../../../test-support/update-hydration"
import { SwitchField } from "../switch-field"

runFieldWiringUpdatesContract("react", "SwitchField", {
  ...createUpdateHydrationHarness(({ helper, ...props }) => (
    <SwitchField {...props} switch={{}} {...(helper ? { description: helper } : {})} />
  )),
  getControl: (label) => screen.getByRole("switch", { name: label }),
  marksErrorAsInvalid: false,
})
