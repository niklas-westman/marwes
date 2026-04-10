import { render, screen } from "@testing-library/react"
import type * as React from "react"
import { runAvatarGroupContract } from "../../../../../../tests/contracts/avatar-group.contract"
import { MarwesProvider } from "../../../provider/marwes-provider"
import { AvatarGroup } from "../avatar-group"

function renderWithProvider(ui: React.ReactElement) {
  return render(<MarwesProvider>{ui}</MarwesProvider>)
}

runAvatarGroupContract("react", {
  async renderAvatarGroup(args = {}) {
    renderWithProvider(
      <AvatarGroup
        {...(args.ariaLabel !== undefined ? { ariaLabel: args.ariaLabel } : {})}
        items={[
          { id: "mw", initials: "MW" },
          { id: "nk", initials: "NK" },
          { id: "as", initials: "AS" },
          { id: "guest", type: "icon", ariaLabel: "Guest member" },
        ]}
        {...(args.overflowCount !== undefined ? { overflowCount: args.overflowCount } : {})}
      />,
    )
  },
  getByRole(role, options) {
    return screen.getByRole(role, options)
  },
  queryGroup() {
    return document.querySelector(".mw-avatar-group")
  },
  queryRenderedAvatars() {
    return document.querySelectorAll(".mw-avatar-group .mw-avatar")
  },
})
