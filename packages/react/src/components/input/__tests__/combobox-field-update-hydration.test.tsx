import { screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import type { ComboboxFieldUpdatesProps } from "../../../../../../tests/contracts/combobox-field-updates.contract"
import { runComboboxFieldUpdatesContract } from "../../../../../../tests/contracts/combobox-field-updates.contract"
import { createUpdateHydrationHarness } from "../../../test-support/update-hydration"
import { DropdownField } from "../field-variants"
import { SelectField } from "../select-field"

const options = [
  { value: "se", label: "Sweden" },
  { value: "no", label: "Norway" },
]

runComboboxFieldUpdatesContract("react", "SelectField", {
  ...createUpdateHydrationHarness(({ label, ...select }: ComboboxFieldUpdatesProps) => (
    <SelectField label={label} select={{ ...select, options, name: "country" }} />
  )),
  getCombobox: (label) => screen.getByRole("combobox", { name: label }),
  getOption: (label) => screen.getByRole("option", { name: label }),
  async click(element) {
    await userEvent.setup().click(element)
  },
})

runComboboxFieldUpdatesContract("react", "DropdownField", {
  ...createUpdateHydrationHarness(({ label, ...select }: ComboboxFieldUpdatesProps) => (
    <DropdownField label={label} select={{ ...select, options, name: "country" }} />
  )),
  getCombobox: (label) => screen.getByRole("combobox", { name: label }),
  getOption: (label) => screen.getByRole("option", { name: label }),
  async click(element) {
    await userEvent.setup().click(element)
  },
})
