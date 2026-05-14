/**
 * Svelte adapter: Tests Avatar, AvatarBadge, and AvatarGroup components —
 * base class, size prop, image rendering, and group overflow.
 */
import { render } from "@testing-library/svelte"
import { describe, expect, it } from "vitest"
import Avatar from "../lib/components/avatar/Avatar.svelte"
import AvatarBadge from "../lib/components/avatar/AvatarBadge.svelte"
import AvatarGroup from "../lib/components/avatar/AvatarGroup.svelte"

describe("Avatar", () => {
  it("includes mw-avatar class", () => {
    const { container } = render(Avatar, { props: { initials: "NW" } })
    const el = container.querySelector(".mw-avatar")
    expect(el).not.toBeNull()
  })

  it("renders initials text", () => {
    const { container } = render(Avatar, { props: { initials: "NW" } })
    expect(container.textContent).toContain("NW")
  })

  it("sets data-component attribute", () => {
    const { container } = render(Avatar, { props: { initials: "NW" } })
    const el = container.querySelector('[data-component="avatar"]')
    expect(el).not.toBeNull()
  })

  it("applies size modifier class", () => {
    const { container } = render(Avatar, { props: { initials: "NW", size: "lg" } })
    const el = container.querySelector(".mw-avatar")
    expect(el?.className).toContain("mw-avatar--lg")
  })

  it("sets aria-hidden when decorative", () => {
    const { container } = render(Avatar, { props: { initials: "NW", decorative: true } })
    const el = container.querySelector(".mw-avatar")
    expect(el?.getAttribute("aria-hidden")).toBe("true")
  })

  it("sets role=img when ariaLabel is provided", () => {
    const { container } = render(Avatar, { props: { initials: "NW", ariaLabel: "Niklas" } })
    const el = container.querySelector('[role="img"]')
    expect(el).not.toBeNull()
    expect(el?.getAttribute("aria-label")).toBe("Niklas")
  })
})

describe("AvatarBadge", () => {
  it("includes mw-avatar-badge class", () => {
    const { container } = render(AvatarBadge)
    const el = container.querySelector(".mw-avatar-badge")
    expect(el).not.toBeNull()
  })
})

describe("AvatarGroup", () => {
  it("includes mw-avatar-group class", () => {
    const { container } = render(AvatarGroup, { props: { items: [] } })
    const el = container.querySelector(".mw-avatar-group")
    expect(el).not.toBeNull()
  })
})
