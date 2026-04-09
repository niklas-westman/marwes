import { render, screen } from "@testing-library/vue"
import { describe, expect, it } from "vitest"
import { defineComponent, h } from "vue"
import { MarwesProvider } from "../../../provider/marwes-provider"
import { SliderField } from "../slider-field"

function renderWithProvider(props: Record<string, unknown>) {
  return render(
    defineComponent({
      setup() {
        return () =>
          h(MarwesProvider, null, {
            default: () => h(SliderField, props),
          })
      },
    }),
  )
}

describe("Vue SliderField", () => {
  it("wires the visible label and helper text to the native slider", () => {
    renderWithProvider({
      label: "Volume",
      description: "Adjust the output level.",
      slider: { defaultValue: 40 },
    })

    const slider = screen.getByRole("slider", { name: "Volume" })
    const description = screen.getByText("Adjust the output level.").closest("[id]")

    expect(description).not.toBeNull()
    expect(slider).toHaveAttribute("aria-describedby", description?.id)
  })

  it("renders min and max labels from the slider bounds", () => {
    renderWithProvider({
      label: "Radius",
      slider: { min: 0, max: 48, defaultValue: 24 },
    })

    expect(screen.getByText("0")).toBeInTheDocument()
    expect(screen.getByText("48")).toBeInTheDocument()
  })

  it("supports custom edge labels and error state", () => {
    renderWithProvider({
      label: "Temperature",
      error: "Select a value within the allowed range.",
      minValueLabel: "Cold",
      maxValueLabel: "Hot",
      slider: { defaultValue: 50 },
    })

    const slider = screen.getByRole("slider", { name: "Temperature" })

    expect(screen.getByText("Cold")).toBeInTheDocument()
    expect(screen.getByText("Hot")).toBeInTheDocument()
    expect(slider).toHaveAttribute("aria-invalid", "true")
  })
})
