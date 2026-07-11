import { readFileSync } from "node:fs"
import { resolve } from "node:path"
import { fileURLToPath } from "node:url"
import { describe, expect, it } from "vitest"

const pkgDir = resolve(fileURLToPath(new URL("..", import.meta.url)))
const breadcrumbCssPath = resolve(pkgDir, "src/firstEdition/breadcrumb.css")
const stylesCssPath = resolve(pkgDir, "src/firstEdition/styles.css")

describe("firstEdition breadcrumb css contract", () => {
  it("keeps Figma typography and icon dimensions", () => {
    const css = readFileSync(breadcrumbCssPath, "utf8")

    expect(css).toContain("--mw-breadcrumb-font-size: 12px;")
    expect(css).toContain("--mw-breadcrumb-line-height: 12px;")
    expect(css).toContain("--mw-breadcrumb-letter-spacing: -0.36px;")
    expect(css).toContain("--mw-breadcrumb-home-size: 14px;")
    expect(css).toContain("--mw-breadcrumb-separator-size: 12px;")
    expect(css).toContain("--mw-breadcrumb-separator-padding: 6px;")
    expect(css).toContain("--mw-breadcrumb-row-gap: 4px;")
    expect(css).toContain("row-gap: var(--mw-breadcrumb-row-gap);")
  })

  it("maps Figma colors to semantic theme variables", () => {
    const css = readFileSync(breadcrumbCssPath, "utf8")

    expect(css).toContain("--mw-breadcrumb-link: var(--mw-color-text-muted, #595959);")
    expect(css).toContain("--mw-breadcrumb-link-hover: var(--mw-color-text, #141414);")
    expect(css).toContain("--mw-breadcrumb-current: var(--mw-color-text, #141414);")
    expect(css).toContain("--mw-breadcrumb-icon: var(--mw-color-text, #141414);")
    expect(css).toContain(".mw-breadcrumb__action:visited")
  })

  it("is imported by the firstEdition stylesheet", () => {
    const css = readFileSync(stylesCssPath, "utf8")

    expect(css).toContain('@import "./breadcrumb.css";')
  })
})
