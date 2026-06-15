import { readFileSync } from "node:fs"
import { resolve } from "node:path"
import { fileURLToPath } from "node:url"
import { describe, expect, it } from "vitest"

const pkgDir = resolve(fileURLToPath(new URL("..", import.meta.url)))
const contextMenuCssPath = resolve(pkgDir, "src/firstEdition/context-menu.css")

describe("firstEdition context menu css contract", () => {
  it("provides a transient pressed item state distinct from hover", () => {
    const css = readFileSync(contextMenuCssPath, "utf8")

    expect(css).toContain("--mw-context-menu-hover: var(--mw-color-surface-subtle, #f5f5f5);")
    expect(css).toContain(
      "--mw-context-menu-active: color-mix(in srgb, var(--mw-color-text) 10%, transparent);",
    )
    expect(css).toContain(".mw-context-menu__item:active:not(:disabled)")
    expect(css).toContain("background: var(--mw-context-menu-active);")
  })

  it("keeps dark mode pressed feedback stronger than dark hover feedback", () => {
    const css = readFileSync(contextMenuCssPath, "utf8")
    const darkBlock = css.match(/\.mw-theme--dark \.mw-context-menu\s*\{[^}]+\}/)?.[0]

    expect(darkBlock).toContain(
      "--mw-context-menu-hover: color-mix(in srgb, var(--mw-color-background) 10%, transparent);",
    )
    expect(darkBlock).toContain(
      "--mw-context-menu-active: color-mix(in srgb, var(--mw-color-background) 18%, transparent);",
    )
  })
})
