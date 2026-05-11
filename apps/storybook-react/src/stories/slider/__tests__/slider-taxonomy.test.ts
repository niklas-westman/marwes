/**
 * React Slider story taxonomy guard — verifies that story files
 * use the correct Storybook title hierarchy and that all expected stories exist.
 */
import { readFileSync } from "node:fs"
import path from "node:path"
import { describe, expect, it } from "vitest"

const storiesDir = path.resolve(__dirname, "..")

describe("React slider story taxonomy", () => {
  it("keeps atom, molecule, and purpose stories under the Slider taxonomy", () => {
    const atomStory = readFileSync(path.join(storiesDir, "slider.stories.tsx"), "utf8")
    const moleculeStory = readFileSync(path.join(storiesDir, "slider-field.stories.tsx"), "utf8")
    const volumeStory = readFileSync(path.join(storiesDir, "volume-slider.stories.tsx"), "utf8")
    const brightnessStory = readFileSync(
      path.join(storiesDir, "brightness-slider.stories.tsx"),
      "utf8",
    )
    const radiusStory = readFileSync(path.join(storiesDir, "radius-slider.stories.tsx"), "utf8")

    expect(atomStory).toContain('title: "Slider/Atom"')
    expect(moleculeStory).toContain('title: "Slider/Molecule"')
    expect(volumeStory).toContain('title: "Slider/Purpose/VolumeSlider"')
    expect(brightnessStory).toContain('title: "Slider/Purpose/BrightnessSlider"')
    expect(radiusStory).toContain('title: "Slider/Purpose/RadiusSlider"')
  })
})
