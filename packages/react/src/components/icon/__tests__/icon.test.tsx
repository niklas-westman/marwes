import { render, screen } from "@testing-library/react"
import type * as React from "react"
import { Icon } from ".."
import { runIconContract } from "../../../../../../tests/contracts/icon.contract"
import { MarwesProvider } from "../../../provider/marwes-provider"

function renderWithProvider(ui: React.ReactElement) {
  return render(<MarwesProvider>{ui}</MarwesProvider>)
}

function toSvgElement(element: Element | null): SVGElement {
  if (element instanceof SVGElement) {
    return element
  }

  throw new TypeError("Expected an SVGElement")
}

runIconContract("react", {
  async renderIcon(args = {}) {
    const iconProps = {
      name: "search" as const,
      ...(args.ariaLabel !== undefined ? { "aria-label": args.ariaLabel } : {}),
      ...(args.size !== undefined ? { size: args.size } : {}),
      ...(args.strokeWidth !== undefined ? { strokeWidth: args.strokeWidth } : {}),
    }

    renderWithProvider(<Icon {...iconProps} />)
  },
  getByRole(role, options) {
    return toSvgElement(screen.getByRole(role, options))
  },
  queryByRole(role) {
    const element = screen.queryByRole(role)
    return element ? toSvgElement(element) : null
  },
  querySvg() {
    return document.querySelector<SVGElement>("svg")
  },
})
