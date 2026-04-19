import { fireEvent, render, screen } from "@testing-library/vue"
import { describe, expect, it } from "vitest"
import { defineComponent, h, ref } from "vue"
import { Slider } from ".."
import { runSliderContract } from "../../../../../../tests/contracts/slider.contract"
import { MarwesProvider } from "../../../provider/marwes-provider"
import { SliderField } from "../slider-field"

function renderWithProvider(child: () => unknown) {
  return render(
    defineComponent({
      setup() {
        return () =>
          h(MarwesProvider, null, {
            default: child,
          })
      },
    }),
  )
}

runSliderContract("vue", {
  async renderSlider(args = {}) {
    if (args.value !== undefined) {
      const ControlledSliderHarness = defineComponent({
        setup() {
          const renderTick = ref(0)

          return () =>
            h(Slider, {
              key: renderTick.value,
              ariaLabel: args.ariaLabel,
              min: args.min,
              max: args.max,
              step: args.step,
              modelValue: args.value,
              disabled: args.disabled,
              showTooltip: args.showTooltip,
              ariaValueText: args.ariaValueText,
              onValueChange: (value: number) => {
                args.onValueChange?.(value)
                renderTick.value += 1
              },
            })
        },
      })

      renderWithProvider(() => h(ControlledSliderHarness))
      return
    }

    renderWithProvider(() =>
      h(Slider, {
        ariaLabel: args.ariaLabel,
        min: args.min,
        max: args.max,
        step: args.step,
        defaultValue: args.defaultValue,
        disabled: args.disabled,
        showTooltip: args.showTooltip,
        ariaValueText: args.ariaValueText,
        onValueChange: args.onValueChange,
      }),
    )
  },
  async renderSliderField(args) {
    renderWithProvider(() =>
      h(SliderField, {
        label: args.label,
        description: args.description,
        error: args.error,
        ariaDescribedBy: args.ariaDescribedBy,
        slider: {
          min: args.min,
          max: args.max,
          step: args.step,
          value: args.value,
          defaultValue: args.defaultValue,
          disabled: args.disabled,
          showTooltip: args.showTooltip,
          ariaValueText: args.ariaValueText,
          onValueChange: args.onValueChange,
        },
      }),
    )
  },
  getByRole(role, options) {
    return screen.getByRole(role, options)
  },
  getByText(text) {
    return screen.getByText(text)
  },
  queryDescriptionRegion() {
    return document.querySelector(".mw-slider-field__description") as HTMLElement | null
  },
  queryErrorRegion() {
    return document.querySelector(".mw-slider-field__error") as HTMLElement | null
  },
  async changeValue(element, nextValue) {
    const slider = element as HTMLInputElement
    slider.value = nextValue
    await fireEvent.input(slider)
  },
})

describe("Vue adapter specifics: Slider", () => {
  it("renders tooltip and touch area data attributes from the PDF spec", () => {
    renderWithProvider(() =>
      h(Slider, {
        ariaLabel: "Radius",
        modelValue: 24,
        showTooltip: true,
        showTouchArea: true,
        ariaValueText: "24 pixels",
      }),
    )

    const element = screen.getByRole("slider", { name: "Radius" })
    const wrapper = element.closest('[data-component="slider"]')

    expect(wrapper).toHaveAttribute("data-show-tooltip", "true")
    expect(wrapper).toHaveAttribute("data-show-touch-area", "true")
    expect(screen.getByText("24")).toBeInTheDocument()
  })

  it("merges class attr with the recipe output on the wrapper", () => {
    renderWithProvider(() =>
      h(Slider, { ariaLabel: "Custom slider", class: "custom-class", disabled: true }),
    )

    const element = screen.getByRole("slider", { name: "Custom slider" })
    const wrapper = element.closest('[data-component="slider"]')

    expect(wrapper).toHaveClass("mw-slider", "mw-slider--disabled", "custom-class")
  })
})
