import { readFileSync } from "node:fs"
import { resolve } from "node:path"
import { fileURLToPath } from "node:url"
import { describe, expect, it } from "vitest"

const pkgDir = resolve(fileURLToPath(new URL("..", import.meta.url)))
const sliderCssPath = resolve(pkgDir, "src/firstEdition/slider.css")

describe("firstEdition slider css contract", () => {
  it("keeps the tooltip absolutely aligned two pixels from the touch area", () => {
    const css = readFileSync(sliderCssPath, "utf8")

    expect(css).toContain("--mw-slider-touch-area-size: 32px;")
    expect(css).toContain("--mw-slider-tooltip-gap: 2px;")
    expect(css).toContain("bottom: calc(100% + var(--mw-slider-tooltip-gap));")
    expect(css).toContain("position: absolute;")
  })

  it("reveals the tooltip only while the slider is actively sliding", () => {
    const css = readFileSync(sliderCssPath, "utf8")

    expect(css).toContain(".mw-slider__native:active ~ .mw-slider__tooltip")
    expect(css).toContain(".mw-slider--state-pressed .mw-slider__tooltip")
    expect(css).not.toContain(".mw-slider__native:hover ~ .mw-slider__tooltip")
    expect(css).not.toContain(".mw-slider__native:focus-visible ~ .mw-slider__tooltip")
    expect(css).not.toContain(".mw-slider--state-hover .mw-slider__tooltip")
    expect(css).not.toContain(".mw-slider--state-focus .mw-slider__tooltip")
  })
})
