/**
 * Vue adapter: Tests the Select component — wires the shared cross-adapter contract
 * and verifies adapter-specific rendering concerns.
 */
import userEvent from "@testing-library/user-event"
import { render, screen } from "@testing-library/vue"
import { describe, expect, it } from "vitest"
import { type Component, defineComponent, h } from "vue"
import { runSelectContract } from "../../../../../../tests/contracts/select.contract"
import { MarwesProvider } from "../../../provider/marwes-provider"
import { Select } from "../select"

function renderWithProvider(component: Component, props: Record<string, unknown>) {
  return render(
    defineComponent({
      setup() {
        return () => h(MarwesProvider, null, { default: () => h(component, props) })
      },
    }),
  )
}

runSelectContract("vue", {
  async renderSelect(args = {}) {
    const props = {
      ariaLabel: args.ariaLabel ?? "Select",
      options: args.options ?? [
        { value: "starter", label: "Starter" },
        { value: "growth", label: "Growth" },
      ],
      ...(args.defaultValue !== undefined ? { defaultValue: args.defaultValue } : {}),
      ...(args.disabled !== undefined ? { disabled: args.disabled } : {}),
      ...(args.required !== undefined ? { required: args.required } : {}),
      ...(args.placeholder !== undefined ? { placeholder: args.placeholder } : {}),
      ...(args.onValueChange ? { "onUpdate:modelValue": args.onValueChange } : {}),
    }

    renderWithProvider(Select, props)
  },
  getByRole(role, options) {
    return screen.getByRole(role, options) as HTMLSelectElement
  },
  getByText(text) {
    return screen.getByText(text)
  },
  async selectOptions(element, value) {
    await userEvent.setup().selectOptions(element, value)
  },
})

describe("Select", () => {
  it("defaults to Marwes appearance and marks placeholder state", () => {
    const { container } = renderWithProvider(Select, {
      ariaLabel: "Country",
      placeholder: "Choose a country",
      options: [
        { value: "se", label: "Sweden" },
        { value: "us", label: "United States" },
      ],
    })

    const select = screen.getByRole("combobox", { name: /country/i })

    expect(select.tagName).toBe("SELECT")
    expect(select).toHaveClass("mw-select--marwes")
    expect(select).toHaveAttribute("data-placeholder-selected", "true")
    expect(container.querySelector(".mw-select__control-icon")).not.toBeNull()
  })

  it("renders the provided arrow svg in Marwes mode when native is false", () => {
    const { container } = renderWithProvider(Select, {
      ariaLabel: "Country",
      native: false,
      options: [
        { value: "se", label: "Sweden" },
        { value: "us", label: "United States" },
      ],
    })

    const selectArrowIcon = container.querySelector(".mw-select__control-icon")

    expect(selectArrowIcon).not.toBeNull()
    expect(selectArrowIcon).toHaveAttribute("viewBox", "0 0 16 16")
  })

  it("supports the native appearance without losing select semantics", () => {
    const { container } = renderWithProvider(Select, {
      ariaLabel: "Plan",
      appearance: "native",
      options: [
        { value: "starter", label: "Starter" },
        { value: "growth", label: "Growth" },
      ],
    })

    const select = screen.getByRole("combobox", { name: /plan/i })

    expect(select.tagName).toBe("SELECT")
    expect(select).toHaveClass("mw-select--native")
    expect(container.querySelector(".mw-select__control-icon")).toBeNull()
  })

  it("supports the native boolean alias", () => {
    renderWithProvider(Select, {
      ariaLabel: "Locale",
      native: true,
      options: [
        { value: "sv", label: "Swedish" },
        { value: "en", label: "English" },
      ],
    })

    const select = screen.getByRole("combobox", { name: /locale/i })

    expect(select.tagName).toBe("SELECT")
    expect(select).toHaveClass("mw-select--native")
  })

  it("clears the placeholder state after an uncontrolled selection", async () => {
    renderWithProvider(Select, {
      ariaLabel: "Workspace",
      placeholder: "Choose a workspace",
      options: [
        { value: "starter", label: "Starter" },
        { value: "growth", label: "Growth" },
      ],
    })

    const select = screen.getByRole("combobox", { name: /workspace/i })
    await userEvent.setup().selectOptions(select, "growth")

    expect(select).toHaveValue("growth")
    expect(select).not.toHaveAttribute("data-placeholder-selected")
  })
})
