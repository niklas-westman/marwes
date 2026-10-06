/**
 * Shared contract for the AvatarBadge molecule — online status
 * default, initials with custom status labels, and decorative mode.
 */
import type { AvatarBadgeOptions } from "@marwes-ui/core"
import { describe, expect, it } from "vitest"

export type AvatarBadgeSize = "small" | "medium" | "large"

export interface AvatarBadgeContractHarness {
  renderAvatarBadge(args?: {
    size?: AvatarBadgeSize
    initials?: string
    decorative?: boolean
    statusLabel?: string
  }): Promise<void> | void
  getByRole(role: "img", options: { name: RegExp }): HTMLElement
  queryBadge(): HTMLElement | null
  queryIndicator(): HTMLElement | null
  /** Renders the base AvatarBadge with raw core options. */
  renderAvatarBadgeOptions(options: AvatarBadgeOptions): Promise<void> | void
}

type AvatarBadgeOptionCase = {
  options: AvatarBadgeOptions
  expectRendered: (badge: HTMLElement) => void
}

// Exhaustive on purpose: a new core AvatarBadgeOptions field (including every AvatarOptions field
// it extends) fails to compile until every adapter's handling of it is described by a case.
const avatarBadgeOptionCases: Record<keyof AvatarBadgeOptions, AvatarBadgeOptionCase> = {
  size: {
    options: { size: "large" },
    expectRendered: (badge) => expect(badge).toHaveAttribute("data-size", "large"),
  },
  type: {
    options: { type: "icon", initials: "mw" },
    expectRendered: (badge) =>
      expect(badge.querySelector('[data-component="avatar"]')).toHaveAttribute("data-type", "icon"),
  },
  initials: {
    options: { initials: "mw" },
    expectRendered: (badge) => expect(badge).toHaveTextContent("MW"),
  },
  src: {
    options: { src: "/ann.png", alt: "Ann" },
    expectRendered: (badge) =>
      expect(badge.querySelector("img")).toHaveAttribute("src", "/ann.png"),
  },
  alt: {
    options: { src: "/ann.png", alt: "Ann" },
    expectRendered: (badge) => expect(badge).toHaveAttribute("aria-label", "Ann, Online"),
  },
  iconName: {
    options: { iconName: "plus" },
    expectRendered: (badge) => expect(badge.querySelector("svg")).not.toBeNull(),
  },
  decorative: {
    options: { decorative: true },
    expectRendered: (badge) => expect(badge).toHaveAttribute("aria-hidden", "true"),
  },
  ariaLabel: {
    options: { initials: "mw", ariaLabel: "Account owner" },
    expectRendered: (badge) => expect(badge).toHaveAttribute("aria-label", "Account owner, Online"),
  },
  label: {
    options: { initials: "mw", label: "Ann Marie" },
    expectRendered: (badge) => expect(badge).toHaveAttribute("aria-label", "Ann Marie, Online"),
  },
  statusLabel: {
    options: { initials: "mw", statusLabel: "Away" },
    expectRendered: (badge) => expect(badge).toHaveAttribute("aria-label", "MW, Away"),
  },
}

export function runAvatarBadgeContract(
  adapterName: string,
  harness: AvatarBadgeContractHarness,
): void {
  describe(`AvatarBadge contract: ${adapterName}`, () => {
    it("renders an online avatar badge by default", async () => {
      await harness.renderAvatarBadge()

      const avatarBadgeElement = harness.getByRole("img", { name: /avatar, online/i })
      const avatarBadgeShell = harness.queryBadge()
      const indicator = harness.queryIndicator()

      expect(avatarBadgeElement.tagName).toBe("SPAN")
      expect(avatarBadgeShell?.className).toContain("mw-avatar-badge")
      expect(avatarBadgeShell).toHaveAttribute("data-status", "online")
      expect(indicator?.className).toContain("mw-avatar-badge__indicator")
    })

    it("supports initials content, custom status labels, and size variants", async () => {
      await harness.renderAvatarBadge({
        size: "large",
        initials: "mw",
        statusLabel: "Available",
      })

      const avatarBadgeElement = harness.getByRole("img", { name: /mw, available/i })
      const avatarBadgeShell = harness.queryBadge()

      expect(avatarBadgeElement.textContent).toContain("MW")
      expect(avatarBadgeShell?.className).toContain("mw-avatar-badge--large")
      expect(avatarBadgeShell).toHaveAttribute("data-size", "large")
    })

    it("supports decorative avatar badges", async () => {
      await harness.renderAvatarBadge({ decorative: true })

      const avatarBadgeShell = harness.queryBadge()
      expect(avatarBadgeShell).toHaveAttribute("aria-hidden", "true")
    })

    describe("every core option reaches the DOM", () => {
      it.each(Object.entries(avatarBadgeOptionCases))("%s", async (_optionName, optionCase) => {
        await harness.renderAvatarBadgeOptions(optionCase.options)

        const badge = harness.queryBadge() as HTMLElement
        expect(badge).toBeInTheDocument()
        optionCase.expectRendered(badge)
      })
    })
  })
}
