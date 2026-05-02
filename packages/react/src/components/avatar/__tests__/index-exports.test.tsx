import { AvatarSize, AvatarType } from "@marwes-ui/core"
import { describe, expect, it } from "vitest"
import * as avatarComponents from ".."
import * as publicApi from "../../../index"

describe("avatar barrel exports", () => {
  it("exports the complete avatar domain surface", () => {
    expect(avatarComponents.Avatar).toBeDefined()
    expect(avatarComponents.AvatarBadge).toBeDefined()
    expect(avatarComponents.AvatarGroup).toBeDefined()
    expect(avatarComponents.ProfileAvatar).toBeDefined()
    expect(avatarComponents.PresenceAvatar).toBeDefined()
    expect(avatarComponents.TeamAvatarGroup).toBeDefined()
    expect(avatarComponents.AvatarSize).toBe(AvatarSize)
    expect(avatarComponents.AvatarType).toBe(AvatarType)
  })

  it("re-exports the same avatar symbols from the package root", () => {
    expect(publicApi.Avatar).toBe(avatarComponents.Avatar)
    expect(publicApi.AvatarBadge).toBe(avatarComponents.AvatarBadge)
    expect(publicApi.AvatarGroup).toBe(avatarComponents.AvatarGroup)
    expect(publicApi.ProfileAvatar).toBe(avatarComponents.ProfileAvatar)
    expect(publicApi.PresenceAvatar).toBe(avatarComponents.PresenceAvatar)
    expect(publicApi.TeamAvatarGroup).toBe(avatarComponents.TeamAvatarGroup)
    expect(publicApi.AvatarSize).toBe(AvatarSize)
    expect(publicApi.AvatarType).toBe(AvatarType)
  })
})
