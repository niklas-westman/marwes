import { screen } from "@testing-library/react"
import { runFieldWiringUpdatesContract } from "../../../../../../tests/contracts/field-wiring-updates.contract"
import { createUpdateHydrationHarness } from "../../../test-support/update-hydration"
import { ZipCodeField } from "../field-variants"

runFieldWiringUpdatesContract("react", "ZipCodeField", {
  ...createUpdateHydrationHarness(({ helper, ...props }) => (
    <ZipCodeField
      {...props}
      input={{ value: "01234" }}
      {...(helper ? { helperText: helper } : {})}
    />
  )),
  getControl: (label) => screen.getByRole("textbox", { name: label }),
})
