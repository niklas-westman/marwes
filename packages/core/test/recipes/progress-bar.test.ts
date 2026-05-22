import { describe, expect, it } from "vitest"
import { createProgressBarRecipe } from "../../src/components/atoms/progress-bar"

describe("createProgressBarRecipe", () => {
  it("builds a determinate progressbar with label and percentage text", () => {
    const kit = createProgressBarRecipe({ id: "setup-progress", label: "Setup", value: 60 })

    expect(kit.tag).toBe("div")
    expect(kit.className).toContain("mw-progress-bar")
    expect(kit.dataAttributes["data-component"]).toBe("progress-bar")
    expect(kit.dataAttributes["data-size"]).toBe("default")
    expect(kit.a11y.role).toBe("progressbar")
    expect(kit.a11y.ariaValueMin).toBe(0)
    expect(kit.a11y.ariaValueMax).toBe(100)
    expect(kit.a11y.ariaValueNow).toBe(60)
    expect(kit.a11y.ariaLabelledBy).toBe("setup-progress-label")
    expect(kit.labelId).toBe("setup-progress-label")
    expect(kit.percentageLabel).toBe("60%")
    expect(kit.vars["--mw-progress-bar-value-percentage"]).toBe("60%")
  })

  it("clamps values and normalizes invalid bounds", () => {
    const kit = createProgressBarRecipe({ value: 150, min: 10, max: 5 })

    expect(kit.min).toBe(10)
    expect(kit.max).toBe(11)
    expect(kit.value).toBe(11)
    expect(kit.percentage).toBe(100)
    expect(kit.vars["--mw-progress-bar-value-percentage"]).toBe("100%")
  })

  it("supports small hidden-label usage with an explicit accessible name", () => {
    const kit = createProgressBarRecipe({
      value: 25,
      size: "small",
      showLabel: false,
      showPercentage: false,
      ariaLabel: "Upload progress",
    })

    expect(kit.className).toContain("mw-progress-bar--small")
    expect(kit.showLabel).toBe(false)
    expect(kit.showPercentage).toBe(false)
    expect(kit.a11y.ariaLabel).toBe("Upload progress")
  })

  it("supports visual states and disabled metadata", () => {
    const kit = createProgressBarRecipe({
      value: 60,
      state: "pressed",
      disabled: true,
      valueLabel: "60 of 100 steps complete",
    })

    expect(kit.className).toContain("mw-progress-bar--state-pressed")
    expect(kit.className).toContain("mw-progress-bar--disabled")
    expect(kit.dataAttributes["data-disabled"]).toBe("true")
    expect(kit.a11y.ariaDisabled).toBe(true)
    expect(kit.a11y.ariaValueText).toBe("60 of 100 steps complete")
  })
})
