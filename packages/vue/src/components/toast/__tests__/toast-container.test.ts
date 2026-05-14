/**
 * Vue adapter: Tests the ToastContainer component — toast stacking, automatic
 * dismissal, and container positioning.
 */
import userEvent from "@testing-library/user-event"
import { render, screen } from "@testing-library/vue"
import { describe, expect, it, vi } from "vitest"
import { defineComponent, h } from "vue"
import { MarwesProvider } from "../../../provider/marwes-provider"
import { ToastContainer } from "../toast-container"
import { ToastProvider, useToast } from "../toast-provider"

function renderWithProvider(child: () => unknown) {
  return render(
    defineComponent({
      setup() {
        return () =>
          h(MarwesProvider, null, {
            default: child,
          })
      },
    }),
  )
}

describe("Vue ToastContainer", () => {
  it("renders stacked toasts in the configured placement", () => {
    const { container } = renderWithProvider(() =>
      h(ToastContainer as unknown as string, {
        placement: "bottom-left",
        toasts: [
          { id: "toast-1", children: "Project saved.", intent: "success" },
          { id: "toast-2", children: "Billing failed.", intent: "error" },
        ],
      }),
    )

    expect(container.querySelector(".mw-toast-container--bottom-left")).not.toBeNull()
    expect(screen.getByText("Project saved.")).toBeTruthy()
    expect(screen.getByText("Billing failed.")).toBeTruthy()
  })

  it("forwards dismiss clicks with the toast id", async () => {
    const user = userEvent.setup()
    const handleDismiss = vi.fn()

    renderWithProvider(() =>
      h(ToastContainer as unknown as string, {
        onDismiss: handleDismiss,
        toasts: [{ id: "toast-1", children: "Project saved." }],
      }),
    )

    await user.click(screen.getByRole("button", { name: /dismiss/i }))

    expect(handleDismiss).toHaveBeenCalledWith("toast-1")
  })

  it("forwards primitive intents to the raw toast for neutral and brand styling", () => {
    renderWithProvider(() =>
      h(ToastContainer as unknown as string, {
        toasts: [
          { id: "toast-1", children: "Neutral message.", intent: "neutral" },
          { id: "toast-2", children: "Brand message.", intent: "brand" },
        ],
      }),
    )

    expect(
      screen.getByText("Neutral message.").closest("[role='status']")?.getAttribute("data-intent"),
    ).toBe("neutral")
    expect(
      screen.getByText("Brand message.").closest("[role='status']")?.getAttribute("data-intent"),
    ).toBe("brand")
  })
})

describe("Vue ToastProvider", () => {
  it("supports the imperative useToast composable", async () => {
    const user = userEvent.setup()

    const Trigger = defineComponent({
      setup() {
        const toast = useToast()

        return () =>
          h(
            "button",
            {
              type: "button",
              onClick: () => toast.show({ children: "Project saved.", duration: null }),
            },
            "Show toast",
          )
      },
    })

    renderWithProvider(() =>
      h(ToastProvider as unknown as string, null, {
        default: () => h(Trigger),
      }),
    )

    await user.click(screen.getByRole("button", { name: /show toast/i }))

    expect(screen.getByText("Project saved.")).toBeTruthy()
  })
})
