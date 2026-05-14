/**
 * Vue Avatar introduction docs guard — verifies that the
 * Introduction.mdx file documents all expected sections and component references.
 */
import { readFileSync } from "node:fs"
import path from "node:path"
import { describe, expect, it } from "vitest"

describe("Vue avatar introduction docs", () => {
  it("documents the avatar atom, molecules, purpose components, and supported content types", () => {
    const introPath = path.resolve(__dirname, "../Introduction.mdx")
    const introDoc = readFileSync(introPath, "utf8")

    expect(introDoc).toContain("Avatar (Atom)")
    expect(introDoc).toContain("AvatarBadge")
    expect(introDoc).toContain("AvatarGroup")
    expect(introDoc).toContain("ProfileAvatar")
    expect(introDoc).toContain("PresenceAvatar")
    expect(introDoc).toContain("TeamAvatarGroup")
    expect(introDoc).toContain("initials")
    expect(introDoc).toContain("icon")
    expect(introDoc).toContain("image")
    expect(introDoc).toContain("Accessibility notes")
    expect(introDoc).toContain("Image avatars need a name")
    expect(introDoc).toContain("Avatar group")
    expect(introDoc).toContain("decorative")
  })
})
