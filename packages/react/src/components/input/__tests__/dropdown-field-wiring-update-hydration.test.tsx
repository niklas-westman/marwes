import { screen } from "@testing-library/react"
import { runFieldWiringUpdatesContract } from "../../../../../../tests/contracts/field-wiring-updates.contract"
import { createUpdateHydrationHarness } from "../../../test-support/update-hydration"
import { DropdownField } from "../field-variants"

runFieldWiringUpdatesContract("react", "DropdownField", {
  ...createUpdateHydrationHarness(({ helper, ...props }) => (
    <DropdownField
      {...props}
      select={{ options: [{ value: "se", label: "Sweden" }], value: "se", name: "country" }}
      {...(helper ? { helperText: helper } : {})}
    />
  )),
  getControl: (label) => screen.getByRole("combobox", { name: label }),
})
