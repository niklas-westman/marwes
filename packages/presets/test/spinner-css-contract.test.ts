/**
 * CSS contract: verifies the firstEdition spinner stylesheet
 * seeds theme colors, rotation animation, cross variant behavior,
 * and reduced-motion slow-not-stop policy.
 */
import { readFileSync } from "node:fs"
import { resolve } from "node:path"
import { fileURLToPath } from "node:url"
import { describe, expect, it } from "vitest"

const pkgDir = resolve(fileURLToPath(new URL("..", import.meta.url)))
const spinnerCssPath = resolve(pkgDir, "src/firstEdition/spinner.css")

describe("firstEdition spinner css contract", () => {
  it("seeds indicator color from semantic theme variable and a fixed track color", () => {
    const css = readFileSync(spinnerCssPath, "utf8")

    expect(css).toContain("--mw-spinner-track-color: #a3a3a3;")
    expect(css).toContain("--mw-spinner-indicator-color: var(--mw-color-primary-base, #2f31fc);")
  })

  it("rotates the svg shell for the standard variants", () => {
    const css = readFileSync(spinnerCssPath, "utf8")

    expect(css).toContain(
      "animation: mw-spinner-rotate var(--mw-spinner-rotation-duration) linear infinite;",
    )
    expect(css).toContain("@keyframes mw-spinner-rotate")
  })

  it("keeps the cross variant stationary and shifts segment color instead", () => {
    const css = readFileSync(spinnerCssPath, "utf8")

    expect(css).toContain(".mw-spinner--cross .mw-spinner__svg")
    expect(css).toContain("animation: none;")
    expect(css).toContain("@keyframes mw-spinner-cross-shift")
    expect(css).toContain("animation: mw-spinner-cross-shift var(--mw-spinner-rotation-duration)")
    expect(css).toContain(".mw-spinner--cross .mw-spinner__svg rect:nth-child(4)")
  })

  it("slows spinner motion under prefers-reduced-motion rather than stopping it", () => {
    const css = readFileSync(spinnerCssPath, "utf8")

    // The shipped policy is slow-not-stop: 800ms normal → 1600ms reduced-motion.
    // This is an intentional design choice. Product teams should pair spinners in
    // reduced-motion environments with sufficient visible loading text.
    expect(css).toContain("@media (prefers-reduced-motion: reduce)")
    expect(css).toContain("animation-duration: 1600ms")
    expect(css).toContain(".mw-spinner--cross .mw-spinner__svg rect")
  })
})
