import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import type * as React from "react"
import { runCheckboxContract } from "../../../../../../tests/contracts/checkbox.contract"
import { MarwesProvider } from "../../../provider/marwes-provider"
import { Checkbox } from "../checkbox"

function renderWithProvider(ui: React.ReactElement) {
  return render(<MarwesProvider>{ui}</MarwesProvider>)
}

runCheckboxContract("react", {
  async renderCheckbox(args = {}) {
    const checkboxProps = {
      ariaLabel: args.ariaLabel ?? "Checkbox",
      ...(args.disabled !== undefined ? { disabled: args.disabled } : {}),
      ...(args.defaultChecked !== undefined ? { defaultChecked: args.defaultChecked } : {}),
      ...(args.indeterminate !== undefined ? { indeterminate: args.indeterminate } : {}),
      ...(args.onCheckedChange ? { onCheckedChange: args.onCheckedChange } : {}),
    }

    renderWithProvider(<Checkbox {...checkboxProps} />)
  },
  getByRole(role, options) {
    return screen.getByRole(role, options) as HTMLInputElement
  },
  async click(element) {
    await userEvent.setup().click(element)
  },
})
