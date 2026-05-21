import { readFileSync } from "node:fs"
import { resolve } from "node:path"
import { fileURLToPath } from "node:url"
import { describe, expect, it } from "vitest"

const pkgDir = resolve(fileURLToPath(new URL("..", import.meta.url)))
const segmentedControlCssPath = resolve(pkgDir, "src/firstEdition/segmented-control.css")

describe("firstEdition segmented-control css contract", () => {
  it("keeps nested item content from stealing the button hit target", () => {
    const css = readFileSync(segmentedControlCssPath, "utf8")

    expect(css).toContain(".mw-segmented-control__item *")
    expect(css).toContain("pointer-events: none;")
    expect(css).not.toContain(".mw-segmented-control__item > *")
  })

  it("keeps inverse track borders on the neutral border token", () => {
    const css = readFileSync(segmentedControlCssPath, "utf8")
    const inverseBlock = css.match(/\.mw-segmented-control--inverse\s*\{[^}]+\}/)?.[0]

    expect(inverseBlock).toContain("--mw-sc-track-border: var(--mw-color-border, #d8d8d8);")
    expect(inverseBlock).not.toContain("--mw-sc-track-border: var(--mw-color-surface-inverted")
  })

  it("keeps icon-only items square without text padding", () => {
    const css = readFileSync(segmentedControlCssPath, "utf8")
    const iconOnlyBlock = css.match(/\.mw-segmented-control__item--icon-only\s*\{[^}]+\}/)?.[0]

    expect(iconOnlyBlock).toContain("flex: 0 0 var(--mw-sc-height);")
    expect(iconOnlyBlock).toContain("width: var(--mw-sc-height);")
    expect(iconOnlyBlock).toContain("padding: 0;")
  })

  it("uses theme text for hover instead of selected text", () => {
    const css = readFileSync(segmentedControlCssPath, "utf8")
    const hoverBlock = css.match(
      /\.mw-segmented-control__item:hover:not\(:disabled\):not\(\.mw-segmented-control__item--disabled\):not\(\.mw-segmented-control__item--selected\)\s*\{[^}]+\}/,
    )?.[0]

    expect(css).toContain("--mw-sc-item-hover-text: var(--mw-color-text, #141414);")
    expect(hoverBlock).toContain("color: var(--mw-sc-item-hover-text);")
    expect(hoverBlock).not.toContain("color: var(--mw-sc-item-active-text);")
  })
})
