import { describe, expect, it } from "vitest"
import {
  type FieldWiringHarness,
  runFieldWiringUpdatesContract,
} from "./field-wiring-updates.contract"

export interface GroupFieldWiringHarness extends FieldWiringHarness {
  getMembers(group: HTMLElement): HTMLElement[]
}

export function runGroupFieldWiringUpdatesContract(
  adapter: string,
  field: string,
  h: GroupFieldWiringHarness,
): void {
  runFieldWiringUpdatesContract(adapter, field, h)
  describe(`${field} group wiring: ${adapter}`, () => {
    it("hydrates one named group and one shared error for multiple controls", async () => {
      const props = {
        label: "Billing contact",
        helper: "Choose a contact",
        error: "Choose at least one",
      }
      expect(await h.hydrate(props)).toEqual([])
      const group = h.getControl(props.label)
      expect(group.getAttribute("aria-labelledby")).toBeTruthy()
      const members = h.getMembers(group)
      expect(members.length).toBeGreaterThanOrEqual(2)
      for (const member of members) expect(group).toContainElement(member)
      const errorTargets = (group.getAttribute("aria-describedby") ?? "")
        .split(/\s+/)
        .filter(Boolean)
        .map((id) => document.getElementById(id))
        .filter((element) => element?.textContent?.includes(props.error))
      expect(errorTargets).toHaveLength(1)
      expect(document.querySelectorAll('[aria-live="polite"]')).toHaveLength(1)
    })
  })
}
