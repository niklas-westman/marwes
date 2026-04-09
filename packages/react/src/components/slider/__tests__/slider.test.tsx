import { fireEvent, render, screen } from "@testing-library/react"
import type * as React from "react"
import { describe, expect, it, vi } from "vitest"
import { Slider } from ".."
import { MarwesProvider } from "../../../provider/marwes-provider"

function renderWithProvider(ui: React.ReactElement) {
  return render(<MarwesProvider>{ui}</MarwesProvider>)
}

describe("React adapter specifics: Slider", () => {
  it("renders a native range input inside the slider atom wrapper", () => {
    renderWithProvider(<Slider ariaLabel="Volume" min={0} max={100} defaultValue={60} step={5} />)

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
    renderWithProvider(
      <Slider ariaLabel="Radius" value={24} showTooltip showTouchArea ariaValueText="24 pixels" />,
    )

    const element = screen.getByRole("slider", { name: "Radius" })
    const wrapper = element.closest('[data-component="slider"]')

    expect(wrapper).toHaveAttribute("data-show-tooltip", "true")
    expect(wrapper).toHaveAttribute("data-show-touch-area", "true")
    expect(screen.getByText("24")).toBeInTheDocument()
  })

  it("calls onValueChange with the numeric value", () => {
    const handleValueChange = vi.fn()

    renderWithProvider(
      <Slider ariaLabel="Opacity" defaultValue={24} onValueChange={handleValueChange} />,
    )

    const element = screen.getByRole("slider", { name: "Opacity" })
    fireEvent.change(element, { target: { value: "32" } })

    expect(handleValueChange).toHaveBeenCalledWith(32)
  })

  it("merges className with the recipe output on the wrapper", () => {
    renderWithProvider(<Slider ariaLabel="Custom slider" className="custom-class" disabled />)

    const element = screen.getByRole("slider", { name: "Custom slider" })
    const wrapper = element.closest('[data-component="slider"]')

    expect(wrapper).toHaveClass("mw-slider", "mw-slider--disabled", "custom-class")
  })
})
