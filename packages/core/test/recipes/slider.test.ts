/**
 * Tests the slider recipe's pure output — value clamping, fill percentage
 * calculation, orientation metadata, tooltip/touch-area flags, and a11y passthrough.
 */
import { describe, expect, it } from "vitest"
import { createSliderRecipe } from "../../src/components/atoms/slider/slider-recipe"

describe("createSliderRecipe", () => {
  it("builds slider atom metadata by default", () => {
    const kit = createSliderRecipe()

    expect(kit.tag).toBe("div")
    expect(kit.className).toBe("mw-slider mw-slider--horizontal")
    expect(kit.inputClassName).toBe("mw-slider__native")
    expect(kit.a11y.type).toBe("range")
    expect(kit.a11y.min).toBe(0)
    expect(kit.a11y.max).toBe(100)
    expect(kit.a11y.step).toBe(1)
    expect(kit.value).toBe(50)
    expect(kit.dataAttributes["data-component"]).toBe("slider")
    expect(kit.dataAttributes["data-orientation"]).toBe("horizontal")
    expect(kit.orientation).toBe("horizontal")
    expect(kit.vars["--mw-slider-fill-percentage"]).toBe("50%")
  })

  it("clamps values to the normalized range", () => {
    const kit = createSliderRecipe({ min: 10, max: 30, value: 40 })

    expect(kit.value).toBe(30)
    expect(kit.vars["--mw-slider-fill-percentage"]).toBe("100%")
  })

  it("uses defaultValue when value is not provided", () => {
    const kit = createSliderRecipe({ min: 0, max: 200, defaultValue: 50, step: 5 })

    expect(kit.value).toBe(50)
    expect(kit.a11y.step).toBe(5)
    expect(kit.vars["--mw-slider-fill-percentage"]).toBe("25%")
  })

  it("normalizes invalid max and step values", () => {
    const kit = createSliderRecipe({ min: 20, max: 10, step: 0 })

    expect(kit.a11y.min).toBe(20)
    expect(kit.a11y.max).toBe(20)
    expect(kit.a11y.step).toBe(1)
    expect(kit.value).toBe(20)
    expect(kit.vars["--mw-slider-fill-percentage"]).toBe("0%")
  })

  it("supports tooltip and touch area display flags", () => {
    const kit = createSliderRecipe({ showTooltip: true, showTouchArea: true })

    expect(kit.className).toBe(
      "mw-slider mw-slider--horizontal mw-slider--with-tooltip mw-slider--with-touch-area",
    )
    expect(kit.showTooltip).toBe(true)
    expect(kit.showTouchArea).toBe(true)
    expect(kit.dataAttributes["data-show-tooltip"]).toBe("true")
    expect(kit.dataAttributes["data-show-touch-area"]).toBe("true")
  })

  it("passes through optional accessibility attributes", () => {
    const kit = createSliderRecipe({
      id: "slider-volume",
      name: "volume",
      disabled: true,
      required: true,
      ariaLabel: "Volume",
      ariaLabelledBy: "volume-label",
      ariaDescribedBy: "volume-help",
      ariaValueText: "60 percent",
    })

    expect(kit.className).toBe("mw-slider mw-slider--horizontal mw-slider--disabled")
    expect(kit.a11y.id).toBe("slider-volume")
    expect(kit.a11y.name).toBe("volume")
    expect(kit.a11y.disabled).toBe(true)
    expect(kit.a11y.required).toBe(true)
    expect(kit.a11y.ariaLabel).toBe("Volume")
    expect(kit.a11y.ariaLabelledBy).toBe("volume-label")
    expect(kit.a11y.ariaDescribedBy).toBe("volume-help")
    expect(kit.a11y.ariaValueText).toBe("60 percent")
  })

  it("supports vertical orientation metadata", () => {
    const kit = createSliderRecipe({ orientation: "vertical" })

    expect(kit.className).toBe("mw-slider mw-slider--vertical")
    expect(kit.a11y.ariaOrientation).toBe("vertical")
    expect(kit.dataAttributes["data-orientation"]).toBe("vertical")
    expect(kit.orientation).toBe("vertical")
  })
})
