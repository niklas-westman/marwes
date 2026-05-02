import { readFileSync } from "node:fs"
import path from "node:path"
import { describe, expect, it } from "vitest"

const storiesDir = path.resolve(__dirname, "..")

describe("Vue avatar story taxonomy", () => {
  it("keeps the atom story under Avatar/Atom", () => {
    const atomStory = readFileSync(path.join(storiesDir, "avatar.stories.ts"), "utf8")

    expect(atomStory).toContain('title: "Avatar/Atom"')
  })

  it("keeps molecule stories under Avatar/Molecule", () => {
    const avatarBadgeStory = readFileSync(path.join(storiesDir, "avatar-badge.stories.ts"), "utf8")
    const avatarGroupStory = readFileSync(path.join(storiesDir, "avatar-group.stories.ts"), "utf8")

    expect(avatarBadgeStory).toContain('title: "Avatar/Molecule/AvatarBadge"')
    expect(avatarGroupStory).toContain('title: "Avatar/Molecule/AvatarGroup"')
  })

  it("keeps purpose stories under Avatar/Purpose", () => {
    expect(readFileSync(path.join(storiesDir, "profile-avatar.stories.ts"), "utf8")).toContain(
      'title: "Avatar/Purpose/ProfileAvatar"',
    )
    expect(readFileSync(path.join(storiesDir, "presence-avatar.stories.ts"), "utf8")).toContain(
      'title: "Avatar/Purpose/PresenceAvatar"',
    )
    expect(readFileSync(path.join(storiesDir, "team-avatar-group.stories.ts"), "utf8")).toContain(
      'title: "Avatar/Purpose/TeamAvatarGroup"',
    )
  })
})
