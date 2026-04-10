import { readFileSync } from "node:fs"
import { resolve } from "node:path"
import { fileURLToPath } from "node:url"
import { describe, expect, it } from "vitest"

const badgeCssPath = resolve(
  fileURLToPath(new URL("..", import.meta.url)),
  "src/firstEdition/badge.css",
)

describe("badge.css figma sync contract", () => {
  const css = readFileSync(badgeCssPath, "utf8")

  it("keeps the live Figma source references in the file header", () => {
    expect(css).toContain(".figma/marwes/components/checkboxbadge.json")
    expect(css).toContain(".figma/marwes/pages/-badge/-badge_1364-11603.json")
    expect(css).toContain(".figma/marwes/pages/-badge/-badge-dark_2276-56582.json")
  })

  it("matches the validated badge layout metrics", () => {
    expect(css).toContain("font-family: var(--mw-font-primary, inherit);")
    expect(css).toContain("gap: var(--mw-spacing-xxs);")
    expect(css).toContain("box-shadow: inset 0 0 0 1px var(--mw-badge-border);")
    expect(css).toContain("line-height: 16px;")
    expect(css).toContain("letter-spacing: 0;")
  })

  it("matches the validated light-mode semantic badge colors", () => {
    expect(css).toContain(
      ".mw-badge--neutral {\n  --mw-badge-surface: #f3f4f6;\n  --mw-badge-border: #e5e7eb;\n  --mw-badge-label: #595959;\n}",
    )
    expect(css).toContain(
      ".mw-badge--info {\n  --mw-badge-surface: #eeeeff;\n  --mw-badge-border: #ababfd;\n  --mw-badge-label: #1b1d97;\n}",
    )
    expect(css).toContain(
      ".mw-badge--success {\n  --mw-badge-surface: #e6f4ed;\n  --mw-badge-border: #90caad;\n  --mw-badge-label: #006633;\n}",
    )
    expect(css).toContain(
      ".mw-badge--warning {\n  --mw-badge-surface: #fff8e6;\n  --mw-badge-border: #fde08a;\n  --mw-badge-label: #b45309;\n}",
    )
    expect(css).toContain(
      ".mw-badge--error {\n  --mw-badge-surface: #ffe8eb;\n  --mw-badge-border: #ff8a95;\n  --mw-badge-label: #a8031f;\n}",
    )
  })

  it("matches the validated dark-mode semantic badge colors", () => {
    expect(css).toContain(
      ".mw-theme--dark .mw-badge--neutral {\n  --mw-badge-surface: #000000;\n  --mw-badge-border: #474747;\n  --mw-badge-label: #a3a3a3;\n}",
    )
    expect(css).toContain(
      ".mw-theme--dark .mw-badge--info {\n  --mw-badge-surface: #040519;\n  --mw-badge-border: #8182fc;\n  --mw-badge-label: #8182fc;\n}",
    )
    expect(css).toContain(
      ".mw-theme--dark .mw-badge--success {\n  --mw-badge-surface: #001a0c;\n  --mw-badge-border: #5db189;\n  --mw-badge-label: #90caad;\n}",
    )
    expect(css).toContain(
      ".mw-theme--dark .mw-badge--warning {\n  --mw-badge-surface: #221004;\n  --mw-badge-border: #e46f00;\n  --mw-badge-label: #fcc94a;\n}",
    )
    expect(css).toContain(
      ".mw-theme--dark .mw-badge--error {\n  --mw-badge-surface: #240006;\n  --mw-badge-border: #ff2847;\n  --mw-badge-label: #ff5566;\n}",
    )
  })
})
