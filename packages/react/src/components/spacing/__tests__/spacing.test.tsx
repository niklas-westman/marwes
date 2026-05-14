/**
 * React adapter: Tests the Spacing component — wires the shared cross-adapter contract
 * and verifies adapter-specific rendering concerns.
 */
import { Spacings } from "@marwes-ui/core"
import { render } from "@testing-library/react"
import type * as React from "react"
import { expect, it } from "vitest"
import { runSpacingContract } from "../../../../../../tests/contracts/spacing.contract"
import { MarwesProvider } from "../../../provider/marwes-provider"
import { Spacer, Spacing } from "../spacing"

function renderWithProvider(ui: React.ReactElement) {
  return render(<MarwesProvider>{ui}</MarwesProvider>)
}

runSpacingContract("react", {
  renderSpacing(args = {}) {
    const spacingProps = {
      ...(args.size !== undefined ? { size: args.size } : {}),
      ...(args.scale !== undefined ? { scale: args.scale } : {}),
    }

    renderWithProvider(<Spacing {...spacingProps} />)
  },
  getSpacingElement() {
    return document.querySelector(".mw-spacing")
  },
})

it("supports Spacer with spacing token dot notation", () => {
  renderWithProvider(<Spacer spacing={Spacings.sp24} />)

  const spacingElement = document.querySelector(".mw-spacing")
  expect(spacingElement).toHaveAttribute("data-size", "sp-24")
  expect((spacingElement as HTMLElement).style.getPropertyValue("--mw-spacing-value")).toBe(
    "var(--mw-spacing-sp-24)",
  )
})
