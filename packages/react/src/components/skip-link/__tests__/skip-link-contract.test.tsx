/**
 * React adapter: wires the shared SkipLink contract.
 */
import { render } from "@testing-library/react"
import type * as React from "react"
import { runSkipLinkContract } from "../../../../../../tests/contracts/skip-link.contract"
import { MarwesProvider } from "../../../provider/marwes-provider"
import { SkipLink } from "../skip-link"

function renderWithProvider(ui: React.ReactElement) {
  return render(<MarwesProvider>{ui}</MarwesProvider>)
}

runSkipLinkContract("react", {
  renderSkipLinkOptions(options) {
    renderWithProvider(<SkipLink {...options}>Skip to content</SkipLink>)
  },
  getSkipLinkRoot() {
    return document.querySelector("a.mw-skip-link") as HTMLElement
  },
})
