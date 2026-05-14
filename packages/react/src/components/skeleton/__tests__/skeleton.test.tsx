/**
 * React adapter: Tests the Skeleton component — wires the shared cross-adapter contract
 * and verifies adapter-specific rendering concerns.
 */
import { render, screen } from "@testing-library/react"
import type * as React from "react"
import { runSkeletonContract } from "../../../../../../tests/contracts/skeleton.contract"
import { MarwesProvider } from "../../../provider/marwes-provider"
import { Skeleton } from "../skeleton"

function renderWithProvider(ui: React.ReactElement) {
  return render(<MarwesProvider>{ui}</MarwesProvider>)
}

runSkeletonContract("react", {
  async renderSkeleton(args = {}) {
    renderWithProvider(<Skeleton {...args} />)
  },
  getSkeletonElement() {
    return document.body.querySelector('[data-component="skeleton"]') as HTMLElement
  },
  getByRole(role) {
    return screen.getByRole(role)
  },
})
