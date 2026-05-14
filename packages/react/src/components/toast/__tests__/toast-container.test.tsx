/**
 * React adapter: Tests the ToastContainer component — toast stacking, automatic
 * dismissal, and container positioning.
 */
import { act, render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import type * as React from "react"
import { describe, expect, it, vi } from "vitest"
import { MarwesProvider } from "../../../provider/marwes-provider"
import { ToastContainer } from "../toast-container"
import { ToastProvider, useToast } from "../toast-provider"

function renderWithProvider(ui: React.ReactElement) {
  return render(<MarwesProvider>{ui}</MarwesProvider>)
}

describe("ToastContainer", () => {
  it("renders stacked toasts in the configured placement", () => {
    const { container } = renderWithProvider(
      <ToastContainer
        placement="bottom-left"
        toasts={[
          { id: "toast-1", children: "Project saved.", intent: "success" },
          { id: "toast-2", children: "Billing failed.", intent: "error" },
        ]}
      />,
    )

    expect(container.querySelector(".mw-toast-container--bottom-left")).not.toBeNull()
    expect(screen.getByText("Project saved.")).toBeTruthy()
    expect(screen.getByText("Billing failed.")).toBeTruthy()
  })

  it("forwards dismiss clicks with the toast id", async () => {
    const user = userEvent.setup()
    const handleDismiss = vi.fn()

    renderWithProvider(
      <ToastContainer
        onDismiss={handleDismiss}
        toasts={[{ id: "toast-1", children: "Project saved." }]}
      />,
    )

    await user.click(screen.getByRole("button", { name: /dismiss/i }))

    expect(handleDismiss).toHaveBeenCalledWith("toast-1")
  })

  it("forwards primitive intents to the raw toast for neutral and brand styling", () => {
    renderWithProvider(
      <ToastContainer
        toasts={[
          { id: "toast-1", children: "Neutral message.", intent: "neutral" },
          { id: "toast-2", children: "Brand message.", intent: "brand" },
        ]}
      />,
    )

    expect(
      screen.getByText("Neutral message.").closest("[role='status']")?.getAttribute("data-intent"),
    ).toBe("neutral")
    expect(
      screen.getByText("Brand message.").closest("[role='status']")?.getAttribute("data-intent"),
    ).toBe("brand")
  })
})

describe("ToastProvider", () => {
  it("supports the imperative useToast API with auto-dismiss", async () => {
    vi.useFakeTimers()

    function Trigger(): React.ReactElement {
      const toast = useToast()

      return (
        <button type="button" onClick={() => toast.show({ children: "Project saved." })}>
          Show toast
        </button>
      )
    }

    renderWithProvider(
      <ToastProvider defaultDuration={100}>
        <Trigger />
      </ToastProvider>,
    )

    act(() => {
      screen.getByRole("button", { name: /show toast/i }).click()
    })

    expect(screen.getByText("Project saved.")).toBeTruthy()

    act(() => {
      vi.advanceTimersByTime(100)
    })

    expect(screen.queryByText("Project saved.")).toBeNull()
    vi.useRealTimers()
  })
})
