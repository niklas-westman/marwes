import { screen } from "@testing-library/react"
import type { FieldWiringProps } from "../../../../../../tests/contracts/field-wiring-updates.contract"
import { runFieldWiringUpdatesContract } from "../../../../../../tests/contracts/field-wiring-updates.contract"
import { createUpdateHydrationHarness } from "../../../test-support/update-hydration"
import { CurrencyField } from "../field-variants"

runFieldWiringUpdatesContract("react", "CurrencyField", {
  ...createUpdateHydrationHarness(({ helper, ...props }: FieldWiringProps) => (
    <CurrencyField {...props} input={{ value: "42" }} {...(helper ? { helperText: helper } : {})} />
  )),
  getControl: (label) => screen.getByRole("textbox", { name: label }),
})
