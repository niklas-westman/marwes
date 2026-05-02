import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import type * as React from "react"
import { runRadioGroupFieldContract } from "../../../../../../tests/contracts/radio-group-field.contract"
import { MarwesProvider } from "../../../provider/marwes-provider"
import { RadioGroupField } from "../radio-group-field"

function renderWithProvider(ui: React.ReactElement) {
  return render(<MarwesProvider>{ui}</MarwesProvider>)
}

runRadioGroupFieldContract("react", {
  async renderRadioGroup(args = {}) {
    const fieldProps = {
      name: args.name ?? "test",
      label: args.label ?? "Pick one",
      ...(args.description !== undefined ? { description: args.description } : {}),
      ...(args.error !== undefined ? { error: args.error } : {}),
      ...(args.value !== undefined ? { value: args.value } : {}),
      ...(args.onValueChange !== undefined ? { onChange: args.onValueChange } : {}),
      ...(args.defaultValue !== undefined ? { defaultValue: args.defaultValue } : {}),
      options: args.options ?? [
        { value: "a", label: "Alpha" },
        { value: "b", label: "Beta" },
        { value: "c", label: "Gamma" },
      ],
      ...(args.disabled !== undefined ? { disabled: args.disabled } : {}),
      ...(args.required !== undefined ? { required: args.required } : {}),
      ...(args.ariaDescribedBy !== undefined ? { ariaDescribedBy: args.ariaDescribedBy } : {}),
    }

    renderWithProvider(<RadioGroupField {...fieldProps} />)
  },
  getByRole(role, options) {
    return screen.getByRole(role, options)
  },
  getAllByRole(role) {
    return screen.getAllByRole(role) as HTMLInputElement[]
  },
  getByText(text) {
    return screen.getByText(text)
  },
  async click(element) {
    await userEvent.setup().click(element)
  },
})
