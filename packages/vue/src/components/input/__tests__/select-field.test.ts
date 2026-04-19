import userEvent from "@testing-library/user-event"
import { render, screen } from "@testing-library/vue"
import { describe, expect, it, vi } from "vitest"
import { defineComponent, h } from "vue"
import { runSelectComboboxContract } from "../../../../../../tests/contracts/select-combobox.contract"
import { runSelectFieldContract } from "../../../../../../tests/contracts/select-field.contract"
import { MarwesProvider } from "../../../provider/marwes-provider"
import { SelectField, type SelectFieldProps } from "../select-field"

function renderWithProvider(props: SelectFieldProps) {
  render(
    defineComponent({
      setup() {
        return () => h(MarwesProvider, null, { default: () => h(SelectField, props) })
      },
    }),
  )
}

runSelectFieldContract("vue", {
  async renderSelectField(args) {
    const props = {
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

    renderWithProvider(props)
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

runSelectComboboxContract("vue", {
  async renderCustomSelectField(args = {}) {
    const props = {
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

    renderWithProvider(props)
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

describe("Vue SelectField specifics", () => {
  it("renders compact trigger and selected-state icons for the Marwes dropdown", async () => {
    const user = userEvent.setup()

    renderWithProvider({
      label: "Country",
      select: {
        native: false,
        placeholder: "Choose a country",
        options: [
          { value: "se", label: "Sweden" },
          { value: "us", label: "United States" },
        ],
      },
    })

    const control = screen.getByRole("combobox", { name: /country/i })
    const triggerIcon = control.querySelector("svg")

    expect(triggerIcon).not.toBeNull()
    expect(triggerIcon).toHaveAttribute("width", "16")
    expect(triggerIcon).toHaveAttribute("height", "16")

    await user.click(control)
    await user.click(screen.getByRole("option", { name: /united states/i }))
    await user.click(screen.getByRole("combobox", { name: /country/i }))

    const selectedIcon = screen.getByRole("option", { name: /united states/i }).querySelector("svg")

    expect(selectedIcon).not.toBeNull()
    expect(selectedIcon).toHaveAttribute("width", "16")
    expect(selectedIcon).toHaveAttribute("height", "16")
  })

  it("uses the custom Marwes combobox when native is false and updates the value on selection", async () => {
    const onValueChange = vi.fn()

    renderWithProvider({
      label: "Country",
      select: {
        native: false,
        placeholder: "Choose a country",
        options: [
          { value: "se", label: "Sweden" },
          { value: "us", label: "United States" },
        ],
        onValueChange,
      },
    })

    const control = screen.getByRole("combobox", { name: /country/i })
    expect(control.tagName).toBe("BUTTON")

    await userEvent.setup().click(control)
    await userEvent.setup().click(screen.getByRole("option", { name: /united states/i }))

    expect(onValueChange).toHaveBeenCalledWith("us")
    expect(screen.getByRole("combobox", { name: /country/i })).toHaveTextContent("United States")
  })

  it("defaults to the native select", () => {
    renderWithProvider({
      label: "Plan",
      select: {
        options: [
          { value: "starter", label: "Starter" },
          { value: "growth", label: "Growth" },
        ],
      },
    })

    const control = screen.getByRole("combobox", { name: /plan/i })

    expect(control.tagName).toBe("SELECT")
    expect(control).toHaveClass("mw-select--native")
  })
})
