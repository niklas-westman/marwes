import { screen } from "@testing-library/react"
import type { FieldWiringProps } from "../../../../../../tests/contracts/field-wiring-updates.contract"
import { runFieldWiringUpdatesContract } from "../../../../../../tests/contracts/field-wiring-updates.contract"
import { createUpdateHydrationHarness } from "../../../test-support/update-hydration"
import { RichTextField } from "../rich-text-field"

runFieldWiringUpdatesContract("react", "RichTextField", {
  ...createUpdateHydrationHarness(({ helper, ...props }: FieldWiringProps) => (
    <RichTextField
      {...props}
      editor={{ value: "Invoice notes" }}
      {...(helper ? { helperText: helper } : {})}
    />
  )),
  getControl: (label) => screen.getByRole("textbox", { name: label }),
})
