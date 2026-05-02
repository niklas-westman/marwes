import { render, screen } from "@testing-library/react"
import type * as React from "react"
import { runSpinnerContract } from "../../../../../../tests/contracts/spinner.contract"
import { MarwesProvider } from "../../../provider/marwes-provider"
import { Spinner } from "../spinner"

function renderWithProvider(ui: React.ReactElement) {
  return render(<MarwesProvider>{ui}</MarwesProvider>)
}

runSpinnerContract("react", {
  async renderSpinner(args = {}) {
    renderWithProvider(<Spinner {...args} />)
  },
  getSpinnerElement() {
    return document.body.querySelector('[data-component="spinner"]') as HTMLElement
  },
  getByRole(role) {
    return screen.getByRole(role)
  },
})
