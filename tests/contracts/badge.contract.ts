/**
 * Shared contract for Badge purpose components — StatusBadge, PriorityBadge,
 * and NotificationBadge canonical semantics, plus ariaLabel passthrough.
 */
import type { BadgeOptions } from "@marwes-ui/core"
import { describe, expect, it } from "vitest"

export interface BadgeContractHarness {
  renderStatus(): Promise<void> | void
  renderPriority(): Promise<void> | void
  renderNotification(): Promise<void> | void
  renderBadgeWithAriaLabel(): Promise<void> | void
  /** Renders the base Badge with raw core options, bypassing purpose wrappers. */
  renderBadge(options: BadgeOptions, text: string): Promise<void> | void
  getBadgeElement(): HTMLElement
  getByText(text: string): HTMLElement
}

type BadgeOptionCase = {
  options: BadgeOptions
  expectRendered: (badge: HTMLElement) => void
}

// Exhaustive on purpose: a new core BadgeOptions field fails to compile until every adapter's
// handling of it is described by a case.
const badgeOptionCases: Record<keyof BadgeOptions, BadgeOptionCase> = {
  variant: {
    options: { variant: "success" },
    expectRendered: (badge) => {
      expect(badge).toHaveClass("mw-badge--success")
      expect(badge).toHaveAttribute("data-variant", "success")
    },
  },
  ariaLabel: {
    options: { ariaLabel: "5 unread messages" },
    expectRendered: (badge) => expect(badge).toHaveAttribute("aria-label", "5 unread messages"),
  },
  label: {
    options: { label: "5 unread messages" },
    expectRendered: (badge) => expect(badge).toHaveAttribute("aria-label", "5 unread messages"),
  },
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

    describe("every core option reaches the DOM", () => {
      it.each(Object.entries(badgeOptionCases))("%s", async (_optionName, optionCase) => {
        await harness.renderBadge(optionCase.options, "5")

        const badge = harness.getBadgeElement()
        expect(badge).toBeInTheDocument()
        optionCase.expectRendered(badge)
      })

      it("prefers ariaLabel over label", async () => {
        await harness.renderBadge({ ariaLabel: "From aria", label: "From label" }, "5")

        expect(harness.getBadgeElement()).toHaveAttribute("aria-label", "From aria")
      })
    })
  })
}
