import { readFileSync } from "node:fs"
import { resolve } from "node:path"
import { fileURLToPath } from "node:url"
import { describe, expect, it } from "vitest"

const pkgDir = resolve(fileURLToPath(new URL("..", import.meta.url)))
const tabCssPath = resolve(pkgDir, "src/firstEdition/tab.css")
const tabGroupCssPath = resolve(pkgDir, "src/firstEdition/molecules/tab-group.css")

describe("firstEdition tab css contract", () => {
  it("keeps the Figma interaction states explicit in component-scoped vars", () => {
    const css = readFileSync(tabCssPath, "utf8")

    expect(css).toContain("--mw-tab-surface-hover")
    expect(css).toContain("--mw-tab-surface-pressed")
    expect(css).toContain(".mw-tab:active:not(:disabled):not(.mw-tab--disabled)")
    expect(css).toContain("border-bottom-color: var(--mw-tab-indicator-disabled);")
    expect(css).toContain("--mw-tab-indicator: #5859fc;")
  })

  it("uses the shared divider treatment for the tab list baseline", () => {
    const css = readFileSync(tabGroupCssPath, "utf8")

    expect(css).toContain(
      "border-bottom: 1px solid color-mix(in srgb, var(--mw-color-text, #141414) 20%, transparent);",
    )
  })
})
