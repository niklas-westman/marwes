import { render } from "@testing-library/react"
import type * as React from "react"
import { runProgressBarContract } from "../../../../../../tests/contracts/progress-bar.contract"
import { MarwesProvider } from "../../../provider/marwes-provider"
import { ProgressBar } from "../progress-bar"

function renderWithProvider(ui: React.ReactElement) {
  return render(<MarwesProvider>{ui}</MarwesProvider>)
}

runProgressBarContract("react", {
  renderProgressBarOptions(options) {
    renderWithProvider(<ProgressBar {...options} />)
  },
  getProgressBarRoot() {
    return document.querySelector('[data-component="progress-bar"]') as HTMLElement
  },
  async renderProgressBar(args = {}) {
    renderWithProvider(<ProgressBar {...args} />)
  },
  getProgressBarElement() {
    return document.body.querySelector('[data-component="progress-bar"]') as HTMLElement
  },
})
