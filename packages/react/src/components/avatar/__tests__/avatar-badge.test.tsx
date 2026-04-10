import { render, screen } from "@testing-library/react"
import type * as React from "react"
import { runAvatarBadgeContract } from "../../../../../../tests/contracts/avatar-badge.contract"
import { MarwesProvider } from "../../../provider/marwes-provider"
import { AvatarBadge } from "../avatar-badge"

function renderWithProvider(ui: React.ReactElement) {
  return render(<MarwesProvider>{ui}</MarwesProvider>)
}

runAvatarBadgeContract("react", {
  async renderAvatarBadge(args = {}) {
    const avatarBadgeProps = {
      ...(args.size !== undefined ? { size: args.size } : {}),
      ...(args.initials !== undefined ? { initials: args.initials } : {}),
      ...(args.decorative !== undefined ? { decorative: args.decorative } : {}),
      ...(args.statusLabel !== undefined ? { statusLabel: args.statusLabel } : {}),
    }

    renderWithProvider(<AvatarBadge {...avatarBadgeProps} />)
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
