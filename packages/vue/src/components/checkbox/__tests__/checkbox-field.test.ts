import { render, screen } from "@testing-library/vue"
import { describe, expect, it } from "vitest"
import { defineComponent, h } from "vue"
import { MarwesProvider } from "../../../provider/marwes-provider"
import { CheckboxField, type CheckboxFieldProps } from "../checkbox-field"

function renderWithProvider(props: CheckboxFieldProps) {
  render(
    defineComponent({
      setup() {
        return () => h(MarwesProvider, null, { default: () => h(CheckboxField, props) })
      },
    }),
  )
}

describe("Vue adapter specifics: CheckboxField", () => {
  it("wires label and description to the checkbox", () => {
    renderWithProvider({ label: "Accept terms", description: "Required to continue", checkbox: {} })

    const checkbox = screen.getByRole("checkbox", { name: /accept terms/i })
    const descriptionText = screen.getByText("Required to continue")
    const description = descriptionText.closest(
      ".mw-checkbox-field__description",
    ) as HTMLElement | null
    const describedBy = checkbox.getAttribute("aria-describedby") ?? ""

    expect(descriptionText).toBeInTheDocument()
    expect(description).not.toBeNull()
    expect(description?.id).toBeTruthy()
    expect(describedBy.split(/\s+/)).toContain(description?.id ?? "")
  })

  it("shows error as polite live region", () => {
    renderWithProvider({ label: "Accept terms", error: "You must accept the terms", checkbox: {} })

    expect(
      screen.getByText("You must accept the terms").closest('[aria-live="polite"]'),
    ).not.toBeNull()
  })
})
