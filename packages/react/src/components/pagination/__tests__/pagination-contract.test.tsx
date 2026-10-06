/**
 * React adapter: wires the shared Pagination contract.
 */
import { render } from "@testing-library/react"
import type * as React from "react"
import { runPaginationContract } from "../../../../../../tests/contracts/pagination.contract"
import { MarwesProvider } from "../../../provider/marwes-provider"
import { Pagination } from "../pagination"

function renderWithProvider(ui: React.ReactElement) {
  return render(<MarwesProvider>{ui}</MarwesProvider>)
}

runPaginationContract("react", {
  renderPaginationOptions(options) {
    renderWithProvider(<Pagination {...options} adaptive={false} />)
  },
  getPaginationRoot() {
    return document.querySelector('nav[data-component="pagination"]') as HTMLElement
  },
})
