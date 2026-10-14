import userEvent from "@testing-library/user-event"
import { screen } from "@testing-library/vue"
import type { Component } from "vue"
import {
  type CheckboxGroupUpdatesProps,
  runCheckboxGroupUpdatesContract,
} from "../../../../../../tests/contracts/checkbox-group-updates.contract"
import { createUpdateHydrationHarness } from "../../../test-support/update-hydration"
import { CheckboxGroupField } from "../checkbox-group-field"
const options = [
  { value: "email", label: "Email" },
  { value: "sms", label: "SMS" },
  { value: "disabled", label: "Disabled option", disabled: true },
]
runCheckboxGroupUpdatesContract("vue", {
  ...createUpdateHydrationHarness<CheckboxGroupUpdatesProps>(
    CheckboxGroupField as Component,
    ({ onValueChange, ...props }) => ({
      ...props,
      label: "Contact",
      options,
      onChange: onValueChange,
    }),
  ),
  getCheckbox: (label) => screen.getByRole("checkbox", { name: label }) as HTMLInputElement,
  async click(element) {
    await userEvent.setup().click(element)
  },
})
