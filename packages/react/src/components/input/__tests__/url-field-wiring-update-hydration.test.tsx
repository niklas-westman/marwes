import { screen } from "@testing-library/react"
import type { FieldWiringProps } from "../../../../../../tests/contracts/field-wiring-updates.contract"
import { runFieldWiringUpdatesContract } from "../../../../../../tests/contracts/field-wiring-updates.contract"
import { createUpdateHydrationHarness } from "../../../test-support/update-hydration"
import { URLField } from "../field-variants"

runFieldWiringUpdatesContract("react", "URLField", {
  ...createUpdateHydrationHarness(({ helper, ...props }: FieldWiringProps) => (
    <URLField
      {...props}
      input={{ value: "https://example.com" }}
      {...(helper ? { helperText: helper } : {})}
    />
  )),
  getControl: (label) => screen.getByRole("textbox", { name: label }),
})
