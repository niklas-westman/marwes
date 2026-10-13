import { screen } from "@testing-library/react"
import type { FieldWiringProps } from "../../../../../../tests/contracts/field-wiring-updates.contract"
import { runFieldWiringUpdatesContract } from "../../../../../../tests/contracts/field-wiring-updates.contract"
import { createUpdateHydrationHarness } from "../../../test-support/update-hydration"
import { SearchField } from "../field-variants"

runFieldWiringUpdatesContract("react", "SearchField", {
  ...createUpdateHydrationHarness(({ helper, ...props }: FieldWiringProps) => (
    <SearchField
      {...props}
      input={{ value: "Invoice" }}
      {...(helper ? { helperText: helper } : {})}
    />
  )),
  getControl: (label) => screen.getByRole("searchbox", { name: label }),
})
