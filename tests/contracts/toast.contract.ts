/**
 * Shared contract for Toast components — polite/assertive live region
 * semantics, dismiss button accessibility, and purpose toast variants
 * (Success, Error, Warning, Info) with canonical semantic attributes.
 */
import { describe, expect, it, vi } from "vitest"

export interface ToastDeliverySpec {
  id: string
  children: string
  intent?: "neutral" | "info" | "success" | "warning" | "error" | "brand"
  duration?: number | null
}

export interface ToastContractHarness {
  renderRawToast(args?: {
    children?: string
    ariaLive?: "polite" | "assertive"
    dismissible?: boolean
  }): Promise<void> | void
  renderSuccess(): Promise<void> | void
  renderError(): Promise<void> | void
  renderWarning(): Promise<void> | void
  renderInfo(): Promise<void> | void
  renderContainer(args: {
    toasts: ToastDeliverySpec[]
    maxVisible?: number
    onDismiss?: (id: string) => void
  }): Promise<void> | void
  renderProvider(args: {
    toast: Omit<ToastDeliverySpec, "id">
    defaultDuration?: number | null
  }): Promise<void> | void
  getByRole(role: "status" | "alert" | "button", options?: { name?: RegExp | string }): HTMLElement
  getByText(text: string): HTMLElement
  queryByText(text: string): HTMLElement | null
  getContainerItemByText(text: string): HTMLElement
  click(element: HTMLElement): Promise<void> | void
  hover(element: HTMLElement): Promise<void> | void
  unhover(element: HTMLElement): Promise<void> | void
  focus(element: HTMLElement): Promise<void> | void
  blur(element: HTMLElement): Promise<void> | void
  advanceTime(ms: number): Promise<void> | void
}

export function runToastContract(adapterName: string, harness: ToastContractHarness): void {
  describe(`Toast contract: ${adapterName}`, () => {
    it("raw Toast defaults to polite status semantics", async () => {
      await harness.renderRawToast()

      const toast = harness.getByRole("status")

      expect(toast).toHaveAttribute("data-component", "toast")
      expect(toast).toHaveAttribute("aria-live", "polite")
      expect(toast).toHaveAttribute("aria-atomic", "true")
      expect(harness.getByText("Project saved.")).toBeInTheDocument()
    })

    it("raw Toast maps assertive announcements to alert semantics", async () => {
      await harness.renderRawToast({
        children: "Publishing failed.",
        ariaLive: "assertive",
      })

      const toast = harness.getByRole("alert")

      expect(toast).toHaveAttribute("data-component", "toast")
      expect(toast).toHaveAttribute("aria-live", "assertive")
    })

    it("dismissible raw Toast renders a dismiss button with an accessible name", async () => {
      await harness.renderRawToast({
        dismissible: true,
      })

      expect(harness.getByRole("button", { name: /dismiss/i })).toBeInTheDocument()
    })

    it("SuccessToast emits canonical success semantics", async () => {
      await harness.renderSuccess()

      const toast = harness.getByRole("status")
      expect(toast).toHaveAttribute("data-component", "toast")
      expect(toast).toHaveAttribute("data-purpose", "success-toast")
      expect(toast).toHaveAttribute("data-intent", "success")
    })

    it("ErrorToast emits canonical error semantics", async () => {
      await harness.renderError()

      const toast = harness.getByRole("alert")
      expect(toast).toHaveAttribute("data-component", "toast")
      expect(toast).toHaveAttribute("data-purpose", "error-toast")
      expect(toast).toHaveAttribute("data-intent", "error")
    })

    it("WarningToast emits canonical warning semantics", async () => {
      await harness.renderWarning()

      const toast = harness.getByRole("status")
      expect(toast).toHaveAttribute("data-component", "toast")
      expect(toast).toHaveAttribute("data-purpose", "warning-toast")
      expect(toast).toHaveAttribute("data-intent", "warning")
    })

    it("InfoToast emits canonical info semantics", async () => {
      await harness.renderInfo()

      const toast = harness.getByRole("status")
      expect(toast).toHaveAttribute("data-component", "toast")
      expect(toast).toHaveAttribute("data-purpose", "info-toast")
      expect(toast).toHaveAttribute("data-intent", "info")
    })

    it("ToastContainer keeps only the newest toasts when maxVisible is set", async () => {
      await harness.renderContainer({
        maxVisible: 2,
        toasts: [
          { id: "toast-1", children: "Draft saved.", intent: "success", duration: null },
          { id: "toast-2", children: "Storage is almost full.", intent: "warning", duration: null },
          { id: "toast-3", children: "Publishing failed.", intent: "error", duration: null },
        ],
      })

      expect(harness.queryByText("Draft saved.")).toBeNull()
      expect(harness.getByText("Storage is almost full.")).toBeInTheDocument()
      expect(harness.getByText("Publishing failed.")).toBeInTheDocument()
    })

    it("ToastContainer forwards primitive neutral and brand intents without promoting them into purpose toasts", async () => {
      await harness.renderContainer({
        toasts: [
          { id: "toast-1", children: "Neutral message.", intent: "neutral", duration: null },
          { id: "toast-2", children: "Brand message.", intent: "brand", duration: null },
        ],
      })

      const neutralToast = harness.getByText("Neutral message.").closest("[role='status']")
      const brandToast = harness.getByText("Brand message.").closest("[role='status']")

      expect(neutralToast).toHaveAttribute("data-intent", "neutral")
      expect(neutralToast).not.toHaveAttribute("data-purpose")
      expect(brandToast).toHaveAttribute("data-intent", "brand")
      expect(brandToast).not.toHaveAttribute("data-purpose")
    })

    it("ToastContainer forwards dismiss clicks with the toast id", async () => {
      const dismissedIds: string[] = []

      await harness.renderContainer({
        onDismiss: (id) => {
          dismissedIds.push(id)
        },
        toasts: [{ id: "toast-1", children: "Project saved.", duration: null }],
      })

      await harness.click(harness.getByRole("button", { name: /dismiss/i }))

      expect(dismissedIds).toEqual(["toast-1"])
    })

    it("auto-dismiss pauses while a toast is hovered and resumes with the remaining time after pointer leaves", async () => {
      vi.useFakeTimers()

      try {
        const dismissedIds: string[] = []

        await harness.renderContainer({
          onDismiss: (id) => {
            dismissedIds.push(id)
          },
          toasts: [{ id: "toast-1", children: "Project saved.", duration: 100 }],
        })

        await harness.advanceTime(40)
        await harness.hover(harness.getContainerItemByText("Project saved."))
        await harness.advanceTime(200)

        expect(dismissedIds).toEqual([])

        await harness.unhover(harness.getContainerItemByText("Project saved."))
        await harness.advanceTime(59)

        expect(dismissedIds).toEqual([])

        await harness.advanceTime(1)

        expect(dismissedIds).toEqual(["toast-1"])
      } finally {
        vi.useRealTimers()
      }
    })

    it("auto-dismiss pauses while focus is inside the toast and resumes after focus leaves", async () => {
      vi.useFakeTimers()

      try {
        const dismissedIds: string[] = []

        await harness.renderContainer({
          onDismiss: (id) => {
            dismissedIds.push(id)
          },
          toasts: [{ id: "toast-1", children: "Project saved.", duration: 100 }],
        })

        await harness.advanceTime(40)

        const dismissButton = harness.getByRole("button", { name: /dismiss/i })
        await harness.focus(dismissButton)
        await harness.advanceTime(200)

        expect(dismissedIds).toEqual([])

        await harness.blur(dismissButton)
        await harness.advanceTime(59)

        expect(dismissedIds).toEqual([])

        await harness.advanceTime(1)

        expect(dismissedIds).toEqual(["toast-1"])
      } finally {
        vi.useRealTimers()
      }
    })

    it("ToastProvider defaults provider-managed toasts to a 4000ms auto-dismiss", async () => {
      vi.useFakeTimers()

      try {
        await harness.renderProvider({
          toast: { children: "Project saved." },
        })

        expect(harness.getByText("Project saved.")).toBeInTheDocument()

        await harness.advanceTime(3999)
        expect(harness.getByText("Project saved.")).toBeInTheDocument()

        await harness.advanceTime(1)
        expect(harness.queryByText("Project saved.")).toBeNull()
      } finally {
        vi.useRealTimers()
      }
    })

    it("ToastProvider keeps duration null toasts visible until product code dismisses them", async () => {
      vi.useFakeTimers()

      try {
        await harness.renderProvider({
          toast: { children: "Workspace archived.", duration: null },
        })

        expect(harness.getByText("Workspace archived.")).toBeInTheDocument()

        await harness.advanceTime(5000)

        expect(harness.getByText("Workspace archived.")).toBeInTheDocument()
      } finally {
        vi.useRealTimers()
      }
    })
  })
}
