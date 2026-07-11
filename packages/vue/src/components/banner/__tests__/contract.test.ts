/**
 * Vue adapter: Banner shared contract harness — proves cross-adapter behavioral parity.
 */
import { fireEvent, render, screen } from "@testing-library/vue"
import { vi } from "vitest"
import { defineComponent, h } from "vue"
import { runBannerContract } from "../../../../../../tests/contracts/banner.contract"
import { MarwesProvider } from "../../../provider/marwes-provider"
import { Banner } from "../banner"

let dismissHandler: ReturnType<typeof vi.fn>

function renderBanner(props: Record<string, unknown>, slots?: Record<string, () => unknown>) {
  const { children, ...componentProps } = props
  render(
    defineComponent({
      setup() {
        return () =>
          h(MarwesProvider, null, {
            default: () =>
              h(Banner, componentProps, {
                default: () => children,
                ...slots,
              }),
          })
      },
    }),
  )
}

runBannerContract("vue", {
  renderDefault() {
    dismissHandler = vi.fn()
    renderBanner({ onDismiss: dismissHandler, children: "Default message" })
  },
  renderInfo() {
    renderBanner({ variant: "info", children: "Info message" })
  },
  renderWarning() {
    renderBanner({ variant: "warning", children: "Warning message" })
  },
  renderError() {
    renderBanner({ variant: "error", children: "Error message" })
  },
  renderWithoutIcon() {
    renderBanner({ showIcon: false, children: "No icon message" })
  },
  renderNonDismissible() {
    renderBanner({ dismissible: false, children: "Persistent message" })
  },
  renderWithAction() {
    renderBanner(
      { showAction: true, children: "Action message" },
      {
        action: () => h("button", { type: "button" }, "Learn more"),
      },
    )
  },
  renderWithAriaLabel() {
    renderBanner({ ariaLabel: "Important notice", children: "Labeled message" })
  },
  async clickDismiss() {
    const dismiss = screen.getByRole("button", { name: /dismiss/i })
    await fireEvent.click(dismiss)
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
