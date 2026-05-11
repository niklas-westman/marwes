/**
 * React adapter: Tests the Textarea component — wires the shared cross-adapter contract
 * and verifies adapter-specific rendering concerns.
 */
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import type * as React from "react"
import { runTextareaContract } from "../../../../../../tests/contracts/textarea.contract"
import { MarwesProvider } from "../../../provider/marwes-provider"
import { Textarea } from "../textarea"

function renderWithProvider(ui: React.ReactElement) {
  return render(<MarwesProvider>{ui}</MarwesProvider>)
}

runTextareaContract("react", {
  async renderTextarea(args = {}) {
    const textareaProps = {
      ariaLabel: args.ariaLabel ?? "Textarea",
      ...(args.disabled !== undefined ? { disabled: args.disabled } : {}),
      ...(args.readOnly !== undefined ? { readOnly: args.readOnly } : {}),
      ...(args.defaultValue !== undefined ? { defaultValue: args.defaultValue } : {}),
      ...(args.onValueChange ? { onValueChange: args.onValueChange } : {}),
    }

    renderWithProvider(<Textarea {...textareaProps} />)
  },
  getByRole(role, options) {
    return screen.getByRole(role, options) as HTMLTextAreaElement
  },
  async type(element, text) {
    await userEvent.setup().type(element, text)
  },
})
