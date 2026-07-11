/**
 * Shared contract for the BadgeGroup molecule — group role with
 * visible label and fieldset/legend aria-labelledby wiring.
 */
import { describe, expect, it } from "vitest"

export interface BadgeGroupContractHarness {
  renderBadgeGroup(args?: { label?: string }): Promise<void> | void
  getByRole(role: "group", options: { name: RegExp }): HTMLElement
}

export function runBadgeGroupContract(
  adapterName: string,
  harness: BadgeGroupContractHarness,
): void {
  describe(`BadgeGroup contract: ${adapterName}`, () => {
    it("renders a group role labeled by the visible group label", async () => {
      await harness.renderBadgeGroup({ label: "Project tags" })

      const group = harness.getByRole("group", { name: /project tags/i })
      expect(group.tagName).toBe("FIELDSET")
    })

    it("wires aria-labelledby from the fieldset to the legend text", async () => {
      await harness.renderBadgeGroup({ label: "Status" })

      const group = harness.getByRole("group", { name: /status/i })
      const labelledBy = group.getAttribute("aria-labelledby") ?? ""

      expect(labelledBy.length).toBeGreaterThan(0)

      const labelElement = document.getElementById(labelledBy)
      expect(labelElement).not.toBeNull()
      expect(labelElement?.textContent).toContain("Status")
      expect(labelElement?.querySelector(".mw-text")).toHaveClass("mw-text--caption")
    })
  })
}
