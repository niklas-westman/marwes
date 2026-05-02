import { render, screen } from "@testing-library/vue"
import { describe, expect, it } from "vitest"
import { defineComponent, h } from "vue"
import { MarwesProvider } from "../../../provider/marwes-provider"
import { BrightnessSlider, RadiusSlider, VolumeSlider } from "../variants"

function renderWithProvider(component: unknown, props: Record<string, unknown>) {
  render(
    defineComponent({
      setup() {
        return () => h(MarwesProvider, null, { default: () => h(component as never, props) })
      },
    }),
  )
}

describe("VolumeSlider", () => {
  it("sets semantic defaults for a volume control", () => {
    renderWithProvider(VolumeSlider, { slider: { defaultValue: 45 } })

    const slider = screen.getByRole("slider", { name: "Volume" })
    const wrapper = slider.closest("[data-purpose]")

    expect(wrapper?.getAttribute("data-purpose")).toBe("volume")
    expect(screen.getByText("0")).toBeTruthy()
    expect(screen.getByText("100")).toBeTruthy()
    expect(screen.getByText("45")).toBeTruthy()
  })

  it("supports vertical orientation directly on the purpose component", () => {
    renderWithProvider(VolumeSlider, { orientation: "vertical", slider: { defaultValue: 45 } })

    const slider = screen.getByRole("slider", { name: "Volume" })
    const wrapper = slider.closest('[data-component="slider"]')

    expect(slider).toHaveAttribute("aria-orientation", "vertical")
    expect(wrapper).toHaveAttribute("data-orientation", "vertical")
    expect(wrapper).toHaveClass("mw-slider--vertical")
  })
})

describe("BrightnessSlider", () => {
  it("sets semantic defaults for brightness adjustments", () => {
    renderWithProvider(BrightnessSlider, { slider: { defaultValue: 80 } })

    const slider = screen.getByRole("slider", { name: "Brightness" })
    const wrapper = slider.closest("[data-purpose]")

    expect(wrapper?.getAttribute("data-purpose")).toBe("brightness")
    expect(screen.getByText("80")).toBeTruthy()
  })
})

describe("RadiusSlider", () => {
  it("uses radius-specific bounds and labels", () => {
    renderWithProvider(RadiusSlider, { slider: { defaultValue: 24 } })

    const slider = screen.getByRole("slider", { name: "Radius" })
    const wrapper = slider.closest("[data-purpose]")

    expect(wrapper?.getAttribute("data-purpose")).toBe("radius")
    expect(screen.getByText("0px")).toBeTruthy()
    expect(screen.getByText("48px")).toBeTruthy()
    expect(slider).toHaveAttribute("max", "48")
    expect(slider).toHaveAttribute("step", "2")
  })
})
