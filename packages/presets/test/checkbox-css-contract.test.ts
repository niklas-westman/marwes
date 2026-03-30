import { readFileSync } from "node:fs"
import { resolve } from "node:path"
import { fileURLToPath } from "node:url"
import { describe, expect, it } from "vitest"

const pkgDir = resolve(fileURLToPath(new URL("..", import.meta.url)))
const checkboxCssPath = resolve(pkgDir, "src/firstEdition/checkbox.css")

describe("firstEdition checkbox css contract", () => {
  it("uses the primary label token for the checked indicator", () => {
    const css = readFileSync(checkboxCssPath, "utf8")

    expect(css).toContain("--mw-checkbox-check: var(--mw-color-primary-label);")
  })
})
