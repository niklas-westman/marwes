import { render, screen } from "@testing-library/vue"
import { defineComponent, h } from "vue"
import { runAvatarGroupContract } from "../../../../../../tests/contracts/avatar-group.contract"
import { MarwesProvider } from "../../../provider/marwes-provider"
import { AvatarGroup } from "../avatar-group"

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

runAvatarGroupContract("vue", {
  async renderAvatarGroup(args = {}) {
    renderWithProvider(AvatarGroup, {
      ariaLabel: args.ariaLabel,
      items: [
        { id: "mw", initials: "MW" },
        { id: "nk", initials: "NK" },
        { id: "as", initials: "AS" },
        { id: "guest", type: "icon", ariaLabel: "Guest member" },
      ],
      overflowCount: args.overflowCount,
    })
  },
  getByRole(role, options) {
    return screen.getByRole(role, options)
  },
  queryGroup() {
    return document.querySelector(".mw-avatar-group")
  },
  queryRenderedAvatars() {
    return document.querySelectorAll(".mw-avatar-group .mw-avatar") as NodeListOf<HTMLElement>
  },
})
