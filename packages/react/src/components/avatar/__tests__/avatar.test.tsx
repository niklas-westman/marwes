import { render, screen } from "@testing-library/react"
import type * as React from "react"
import { runAvatarContract } from "../../../../../../tests/contracts/avatar.contract"
import { MarwesProvider } from "../../../provider/marwes-provider"
import { Avatar } from "../avatar"

function renderWithProvider(ui: React.ReactElement) {
  return render(<MarwesProvider>{ui}</MarwesProvider>)
}

runAvatarContract("react", {
  async renderAvatar(args = {}) {
    const avatarProps = {
      ...(args.size !== undefined ? { size: args.size } : {}),
      ...(args.initials !== undefined ? { initials: args.initials } : {}),
      ...(args.src !== undefined ? { src: args.src } : {}),
      ...(args.alt !== undefined ? { alt: args.alt } : {}),
      ...(args.decorative !== undefined ? { decorative: args.decorative } : {}),
    }

    renderWithProvider(<Avatar {...avatarProps} />)
  },
  getByRole(role, options) {
    return screen.getByRole(role, options)
  },
  queryAvatarShell() {
    return document.querySelector(".mw-avatar")
  },
})
