import { render, screen } from "@testing-library/react"
import type * as React from "react"
import { H1, H2, H3 } from ".."
import { runHeadingContract } from "../../../../../../tests/contracts/heading.contract"
import { MarwesProvider } from "../../../provider/marwes-provider"

function renderWithProvider(ui: React.ReactElement) {
  return render(<MarwesProvider>{ui}</MarwesProvider>)
}

runHeadingContract("react", {
  async renderHeading(args) {
    const headingProps = {
      ...(args.size !== undefined ? { size: args.size } : {}),
      ...(args.id !== undefined ? { id: args.id } : {}),
      ...(args.ariaLabel !== undefined ? { ariaLabel: args.ariaLabel } : {}),
    }

    if (args.level === 1) {
      renderWithProvider(<H1 {...headingProps}>{args.text}</H1>)
      return
    }

    if (args.level === 2) {
      renderWithProvider(<H2 {...headingProps}>{args.text}</H2>)
      return
    }

    renderWithProvider(<H3 {...headingProps}>{args.text}</H3>)
  },
  getByRole(role, options) {
    return screen.getByRole(role, options)
  },
})
