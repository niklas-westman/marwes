import { screen } from "@testing-library/react"
import { runFieldWiringUpdatesContract } from "../../../../../../tests/contracts/field-wiring-updates.contract"
import { createUpdateHydrationHarness } from "../../../test-support/update-hydration"
import { DateOfBirthField } from "../field-variants"

runFieldWiringUpdatesContract("react", "DateOfBirthField", {
  ...createUpdateHydrationHarness(({ helper, ...props }) => (
    <DateOfBirthField
      {...props}
      input={{ value: "2000-01-02" }}
      {...(helper ? { helperText: helper } : {})}
    />
  )),
  getControl: (label) => screen.getByLabelText(label),
})
