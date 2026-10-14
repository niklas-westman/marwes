/**
 * React adapter: wires the shared field wiring contract for TextareaField.
 */
import { screen } from "@testing-library/react"
import type { FieldWiringProps } from "../../../../../../tests/contracts/field-wiring-updates.contract"
import { runFieldWiringUpdatesContract } from "../../../../../../tests/contracts/field-wiring-updates.contract"
import { createUpdateHydrationHarness } from "../../../test-support/update-hydration"
import { TextareaField } from "../textarea-field"

runFieldWiringUpdatesContract("react", "TextareaField", {
  ...createUpdateHydrationHarness(({ helper, ...props }: FieldWiringProps) => (
    <TextareaField {...props} textarea={{}} {...(helper ? { helperText: helper } : {})} />
  )),
  getControl: (label) => screen.getByRole("textbox", { name: label }),
})
