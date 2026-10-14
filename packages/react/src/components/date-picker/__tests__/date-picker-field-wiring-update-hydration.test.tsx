import { screen } from "@testing-library/react"
import type { FieldWiringProps } from "../../../../../../tests/contracts/field-wiring-updates.contract"
import { runFieldWiringUpdatesContract } from "../../../../../../tests/contracts/field-wiring-updates.contract"
import { createUpdateHydrationHarness } from "../../../test-support/update-hydration"
import { DatePickerField } from "../date-picker-field"

runFieldWiringUpdatesContract("react", "DatePickerField", {
  ...createUpdateHydrationHarness(({ helper, ...props }: FieldWiringProps) => (
    <DatePickerField
      {...props}
      datePicker={{ monthLabel: "October 2026" }}
      {...(helper ? { helperText: helper } : {})}
    />
  )),
  getControl: (label) => screen.getByRole("region", { name: label }),
})
