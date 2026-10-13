import { screen, within } from "@testing-library/react"
import type { FieldWiringProps } from "../../../../../../tests/contracts/field-wiring-updates.contract"
import { runGroupFieldWiringUpdatesContract } from "../../../../../../tests/contracts/group-field-wiring-updates.contract"
import { createUpdateHydrationHarness } from "../../../test-support/update-hydration"
import { RadioGroupField } from "../radio-group-field"

runGroupFieldWiringUpdatesContract("react", "RadioGroupField", {
  ...createUpdateHydrationHarness(({ helper, ...props }: FieldWiringProps) => (
    <RadioGroupField
      {...props}
      name="contact"
      options={[
        { value: "email", label: "Email" },
        { value: "sms", label: "SMS" },
      ]}
      value="sms"
      {...(helper ? { description: helper } : {})}
    />
  )),
  getMembers: (group) => within(group).getAllByRole("radio"),
  getControl: (label) => screen.getByRole("radiogroup", { name: label }),
})
