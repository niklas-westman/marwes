/**
 * Shared contract for Dialog purpose components — ConfirmDialog,
 * DestructiveDialog, and InfoDialog canonical semantic attributes.
 */
import type { DialogOptions } from "@marwes-ui/core"
import { describe, expect, it } from "vitest"

export interface DialogContractHarness {
  renderConfirm(): Promise<void> | void
  renderDestructive(): Promise<void> | void
  renderInfo(): Promise<void> | void
  getByRole(role: "dialog", options: { name: RegExp }): HTMLElement
  /** Renders the base Dialog with raw core options, a title, a footer and a close handler. */
  renderDialogOptions(options: DialogOptions): Promise<void> | void
  getDialogRoot(): HTMLElement
}

type DialogOptionCase = {
  options: DialogOptions
  expectRendered: (dialog: HTMLElement) => void
}

// Exhaustive on purpose: a new core DialogOptions field fails to compile until every adapter's
// handling of it is described by a case.
const dialogOptionCases: Record<keyof DialogOptions, DialogOptionCase> = {
  size: {
    options: { size: "large" },
    expectRendered: (dialog) => {
      expect(dialog).toHaveClass("mw-dialog--large")
      expect(dialog).toHaveAttribute("data-size", "large")
    },
  },
  showFooter: {
    options: { showFooter: false },
    expectRendered: (dialog) => expect(dialog).toHaveAttribute("data-footer", "false"),
  },
  dismissible: {
    options: { dismissible: false },
    expectRendered: (dialog) => {
      expect(dialog).toHaveAttribute("data-dismissible", "false")
      expect(dialog.querySelector(".mw-dialog__close")).toBeNull()
    },
  },
  closeLabel: {
    options: { closeLabel: "Stäng" },
    expectRendered: (dialog) =>
      expect(dialog.querySelector(".mw-dialog__close")).toHaveAttribute("aria-label", "Stäng"),
  },
  modal: {
    options: { modal: true },
    expectRendered: (dialog) => expect(dialog).toHaveAttribute("aria-modal", "true"),
  },
  ariaLabel: {
    options: { ariaLabel: "Settings" },
    expectRendered: (dialog) => expect(dialog).toHaveAttribute("aria-label", "Settings"),
  },
  ariaLabelledBy: {
    options: { ariaLabelledBy: "label-id" },
    expectRendered: (dialog) => expect(dialog).toHaveAttribute("aria-labelledby", "label-id"),
  },
  ariaDescribedBy: {
    options: { ariaDescribedBy: "desc-id" },
    expectRendered: (dialog) => expect(dialog).toHaveAttribute("aria-describedby", "desc-id"),
  },
  dataAttributes: {
    options: { dataAttributes: { "data-track": "dlg" } },
    expectRendered: (dialog) => expect(dialog).toHaveAttribute("data-track", "dlg"),
  },
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

    describe("every core option reaches the DOM", () => {
      it.each(Object.entries(dialogOptionCases))("%s", async (_optionName, optionCase) => {
        await harness.renderDialogOptions(optionCase.options)

        const element = harness.getDialogRoot()
        expect(element).toBeInTheDocument()
        optionCase.expectRendered?.(element)
      })
    })
  })
}
