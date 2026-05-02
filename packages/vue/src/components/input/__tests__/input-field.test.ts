import { render, screen } from "@testing-library/vue"
import { describe, expect, it } from "vitest"
import { defineComponent, h } from "vue"
import { runInputFieldContract } from "../../../../../../tests/contracts/input-field.contract"
import { MarwesProvider } from "../../../provider/marwes-provider"
import { InputField, type InputFieldProps } from "../input-field"

function renderWithProvider(props: InputFieldProps) {
  render(
    defineComponent({
      setup() {
        return () => h(MarwesProvider, null, { default: () => h(InputField, props) })
      },
    }),
  )
}

runInputFieldContract("vue", {
  async renderInputField(args) {
    const props = {
      label: args.label,
      ...(args.helperText !== undefined ? { helperText: args.helperText } : {}),
      ...(args.error !== undefined ? { error: args.error } : {}),
      ...(args.ariaDescribedBy !== undefined ? { ariaDescribedBy: args.ariaDescribedBy } : {}),
      input: {},
    }
    renderWithProvider(props)
  },
  getByLabelText(text) {
    return screen.getByLabelText(text) as HTMLInputElement
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

describe("Vue InputField leadingSymbol", () => {
  it("renders a leading symbol as text when leadingSymbol prop is provided", () => {
    renderWithProvider({ label: "Amount", leadingSymbol: "$" })

    const leadingSymbolWrapper = document.querySelector(".mw-input-field__leading-symbol")
    expect(leadingSymbolWrapper).not.toBeNull()
    expect(leadingSymbolWrapper?.textContent).toBe("$")
    expect(leadingSymbolWrapper?.getAttribute("aria-hidden")).toBe("true")

    const svg = leadingSymbolWrapper?.querySelector("svg")
    expect(svg).toBeNull()
  })

  it("does not render a leading symbol when leadingSymbol prop is omitted", () => {
    renderWithProvider({ label: "Amount" })

    const leadingSymbolWrapper = document.querySelector(".mw-input-field__leading-symbol")
    expect(leadingSymbolWrapper).toBeNull()
  })
})

describe("Vue InputField search affordance", () => {
  it("renders a search icon when the search field is empty", () => {
    renderWithProvider({ label: "Search", input: { type: "search" } })

    const searchIconWrapper = document.querySelector(".mw-input-field__search-icon")
    expect(searchIconWrapper).not.toBeNull()
    expect(searchIconWrapper?.getAttribute("aria-hidden")).toBe("true")
    expect(searchIconWrapper?.querySelector("svg")).not.toBeNull()
    expect(screen.queryByLabelText("Clear search")).toBeNull()
  })

  it("renders the clear button instead of the search icon when the search field has a value", () => {
    renderWithProvider({ label: "Search", input: { type: "search", value: "laptop" } })

    expect(screen.getByLabelText("Clear search")).toBeInTheDocument()
    expect(document.querySelector(".mw-input-field__search-icon")).toBeNull()
  })

  it("keeps the search icon for read-only search fields with a value", () => {
    renderWithProvider({
      label: "Search",
      input: { type: "search", value: "laptop", readOnly: true },
    })

    expect(screen.queryByLabelText("Clear search")).toBeNull()
    expect(document.querySelector(".mw-input-field__search-icon")).not.toBeNull()
  })
})
