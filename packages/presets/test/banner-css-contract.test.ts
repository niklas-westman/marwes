import { readFileSync } from "node:fs"
import { resolve } from "node:path"
import { fileURLToPath } from "node:url"
import { describe, expect, it } from "vitest"

const pkgDir = resolve(fileURLToPath(new URL("..", import.meta.url)))
const bannerCssPath = resolve(pkgDir, "src/firstEdition/banner.css")

describe("firstEdition banner css contract", () => {
  it("keeps the Figma banner padding valid even when optional spacing tokens are absent", () => {
    const css = readFileSync(bannerCssPath, "utf8")
    const bannerBlock = css.match(/\.mw-banner\s*\{[^}]+\}/)?.[0]

    expect(bannerBlock).toContain(
      "padding: var(--mw-spacing-sp-8, 8px) 12px var(--mw-spacing-sp-8, 8px) 20px;",
    )
    expect(bannerBlock).not.toContain("--mw-spacing-sp-12")
    expect(bannerBlock).not.toContain("--mw-spacing-sp-20")
  })

  it("renders the banner stroke as a bottom rule without theme radius", () => {
    const css = readFileSync(bannerCssPath, "utf8")
    const bannerBlock = css.match(/\.mw-banner\s*\{[^}]+\}/)?.[0]

    expect(bannerBlock).toContain("border: 0;")
    expect(bannerBlock).toContain("border-bottom: 1px solid var(--mw-banner-border);")
    expect(bannerBlock).toContain("border-radius: 0;")
    expect(bannerBlock).not.toContain("--mw-ui-radius")
  })
})
