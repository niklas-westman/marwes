/**
 * React adapter: Tests Radio purpose/variant components — verifies that each
 * purpose wrapper renders with the correct semantic defaults and metadata.
 */
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import type * as React from "react"
import { describe, expect, it } from "vitest"
import { MarwesProvider } from "../../../provider/marwes-provider"
import { OptionRadioGroup } from "../variants"
import { RatingRadioGroup } from "../variants"
import { YesNoRadioGroup } from "../variants"

function renderWithProvider(ui: React.ReactElement) {
  return render(<MarwesProvider>{ui}</MarwesProvider>)
}

describe("YesNoRadioGroup", () => {
  it("renders two options with values yes and no", () => {
    renderWithProvider(<YesNoRadioGroup name="accept" label="Accept terms?" />)

    const radios = screen.getAllByRole("radio")
    expect(radios).toHaveLength(2)

    expect(screen.getByRole("radio", { name: /yes/i })).toBeTruthy()
    expect(screen.getByRole("radio", { name: /no/i })).toBeTruthy()
  })

  it("supports custom labels", () => {
    renderWithProvider(
      <YesNoRadioGroup name="accept" label="Terms" yesLabel="Agree" noLabel="Disagree" />,
    )

    expect(screen.getByText("Agree")).toBeTruthy()
    expect(screen.getByText("Disagree")).toBeTruthy()
  })

  it("has data-purpose=binary-choice", () => {
    renderWithProvider(<YesNoRadioGroup name="accept" label="Accept?" />)

    const wrapper = screen.getByRole("radiogroup").closest("[data-purpose]")
    expect(wrapper?.getAttribute("data-purpose")).toBe("binary-choice")
  })

  it("pre-selects defaultValue", async () => {
    renderWithProvider(<YesNoRadioGroup name="accept" label="Accept?" defaultValue="yes" />)

    expect(screen.getByRole("radio", { name: /yes/i })).toBeChecked()
    expect(screen.getByRole("radio", { name: /no/i })).not.toBeChecked()
  })
})

describe("RatingRadioGroup", () => {
  it("renders 5 options by default (1-5)", () => {
    renderWithProvider(<RatingRadioGroup name="rate" label="Rating" />)

    const radios = screen.getAllByRole("radio")
    expect(radios).toHaveLength(5)
  })

  it("renders custom range with min/max", () => {
    renderWithProvider(<RatingRadioGroup name="rate" label="Rating" min={1} max={3} />)

    const radios = screen.getAllByRole("radio")
    expect(radios).toHaveLength(3)
  })

  it("has data-purpose=rating", () => {
    renderWithProvider(<RatingRadioGroup name="rate" label="Rating" />)

    const wrapper = screen.getByRole("radiogroup").closest("[data-purpose]")
    expect(wrapper?.getAttribute("data-purpose")).toBe("rating")
  })

  it("supports custom label function", () => {
    renderWithProvider(
      <RatingRadioGroup name="rate" label="Rating" min={1} max={3} labelFn={(v) => `${v} star`} />,
    )

    expect(screen.getByText("1 star")).toBeTruthy()
    expect(screen.getByText("2 star")).toBeTruthy()
    expect(screen.getByText("3 star")).toBeTruthy()
  })
})

describe("OptionRadioGroup", () => {
  it("renders provided options with labels", () => {
    renderWithProvider(
      <OptionRadioGroup
        name="fruit"
        label="Pick a fruit"
        options={[
          { value: "a", label: "Alpha" },
          { value: "b", label: "Beta" },
        ]}
      />,
    )

    expect(screen.getByText("Alpha")).toBeTruthy()
    expect(screen.getByText("Beta")).toBeTruthy()
    expect(screen.getAllByRole("radio")).toHaveLength(2)
  })

  it("has data-purpose=selection", () => {
    renderWithProvider(
      <OptionRadioGroup name="fruit" label="Pick" options={[{ value: "a", label: "Alpha" }]} />,
    )

    const wrapper = screen.getByRole("radiogroup").closest("[data-purpose]")
    expect(wrapper?.getAttribute("data-purpose")).toBe("selection")
  })

  it("supports switching selection", async () => {
    const user = userEvent.setup()
    renderWithProvider(
      <OptionRadioGroup
        name="fruit"
        label="Pick"
        options={[
          { value: "a", label: "Alpha" },
          { value: "b", label: "Beta" },
        ]}
        defaultValue="a"
      />,
    )

    const alphaRadio = screen.getByRole("radio", { name: /alpha/i })
    const betaRadio = screen.getByRole("radio", { name: /beta/i })

    expect(alphaRadio).toBeChecked()
    await user.click(betaRadio)
    expect(betaRadio).toBeChecked()
    expect(alphaRadio).not.toBeChecked()
  })
})
