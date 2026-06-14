/**
 * CSS contract: verifies the firstEdition slider stylesheet.
 */
import { readFileSync } from "node:fs"
import { resolve } from "node:path"
import { fileURLToPath } from "node:url"
import { describe, expect, it } from "vitest"

const pkgDir = resolve(fileURLToPath(new URL("..", import.meta.url)))
const sliderCssPath = resolve(pkgDir, "src/firstEdition/slider.css")
const sliderFieldCssPath = resolve(pkgDir, "src/firstEdition/molecules/slider-field.css")

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

  it("maps the default track to the Figma slider/track token alias", () => {
    const css = readFileSync(sliderCssPath, "utf8")
    const rootBlock = css.match(/\.mw-slider\s*\{[^}]+\}/)?.[0]
    const darkBlock = css.match(/\.mw-theme--dark \.mw-slider\s*\{[^}]+\}/)?.[0]

    expect(rootBlock).toContain("--mw-slider-track-background: var(")
    expect(rootBlock).toContain("--mw-color-border-subtle,")
    expect(darkBlock).toContain("--mw-slider-track-background: var(")
    expect(darkBlock).toContain("--mw-color-border-subtle,")
  })

  it("targets text typography classes for slider field labels, descriptions, edge values, and errors", () => {
    const css = readFileSync(sliderFieldCssPath, "utf8")

    expect(css).toContain(".mw-slider-field__label .mw-text")
    expect(css).toContain(".mw-slider-field__description .mw-text")
    expect(css).toContain(".mw-slider-field__edge-value .mw-text")
    expect(css).toContain(".mw-slider-field__error .mw-text")
    expect(css).toContain(".mw-slider-field--invalid .mw-slider-field__label .mw-text")
    expect(css).toContain(".mw-slider-field--invalid .mw-slider-field__error .mw-text")
    expect(css).not.toContain(".mw-slider-field--invalid .mw-slider-field__label .mw-p")
    expect(css).not.toContain(".mw-slider-field--invalid .mw-slider-field__error .mw-p")
  })
})
