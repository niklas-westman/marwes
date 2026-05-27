/**
 * Svelte adapter: Tests the Slider atom — range input rendering,
 * class, value binding, min/max, and disabled state.
 */
import { fireEvent, render } from "@testing-library/svelte"
import { describe, expect, it } from "vitest"
import Slider from "../lib/components/slider/Slider.svelte"
import SliderFieldContractFixture from "./type-fixtures/SliderFieldContractFixture.svelte"
import SliderPurposeFixture from "./type-fixtures/SliderPurposeFixture.svelte"

describe("Slider", () => {
  it("renders an input with type range", () => {
    const { container } = render(Slider, { props: { ariaLabel: "Volume" } })
    const input = container.querySelector('input[type="range"]')
    expect(input).not.toBeNull()
  })

  it("includes mw-slider class", () => {
    const { container } = render(Slider, { props: { ariaLabel: "Volume" } })
    const el = container.querySelector(".mw-slider")
    expect(el).not.toBeNull()
  })

  it("applies aria-label", () => {
    const { container } = render(Slider, { props: { ariaLabel: "Volume" } })
    const input = container.querySelector("input")
    expect(input?.getAttribute("aria-label")).toBe("Volume")
  })

  it("respects min and max", () => {
    const { container } = render(Slider, {
      props: { ariaLabel: "Volume", min: 0, max: 100 },
    })
    const input = container.querySelector("input") as HTMLInputElement
    expect(input.min).toBe("0")
    expect(input.max).toBe("100")
  })

  it("applies disabled state", () => {
    const { container } = render(Slider, {
      props: { ariaLabel: "Volume", disabled: true },
    })
    const input = container.querySelector("input") as HTMLInputElement
    expect(input.disabled).toBe(true)
  })
})

describe("SliderField", () => {
  it("renders with a label", () => {
    const { container } = render(SliderFieldContractFixture, {
      props: { label: "Volume" },
    })
    const label = container.querySelector(".mw-slider-field__label")
    expect(label?.textContent).toContain("Volume")
  })

  it("renders a range input", () => {
    const { container } = render(SliderFieldContractFixture, {
      props: { label: "Volume" },
    })
    const input = container.querySelector('input[type="range"]')
    expect(input).not.toBeNull()
  })

  it("shows helper text", () => {
    const { container } = render(SliderFieldContractFixture, {
      props: { label: "Volume", helperText: "Drag to adjust" },
    })
    expect(container.textContent).toContain("Drag to adjust")
  })

  it("renders edge value labels from the slider bounds", () => {
    const { container } = render(SliderFieldContractFixture, {
      props: { label: "Radius", slider: { min: 0, max: 48 }, value: 24 },
    })

    expect(container.querySelector(".mw-slider-field__edge-value--min")?.textContent).toContain("0")
    expect(container.querySelector(".mw-slider-field__edge-value--max")?.textContent).toContain(
      "48",
    )
  })

  it("supports custom edge labels and inline label position", () => {
    const { container } = render(SliderFieldContractFixture, {
      props: {
        label: "Temperature",
        minValueLabel: "Cold",
        maxValueLabel: "Hot",
        labelPosition: "inline",
      },
    })

    const wrapper = container.querySelector('[data-label-position="inline"]')

    expect(wrapper?.className).toContain("mw-slider-field--label-inline")
    expect(container.textContent).toContain("Cold")
    expect(container.textContent).toContain("Hot")
  })

  it("shows error text", () => {
    const { container } = render(SliderFieldContractFixture, {
      props: { label: "Volume", error: "Too loud" },
    })
    expect(container.textContent).toContain("Too loud")
  })
})

describe("Purpose sliders", () => {
  it("BrightnessSlider renders brightness semantics, top values, and the current tooltip", () => {
    const { container } = render(SliderPurposeFixture, {
      props: { kind: "brightness", value: 80 },
    })
    const slider = container.querySelector('input[type="range"]') as HTMLInputElement

    expect(container.querySelector('[data-purpose="brightness"]')).not.toBeNull()
    expect(container.querySelector(".mw-slider-field__edge-value--min")?.textContent).toContain("0")
    expect(container.querySelector(".mw-slider-field__edge-value--max")?.textContent).toContain(
      "100",
    )
    expect(container.querySelector(".mw-slider__tooltip")?.textContent).toBe("80")
    expect(slider.getAttribute("aria-labelledby")).toBeTruthy()
  })

  it("VolumeSlider supports vertical orientation directly", () => {
    const { container } = render(SliderPurposeFixture, {
      props: { kind: "volume", value: 45, orientation: "vertical" },
    })
    const slider = container.querySelector('input[type="range"]') as HTMLInputElement
    const shell = container.querySelector('[data-component="slider"]')

    expect(slider.getAttribute("aria-orientation")).toBe("vertical")
    expect(shell?.getAttribute("data-orientation")).toBe("vertical")
    expect(shell?.className).toContain("mw-slider--vertical")
  })

  it("RadiusSlider uses radius-specific bounds and labels", () => {
    const { container } = render(SliderPurposeFixture, {
      props: { kind: "radius", value: 24 },
    })
    const slider = container.querySelector('input[type="range"]') as HTMLInputElement

    expect(container.querySelector('[data-purpose="radius"]')).not.toBeNull()
    expect(container.querySelector(".mw-slider-field__edge-value--min")?.textContent).toContain(
      "0px",
    )
    expect(container.querySelector(".mw-slider-field__edge-value--max")?.textContent).toContain(
      "48px",
    )
    expect(slider.getAttribute("max")).toBe("48")
    expect(slider.getAttribute("step")).toBe("2")
  })
})
