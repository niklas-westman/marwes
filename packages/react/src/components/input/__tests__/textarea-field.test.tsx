/**
 * React adapter: Tests the Textarea Field molecule — wires the shared contract for label,
 * helper text, error state, and aria-describedby connections.
 */
import { render, screen } from "@testing-library/react"
import type * as React from "react"
import { runTextareaFieldContract } from "../../../../../../tests/contracts/textarea-field.contract"
import { MarwesProvider } from "../../../provider/marwes-provider"
import { TextareaField } from "../textarea-field"

function renderWithProvider(ui: React.ReactElement) {
  return render(<MarwesProvider>{ui}</MarwesProvider>)
}

runTextareaFieldContract("react", {
  async renderTextareaField(args) {
    const fieldProps = {
      label: args.label,
      ...(args.helperText !== undefined ? { helperText: args.helperText } : {}),
      ...(args.counterText !== undefined ? { counterText: args.counterText } : {}),
      ...(args.error !== undefined ? { error: args.error } : {}),
      ...(args.ariaDescribedBy !== undefined ? { ariaDescribedBy: args.ariaDescribedBy } : {}),
      textarea: {},
    }

    renderWithProvider(<TextareaField {...fieldProps} />)
  },
  getByLabelText(text) {
    return screen.getByLabelText(text) as HTMLTextAreaElement
  },
  getByText(text) {
    return screen.getByText(text)
  },
  queryHelperRegion() {
    return document.querySelector(".mw-input-field__helper")
  },
  queryErrorRegion() {
    return document.querySelector(".mw-input-field__error")
  },
})
