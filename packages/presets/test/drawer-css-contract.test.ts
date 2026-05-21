/**
 * CSS contract: verifies the firstEdition drawer stylesheet.
 */
import { readFileSync } from "node:fs"
import { resolve } from "node:path"
import { fileURLToPath } from "node:url"
import { describe, expect, it } from "vitest"

const pkgDir = resolve(fileURLToPath(new URL("..", import.meta.url)))
const drawerCssPath = resolve(pkgDir, "src/firstEdition/drawer.css")
const stylesCssPath = resolve(pkgDir, "src/firstEdition/styles.css")

describe("firstEdition drawer css contract", () => {
  it("imports drawer css from the preset entrypoint", () => {
    const css = readFileSync(stylesCssPath, "utf8")

    expect(css).toContain('@import "./drawer.css";')
  })

  it("keeps Figma drawer widths as component variables", () => {
    const css = readFileSync(drawerCssPath, "utf8")

    expect(css).toContain("--mw-drawer-width-small: 320px;")
    expect(css).toContain("--mw-drawer-width-medium: 400px;")
    expect(css).toContain("--mw-drawer-width-large: 560px;")
  })

  it("maps drawer color and radius styling to theme variables", () => {
    const css = readFileSync(drawerCssPath, "utf8")

    expect(css).toContain("--mw-drawer-surface: var(--mw-color-surface")
    expect(css).toContain("--mw-drawer-border: var(--mw-color-border-subtle")
    expect(css).toContain("--mw-drawer-title: var(--mw-color-text);")
    expect(css).toContain("--mw-drawer-radius: calc(var(--mw-ui-radius")
    expect(css).toContain("font-family: var(--mw-font-primary, inherit);")
    expect(css).toContain("outline: 2px solid var(--mw-color-focus);")
  })

  it("keeps panel, scrim, and slot selectors stable", () => {
    const css = readFileSync(drawerCssPath, "utf8")

    expect(css).toContain(".mw-drawer__scrim")
    expect(css).toContain(".mw-drawer__panel")
    expect(css).toContain(".mw-drawer__header")
    expect(css).toContain(".mw-drawer__content")
    expect(css).toContain(".mw-drawer__footer")
  })
})
