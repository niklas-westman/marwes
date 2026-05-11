/**
 * Vue adapter: Tests the Avatar Badge component — wires the shared cross-adapter contract
 * and verifies adapter-specific rendering concerns.
 */
import { render, screen } from "@testing-library/vue"
import { defineComponent, h } from "vue"
import { runAvatarBadgeContract } from "../../../../../../tests/contracts/avatar-badge.contract"
import { MarwesProvider } from "../../../provider/marwes-provider"
import { AvatarBadge } from "../avatar-badge"

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

runAvatarBadgeContract("vue", {
  async renderAvatarBadge(args = {}) {
    const avatarBadgeProps = {
      ...(args.size !== undefined ? { size: args.size } : {}),
      ...(args.initials !== undefined ? { initials: args.initials } : {}),
      ...(args.decorative !== undefined ? { decorative: args.decorative } : {}),
      ...(args.statusLabel !== undefined ? { statusLabel: args.statusLabel } : {}),
    }

    renderWithProvider(AvatarBadge, avatarBadgeProps)
  },
  getByRole(role, options) {
    return screen.getByRole(role, options)
  },
  queryBadge() {
    return document.querySelector(".mw-avatar-badge")
  },
  queryIndicator() {
    return document.querySelector(".mw-avatar-badge__indicator")
  },
})
