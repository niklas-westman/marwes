import { render, screen } from "@testing-library/react"
import type * as React from "react"
import { runRichTextFieldContract } from "../../../../../../tests/contracts/rich-text-field.contract"
import { MarwesProvider } from "../../../provider/marwes-provider"
import { RichTextField } from "../rich-text-field"

function renderWithProvider(ui: React.ReactElement) {
  return render(<MarwesProvider>{ui}</MarwesProvider>)
}

runRichTextFieldContract("react", {
  async renderRichTextField(args) {
    const fieldProps = {
      label: args.label,
      ...(args.helperText !== undefined ? { helperText: args.helperText } : {}),
      ...(args.error !== undefined ? { error: args.error } : {}),
      ...(args.ariaDescribedBy !== undefined ? { ariaDescribedBy: args.ariaDescribedBy } : {}),
      editor: {},
    }

    renderWithProvider(<RichTextField {...fieldProps} />)
  },
  getByRole(role, options) {
    return screen.getByRole(role, options) as HTMLDivElement
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
