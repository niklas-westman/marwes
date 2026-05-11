/**
 * Svelte adapter: Tests the Slider atom — range input rendering,
 * class, value binding, min/max, and disabled state.
 */
import { fireEvent, render } from "@testing-library/svelte"
import { describe, expect, it, vi } from "vitest"
import Slider from "../lib/components/slider/Slider.svelte"
import SliderField from "../lib/components/slider/SliderField.svelte"

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
    const { container } = render(SliderField, {
      props: { label: "Volume" },
    })
    const label = container.querySelector("label")
    expect(label?.textContent).toContain("Volume")
  })

  it("renders a range input", () => {
    const { container } = render(SliderField, {
      props: { label: "Volume" },
    })
    const input = container.querySelector('input[type="range"]')
    expect(input).not.toBeNull()
  })

  it("shows helper text", () => {
    const { container } = render(SliderField, {
      props: { label: "Volume", helperText: "Drag to adjust" },
    })
    expect(container.textContent).toContain("Drag to adjust")
  })

  it("shows error text", () => {
    const { container } = render(SliderField, {
      props: { label: "Volume", error: "Too loud" },
    })
    expect(container.textContent).toContain("Too loud")
  })
})
