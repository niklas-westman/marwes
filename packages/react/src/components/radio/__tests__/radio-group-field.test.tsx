import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import type * as React from "react"
import { describe, expect, it, vi } from "vitest"
import { MarwesProvider } from "../../../provider/marwes-provider"
import { RadioGroupField } from "../radio-group-field"

function renderWithProvider(ui: React.ReactElement) {
  return render(<MarwesProvider>{ui}</MarwesProvider>)
}

const testOptions = [
  { value: "a", label: "Alpha" },
  { value: "b", label: "Beta" },
  { value: "c", label: "Gamma" },
]

describe("RadioGroupField", () => {
  it("renders role=radiogroup with aria-labelledby pointing to label", () => {
    renderWithProvider(<RadioGroupField name="test" label="Pick one" options={testOptions} />)

    const group = screen.getByRole("radiogroup", { name: /pick one/i })
    expect(group).toBeTruthy()
  })

  it("renders all options as radio inputs", () => {
    renderWithProvider(<RadioGroupField name="test" label="Pick one" options={testOptions} />)

    const radios = screen.getAllByRole("radio")
    expect(radios).toHaveLength(3)
  })

  it("uncontrolled: selects defaultValue and allows switching", async () => {
    const user = userEvent.setup()
    renderWithProvider(
      <RadioGroupField name="test" label="Pick one" options={testOptions} defaultValue="a" />,
    )

    const alphaRadio = screen.getByRole("radio", { name: /alpha/i })
    const betaRadio = screen.getByRole("radio", { name: /beta/i })

    expect(alphaRadio).toBeChecked()
    expect(betaRadio).not.toBeChecked()

    await user.click(betaRadio)

    expect(betaRadio).toBeChecked()
    expect(alphaRadio).not.toBeChecked()
  })

  it("controlled: calls onChange when option clicked", async () => {
    const handleChange = vi.fn()
    const user = userEvent.setup()
    renderWithProvider(
      <RadioGroupField
        name="test"
        label="Pick one"
        options={testOptions}
        value="a"
        onChange={handleChange}
      />,
    )

    const betaRadio = screen.getByRole("radio", { name: /beta/i })
    await user.click(betaRadio)

    expect(handleChange).toHaveBeenCalledWith("b")
  })

  it("all child radios have matching name attribute", () => {
    renderWithProvider(<RadioGroupField name="my-group" label="Pick one" options={testOptions} />)

    const radios = screen.getAllByRole("radio")
    for (const radio of radios) {
      expect((radio as HTMLInputElement).name).toBe("my-group")
    }
  })

  it("wires description into aria-describedby and keeps it above the options", () => {
    renderWithProvider(
      <RadioGroupField
        name="test"
        label="Pick one"
        description="Choose your favorite"
        options={testOptions}
      />,
    )

    const group = screen.getByRole("radiogroup")
    const describedBy = group.getAttribute("aria-describedby") ?? ""
    const descriptionText = screen.getByText("Choose your favorite")
    const descriptionEl = descriptionText.closest("[id]") as HTMLElement | null
    const wrapperChildren = Array.from(group.parentElement?.children ?? [])

    expect(descriptionEl).not.toBeNull()
    expect(describedBy.split(/\s+/)).toContain(descriptionEl?.id ?? "")
    expect(wrapperChildren.indexOf(descriptionEl as HTMLElement)).toBeLessThan(
      wrapperChildren.indexOf(group),
    )
  })

  it("shows error with aria-invalid, propagates invalid state to radios, and renders a live region", () => {
    renderWithProvider(
      <RadioGroupField
        name="test"
        label="Pick one"
        error="Selection required"
        options={testOptions}
      />,
    )

    const group = screen.getByRole("radiogroup")
    expect(group.getAttribute("aria-invalid")).toBe("true")

    for (const radio of screen.getAllByRole("radio")) {
      expect(radio.getAttribute("aria-invalid")).toBe("true")
    }

    const errorText = screen.getByText("Selection required")
    expect(errorText.closest('[aria-live="polite"]')).not.toBeNull()
  })

  it("disabled group disables all child radios", () => {
    renderWithProvider(
      <RadioGroupField name="test" label="Pick one" options={testOptions} disabled />,
    )

    const radios = screen.getAllByRole("radio")
    for (const radio of radios) {
      expect(radio).toBeDisabled()
    }
  })

  it("required prop sets aria-required on the radiogroup", () => {
    renderWithProvider(
      <RadioGroupField name="test" label="Pick one" options={testOptions} required />,
    )

    const group = screen.getByRole("radiogroup")
    expect(group.getAttribute("aria-required")).toBe("true")
  })

  it("per-option disabled disables only that option", () => {
    const mixedOptions = [
      { value: "a", label: "Alpha" },
      { value: "b", label: "Beta", disabled: true },
      { value: "c", label: "Gamma" },
    ]

    renderWithProvider(<RadioGroupField name="test" label="Pick one" options={mixedOptions} />)

    const alphaRadio = screen.getByRole("radio", { name: /alpha/i })
    const betaRadio = screen.getByRole("radio", { name: /beta/i })
    const gammaRadio = screen.getByRole("radio", { name: /gamma/i })

    expect(alphaRadio).not.toBeDisabled()
    expect(betaRadio).toBeDisabled()
    expect(gammaRadio).not.toBeDisabled()
  })
})
