import { describe, expect, it } from "vitest"

export type AvatarSize = "small" | "medium" | "large"

export interface AvatarContractHarness {
  renderAvatar(args?: {
    size?: AvatarSize
    initials?: string
    src?: string
    alt?: string
    ariaLabel?: string
    decorative?: boolean
  }): Promise<void> | void
  getByRole(role: "img", options: { name: RegExp }): HTMLElement
  queryAvatarShell(): HTMLElement | null
}

export function runAvatarContract(adapterName: string, harness: AvatarContractHarness): void {
  describe(`Avatar contract: ${adapterName}`, () => {
    it("renders an icon fallback by default", async () => {
      await harness.renderAvatar()

      const avatarElement = harness.getByRole("img", { name: /avatar/i })
      const avatarShell = harness.queryAvatarShell()

      expect(avatarElement.tagName).toBe("SPAN")
      expect(avatarShell?.className).toContain("mw-avatar")
      expect(avatarShell?.className).toContain("mw-avatar--medium")
      expect(avatarShell).toHaveAttribute("data-type", "icon")
      expect(avatarShell).toHaveAttribute("data-size", "medium")
    })

    it("supports initials content with size variants", async () => {
      await harness.renderAvatar({ initials: " am ", size: "large" })

      const avatarElement = harness.getByRole("img", { name: /am/i })
      const avatarShell = harness.queryAvatarShell()

      expect(avatarElement.textContent).toContain("AM")
      expect(avatarShell?.className).toContain("mw-avatar--large")
      expect(avatarShell).toHaveAttribute("data-type", "initials")
      expect(avatarShell).toHaveAttribute("data-size", "large")
    })

    it("renders image avatars with the provided alt text", async () => {
      await harness.renderAvatar({
        src: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg'/%3E",
        alt: "Alex Morgan",
      })

      const imageElement = harness.getByRole("img", { name: /alex morgan/i })
      const avatarShell = harness.queryAvatarShell()

      expect(imageElement.tagName).toBe("IMG")
      expect(avatarShell).toHaveAttribute("data-type", "image")
    })

    it("supports decorative avatars by hiding the shell from assistive technology", async () => {
      await harness.renderAvatar({ initials: "mw", decorative: true })

      const avatarShell = harness.queryAvatarShell()
      expect(avatarShell).toHaveAttribute("aria-hidden", "true")
    })

    it("uses an explicit ariaLabel to name a non-image avatar when provided", async () => {
      await harness.renderAvatar({ ariaLabel: "Alex Morgan" })

      const avatarElement = harness.getByRole("img", { name: /alex morgan/i })
      expect(avatarElement).toBeInTheDocument()
      expect(avatarElement).toHaveAttribute("aria-label", "Alex Morgan")
    })
  })
}
