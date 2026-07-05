/**
 * React adapter: Tests the Slider component — wires the shared cross-adapter contract
 * and verifies adapter-specific rendering concerns.
 */
import { fireEvent, render, screen } from "@testing-library/react"
import * as React from "react"
import { describe, expect, it } from "vitest"
import { runSliderContract } from "../../../../../../tests/contracts/slider.contract"
import { MarwesProvider } from "../../../provider/marwes-provider"
import { Slider } from "../slider"
import { SliderField } from "../slider-field"

function renderWithProvider(ui: React.ReactElement) {
  return render(<MarwesProvider>{ui}</MarwesProvider>)
}

runSliderContract("react", {
  async renderSlider(args = {}) {
    if (args.value !== undefined) {
      const controlledValue = args.value

      function ControlledSliderHarness(): React.ReactElement {
        const [_renderTick, setRenderTick] = React.useState(0)
        const sliderProps = {
          ...(args.ariaLabel !== undefined ? { ariaLabel: args.ariaLabel } : {}),
          ...(args.min !== undefined ? { min: args.min } : {}),
          ...(args.max !== undefined ? { max: args.max } : {}),
          ...(args.step !== undefined ? { step: args.step } : {}),
          value: controlledValue,
          ...(args.disabled !== undefined ? { disabled: args.disabled } : {}),
          ...(args.showTooltip !== undefined ? { showTooltip: args.showTooltip } : {}),
          ...(args.ariaValueText !== undefined ? { ariaValueText: args.ariaValueText } : {}),
          onValueChange: (value: number) => {
            args.onValueChange?.(value)
            setRenderTick((currentTick) => currentTick + 1)
          },
        }

        return <Slider {...sliderProps} />
      }

      renderWithProvider(<ControlledSliderHarness />)
      return
    }

    const sliderProps = {
      ...(args.ariaLabel !== undefined ? { ariaLabel: args.ariaLabel } : {}),
      ...(args.min !== undefined ? { min: args.min } : {}),
      ...(args.max !== undefined ? { max: args.max } : {}),
      ...(args.step !== undefined ? { step: args.step } : {}),
      ...(args.defaultValue !== undefined ? { defaultValue: args.defaultValue } : {}),
      ...(args.disabled !== undefined ? { disabled: args.disabled } : {}),
      ...(args.showTooltip !== undefined ? { showTooltip: args.showTooltip } : {}),
      ...(args.ariaValueText !== undefined ? { ariaValueText: args.ariaValueText } : {}),
      ...(args.onValueChange !== undefined ? { onValueChange: args.onValueChange } : {}),
    }

    renderWithProvider(<Slider {...sliderProps} />)
  },
  async renderSliderField(args) {
    const sliderFieldProps = {
      label: args.label,
      ...(args.description !== undefined ? { description: args.description } : {}),
      ...(args.error !== undefined ? { error: args.error } : {}),
      ...(args.ariaDescribedBy !== undefined ? { ariaDescribedBy: args.ariaDescribedBy } : {}),
      slider: {
        ...(args.min !== undefined ? { min: args.min } : {}),
        ...(args.max !== undefined ? { max: args.max } : {}),
        ...(args.step !== undefined ? { step: args.step } : {}),
        ...(args.value !== undefined ? { value: args.value } : {}),
        ...(args.defaultValue !== undefined ? { defaultValue: args.defaultValue } : {}),
        ...(args.disabled !== undefined ? { disabled: args.disabled } : {}),
        ...(args.showTooltip !== undefined ? { showTooltip: args.showTooltip } : {}),
        ...(args.ariaValueText !== undefined ? { ariaValueText: args.ariaValueText } : {}),
        ...(args.onValueChange !== undefined ? { onValueChange: args.onValueChange } : {}),
      },
    }

    renderWithProvider(<SliderField {...sliderFieldProps} />)
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
