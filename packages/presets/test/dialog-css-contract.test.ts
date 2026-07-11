/**
 * CSS contract: verifies the firstEdition dialog stylesheet.
 */
import { readFileSync } from "node:fs"
import { resolve } from "node:path"
import { fileURLToPath } from "node:url"
import { describe, expect, it } from "vitest"

const pkgDir = resolve(fileURLToPath(new URL("..", import.meta.url)))
const dialogCssPath = resolve(pkgDir, "src/firstEdition/dialog.css")
const dialogModalCssPath = resolve(pkgDir, "src/firstEdition/molecules/dialog-modal.css")

describe("firstEdition dialog css contract", () => {
  it("keeps dialog vertical rhythm compact and content typography aligned", () => {
    const css = readFileSync(dialogCssPath, "utf8")

    expect(css).not.toContain("min-height: 64px;")
    expect(css).not.toContain("min-height: 72px;")
    expect(css).not.toContain("gap: 16px;")
    expect(css).toContain(".mw-dialog__description,\n.mw-dialog__content .mw-p")
    expect(css).toContain("letter-spacing: -0.48px;")
  })

  it("exposes modal surface width, tone, and divider hooks", () => {
    const css = readFileSync(dialogModalCssPath, "utf8")

    expect(css).toContain('.mw-dialog-modal[data-surface-width="custom"]')
    expect(css).toContain("--mw-dialog-width: var(--mw-dialog-surface-width);")
    expect(css).toContain('.mw-dialog-modal[data-tone="calm"] .mw-dialog-modal__scrim')
    expect(css).toContain('.mw-dialog-modal[data-divider="hidden"] .mw-dialog__header-divider')
    expect(css).toContain("display: none;")
  })
})
