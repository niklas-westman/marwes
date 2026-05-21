/**
 * React adapter: Banner shared contract harness — proves cross-adapter behavioral parity.
 */
import { fireEvent, render, screen } from "@testing-library/react"
import type * as React from "react"
import { vi } from "vitest"
import { runBannerContract } from "../../../../../../tests/contracts/banner.contract"
import { MarwesProvider } from "../../../provider/marwes-provider"
import { Banner } from "../banner"

let dismissHandler: ReturnType<typeof vi.fn>

function renderWithProvider(ui: React.ReactElement) {
  return render(<MarwesProvider>{ui}</MarwesProvider>)
}

runBannerContract("react", {
  renderDefault() {
    dismissHandler = vi.fn()
    renderWithProvider(<Banner onDismiss={dismissHandler}>Default message</Banner>)
  },
  renderInfo() {
    renderWithProvider(<Banner variant="info">Info message</Banner>)
  },
  renderWarning() {
    renderWithProvider(<Banner variant="warning">Warning message</Banner>)
  },
  renderError() {
    renderWithProvider(<Banner variant="error">Error message</Banner>)
  },
  renderWithoutIcon() {
    renderWithProvider(<Banner showIcon={false}>No icon message</Banner>)
  },
  renderNonDismissible() {
    renderWithProvider(<Banner dismissible={false}>Persistent message</Banner>)
  },
  renderWithAction() {
    renderWithProvider(
      <Banner action={<button type="button">Learn more</button>}>Action message</Banner>,
    )
  },
  renderWithAriaLabel() {
    renderWithProvider(<Banner ariaLabel="Important notice">Labeled message</Banner>)
  },
  clickDismiss() {
    const dismiss = screen.getByRole("button", { name: /dismiss/i })
    fireEvent.click(dismiss)
  },
  getByRole(role, options) {
    return screen.getByRole(role as never, options)
  },
  getByText(text) {
    return screen.getByText(text)
  },
  queryByRole(role, options) {
    return screen.queryByRole(role as never, options)
  },
  getRoot() {
    return screen.getByRole("status") ?? screen.getByRole("alert")
  },
  getDismissHandler() {
    return { called: dismissHandler.mock.calls.length > 0 }
  },
})
