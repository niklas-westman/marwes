import { readFileSync } from "node:fs"
import { resolve } from "node:path"
import { fileURLToPath } from "node:url"
import { describe, expect, it } from "vitest"

const pkgDir = resolve(fileURLToPath(new URL("..", import.meta.url)))
const paginationCssPath = resolve(pkgDir, "src/firstEdition/pagination.css")

describe("firstEdition pagination css contract", () => {
  it("keeps Figma item dimensions and spacing", () => {
    const css = readFileSync(paginationCssPath, "utf8")

    expect(css).toContain("--mw-pagination-size: 32px;")
    expect(css).toContain("--mw-pagination-radius: 8px;")
    expect(css).toContain("--mw-pagination-gap: 2px;")
    expect(css).toContain("--mw-pagination-section-gap: 12px;")
    expect(css).toContain("--mw-pagination-list-width: 0px;")
    expect(css).toContain("min-width: var(--mw-pagination-size);")
  })

  it("keeps active page on the primary token with white label fallback", () => {
    const css = readFileSync(paginationCssPath, "utf8")
    const selectedBlock = css.match(/\.mw-pagination__page--selected\s*\{[^}]+\}/)?.[0]

    expect(css).toContain("--mw-pagination-active-bg: var(--mw-color-primary-base, #2f31fc);")
    expect(css).toContain("--mw-pagination-active-text: var(--mw-color-primary-label, #ffffff);")
    expect(selectedBlock).toContain("background: var(--mw-pagination-active-bg);")
    expect(selectedBlock).toContain("color: var(--mw-pagination-active-text);")
  })

  it("prevents control icon content from stealing the hit target", () => {
    const css = readFileSync(paginationCssPath, "utf8")

    expect(css).toContain(".mw-pagination__control *")
    expect(css).toContain("pointer-events: none;")
  })

  it("keeps pagination responsive without wrapping controls between rows", () => {
    const css = readFileSync(paginationCssPath, "utf8")

    expect(css).toContain("flex-wrap: nowrap;")
    expect(css).toContain("min-width: var(--mw-pagination-list-width);")
    expect(css).toContain("box-sizing: border-box;")
    expect(css).toContain(".mw-pagination__control-label")
    expect(css).toContain("letter-spacing: 0;")
  })

  it("supports icon-only controls for constrained layouts", () => {
    const css = readFileSync(paginationCssPath, "utf8")

    expect(css).toContain('.mw-pagination[data-control-display="icon"] .mw-pagination__control')
    expect(css).toContain("width: var(--mw-pagination-size);")
    expect(css).toContain("min-width: var(--mw-pagination-size);")
    expect(css).toContain('.mw-pagination[data-control-display="icon"] .mw-pagination__list')
    expect(css).toContain("min-width: 0;")
    expect(css).toContain(
      '.mw-pagination[data-control-display="icon"] .mw-pagination__control-label',
    )
    expect(css).toContain("max-width: 0;")
  })
})
