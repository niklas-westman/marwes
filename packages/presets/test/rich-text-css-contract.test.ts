/**
 * CSS contract: verifies the firstEdition rich text stylesheet.
 */
import { readFileSync } from "node:fs"
import { resolve } from "node:path"
import { fileURLToPath } from "node:url"
import { describe, expect, it } from "vitest"

const pkgDir = resolve(fileURLToPath(new URL("..", import.meta.url)))
const richTextCssPath = resolve(pkgDir, "src/firstEdition/rich-text.css")

describe("firstEdition rich text css contract", () => {
  it("lets rich text editors adapt to wrapper width", () => {
    const css = readFileSync(richTextCssPath, "utf8")

    expect(css).not.toContain("width: 260px;")
    expect(css).toContain("box-sizing: border-box;")
    expect(css).toContain("width: 100%;")
    expect(css).toContain("min-width: 0;")
    expect(css).toContain("max-width: 100%;")
  })
})
