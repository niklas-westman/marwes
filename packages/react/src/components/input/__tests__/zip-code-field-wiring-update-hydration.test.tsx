import { screen } from "@testing-library/react"
import type { FieldWiringProps } from "../../../../../../tests/contracts/field-wiring-updates.contract"
import { runFieldWiringUpdatesContract } from "../../../../../../tests/contracts/field-wiring-updates.contract"
import { createUpdateHydrationHarness } from "../../../test-support/update-hydration"
import { ZipCodeField } from "../field-variants"

runFieldWiringUpdatesContract("react", "ZipCodeField", {
  ...createUpdateHydrationHarness(({ helper, ...props }: FieldWiringProps) => (
    <ZipCodeField
      {...props}
      input={{ value: "01234" }}
      {...(helper ? { helperText: helper } : {})}
    />
  )),
  getControl: (label) => screen.getByRole("textbox", { name: label }),
})
