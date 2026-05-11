/**
 * React adapter: Tests the Zip Code Field molecule — wires the shared contract for label,
 * helper text, error state, and aria-describedby connections.
 */
import { render, screen } from "@testing-library/react"
import type * as React from "react"
import { runZipCodeFieldContract } from "../../../../../../tests/contracts/zip-code-field.contract"
import { MarwesProvider } from "../../../provider/marwes-provider"
import type { ZipCodeFieldProps } from "../field-variants"
import { ZipCodeField } from "../field-variants"

function renderWithProvider(ui: React.ReactElement) {
  return render(<MarwesProvider>{ui}</MarwesProvider>)
}

runZipCodeFieldContract("react", {
  async renderZipCodeField(args) {
    const fieldProps = {
      label: args.label,
      ...(args.helperText !== undefined ? { helperText: args.helperText } : {}),
      ...(args.error !== undefined ? { error: args.error } : {}),
      ...(args.ariaDescribedBy !== undefined ? { ariaDescribedBy: args.ariaDescribedBy } : {}),
      input: {},
    } as ZipCodeFieldProps

    renderWithProvider(<ZipCodeField {...fieldProps} />)
  },
  getByLabelText(text) {
    return screen.getByLabelText(text) as HTMLInputElement
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
  queryPurposeRegion() {
    return document.querySelector('[data-purpose="zip-code"]')
  },
})
