import { screen, within } from "@testing-library/react"
import type { FieldWiringProps } from "../../../../../../tests/contracts/field-wiring-updates.contract"
import { runGroupFieldWiringUpdatesContract } from "../../../../../../tests/contracts/group-field-wiring-updates.contract"
import { createUpdateHydrationHarness } from "../../../test-support/update-hydration"
import { CheckboxGroupField } from "../checkbox-group-field"

runGroupFieldWiringUpdatesContract("react", "CheckboxGroupField", {
  ...createUpdateHydrationHarness(({ helper, ...props }: FieldWiringProps) => (
    <CheckboxGroupField
      {...props}
      options={[
        { value: "email", label: "Email" },
        { value: "sms", label: "SMS" },
      ]}
      value={["sms"]}
      {...(helper ? { description: helper } : {})}
    />
  )),
  getMembers: (group) => within(group).getAllByRole("checkbox"),
  getControl: (label) => screen.getByRole("group", { name: label }),
})
