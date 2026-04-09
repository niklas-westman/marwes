import { render, screen } from "@testing-library/react"
import type * as React from "react"
import { describe, expect, it } from "vitest"
import { MarwesProvider } from "../../../provider/marwes-provider"
import { SliderField } from "../slider-field"

function renderWithProvider(ui: React.ReactElement) {
  return render(<MarwesProvider>{ui}</MarwesProvider>)
}

describe("React SliderField", () => {
  it("wires the visible label and helper text to the native slider", () => {
    renderWithProvider(
      <SliderField
        label="Volume"
        description="Adjust the output level."
        slider={{ defaultValue: 40 }}
      />,
    )

    const slider = screen.getByRole("slider", { name: "Volume" })
    const description = screen.getByText("Adjust the output level.").closest("[id]")

    expect(description).not.toBeNull()
    expect(slider).toHaveAttribute("aria-describedby", description?.id)
  })

  it("renders min and max labels from the slider bounds", () => {
    renderWithProvider(
      <SliderField label="Radius" slider={{ min: 0, max: 48, defaultValue: 24 }} />,
    )

    expect(screen.getByText("0")).toBeInTheDocument()
    expect(screen.getByText("48")).toBeInTheDocument()
  })

  it("supports custom edge labels and error state", () => {
    renderWithProvider(
      <SliderField
        label="Temperature"
        error="Select a value within the allowed range."
        minValueLabel="Cold"
        maxValueLabel="Hot"
        slider={{ defaultValue: 50 }}
      />,
    )

    const slider = screen.getByRole("slider", { name: "Temperature" })

    expect(screen.getByText("Cold")).toBeInTheDocument()
    expect(screen.getByText("Hot")).toBeInTheDocument()
    expect(slider).toHaveAttribute("aria-invalid", "true")
  })

  it("supports the inline label-position variant from Figma", () => {
    renderWithProvider(
      <SliderField
        label="Volume"
        labelPosition="inline"
        slider={{ min: 0, max: 100, defaultValue: 40 }}
      />,
    )

    const slider = screen.getByRole("slider", { name: "Volume" })
    const wrapper = slider.closest('[data-label-position="inline"]')

    expect(wrapper).toHaveClass("mw-slider-field--label-inline")
    expect(screen.getByText("0")).toBeInTheDocument()
    expect(screen.getByText("100")).toBeInTheDocument()
  })
})
