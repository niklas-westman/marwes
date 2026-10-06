/**
 * React adapter: wires the shared SegmentedControl contract.
 */
import { render } from "@testing-library/react"
import type * as React from "react"
import { runSegmentedControlContract } from "../../../../../../tests/contracts/segmented-control.contract"
import { MarwesProvider } from "../../../provider/marwes-provider"
import { Icon } from "../../icon"
import { SegmentedControl } from "../segmented-control"

function renderWithProvider(ui: React.ReactElement) {
  return render(<MarwesProvider>{ui}</MarwesProvider>)
}

runSegmentedControlContract("react", {
  renderSegmentedControlOptions(options) {
    renderWithProvider(
      <SegmentedControl
        {...options}
        items={[
          { value: "a", label: "Alpha" },
          { value: "b", label: "Beta" },
        ]}
      />,
    )
  },
  renderSegmentedControlIconOnlyItem() {
    renderWithProvider(
      <SegmentedControl
        items={[{ value: "a", icon: <Icon name="search" />, ariaLabel: "Search" }]}
      />,
    )
  },
  renderSegmentedControlItems(items) {
    renderWithProvider(<SegmentedControl items={[...items]} />)
  },
  getSegmentedControlRoot() {
    return document.querySelector('[role="radiogroup"]') as HTMLElement
  },
})
