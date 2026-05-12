/**
 * CSS contract: verifies the firstEdition badge stylesheet.
 */
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
    expect(css).toContain("--mw-badge-gap: 4px;")
    expect(css).toContain("--mw-badge-padding-x: 8px;")
    expect(css).toContain("--mw-badge-padding-y: 2px;")
    expect(css).toContain("--mw-badge-font-family: var(--mw-font-primary, inherit);")
    expect(css).toContain("font-family: var(--mw-badge-font-family);")
    expect(css).toContain("gap: var(--mw-badge-gap);")
    expect(css).toContain("box-shadow: inset 0 0 0 1px var(--mw-badge-border);")
    expect(css).toContain("line-height: var(--mw-badge-line-height);")
    expect(css).toContain("letter-spacing: 0;")
  })

  it("seeds light-mode badge colors from semantic theme variables", () => {
    expect(css).toContain(
      ".mw-badge--neutral {\n  --mw-badge-surface: var(--mw-color-surface-subtle, #f5f5f5);\n  --mw-badge-border: var(--mw-color-border-subtle, #d8d8d8);\n  --mw-badge-label: var(--mw-color-text-muted, #595959);\n}",
    )
    expect(css).toContain(
      ".mw-badge--info {\n  --mw-badge-surface: var(--mw-color-status-info-background, #eeeeff);\n  --mw-badge-border: var(--mw-color-status-info-border, #ababfd);\n  --mw-badge-label: var(--mw-color-status-info-text, #1b1d97);\n}",
    )
    expect(css).toContain(
      ".mw-badge--success {\n  --mw-badge-surface: var(--mw-color-status-success-background, #e6f4ed);\n  --mw-badge-border: var(--mw-color-status-success-border, #90caad);\n  --mw-badge-label: var(--mw-color-status-success-text, #006633);\n}",
    )
    expect(css).toContain(
      ".mw-badge--warning {\n  --mw-badge-surface: var(--mw-color-status-warning-background, #fff8e6);\n  --mw-badge-border: var(--mw-color-status-warning-border, #fde08a);\n  --mw-badge-label: var(--mw-color-status-warning-text, #b45309);\n}",
    )
    expect(css).toContain(
      ".mw-badge--error {\n  --mw-badge-surface: var(--mw-color-status-error-background, #ffe8eb);\n  --mw-badge-border: var(--mw-color-status-error-border, #ff8a95);\n  --mw-badge-label: var(--mw-color-status-error-text, #a8031f);\n}",
    )
  })

  it("seeds dark-mode badge colors from semantic theme variables", () => {
    expect(css).toContain(
      ".mw-theme--dark .mw-badge--neutral {\n  --mw-badge-surface: var(--mw-color-surface-subtle);\n  --mw-badge-border: var(--mw-color-border-subtle);\n  --mw-badge-label: var(--mw-color-text-muted);\n}",
    )
    expect(css).toContain(
      ".mw-theme--dark .mw-badge--info {\n  --mw-badge-surface: var(--mw-color-status-info-background, #040519);\n  --mw-badge-border: var(--mw-color-status-info-border, #8182fc);\n  --mw-badge-label: var(--mw-color-status-info-text, #ababfd);\n}",
    )
    expect(css).toContain(
      ".mw-theme--dark .mw-badge--success {\n  --mw-badge-surface: var(--mw-color-status-success-background, #001a0c);\n  --mw-badge-border: var(--mw-color-status-success-border, #5db189);\n  --mw-badge-label: var(--mw-color-status-success-text, #90caad);\n}",
    )
    expect(css).toContain(
      ".mw-theme--dark .mw-badge--warning {\n  --mw-badge-surface: var(--mw-color-status-warning-background, #221004);\n  --mw-badge-border: var(--mw-color-status-warning-border, #e46f00);\n  --mw-badge-label: var(--mw-color-status-warning-text, #fcc94a);\n}",
    )
    expect(css).toContain(
      ".mw-theme--dark .mw-badge--error {\n  --mw-badge-surface: var(--mw-color-status-error-background, #240006);\n  --mw-badge-border: var(--mw-color-status-error-border, #ff2847);\n  --mw-badge-label: var(--mw-color-status-error-text, #ff5566);\n}",
    )
  })
})
