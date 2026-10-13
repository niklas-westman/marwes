import { screen } from "@testing-library/react"
import { runFieldWiringUpdatesContract } from "../../../../../../tests/contracts/field-wiring-updates.contract"
import { createUpdateHydrationHarness } from "../../../test-support/update-hydration"
import { SearchField } from "../field-variants"

runFieldWiringUpdatesContract("react", "SearchField", {
  ...createUpdateHydrationHarness(({ helper, ...props }) => (
    <SearchField
      {...props}
      input={{ value: "Invoice" }}
      {...(helper ? { helperText: helper } : {})}
    />
  )),
  getControl: (label) => screen.getByRole("searchbox", { name: label }),
})
