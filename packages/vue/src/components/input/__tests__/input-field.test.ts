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
      input: { ariaLabel: args.label },
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
