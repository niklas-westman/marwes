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
    expect(css).toContain("gap: var(--mw-spacing-sp-4);")
    expect(css).toContain("box-shadow: inset 0 0 0 1px var(--mw-badge-border);")
    expect(css).toContain("line-height: 16px;")
    expect(css).toContain("letter-spacing: 0;")
  })

  it("seeds light-mode badge colors from semantic theme variables", () => {
    expect(css).toContain(
      ".mw-badge--neutral {\n  --mw-badge-surface: var(--mw-color-surface-subtle, #f5f5f5);\n  --mw-badge-border: var(--mw-color-border-subtle, #d8d8d8);\n  --mw-badge-label: var(--mw-color-text-muted, #595959);\n}",
    )
    expect(css).toContain(
      ".mw-badge--info {\n  --mw-badge-surface: color-mix(in srgb, var(--mw-color-info-base) 12%, var(--mw-color-surface));",
    )
    expect(css).toContain("--mw-badge-label: var(--mw-color-info-base);")
    expect(css).toContain(
      ".mw-badge--success {\n  --mw-badge-surface: color-mix(in srgb, var(--mw-color-success-base) 12%, var(--mw-color-surface));",
    )
    expect(css).toContain("--mw-badge-label: var(--mw-color-success-base);")
    expect(css).toContain(
      ".mw-badge--warning {\n  --mw-badge-surface: color-mix(in srgb, var(--mw-color-warning-base) 16%, var(--mw-color-surface));",
    )
    expect(css).toContain("--mw-badge-label: var(--mw-color-warning-base, #b45309);")
    expect(css).toContain(
      ".mw-badge--error {\n  --mw-badge-surface: color-mix(in srgb, var(--mw-color-danger-base) 12%, var(--mw-color-surface));",
    )
    expect(css).toContain(
      "--mw-badge-label: color-mix(in srgb, var(--mw-color-danger-base) 80%, var(--mw-color-text));",
    )
  })

  it("seeds dark-mode badge colors from semantic theme variables", () => {
    expect(css).toContain(
      ".mw-theme--dark .mw-badge--neutral {\n  --mw-badge-surface: var(--mw-color-surface-subtle);\n  --mw-badge-border: var(--mw-color-border-subtle);\n  --mw-badge-label: var(--mw-color-text-muted);\n}",
    )
    expect(css).toContain(
      ".mw-theme--dark .mw-badge--info {\n  --mw-badge-surface: color-mix(in srgb, var(--mw-color-info-base) 18%, var(--mw-color-surface));",
    )
    expect(css).toContain(
      ".mw-theme--dark .mw-badge--success {\n  --mw-badge-surface: color-mix(in srgb, var(--mw-color-success-base) 18%, var(--mw-color-surface));",
    )
    expect(css).toContain(
      ".mw-theme--dark .mw-badge--warning {\n  --mw-badge-surface: color-mix(in srgb, var(--mw-color-warning-base) 20%, var(--mw-color-surface));",
    )
    expect(css).toContain(
      ".mw-theme--dark .mw-badge--error {\n  --mw-badge-surface: color-mix(in srgb, var(--mw-color-danger-base) 18%, var(--mw-color-surface));",
    )
    expect(css).toContain(
      "--mw-badge-label: color-mix(in srgb, var(--mw-color-danger-base) 70%, var(--mw-color-text));",
    )
  })
})
