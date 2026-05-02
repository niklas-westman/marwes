import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import type * as React from "react"
import { describe, expect, it, vi } from "vitest"
import { runSelectComboboxContract } from "../../../../../../tests/contracts/select-combobox.contract"
import { runSelectFieldContract } from "../../../../../../tests/contracts/select-field.contract"
import { MarwesProvider } from "../../../provider/marwes-provider"
import { SelectField } from "../select-field"

function renderWithProvider(ui: React.ReactElement) {
  return render(<MarwesProvider>{ui}</MarwesProvider>)
}

runSelectFieldContract("react", {
  async renderSelectField(args) {
    const fieldProps = {
      label: args.label,
      ...(args.helperText !== undefined ? { helperText: args.helperText } : {}),
      ...(args.error !== undefined ? { error: args.error } : {}),
      ...(args.ariaDescribedBy !== undefined ? { ariaDescribedBy: args.ariaDescribedBy } : {}),
      select: {
        options: [
          { value: "se", label: "Sweden" },
          { value: "us", label: "United States" },
        ],
        placeholder: "Choose an option",
        ...(args.select ?? {}),
      },
    }

    renderWithProvider(<SelectField {...fieldProps} />)
  },
  getByRole(role, options) {
    return screen.getByRole(role, options)
  },
  getByText(text) {
    return screen.getByText(text)
  },
  queryHelperRegion() {
    return document.querySelector(".mw-input-field__helper")
  },
  queryErrorRegion() {
    return document.querySelector(".mw-input-field__error")
  },
})

runSelectComboboxContract("react", {
  async renderCustomSelectField(args = {}) {
    const fieldProps = {
      label: args.label ?? "Country",
      select: {
        native: false,
        options: args.options ?? [
          { value: "se", label: "Sweden" },
          { value: "us", label: "United States" },
          { value: "no", label: "Norway" },
        ],
        placeholder: "Choose an option",
        ...(args.defaultValue !== undefined ? { defaultValue: args.defaultValue } : {}),
      },
    }

    renderWithProvider(<SelectField {...fieldProps} />)
  },
  getByRole(role, options) {
    return screen.getByRole(role, options)
  },
  queryByRole(role, options) {
    return screen.queryByRole(role, options)
  },
  async keyboard(text) {
    await userEvent.setup().keyboard(text)
  },
})

describe("React SelectField specifics", () => {
  it("renders compact trigger and selected-state icons for the Marwes dropdown", async () => {
    renderWithProvider(
      <SelectField
        label="Country"
        select={{
          native: false,
          placeholder: "Choose a country",
          options: [
            { value: "se", label: "Sweden" },
            { value: "us", label: "United States" },
          ],
        }}
      />,
    )

    const control = screen.getByRole("combobox", { name: /country/i })
    const triggerIcon = control.querySelector("svg")

    expect(triggerIcon).not.toBeNull()
    expect(triggerIcon).toHaveAttribute("width", "16")
    expect(triggerIcon).toHaveAttribute("height", "16")

    await userEvent.click(control)
    await userEvent.click(screen.getByRole("option", { name: /united states/i }))
    await userEvent.click(screen.getByRole("combobox", { name: /country/i }))

    const selectedIcon = screen.getByRole("option", { name: /united states/i }).querySelector("svg")

    expect(selectedIcon).not.toBeNull()
    expect(selectedIcon).toHaveAttribute("width", "16")
    expect(selectedIcon).toHaveAttribute("height", "16")
  })

  it("uses the custom Marwes combobox when native is false and updates the value on selection", async () => {
    const onValueChange = vi.fn()

    renderWithProvider(
      <SelectField
        label="Country"
        select={{
          native: false,
          placeholder: "Choose a country",
          options: [
            { value: "se", label: "Sweden" },
            { value: "us", label: "United States" },
          ],
          onValueChange,
        }}
      />,
    )

    const control = screen.getByRole("combobox", { name: /country/i })
    expect(control.tagName).toBe("BUTTON")

    await userEvent.click(control)
    await userEvent.click(screen.getByRole("option", { name: /united states/i }))

    expect(onValueChange).toHaveBeenCalledWith("us")
    expect(screen.getByRole("combobox", { name: /country/i })).toHaveTextContent("United States")
  })

  it("defaults to the custom Marwes combobox", () => {
    renderWithProvider(
      <SelectField
        label="Plan"
        select={{
          options: [
            { value: "starter", label: "Starter" },
            { value: "growth", label: "Growth" },
          ],
        }}
      />,
    )

    const control = screen.getByRole("combobox", { name: /plan/i })

    expect(control.tagName).toBe("BUTTON")
    expect(control).toHaveClass("mw-select-field__trigger")
  })
})
