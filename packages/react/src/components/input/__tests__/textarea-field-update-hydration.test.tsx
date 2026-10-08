/**
 * React adapter: wires the shared field wiring contract for TextareaField.
 */
import { screen } from "@testing-library/react"
import { runFieldWiringUpdatesContract } from "../../../../../../tests/contracts/field-wiring-updates.contract"
import { createUpdateHydrationHarness } from "../../../test-support/update-hydration"
import { TextareaField } from "../textarea-field"

runFieldWiringUpdatesContract("react", "TextareaField", {
  ...createUpdateHydrationHarness(({ helper, ...props }) => (
    <TextareaField {...props} textarea={{}} {...(helper ? { helperText: helper } : {})} />
  )),
  getControl: (label) => screen.getByRole("textbox", { name: label }),
  marksErrorAsInvalid: true,
})
