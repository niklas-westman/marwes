import { render, screen } from "@testing-library/react"
import type * as React from "react"
import { runDividerContract } from "../../../../../../tests/contracts/divider.contract"
import { MarwesProvider } from "../../../provider/marwes-provider"
import { Divider } from "../../divider"

function renderWithProvider(ui: React.ReactElement) {
  return render(<MarwesProvider>{ui}</MarwesProvider>)
}

runDividerContract("react", {
  async renderDivider(args = {}) {
    const dividerProps = {
      ...(args.size !== undefined ? { size: args.size } : {}),
      ...(args.orientation !== undefined ? { orientation: args.orientation } : {}),
      ...(args.id !== undefined ? { id: args.id } : {}),
    }

    renderWithProvider(<Divider {...dividerProps} />)
  },
  getByRole(role) {
    return screen.getByRole(role)
  },
})
