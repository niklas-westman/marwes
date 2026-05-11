/**
 * Vue Slider introduction docs guard — verifies that the
 * Introduction.mdx file documents all expected sections and component references.
 */
import { readFileSync } from "node:fs"
import path from "node:path"
import { describe, expect, it } from "vitest"

describe("Vue slider introduction docs", () => {
  it("documents the slider atom and PDF-aligned features", () => {
    const introPath = path.resolve(__dirname, "../Introduction.mdx")
    const introDoc = readFileSync(introPath, "utf8")

    const expectedContent = [
      "Slider",
      "SliderField (Molecule)",
      "Slider (Atom)",
      "VolumeSlider",
      "BrightnessSlider",
      "RadiusSlider",
      'type="range"',
      "showTooltip",
      "showTouchArea",
      "onValueChange",
      "SliderField",
      "Component Reference",
    ]

    for (const value of expectedContent) {
      expect(introDoc).toContain(value)
    }
  })
})
