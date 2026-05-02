import { readFileSync } from "node:fs"
import { resolve } from "node:path"
import { fileURLToPath } from "node:url"
import { describe, expect, it } from "vitest"

const pkgDir = resolve(fileURLToPath(new URL("..", import.meta.url)))
const dialogCssPath = resolve(pkgDir, "src/firstEdition/dialog.css")

describe("firstEdition dialog css contract", () => {
  it("keeps dialog vertical rhythm compact and content typography aligned", () => {
    const css = readFileSync(dialogCssPath, "utf8")

    expect(css).not.toContain("min-height: 64px;")
    expect(css).not.toContain("min-height: 72px;")
    expect(css).not.toContain("gap: 16px;")
    expect(css).toContain(".mw-dialog__description,\n.mw-dialog__content .mw-p")
    expect(css).toContain("letter-spacing: 0;")
  })
})
