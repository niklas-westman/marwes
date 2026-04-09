import { fireEvent, render, screen } from "@testing-library/vue"
import { describe, expect, it, vi } from "vitest"
import { defineComponent, h } from "vue"
import { Slider } from ".."
import { MarwesProvider } from "../../../provider/marwes-provider"

function renderWithProvider(props: Record<string, unknown>) {
  return render(
    defineComponent({
      setup() {
        return () =>
          h(MarwesProvider, null, {
            default: () => h(Slider, props),
          })
      },
    }),
  )
}

describe("Vue adapter specifics: Slider", () => {
  it("renders a native range input inside the slider atom wrapper", () => {
    renderWithProvider({ ariaLabel: "Volume", min: 0, max: 100, defaultValue: 60, step: 5 })

    const element = screen.getByRole("slider", { name: "Volume" })
    const wrapper = element.closest('[data-component="slider"]')

    expect(wrapper).toHaveClass("mw-slider")
    expect(element).toHaveAttribute("type", "range")
    expect(element).toHaveAttribute("min", "0")
    expect(element).toHaveAttribute("max", "100")
    expect(element).toHaveAttribute("step", "5")
    expect(element).toHaveClass("mw-slider__native")
  })

  it("renders tooltip and touch area variants from the PDF spec", () => {
    renderWithProvider({
      ariaLabel: "Radius",
      modelValue: 24,
      showTooltip: true,
      showTouchArea: true,
      ariaValueText: "24 pixels",
    })

    const element = screen.getByRole("slider", { name: "Radius" })
    const wrapper = element.closest('[data-component="slider"]')

    expect(wrapper).toHaveAttribute("data-show-tooltip", "true")
    expect(wrapper).toHaveAttribute("data-show-touch-area", "true")
    expect(screen.getByText("24")).toBeInTheDocument()
  })

  it("emits numeric values through v-model and onValueChange", async () => {
    const handleValueChange = vi.fn()

    renderWithProvider({ ariaLabel: "Opacity", defaultValue: 24, onValueChange: handleValueChange })

    const element = screen.getByRole("slider", { name: "Opacity" })
    await fireEvent.update(element, "32")

    expect(handleValueChange).toHaveBeenCalledWith(32)
  })

  it("merges class attr with the recipe output on the wrapper", () => {
    renderWithProvider({ ariaLabel: "Custom slider", class: "custom-class", disabled: true })

    const element = screen.getByRole("slider", { name: "Custom slider" })
    const wrapper = element.closest('[data-component="slider"]')

    expect(wrapper).toHaveClass("mw-slider", "mw-slider--disabled", "custom-class")
  })
})
