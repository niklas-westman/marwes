import { render, screen } from "@testing-library/vue"
import { defineComponent, h } from "vue"
import { runAvatarContract } from "../../../../../../tests/contracts/avatar.contract"
import { MarwesProvider } from "../../../provider/marwes-provider"
import { Avatar } from "../avatar"

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

runAvatarContract("vue", {
  async renderAvatar(args = {}) {
    const avatarProps = {
      ...(args.size !== undefined ? { size: args.size } : {}),
      ...(args.initials !== undefined ? { initials: args.initials } : {}),
      ...(args.src !== undefined ? { src: args.src } : {}),
      ...(args.alt !== undefined ? { alt: args.alt } : {}),
      ...(args.ariaLabel !== undefined ? { ariaLabel: args.ariaLabel } : {}),
      ...(args.decorative !== undefined ? { decorative: args.decorative } : {}),
    }

    renderWithProvider(Avatar, avatarProps)
  },
  getByRole(role, options) {
    return screen.getByRole(role, options)
  },
  queryAvatarShell() {
    return document.querySelector(".mw-avatar")
  },
})
