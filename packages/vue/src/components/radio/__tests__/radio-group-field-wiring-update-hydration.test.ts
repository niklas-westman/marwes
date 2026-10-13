import { screen, within } from "@testing-library/vue"
import type { Component } from "vue"
import { runGroupFieldWiringUpdatesContract } from "../../../../../../tests/contracts/group-field-wiring-updates.contract"
import { createUpdateHydrationHarness } from "../../../test-support/update-hydration"
import { RadioGroupField } from "../radio-group-field"

runGroupFieldWiringUpdatesContract("vue", "RadioGroupField", {
  ...createUpdateHydrationHarness(RadioGroupField as Component, ({ helper, ...props }) => ({
    ...props,
    name: "contact",
    options: [
      { value: "email", label: "Email" },
      { value: "sms", label: "SMS" },
    ],
    value: "sms",
    ...(helper ? { description: helper } : {}),
  })),
  getMembers: (group) => within(group).getAllByRole("radio"),
  getControl: (label) => screen.getByRole("radiogroup", { name: label }),
})
