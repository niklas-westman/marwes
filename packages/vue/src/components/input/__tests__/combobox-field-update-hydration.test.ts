import userEvent from "@testing-library/user-event"
import { screen } from "@testing-library/vue"
import type { Component } from "vue"
import type { ComboboxFieldUpdatesProps } from "../../../../../../tests/contracts/combobox-field-updates.contract"
import { runComboboxFieldUpdatesContract } from "../../../../../../tests/contracts/combobox-field-updates.contract"
import { createUpdateHydrationHarness } from "../../../test-support/update-hydration"
import { DropdownField } from "../field-variants"
import { SelectField } from "../select-field"

const options = [
  { value: "se", label: "Sweden" },
  { value: "no", label: "Norway" },
]

runComboboxFieldUpdatesContract("vue", "SelectField", {
  ...createUpdateHydrationHarness(
    SelectField as Component,
    ({ label, ...select }: ComboboxFieldUpdatesProps) => ({
      label,
      select: { ...select, options, name: "country" },
    }),
  ),
  getCombobox: (label) => screen.getByRole("combobox", { name: label }),
  getOption: (label) => screen.getByRole("option", { name: label }),
  async click(element) {
    await userEvent.setup().click(element)
  },
})

runComboboxFieldUpdatesContract("vue", "DropdownField", {
  ...createUpdateHydrationHarness(
    DropdownField as Component,
    ({ label, ...select }: ComboboxFieldUpdatesProps) => ({
      label,
      select: { ...select, options, name: "country" },
    }),
  ),
  getCombobox: (label) => screen.getByRole("combobox", { name: label }),
  getOption: (label) => screen.getByRole("option", { name: label }),
  async click(element) {
    await userEvent.setup().click(element)
  },
})
