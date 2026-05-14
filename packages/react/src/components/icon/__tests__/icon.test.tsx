/**
 * React adapter: Tests the Icon component — wires the shared cross-adapter contract
 * and verifies adapter-specific rendering concerns.
 */
import { render, screen } from "@testing-library/react"
import type * as React from "react"
import { describe, expect, it, vi } from "vitest"
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
      ...(args.decorative !== undefined ? { decorative: args.decorative } : {}),
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

describe("Icon (React)", () => {
  it("warns in development when decorative=false is passed without aria-label", () => {
    const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {})

    renderWithProvider(<Icon name="search" decorative={false} />)

    expect(warnSpy).toHaveBeenCalledWith(
      "[marwes] Icon: decorative={false} was passed without ariaLabel. " +
        "The icon stays hidden from assistive technology unless ariaLabel is also provided.",
    )

    warnSpy.mockRestore()
  })
})
