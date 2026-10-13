import { screen } from "@testing-library/react"
import { runFieldWiringUpdatesContract } from "../../../../../../tests/contracts/field-wiring-updates.contract"
import { createUpdateHydrationHarness } from "../../../test-support/update-hydration"
import { PhoneField } from "../field-variants"

runFieldWiringUpdatesContract("react", "PhoneField", {
  ...createUpdateHydrationHarness(({ helper, ...props }) => (
    <PhoneField
      {...props}
      input={{ value: "+46123456789" }}
      {...(helper ? { helperText: helper } : {})}
    />
  )),
  getControl: (label) => screen.getByRole("textbox", { name: label }),
})
