import { describe, expect, it } from "vitest"

export interface BadgeContractHarness {
  renderStatus(): Promise<void> | void
  renderPriority(): Promise<void> | void
  renderNotification(): Promise<void> | void
  renderBadgeWithAriaLabel(): Promise<void> | void
  getByText(text: string): HTMLElement
}

export function runBadgeContract(adapterName: string, harness: BadgeContractHarness): void {
  describe(`Badge semantic contract: ${adapterName}`, () => {
    it("StatusBadge emits canonical status semantics", async () => {
      await harness.renderStatus()

      const badge = harness.getByText("Active")
      expect(badge).toHaveAttribute("data-component", "badge")
      expect(badge).toHaveAttribute("data-purpose", "status")
    })

    it("PriorityBadge emits canonical priority semantics", async () => {
      await harness.renderPriority()

      const badge = harness.getByText("Critical")
      expect(badge).toHaveAttribute("data-component", "badge")
      expect(badge).toHaveAttribute("data-purpose", "priority")
    })

    it("NotificationBadge emits canonical notification semantics", async () => {
      await harness.renderNotification()

      const badge = harness.getByText("5")
      expect(badge).toHaveAttribute("data-component", "badge")
      expect(badge).toHaveAttribute("data-purpose", "notification")
    })

    it("ariaLabel flows to aria-label in the DOM for numeric badge content", async () => {
      await harness.renderBadgeWithAriaLabel()

      const badge = harness.getByText("5")
      expect(badge).toHaveAttribute("aria-label", "5 unread messages")
    })
  })
}
