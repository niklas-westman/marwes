import "@testing-library/jest-dom/vitest"
import { render, screen } from "@testing-library/svelte"
import { describe, expect, it } from "vitest"
import CurrencyField from "../lib/components/input/CurrencyField.svelte"
import DateOfBirthField from "../lib/components/input/DateOfBirthField.svelte"
import EmailField from "../lib/components/input/EmailField.svelte"
import PasswordField from "../lib/components/input/PasswordField.svelte"
import PhoneField from "../lib/components/input/PhoneField.svelte"
import SearchField from "../lib/components/input/SearchField.svelte"
import URLField from "../lib/components/input/URLField.svelte"
import ZipCodeField from "../lib/components/input/ZipCodeField.svelte"
import WithProviderFixture from "./type-fixtures/WithProviderFixture.svelte"

const purposeFields = {
  CurrencyField,
  DateOfBirthField,
  EmailField,
  PasswordField,
  PhoneField,
  SearchField,
  URLField,
  ZipCodeField,
}

// The wrappers bind `value` into InputField, whose own fallback makes Svelte reject a bound `undefined`.
describe("purpose fields without a value prop", () => {
  it.each(Object.entries(purposeFields))(
    "%s renders and exposes an empty input",
    (_name, Component) => {
      render(WithProviderFixture, { props: { Component, props: { label: "Field" } } })

      expect((screen.getByLabelText("Field") as HTMLInputElement).value).toBe("")
    },
  )

  it.each(Object.entries(purposeFields))("%s honours input.defaultValue", (_name, Component) => {
    render(WithProviderFixture, {
      props: { Component, props: { label: "Field", input: { defaultValue: "2000-01-01" } } },
    })

    expect((screen.getByLabelText("Field") as HTMLInputElement).value).not.toBe("")
  })
})
