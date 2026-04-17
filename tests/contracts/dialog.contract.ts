import { describe, expect, it } from "vitest"

export interface DialogContractHarness {
  renderConfirm(): Promise<void> | void
  renderDestructive(): Promise<void> | void
  renderInfo(): Promise<void> | void
  getByRole(role: "dialog", options: { name: RegExp }): HTMLElement
}

export function runDialogContract(adapterName: string, harness: DialogContractHarness): void {
  describe(`Dialog semantic contract: ${adapterName}`, () => {
    it("ConfirmDialog emits canonical confirm semantics", async () => {
      await harness.renderConfirm()

      const dialog = harness.getByRole("dialog", { name: /publish update/i })
      expect(dialog).toHaveAttribute("data-component", "dialog")
      expect(dialog).toHaveAttribute("data-purpose", "confirm-dialog")
      expect(dialog).toHaveAttribute("data-intent", "confirm")
    })

    it("DestructiveDialog emits canonical destructive semantics", async () => {
      await harness.renderDestructive()

      const dialog = harness.getByRole("dialog", { name: /delete workspace/i })
      expect(dialog).toHaveAttribute("data-component", "dialog")
      expect(dialog).toHaveAttribute("data-purpose", "destructive-dialog")
      expect(dialog).toHaveAttribute("data-intent", "destructive")
      expect(dialog).toHaveAttribute("data-destructive", "true")
      expect(dialog).toHaveAttribute("data-confirmation-required", "true")
    })

    it("InfoDialog emits canonical info semantics", async () => {
      await harness.renderInfo()

      const dialog = harness.getByRole("dialog", { name: /maintenance notice/i })
      expect(dialog).toHaveAttribute("data-component", "dialog")
      expect(dialog).toHaveAttribute("data-purpose", "info-dialog")
      expect(dialog).toHaveAttribute("data-intent", "info")
    })
  })
}
