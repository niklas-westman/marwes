/**
 * React adapter: wires the shared ContextMenu contract.
 */
import { render } from "@testing-library/react"
import type * as React from "react"
import { runContextMenuContract } from "../../../../../../tests/contracts/context-menu.contract"
import { MarwesProvider } from "../../../provider/marwes-provider"
import { ContextMenu } from "../context-menu"

function renderWithProvider(ui: React.ReactElement) {
  return render(<MarwesProvider>{ui}</MarwesProvider>)
}

runContextMenuContract("react", {
  renderContextMenuOptions(options) {
    renderWithProvider(<ContextMenu {...options} items={options.items ?? []} />)
  },
  getContextMenuRoot() {
    return document.querySelector('[role="menu"]') as HTMLElement
  },
})
