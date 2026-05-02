import { render, screen } from "@testing-library/vue"
import { describe, expect, it } from "vitest"
import { defineComponent, h } from "vue"
import { MarwesProvider } from "../../../provider/marwes-provider"
import { PresenceAvatar, ProfileAvatar, TeamAvatarGroup } from "../variants"

function renderWithProvider(component: unknown, props: Record<string, unknown> = {}) {
  return render(
    defineComponent({
      setup() {
        return () =>
          h(MarwesProvider, null, {
            default: () => h(component as never, props),
          })
      },
    }),
  )
}

describe("Vue avatar purpose components", () => {
  it("ProfileAvatar adds profile purpose metadata", () => {
    renderWithProvider(ProfileAvatar, { initials: "MW" })

    const avatarElement = screen.getByRole("img", { name: /mw/i })
    expect(avatarElement.getAttribute("data-purpose")).toBe("profile")
    expect(avatarElement.getAttribute("data-component")).toBe("avatar")
  })

  it("PresenceAvatar adds presence purpose metadata", () => {
    renderWithProvider(PresenceAvatar, { initials: "MW" })

    const avatarBadgeElement = screen.getByRole("img", { name: /mw, online/i })
    expect(avatarBadgeElement.getAttribute("data-purpose")).toBe("presence")
    expect(avatarBadgeElement.getAttribute("data-component")).toBe("avatar-badge")
  })

  it("TeamAvatarGroup adds team purpose metadata", () => {
    renderWithProvider(TeamAvatarGroup, {
      ariaLabel: "Project members",
      items: [
        { id: "mw", initials: "MW" },
        { id: "nk", initials: "NK" },
      ],
    })

    const avatarGroupElement = screen.getByRole("group", { name: /project members/i })
    expect(avatarGroupElement.getAttribute("data-purpose")).toBe("team")
    expect(avatarGroupElement.getAttribute("data-component")).toBe("avatar-group")
  })
})
