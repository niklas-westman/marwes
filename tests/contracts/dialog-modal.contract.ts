import { describe, expect, it } from "vitest"

export type DialogModalContractHarness = {
  renderOpenDialogModal(args?: {
    title?: string
    description?: string
    ariaLabel?: string
    dismissible?: boolean
    showFooter?: boolean
    closeOnEscape?: boolean
    closeOnScrimClick?: boolean
    includeInput?: boolean
    onOpenChange?: (open: boolean) => void
  }): Promise<void> | void
  renderTriggerDialogModal(args?: {
    title?: string
    description?: string
    restoreFocus?: boolean
    closeOnScrimClick?: boolean
  }): Promise<void> | void
  getByRole(
    role: "dialog" | "button" | "textbox",
    options?: { name?: RegExp | string },
  ): HTMLElement
  queryByRole(
    role: "dialog" | "button" | "textbox",
    options?: { name?: RegExp | string },
  ): HTMLElement | null
  getScrim(): HTMLElement
  click(element: HTMLElement): Promise<void>
  tab(options?: { shift?: boolean }): Promise<void>
  keyboard(text: string): Promise<void>
  waitFor(assertion: () => void): Promise<void>
}

export function runDialogModalContract(
  adapterName: string,
  harness: DialogModalContractHarness,
): void {
  describe(`DialogModal contract: ${adapterName}`, () => {
    it("renders a named modal dialog with description wiring", async () => {
      await harness.renderOpenDialogModal({
        title: "Archive project",
        description: "Archiving hides the project from active views.",
      })

      const dialog = harness.getByRole("dialog", { name: /archive project/i })

      expect(dialog).toHaveAttribute("aria-modal", "true")
      expect(dialog.getAttribute("aria-describedby")).toContain("description")
      expect(harness.getByRole("button", { name: /close dialog/i })).toBeInTheDocument()
    })

    it("falls back to aria-label when no visible title is provided", async () => {
      await harness.renderOpenDialogModal({
        ariaLabel: "Unsaved changes",
        dismissible: false,
        showFooter: false,
      })

      const dialog = harness.getByRole("dialog", { name: /unsaved changes/i })

      expect(dialog).toHaveAttribute("aria-label", "Unsaved changes")
      expect(dialog).not.toHaveAttribute("aria-labelledby")
    })

    it("moves initial focus to the first focusable element in the dialog", async () => {
      await harness.renderOpenDialogModal({
        title: "Rename workspace",
        dismissible: false,
        showFooter: false,
        includeInput: true,
      })

      const textbox = harness.getByRole("textbox", { name: /workspace name/i })

      await harness.waitFor(() => {
        expect(document.activeElement).toBe(textbox)
      })
    })

    it("falls back to focusing the dialog surface when there are no focusable children", async () => {
      await harness.renderOpenDialogModal({
        title: "Maintenance notice",
        dismissible: false,
        showFooter: false,
      })

      const dialog = harness.getByRole("dialog", { name: /maintenance notice/i })

      await harness.waitFor(() => {
        expect(document.activeElement).toBe(dialog)
      })
    })

    it("traps focus within the modal surface", async () => {
      await harness.renderOpenDialogModal({
        title: "Delete workspace",
        dismissible: false,
      })

      const cancelButton = harness.getByRole("button", { name: /cancel/i })
      const confirmButton = harness.getByRole("button", { name: /confirm/i })

      await harness.waitFor(() => {
        expect(document.activeElement).toBe(cancelButton)
      })

      await harness.tab()
      expect(document.activeElement).toBe(confirmButton)

      await harness.tab()
      expect(document.activeElement).toBe(cancelButton)

      await harness.tab({ shift: true })
      expect(document.activeElement).toBe(confirmButton)
    })

    it("keeps controlled open state as the source of truth while emitting one close request", async () => {
      const emittedValues: boolean[] = []

      await harness.renderOpenDialogModal({
        title: "Rename workspace",
        includeInput: true,
        onOpenChange: (open) => {
          emittedValues.push(open)
        },
      })

      await harness.keyboard("{Escape}")

      expect(emittedValues).toEqual([false])
      expect(harness.getByRole("dialog", { name: /rename workspace/i })).toBeInTheDocument()
    })

    it("supports scrim dismissal and restores focus to the trigger", async () => {
      await harness.renderTriggerDialogModal({
        title: "Invite teammate",
        description: "Send an email invitation.",
      })

      const trigger = harness.getByRole("button", { name: /open dialog/i })
      trigger.focus()

      await harness.click(trigger)
      expect(harness.getByRole("dialog", { name: /invite teammate/i })).toBeInTheDocument()

      await harness.click(harness.getScrim())

      await harness.waitFor(() => {
        expect(harness.queryByRole("dialog", { name: /invite teammate/i })).toBeNull()
        expect(document.activeElement).toBe(trigger)
      })
    })
  })
}
