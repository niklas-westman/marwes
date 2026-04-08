import { render, screen } from "@testing-library/react"
import type * as React from "react"
import { describe, expect, it } from "vitest"
import { runInputFieldContract } from "../../../../../../tests/contracts/input-field.contract"
import { MarwesProvider } from "../../../provider/marwes-provider"
import { InputField } from "../input-field"

function renderWithProvider(ui: React.ReactElement) {
  return render(<MarwesProvider>{ui}</MarwesProvider>)
}

runInputFieldContract("react", {
  async renderInputField(args) {
    const fieldProps = {
      label: args.label,
      ...(args.helperText !== undefined ? { helperText: args.helperText } : {}),
      ...(args.error !== undefined ? { error: args.error } : {}),
      ...(args.ariaDescribedBy !== undefined ? { ariaDescribedBy: args.ariaDescribedBy } : {}),
      input: { ariaLabel: args.label },
    }

    renderWithProvider(<InputField {...fieldProps} />)
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

describe("InputField leadingSymbol", () => {
  it("renders a leading symbol as text when leadingSymbol prop is provided", () => {
    renderWithProvider(<InputField label="Amount" input={{}} leadingSymbol="$" />)

    const leadingSymbolWrapper = document.querySelector(".mw-input-field__leading-symbol")
    expect(leadingSymbolWrapper).not.toBeNull()
    expect(leadingSymbolWrapper?.textContent).toBe("$")
    expect(leadingSymbolWrapper?.getAttribute("aria-hidden")).toBe("true")

    const svg = leadingSymbolWrapper?.querySelector("svg")
    expect(svg).toBeNull()
  })

  it("does not render a leading symbol when leadingSymbol prop is omitted", () => {
    renderWithProvider(<InputField label="Amount" input={{}} />)

    const leadingSymbolWrapper = document.querySelector(".mw-input-field__leading-symbol")
    expect(leadingSymbolWrapper).toBeNull()
  })
})
