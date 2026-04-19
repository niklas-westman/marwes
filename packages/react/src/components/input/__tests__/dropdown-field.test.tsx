import { render, screen } from "@testing-library/react"
import type * as React from "react"
import { runDropdownFieldContract } from "../../../../../../tests/contracts/dropdown-field.contract"
import { MarwesProvider } from "../../../provider/marwes-provider"
import type { DropdownFieldProps } from "../field-variants"
import { DropdownField } from "../field-variants"

function renderWithProvider(ui: React.ReactElement) {
  return render(<MarwesProvider>{ui}</MarwesProvider>)
}

runDropdownFieldContract("react", {
  async renderDropdownField(args) {
    const fieldProps = {
      label: args.label,
      ...(args.helperText !== undefined ? { helperText: args.helperText } : {}),
      ...(args.error !== undefined ? { error: args.error } : {}),
      ...(args.ariaDescribedBy !== undefined ? { ariaDescribedBy: args.ariaDescribedBy } : {}),
      select: {
        options: [
          { value: "se", label: "Sweden" },
          { value: "us", label: "United States" },
        ],
        placeholder: "Choose an option",
        ...(args.select ?? {}),
      },
    } as unknown as DropdownFieldProps

    renderWithProvider(<DropdownField {...fieldProps} />)
  },
  getByRole(role, options) {
    return screen.getByRole(role, options)
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
    return document.querySelector('[data-purpose="dropdown"]')
  },
})
