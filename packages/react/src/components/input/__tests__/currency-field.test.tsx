/**
 * React adapter: Tests the Currency Field molecule — wires the shared contract for label,
 * helper text, error state, and aria-describedby connections.
 */
import { fireEvent, render } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"
import { MarwesProvider } from "../../../provider/marwes-provider"
import { CurrencyField } from "../field-variants"

function renderCurrencyField(props: Parameters<typeof CurrencyField>[0]) {
  return render(
    <MarwesProvider>
      <CurrencyField {...props} />
    </MarwesProvider>,
  )
}

function queryLeadingSymbol() {
  return document.querySelector(".mw-input-field__leading-symbol")
}

describe("CurrencyField leading symbol", () => {
  it("renders a dollar symbol when currency is USD", () => {
    renderCurrencyField({ label: "Amount", currency: "USD" })
    const symbolElement = queryLeadingSymbol()
    expect(symbolElement).not.toBeNull()
    expect(symbolElement?.textContent).toBe("$")
  })

  it("renders a euro symbol when currency is EUR", () => {
    renderCurrencyField({ label: "Amount", currency: "EUR" })
    expect(queryLeadingSymbol()?.textContent).toBe("€")
  })

  it("renders a pound symbol when currency is GBP", () => {
    renderCurrencyField({ label: "Amount", currency: "GBP" })
    expect(queryLeadingSymbol()?.textContent).toBe("£")
  })

  it("renders a yen symbol when currency is JPY", () => {
    renderCurrencyField({ label: "Amount", currency: "JPY" })
    expect(queryLeadingSymbol()?.textContent).toBe("¥")
  })

  it("renders a multi-character symbol for SEK", () => {
    renderCurrencyField({ label: "Amount", currency: "SEK" })
    expect(queryLeadingSymbol()?.textContent).toBe("kr")
  })

  it("renders a crypto symbol for BTC", () => {
    renderCurrencyField({ label: "Amount", currency: "BTC" })
    expect(queryLeadingSymbol()?.textContent).toBe("₿")
  })

  it("does not render a leading symbol when currency is omitted", () => {
    renderCurrencyField({ label: "Amount" })
    expect(queryLeadingSymbol()).toBeNull()
  })

  it("does not render a leading symbol for invalid currency codes", () => {
    renderCurrencyField({ label: "Amount", currency: "INVALID" })
    expect(queryLeadingSymbol()).toBeNull()
  })
})

describe("CurrencyField input filtering", () => {
  it("strips letters from input value", () => {
    const handleValueChange = vi.fn()
    renderCurrencyField({
      label: "Amount",
      currency: "USD",
      input: { onValueChange: handleValueChange },
    })

    const inputElement = document.querySelector("input") as HTMLInputElement
    fireEvent.change(inputElement, { target: { value: "12abc" } })

    expect(handleValueChange).toHaveBeenCalledWith("12")
  })

  it("keeps only the first decimal point", () => {
    const handleValueChange = vi.fn()
    renderCurrencyField({
      label: "Amount",
      currency: "USD",
      input: { onValueChange: handleValueChange },
    })

    const inputElement = document.querySelector("input") as HTMLInputElement
    fireEvent.change(inputElement, { target: { value: "5.5.5" } })

    expect(handleValueChange).toHaveBeenCalledWith("5.55")
  })
})
