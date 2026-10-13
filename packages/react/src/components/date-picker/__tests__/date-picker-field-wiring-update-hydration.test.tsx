import { screen } from "@testing-library/react"
import { runFieldWiringUpdatesContract } from "../../../../../../tests/contracts/field-wiring-updates.contract"
import { createUpdateHydrationHarness } from "../../../test-support/update-hydration"
import { DatePickerField } from "../date-picker-field"

runFieldWiringUpdatesContract("react", "DatePickerField", {
  ...createUpdateHydrationHarness(({ helper, ...props }) => (
    <DatePickerField
      {...props}
      datePicker={{ monthLabel: "October 2026" }}
      {...(helper ? { helperText: helper } : {})}
    />
  )),
  getControl: (label) => screen.getByRole("region", { name: label }),
})
