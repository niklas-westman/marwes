import { render, screen } from "@testing-library/react"
import type * as React from "react"
import { runDateOfBirthFieldContract } from "../../../../../../tests/contracts/date-of-birth-field.contract"
import { MarwesProvider } from "../../../provider/marwes-provider"
import type { DateOfBirthFieldProps } from "../field-variants"
import { DateOfBirthField } from "../field-variants"

function renderWithProvider(ui: React.ReactElement) {
  return render(<MarwesProvider>{ui}</MarwesProvider>)
}

runDateOfBirthFieldContract("react", {
  async renderDateOfBirthField(args) {
    const fieldProps = {
      label: args.label,
      ...(args.helperText !== undefined ? { helperText: args.helperText } : {}),
      ...(args.error !== undefined ? { error: args.error } : {}),
      ...(args.ariaDescribedBy !== undefined ? { ariaDescribedBy: args.ariaDescribedBy } : {}),
      input: {},
    } as DateOfBirthFieldProps

    renderWithProvider(<DateOfBirthField {...fieldProps} />)
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
    return document.querySelector('[data-purpose="date-of-birth"]')
  },
})
