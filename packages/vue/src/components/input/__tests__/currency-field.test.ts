import { fireEvent, render, screen } from "@testing-library/vue"
import { describe, expect, it, vi } from "vitest"
import { defineComponent, h } from "vue"
import { MarwesProvider } from "../../../provider/marwes-provider"
import type { CurrencyFieldProps } from "../field-variants"
import { CurrencyField } from "../field-variants"

function renderCurrencyField(props: CurrencyFieldProps) {
  render(
    defineComponent({
      setup() {
        return () => h(MarwesProvider, null, { default: () => h(CurrencyField, props) })
      },
    }),
  )
}

function queryLeadingSymbol() {
  return document.querySelector(".mw-input-field__leading-symbol")
}

describe("Vue CurrencyField leading symbol", () => {
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

describe("Vue CurrencyField prop forwarding", () => {
  it("forwards the label to InputField", () => {
    renderCurrencyField({ label: "Amount", currency: "USD" })

    expect(screen.getByLabelText("Amount")).toBeTruthy()
  })

  it("forwards controlled modelValue updates", async () => {
    const handleModelValueUpdate = vi.fn()

    render(
      defineComponent({
        setup() {
          return () =>
            h(MarwesProvider, null, {
              default: () =>
                h(CurrencyField, {
                  label: "Amount",
                  currency: "USD",
                  modelValue: "12",
                  "onUpdate:modelValue": handleModelValueUpdate,
                }),
            })
        },
      }),
    )

    const inputElement = screen.getByLabelText("Amount") as HTMLInputElement
    await fireEvent.update(inputElement, "12abc")

    expect(handleModelValueUpdate).toHaveBeenCalledWith("12")
  })
})

describe("Vue CurrencyField input filtering", () => {
  it("strips letters from input value", async () => {
    const handleValueChange = vi.fn()
    renderCurrencyField({
      label: "Amount",
      currency: "USD",
      input: { onValueChange: handleValueChange },
    })

    const inputElement = document.querySelector("input") as HTMLInputElement
    await fireEvent.update(inputElement, "12abc")

    expect(handleValueChange).toHaveBeenCalledWith("12")
  })

  it("keeps only the first decimal point", async () => {
    const handleValueChange = vi.fn()
    renderCurrencyField({
      label: "Amount",
      currency: "USD",
      input: { onValueChange: handleValueChange },
    })

    const inputElement = document.querySelector("input") as HTMLInputElement
    await fireEvent.update(inputElement, "5.5.5")

    expect(handleValueChange).toHaveBeenCalledWith("5.55")
  })
})
