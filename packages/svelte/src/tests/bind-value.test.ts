/**
 * Svelte-only: `bind:value` must write back through every specialised field and slider preset,
 * and `defaultValue` must keep working through the field wrappers. Svelte's rest-props proxy
 * has no setter, so wrappers must declare `value` as `$bindable` and pass it on with `bind:`.
 */
import "@testing-library/jest-dom/vitest"
import { fireEvent, render, screen } from "@testing-library/svelte"
import { describe, expect, it } from "vitest"
import CurrencyField from "../lib/components/input/CurrencyField.svelte"
import DateOfBirthField from "../lib/components/input/DateOfBirthField.svelte"
import EmailField from "../lib/components/input/EmailField.svelte"
import InputField from "../lib/components/input/InputField.svelte"
import PasswordField from "../lib/components/input/PasswordField.svelte"
import PhoneField from "../lib/components/input/PhoneField.svelte"
import SearchField from "../lib/components/input/SearchField.svelte"
import URLField from "../lib/components/input/URLField.svelte"
import ZipCodeField from "../lib/components/input/ZipCodeField.svelte"
import BrightnessSlider from "../lib/components/slider/BrightnessSlider.svelte"
import RadiusSlider from "../lib/components/slider/RadiusSlider.svelte"
import VolumeSlider from "../lib/components/slider/VolumeSlider.svelte"
import BindValueFixture from "./type-fixtures/BindValueFixture.svelte"

const textFields = [
  ["InputField", InputField, "hello"],
  ["EmailField", EmailField, "a@b.se"],
  ["PasswordField", PasswordField, "secret"],
  ["PhoneField", PhoneField, "0701234567"],
  ["SearchField", SearchField, "query"],
  ["URLField", URLField, "https://marwes.dev"],
  ["CurrencyField", CurrencyField, "12"],
  ["ZipCodeField", ZipCodeField, "12345"],
] as const

describe("Svelte bind:value through field wrappers", () => {
  it.each(textFields)(
    "%s writes typed text back to the bound value",
    async (_name, Component, typed) => {
      render(BindValueFixture, { props: { Component, initial: "", props: { label: "Field" } } })

      const input = document.querySelector("input") as HTMLInputElement
      await fireEvent.input(input, { target: { value: typed } })

      expect(screen.getByTestId("bound")).toHaveTextContent(typed)
    },
  )

  it("DateOfBirthField writes the chosen date back to the bound value", async () => {
    render(BindValueFixture, {
      props: { Component: DateOfBirthField, initial: "", props: { label: "Birthday" } },
    })

    const input = document.querySelector("input") as HTMLInputElement
    await fireEvent.input(input, { target: { value: "1990-04-02" } })

    expect(screen.getByTestId("bound")).toHaveTextContent("1990-04-02")
  })

  it.each([
    ["VolumeSlider", VolumeSlider],
    ["BrightnessSlider", BrightnessSlider],
    ["RadiusSlider", RadiusSlider],
  ] as const)("%s writes the slider value back to the bound value", async (_name, Component) => {
    render(BindValueFixture, { props: { Component, initial: 10 } })

    const range = document.querySelector('input[type="range"]') as HTMLInputElement
    await fireEvent.input(range, { target: { value: "30" } })

    expect(screen.getByTestId("bound")).toHaveTextContent("30")
  })
})
