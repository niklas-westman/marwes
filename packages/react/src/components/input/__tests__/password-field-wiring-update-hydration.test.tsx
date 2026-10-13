import { screen } from "@testing-library/react"
import type { FieldWiringProps } from "../../../../../../tests/contracts/field-wiring-updates.contract"
import { runFieldWiringUpdatesContract } from "../../../../../../tests/contracts/field-wiring-updates.contract"
import { createUpdateHydrationHarness } from "../../../test-support/update-hydration"
import { PasswordField } from "../field-variants"

runFieldWiringUpdatesContract("react", "PasswordField", {
  ...createUpdateHydrationHarness(({ helper, ...props }: FieldWiringProps) => (
    <PasswordField
      {...props}
      input={{ value: "Secret" }}
      {...(helper ? { helperText: helper } : {})}
    />
  )),
  getControl: (label) => screen.getByLabelText(label),
})
