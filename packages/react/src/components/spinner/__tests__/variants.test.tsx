/**
 * React spinner purpose variants — wires the shared spinner-variants contract.
 * Adapter-specific rendering concerns (if any) would be tested below the contract call.
 */
import { render, screen } from "@testing-library/react"
import type * as React from "react"
import { runSpinnerVariantsContract } from "../../../../../../tests/contracts/spinner-variants.contract"
import { MarwesProvider } from "../../../provider/marwes-provider"
import { ButtonSpinner, EmptyStateSpinner } from "../variants"

function renderWithProvider(ui: React.ReactElement) {
  return render(<MarwesProvider>{ui}</MarwesProvider>)
}

runSpinnerVariantsContract("react", {
  renderButtonSpinner() {
    renderWithProvider(<ButtonSpinner ariaLabel="Loading action" decorative={false} />)
  },
  renderEmptyStateSpinner() {
    renderWithProvider(<EmptyStateSpinner ariaLabel="Loading dashboard" decorative={false} />)
  },
  getByRole(role, options) {
    return screen.getByRole(role, options)
  },
})
