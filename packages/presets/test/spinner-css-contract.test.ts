import { readFileSync } from "node:fs"
import { resolve } from "node:path"
import { fileURLToPath } from "node:url"
import { describe, expect, it } from "vitest"

const pkgDir = resolve(fileURLToPath(new URL("..", import.meta.url)))
const spinnerCssPath = resolve(pkgDir, "src/firstEdition/spinner.css")

describe("firstEdition spinner css contract", () => {
  it("keeps light and dark indicator colors aligned with the synced Spinner showcases", () => {
    const css = readFileSync(spinnerCssPath, "utf8")

    expect(css).toContain("--mw-spinner-indicator-color: #2f31fc;")
    expect(css).toContain(".mw-theme--dark .mw-spinner")
    expect(css).toContain("--mw-spinner-indicator-color: #5859fc;")
  })

  it("animates the svg shell with a single rotation keyframe", () => {
    const css = readFileSync(spinnerCssPath, "utf8")

    expect(css).toContain(
      "animation: mw-spinner-rotate var(--mw-spinner-rotation-duration) linear infinite;",
    )
    expect(css).toContain("@keyframes mw-spinner-rotate")
  })
})
