import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import type * as React from "react"
import { runInputContract } from "../../../../../../tests/contracts/input.contract"
import { MarwesProvider } from "../../../provider/marwes-provider"
import { Input } from "../../input"

function renderWithProvider(ui: React.ReactElement) {
  return render(<MarwesProvider>{ui}</MarwesProvider>)
}

runInputContract("react", {
  async renderInput(args = {}) {
    const inputProps = {
      ariaLabel: args.ariaLabel ?? "Input",
      ...(args.disabled !== undefined ? { disabled: args.disabled } : {}),
      ...(args.readOnly !== undefined ? { readOnly: args.readOnly } : {}),
      ...(args.defaultValue !== undefined ? { defaultValue: args.defaultValue } : {}),
      ...(args.onValueChange ? { onValueChange: args.onValueChange } : {}),
    }

    renderWithProvider(<Input {...inputProps} />)
  },
  getByRole(role, options) {
    return screen.getByRole(role, options) as HTMLInputElement
  },
  async type(element, text) {
    await userEvent.setup().type(element, text)
  },
})
