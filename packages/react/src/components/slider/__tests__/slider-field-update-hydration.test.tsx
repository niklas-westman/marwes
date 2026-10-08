/**
 * React adapter: wires the shared field wiring contract for SliderField.
 */
import { screen } from "@testing-library/react"
import { runFieldWiringUpdatesContract } from "../../../../../../tests/contracts/field-wiring-updates.contract"
import { createUpdateHydrationHarness } from "../../../test-support/update-hydration"
import { SliderField } from "../slider-field"

runFieldWiringUpdatesContract("react", "SliderField", {
  ...createUpdateHydrationHarness(({ helper, ...props }) => (
    <SliderField {...props} slider={{}} {...(helper ? { description: helper } : {})} />
  )),
  getControl: (label) => screen.getByRole("slider", { name: label }),
})
