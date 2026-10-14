import { screen } from "@testing-library/react"
import type { FieldWiringProps } from "../../../../../../tests/contracts/field-wiring-updates.contract"
import { runFieldWiringUpdatesContract } from "../../../../../../tests/contracts/field-wiring-updates.contract"
import { createUpdateHydrationHarness } from "../../../test-support/update-hydration"
import { SelectField } from "../select-field"

runFieldWiringUpdatesContract("react", "SelectField", {
  ...createUpdateHydrationHarness(({ helper, ...props }: FieldWiringProps) => (
    <SelectField
      {...props}
      select={{
        options: [
          { value: "se", label: "Sweden" },
          { value: "no", label: "Norway" },
        ],
        value: "no",
        name: "country",
      }}
      {...(helper ? { helperText: helper } : {})}
    />
  )),
  getControl: (label) => screen.getByRole("combobox", { name: label }),
})
