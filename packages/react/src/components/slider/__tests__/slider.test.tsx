import { fireEvent, render, screen } from "@testing-library/react"
import * as React from "react"
import { describe, expect, it } from "vitest"
import { Slider } from ".."
import { runSliderContract } from "../../../../../../tests/contracts/slider.contract"
import { MarwesProvider } from "../../../provider/marwes-provider"
import { SliderField } from "../slider-field"

function renderWithProvider(ui: React.ReactElement) {
  return render(<MarwesProvider>{ui}</MarwesProvider>)
}

runSliderContract("react", {
  async renderSlider(args = {}) {
    if (args.value !== undefined) {
      function ControlledSliderHarness(): React.ReactElement {
        const [_renderTick, setRenderTick] = React.useState(0)

        return (
          <Slider
            ariaLabel={args.ariaLabel}
            min={args.min}
            max={args.max}
            step={args.step}
            value={args.value}
            disabled={args.disabled}
            showTooltip={args.showTooltip}
            ariaValueText={args.ariaValueText}
            onValueChange={(value) => {
              args.onValueChange?.(value)
              setRenderTick((currentTick) => currentTick + 1)
            }}
          />
        )
      }

      renderWithProvider(<ControlledSliderHarness />)
      return
    }

    renderWithProvider(
      <Slider
        ariaLabel={args.ariaLabel}
        min={args.min}
        max={args.max}
        step={args.step}
        defaultValue={args.defaultValue}
        disabled={args.disabled}
        showTooltip={args.showTooltip}
        ariaValueText={args.ariaValueText}
        onValueChange={args.onValueChange}
      />,
    )
  },
  async renderSliderField(args) {
    renderWithProvider(
      <SliderField
        label={args.label}
        description={args.description}
        error={args.error}
        ariaDescribedBy={args.ariaDescribedBy}
        slider={{
          min: args.min,
          max: args.max,
          step: args.step,
          value: args.value,
          defaultValue: args.defaultValue,
          disabled: args.disabled,
          showTooltip: args.showTooltip,
          ariaValueText: args.ariaValueText,
          onValueChange: args.onValueChange,
        }}
      />,
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
    fireEvent.change(element, { target: { value: nextValue } })
  },
})

describe("React adapter specifics: Slider", () => {
  it("renders tooltip and touch area data attributes from the PDF spec", () => {
    renderWithProvider(
      <Slider ariaLabel="Radius" value={24} showTooltip showTouchArea ariaValueText="24 pixels" />,
    )

    const element = screen.getByRole("slider", { name: "Radius" })
    const wrapper = element.closest('[data-component="slider"]')

    expect(wrapper).toHaveAttribute("data-show-tooltip", "true")
    expect(wrapper).toHaveAttribute("data-show-touch-area", "true")
    expect(screen.getByText("24")).toBeInTheDocument()
  })

  it("merges className with the recipe output on the wrapper", () => {
    renderWithProvider(<Slider ariaLabel="Custom slider" className="custom-class" disabled />)

    const element = screen.getByRole("slider", { name: "Custom slider" })
    const wrapper = element.closest('[data-component="slider"]')

    expect(wrapper).toHaveClass("mw-slider", "mw-slider--disabled", "custom-class")
  })
})
