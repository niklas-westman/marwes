import { describe, expect, it } from "vitest"

export interface ToastContractHarness {
  renderSuccess(): Promise<void> | void
  renderError(): Promise<void> | void
  renderWarning(): Promise<void> | void
  renderInfo(): Promise<void> | void
  getByRole(role: "status" | "alert"): HTMLElement
}

export function runToastContract(adapterName: string, harness: ToastContractHarness): void {
  describe(`Toast semantic contract: ${adapterName}`, () => {
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
  })
}
