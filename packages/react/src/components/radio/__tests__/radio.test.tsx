/**
 * React adapter: Tests the Radio component — wires the shared cross-adapter contract
 * and verifies adapter-specific rendering concerns.
 */
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import type * as React from "react"
import { runRadioContract } from "../../../../../../tests/contracts/radio.contract"
import { MarwesProvider } from "../../../provider/marwes-provider"
import { Radio } from "../radio"

function renderWithProvider(ui: React.ReactElement) {
  return render(<MarwesProvider>{ui}</MarwesProvider>)
}

runRadioContract("react", {
  async renderRadio(args = {}) {
    const radioProps = {
      ariaLabel: args.ariaLabel ?? "Radio",
      ...(args.disabled !== undefined ? { disabled: args.disabled } : {}),
      ...(args.defaultChecked !== undefined ? { defaultChecked: args.defaultChecked } : {}),
      ...(args.onCheckedChange ? { onCheckedChange: args.onCheckedChange } : {}),
    }

    renderWithProvider(<Radio {...radioProps} />)
  },
  getByRole(role, options) {
    return screen.getByRole(role, options) as HTMLInputElement
  },
  async click(element) {
    await userEvent.setup().click(element)
  },
})
