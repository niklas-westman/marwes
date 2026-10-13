import { screen, within } from "@testing-library/vue"
import type { Component } from "vue"
import { runGroupFieldWiringUpdatesContract } from "../../../../../../tests/contracts/group-field-wiring-updates.contract"
import { createUpdateHydrationHarness } from "../../../test-support/update-hydration"
import { CheckboxGroupField } from "../checkbox-group-field"

runGroupFieldWiringUpdatesContract("vue", "CheckboxGroupField", {
  ...createUpdateHydrationHarness(CheckboxGroupField as Component, ({ helper, ...props }) => ({
    ...props,
    options: [
      { value: "email", label: "Email" },
      { value: "sms", label: "SMS" },
    ],
    value: ["sms"],
    ...(helper ? { description: helper } : {}),
  })),
  getMembers: (group) => within(group).getAllByRole("checkbox"),
  getControl: (label) => screen.getByRole("group", { name: label }),
})
