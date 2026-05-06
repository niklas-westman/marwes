import { readFileSync } from "node:fs"
import { resolve } from "node:path"
import { fileURLToPath } from "node:url"
import { describe, expect, it } from "vitest"

const pkgDir = resolve(fileURLToPath(new URL("..", import.meta.url)))
const skeletonCssPath = resolve(pkgDir, "src/firstEdition/skeleton.css")

describe("firstEdition skeleton css contract", () => {
  it("keeps the base fill aligned with the Figma 4% text overlay", () => {
    const css = readFileSync(skeletonCssPath, "utf8")

    expect(css).toContain(
      "--mw-skeleton-base-color: color-mix(in srgb, var(--mw-color-text, #141414) 4%, transparent);",
    )
  })

  it("lifts the skeleton fill against dark mode surfaces", () => {
    const css = readFileSync(skeletonCssPath, "utf8")

    expect(css).toContain(".mw-theme--dark .mw-skeleton")
    expect(css).toContain("var(--mw-color-surface-elevated, #2b2b2b)")
    expect(css).toContain("var(--mw-color-text, #f9fafb) 12%")
  })

  it("supports pulse and wave animation hooks", () => {
    const css = readFileSync(skeletonCssPath, "utf8")

    expect(css).toContain("@keyframes mw-skeleton-pulse")
    expect(css).toContain("@keyframes mw-skeleton-wave")
    expect(css).toContain("prefers-reduced-motion: reduce")
  })
})
