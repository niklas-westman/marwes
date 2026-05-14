/**
 * Shared contract for the AvatarBadge molecule — online status
 * default, initials with custom status labels, and decorative mode.
 */
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
  })
}
