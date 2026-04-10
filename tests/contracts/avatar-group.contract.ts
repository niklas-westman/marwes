import { describe, expect, it } from "vitest"

export interface AvatarGroupContractHarness {
  renderAvatarGroup(args?: {
    ariaLabel?: string
    overflowCount?: number
  }): Promise<void> | void
  getByRole(role: "group" | "img", options: { name: RegExp }): HTMLElement
  queryGroup(): HTMLElement | null
  queryRenderedAvatars(): NodeListOf<HTMLElement>
}

export function runAvatarGroupContract(
  adapterName: string,
  harness: AvatarGroupContractHarness,
): void {
  describe(`AvatarGroup contract: ${adapterName}`, () => {
    it("renders a grouped stack of avatars", async () => {
      await harness.renderAvatarGroup({ ariaLabel: "Project members" })

      const avatarGroupElement = harness.getByRole("group", { name: /project members/i })
      const renderedAvatars = harness.queryRenderedAvatars()

      expect(avatarGroupElement.tagName).toBe("FIELDSET")
      expect(avatarGroupElement.className).toContain("mw-avatar-group")
      expect(renderedAvatars).toHaveLength(4)
    })

    it("renders an overflow counter when requested", async () => {
      await harness.renderAvatarGroup({ overflowCount: 3 })

      const overflowCounter = harness.getByRole("img", { name: /3 more people/i })
      const avatarGroupElement = harness.queryGroup()

      expect(overflowCounter.textContent).toContain("+3")
      expect(avatarGroupElement).toHaveAttribute("data-component", "avatar-group")
    })
  })
}
