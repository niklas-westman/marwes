/**
 * React adapter: Tests Toast purpose/variant components — verifies that each
 * purpose wrapper renders with the correct semantic defaults and metadata.
 */
import { act, fireEvent, render, screen } from "@testing-library/react"
import * as React from "react"
import { describe, expect, it, vi } from "vitest"
import { runToastContract } from "../../../../../../tests/contracts/toast.contract"
import { MarwesProvider } from "../../../provider/marwes-provider"
import { Toast } from "../toast"
import { ToastContainer } from "../toast-container"
import { ToastProvider, useToast } from "../toast-provider"
import { ErrorToast, InfoToast, SuccessToast, WarningToast } from "../variants"

function renderWithProvider(ui: React.ReactElement) {
  return render(<MarwesProvider>{ui}</MarwesProvider>)
}

runToastContract("react", {
  renderRawToast(args) {
    renderWithProvider(
      <Toast
        {...(args?.ariaLive ? { ariaLive: args.ariaLive } : {})}
        {...(args?.dismissible ? { onDismiss: () => {} } : {})}
      >
        {args?.children ?? "Project saved."}
      </Toast>,
    )
  },
  renderSuccess() {
    renderWithProvider(<SuccessToast>Saved successfully.</SuccessToast>)
  },
  renderError() {
    renderWithProvider(<ErrorToast>Publishing failed.</ErrorToast>)
  },
  renderWarning() {
    renderWithProvider(<WarningToast>Storage is almost full.</WarningToast>)
  },
  renderInfo() {
    renderWithProvider(<InfoToast>New release notes are available.</InfoToast>)
  },
  renderContainer(args) {
    renderWithProvider(
      <ToastContainer
        toasts={args.toasts.map((toast) => ({
          ...toast,
        }))}
        {...(args.maxVisible !== undefined ? { maxVisible: args.maxVisible } : {})}
        {...(args.onDismiss ? { onDismiss: args.onDismiss } : {})}
      />,
    )
  },
  renderProvider(args) {
    function AutoShowToast(): React.ReactElement {
      const toast = useToast()

      React.useEffect(() => {
        toast.show({
          children: args.toast.children,
          ...(args.toast.intent ? { intent: args.toast.intent } : {}),
          ...(args.toast.duration !== undefined ? { duration: args.toast.duration } : {}),
        })
      }, [args.toast.children, args.toast.duration, args.toast.intent, toast])

      return <div>Toast test harness</div>
    }

    renderWithProvider(
      <ToastProvider
        {...(args.defaultDuration !== undefined ? { defaultDuration: args.defaultDuration } : {})}
      >
        <AutoShowToast />
      </ToastProvider>,
    )
  },
  getByRole(role, options) {
    return screen.getByRole(role, options)
  },
  getByText(text) {
    return screen.getByText(text)
  },
  queryByText(text) {
    return screen.queryByText(text)
  },
  getContainerItemByText(text) {
    const item = screen.getByText(text).closest(".mw-toast-container__item")

    if (!item) {
      throw new Error(`Toast container item not found for text: ${text}`)
    }

    return item as HTMLElement
  },
  click(element) {
    act(() => {
      fireEvent.click(element)
    })
  },
  hover(element) {
    act(() => {
      fireEvent.mouseEnter(element)
    })
  },
  unhover(element) {
    act(() => {
      fireEvent.mouseLeave(element)
    })
  },
  focus(element) {
    act(() => {
      fireEvent.focusIn(element)
    })
  },
  blur(element) {
    act(() => {
      fireEvent.focusOut(element)
    })
  },
  advanceTime(ms) {
    act(() => {
      vi.advanceTimersByTime(ms)
    })
  },
})

describe("SuccessToast", () => {
  it("adds success metadata and defaults to the outline emphasis", () => {
    renderWithProvider(<SuccessToast>Saved successfully.</SuccessToast>)

    const toast = screen.getByRole("status")
    expect(toast.getAttribute("data-purpose")).toBe("success-toast")
    expect(toast.getAttribute("data-intent")).toBe("success")
    expect(toast.className).toContain("mw-toast--outline")
    expect(toast.querySelector(".mw-toast__icon svg")).not.toBeNull()
  })
})

describe("ErrorToast", () => {
  it("uses assertive announcements for urgent errors and defaults to outline", () => {
    renderWithProvider(<ErrorToast>Publishing failed.</ErrorToast>)

    const toast = screen.getByRole("alert")
    expect(toast.getAttribute("data-purpose")).toBe("error-toast")
    expect(toast.getAttribute("data-intent")).toBe("error")
    expect(toast.className).toContain("mw-toast--outline")
  })
})

describe("WarningToast", () => {
  it("adds warning metadata", () => {
    renderWithProvider(<WarningToast>Storage is almost full.</WarningToast>)

    const toast = screen.getByRole("status")
    expect(toast.getAttribute("data-purpose")).toBe("warning-toast")
    expect(toast.getAttribute("data-intent")).toBe("warning")
    expect(toast.className).toContain("mw-toast--outline")
  })
})

describe("InfoToast", () => {
  it("adds info metadata", () => {
    renderWithProvider(<InfoToast>New release notes are available.</InfoToast>)

    const toast = screen.getByRole("status")
    expect(toast.getAttribute("data-purpose")).toBe("info-toast")
    expect(toast.getAttribute("data-intent")).toBe("info")
    expect(toast.className).toContain("mw-toast--outline")
  })
})
