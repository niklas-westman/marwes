/**
 * React adapter: wires the shared Breadcrumb contract.
 */
import { render } from "@testing-library/react"
import type * as React from "react"
import { runBreadcrumbContract } from "../../../../../../tests/contracts/breadcrumb.contract"
import { MarwesProvider } from "../../../provider/marwes-provider"
import { Breadcrumb } from "../breadcrumb"

function renderWithProvider(ui: React.ReactElement) {
  return render(<MarwesProvider>{ui}</MarwesProvider>)
}

runBreadcrumbContract("react", {
  renderBreadcrumbOptions(options) {
    renderWithProvider(<Breadcrumb {...options} items={options.items ?? []} />)
  },
  getBreadcrumbRoot() {
    return document.querySelector('nav[data-component="breadcrumb"]') as HTMLElement
  },
})
