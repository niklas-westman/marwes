/**
 * Shared contract for the AvatarGroup molecule — grouped avatar
 * stack, overflow counter, and default group label fallback.
 */
import type { AvatarGroupOptions } from "@marwes-ui/core"
import { describe, expect, it } from "vitest"

export interface AvatarGroupContractHarness {
  renderAvatarGroup(args?: {
    ariaLabel?: string
    label?: string
    overflowCount?: number
  }): Promise<void> | void
  getByRole(role: "group" | "img", options: { name: RegExp }): HTMLElement
  queryGroup(): HTMLElement | null
  queryRenderedAvatars(): NodeListOf<HTMLElement>
  /** Renders the base AvatarGroup with raw core options and one avatar. */
  renderAvatarGroupOptions(options: AvatarGroupOptions): Promise<void> | void
}

type AvatarGroupOptionCase = {
  options: AvatarGroupOptions
  expectRendered: (group: HTMLElement) => void
}

// Exhaustive on purpose: a new core AvatarGroupOptions field fails to compile until every
// adapter's handling of it is described by a case.
const avatarGroupOptionCases: Record<keyof AvatarGroupOptions, AvatarGroupOptionCase> = {
  overflowCount: {
    options: { overflowCount: 3 },
    expectRendered: (group) =>
      expect(group.querySelector(".mw-avatar-group__counter")).toHaveTextContent("+3"),
  },
  overflowLabel: {
    options: { overflowCount: 3, overflowLabel: "Three others" },
    expectRendered: (group) =>
      expect(group.querySelector(".mw-avatar-group__counter")).toHaveAttribute(
        "aria-label",
        "Three others",
      ),
  },
  ariaLabel: {
    options: { ariaLabel: "Project members" },
    expectRendered: (group) => expect(group).toHaveAttribute("aria-label", "Project members"),
  },
  label: {
    options: { label: "Team" },
    expectRendered: (group) => expect(group).toHaveAttribute("aria-label", "Team"),
  },
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

    it("falls back to Avatar group as the group label when no ariaLabel is provided", async () => {
      await harness.renderAvatarGroup()

      const group = harness.getByRole("group", { name: /avatar group/i })
      expect(group).toBeInTheDocument()
    })

    it("accepts label as an alias for ariaLabel and lets ariaLabel win", async () => {
      await harness.renderAvatarGroup({ label: "Team" })
      expect(harness.getByRole("group", { name: /team/i })).toBeInTheDocument()
    })

    it("prefers ariaLabel over label", async () => {
      await harness.renderAvatarGroup({ ariaLabel: "Project members", label: "Team" })
      expect(harness.getByRole("group", { name: /project members/i })).toBeInTheDocument()
    })

    it("falls back to a default group name", async () => {
      await harness.renderAvatarGroup()
      expect(harness.getByRole("group", { name: /avatar group/i })).toBeInTheDocument()
    })

    describe("every core option reaches the DOM", () => {
      it.each(Object.entries(avatarGroupOptionCases))("%s", async (_optionName, optionCase) => {
        await harness.renderAvatarGroupOptions(optionCase.options)

        const group = harness.queryGroup() as HTMLElement
        expect(group).toBeInTheDocument()
        optionCase.expectRendered(group)
      })
    })
  })
}
