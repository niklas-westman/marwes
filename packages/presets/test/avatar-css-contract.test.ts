/**
 * CSS contract: verifies the firstEdition avatar stylesheet.
 */
import { readFileSync } from "node:fs"
import { dirname, resolve } from "node:path"
import { fileURLToPath } from "node:url"
import { describe, expect, it } from "vitest"

const __dirname = dirname(fileURLToPath(import.meta.url))
const avatarCssPath = resolve(__dirname, "../src/firstEdition/avatar.css")

describe("avatar.css figma sync contract", () => {
  const css = readFileSync(avatarCssPath, "utf8")

  it("tracks the synced Figma avatar references", () => {
    expect(css).toContain(".figma/marwes/components/avatar.json")
    expect(css).toContain(".figma/marwes/components/avatar-badge.json")
    expect(css).toContain(".figma/marwes/pages/-avatar/-avatar_1574-27460.json")
    expect(css).toContain(".figma/marwes/pages/-avatar/-avatar-dark_1574-27570.json")
  })

  it("matches AvatarBadge indicator sizing and placement", () => {
    expect(css).toContain("--mw-avatar-badge-indicator-size: 8px;")
    expect(css).toContain("--mw-avatar-badge-indicator-size: 10px;")
    expect(css).toContain("--mw-avatar-badge-indicator-size: 12px;")
    expect(css).toContain("right: -1px;")
    expect(css).toContain("bottom: -1px;")
    expect(css).toContain("border: 2px solid var(--mw-color-surface, #f9fafb);")
  })

  it("matches standalone and grouped icon avatar surfaces", () => {
    expect(css).toContain(
      ".mw-avatar--icon {\n  --mw-avatar-surface: var(--mw-color-surface-primary, #ffffff);\n  --mw-avatar-border-width: 1px;\n  --mw-avatar-border-color: var(--mw-color-border-full, #000000);",
    )
    expect(css).toContain("--mw-avatar-surface: var(--mw-color-surface-elevated, #2b2b2b);")
    expect(css).toContain("--mw-avatar-border-color: var(--mw-color-border-full, #ffffff);")
    expect(css).toContain(
      ".mw-avatar-group__item > .mw-avatar--icon {\n  --mw-avatar-surface: var(--mw-color-surface, #f8f8f8);\n  --mw-avatar-border-width: 0px;\n  --mw-avatar-border-color: transparent;",
    )
  })

  it("keeps image avatars on the primary fallback in dark mode", () => {
    expect(css).toContain("--mw-avatar-image-fallback: var(--mw-color-primary-base, #5859fc);")
  })

  it("matches AvatarGroup overlap, outside stroke, and counter metrics", () => {
    expect(css).toContain("--mw-avatar-group-overlap: 12px;")
    expect(css).toContain("--mw-avatar-group-stroke: var(--mw-color-surface-elevated, #ffffff);")
    expect(css).toContain("--mw-avatar-group-stroke-width: 2px;")
    expect(css).toContain(
      "--mw-avatar-group-counter-surface: var(--mw-color-surface-inverted, #141414);",
    )
    expect(css).toContain("--mw-avatar-group-counter-stroke: var(--mw-avatar-group-stroke);")
    expect(css).toContain(
      "--mw-avatar-group-counter-label: var(--mw-color-text-inverted, #ffffff);",
    )
    expect(css).toContain("margin-left: calc(var(--mw-avatar-group-overlap) * -1);")
    expect(css).toContain(
      "box-shadow: 0 0 0 var(--mw-avatar-group-stroke-width) var(--mw-avatar-group-counter-stroke);",
    )
    expect(css).toContain(
      ".mw-theme--dark .mw-avatar-group {\n  --mw-avatar-group-stroke: var(--mw-avatar-group-dark-stroke, #000000);",
    )
    expect(css).toContain("line-height: 12px;")
  })
})
