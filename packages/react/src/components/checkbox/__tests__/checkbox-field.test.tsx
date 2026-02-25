import { render, screen } from "@testing-library/react"
import type * as React from "react"
import { describe, expect, it } from "vitest"
import { MarwesProvider } from "../../../provider/marwes-provider"
import { CheckboxField } from "../checkbox-field"

function renderWithProvider(ui: React.ReactElement) {
  return render(<MarwesProvider>{ui}</MarwesProvider>)
}

describe("React adapter specifics: CheckboxField", () => {
  it("wires label and description to the checkbox", () => {
    renderWithProvider(
      <CheckboxField label="Accept terms" description="Required to continue" checkbox={{}} />,
    )

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
    renderWithProvider(
      <CheckboxField label="Accept terms" error="You must accept the terms" checkbox={{}} />,
    )

    expect(
      screen.getByText("You must accept the terms").closest('[aria-live="polite"]'),
    ).not.toBeNull()
  })
})
