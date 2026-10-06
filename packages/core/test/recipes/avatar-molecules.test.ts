/**
 * Tests the AvatarGroup, AvatarBadge and BadgeGroup recipes that own the molecules' a11y.
 */
import { describe, expect, it } from "vitest"
import {
  createAvatarBadgeRecipe,
  createAvatarGroupRecipe,
  createBadgeGroupRecipe,
} from "../../src/components/atoms"

describe("createAvatarGroupRecipe", () => {
  it("names the group from ariaLabel, then label, then a default", () => {
    expect(createAvatarGroupRecipe({ ariaLabel: "A", label: "B" }).a11y.ariaLabel).toBe("A")
    expect(createAvatarGroupRecipe({ label: "B" }).a11y.ariaLabel).toBe("B")
    expect(createAvatarGroupRecipe().a11y.ariaLabel).toBe("Avatar group")
  })

  it("shows the overflow counter only for a positive count and labels it", () => {
    expect(createAvatarGroupRecipe().counter.visible).toBe(false)
    expect(createAvatarGroupRecipe({ overflowCount: 0 }).counter.visible).toBe(false)

    const kit = createAvatarGroupRecipe({ overflowCount: 3 })
    expect(kit.counter).toEqual({
      visible: true,
      text: "+3",
      a11y: { role: "img", ariaLabel: "3 more people" },
    })
    expect(
      createAvatarGroupRecipe({ overflowCount: 3, overflowLabel: "Others" }).counter.a11y,
    ).toEqual({
      role: "img",
      ariaLabel: "Others",
    })
  })
})

describe("createAvatarBadgeRecipe", () => {
  it("composes the accessible name from the avatar name and status", () => {
    expect(createAvatarBadgeRecipe({ initials: "mw" }).a11y).toEqual({
      role: "img",
      ariaLabel: "MW, Online",
    })
    expect(createAvatarBadgeRecipe({ initials: "mw", statusLabel: "Away" }).a11y.ariaLabel).toBe(
      "MW, Away",
    )
    expect(createAvatarBadgeRecipe({ src: "/a.png", alt: "Ann" }).a11y.ariaLabel).toBe(
      "Ann, Online",
    )
  })

  it("hides decorative badges instead of naming them", () => {
    expect(createAvatarBadgeRecipe({ initials: "mw", decorative: true }).a11y).toEqual({
      ariaHidden: true,
    })
  })
})

describe("createBadgeGroupRecipe", () => {
  it("labels the group by its legend id", () => {
    expect(createBadgeGroupRecipe({ id: "tags" })).toMatchObject({
      labelId: "tags-label",
      a11y: { ariaLabelledBy: "tags-label" },
    })
  })
})
