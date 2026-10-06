/**
 * Vue adapter: specialised input field wrappers must forward the InputField options they share,
 * since Vue only passes declared props through.
 */
import { render, screen } from "@testing-library/vue"
import { describe, expect, it } from "vitest"
import { defineComponent, h } from "vue"
import { MarwesProvider } from "../../../provider/marwes-provider"
import { EmailField, PasswordField, PhoneField, SearchField, URLField } from "../field-variants"

function renderField(component: unknown, props: Record<string, unknown>): void {
  render(
    defineComponent({
      setup() {
        return () => h(MarwesProvider, null, { default: () => h(component as never, props) })
      },
    }),
  )
}

describe("specialised field wrappers", () => {
  it.each([
    ["SearchField", SearchField],
    ["PasswordField", PasswordField],
    ["EmailField", EmailField],
    ["PhoneField", PhoneField],
    ["URLField", URLField],
  ] as const)("%s forwards leadingSymbol", (_name, component) => {
    renderField(component, { label: "Field", leadingSymbol: "kr" })

    expect(document.querySelector(".mw-input-field__leading-symbol")).toHaveTextContent("kr")
  })

  it("PasswordField forwards the password toggle labels", () => {
    renderField(PasswordField, { label: "Password", showPasswordLabel: "Visa lösenord" })

    expect(screen.getByRole("button", { name: /visa lösenord/i })).toBeInTheDocument()
  })

  it("SearchField forwards clearLabel", () => {
    renderField(SearchField, {
      label: "Search",
      clearLabel: "Rensa sökning",
      input: { value: "abc" },
    })

    expect(screen.getByRole("button", { name: /rensa sökning/i })).toBeInTheDocument()
  })
})
