import { screen } from "@testing-library/react"
import type { FieldWiringProps } from "../../../../../../tests/contracts/field-wiring-updates.contract"
import { runFieldWiringUpdatesContract } from "../../../../../../tests/contracts/field-wiring-updates.contract"
import { createUpdateHydrationHarness } from "../../../test-support/update-hydration"
import { EmailField } from "../field-variants"

runFieldWiringUpdatesContract("react", "EmailField", {
  ...createUpdateHydrationHarness(({ helper, ...props }: FieldWiringProps) => (
    <EmailField
      {...props}
      input={{ value: "user@example.com" }}
      {...(helper ? { helperText: helper } : {})}
    />
  )),
  getControl: (label) => screen.getByRole("textbox", { name: label }),
})
