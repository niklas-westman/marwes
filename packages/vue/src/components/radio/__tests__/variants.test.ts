/**
 * Vue adapter: Tests Radio purpose/variant components — verifies that each
 * purpose wrapper renders with the correct semantic defaults and metadata.
 */
import userEvent from "@testing-library/user-event"
import { render, screen } from "@testing-library/vue"
import { describe, expect, it } from "vitest"
import { defineComponent, h } from "vue"
import { MarwesProvider } from "../../../provider/marwes-provider"
import { OptionRadioGroup, RatingRadioGroup, YesNoRadioGroup } from "../variants"

function renderWithProvider(component: unknown, props: Record<string, unknown>) {
  render(
    defineComponent({
      setup() {
        return () => h(MarwesProvider, null, { default: () => h(component as never, props) })
      },
    }),
  )
}

describe("YesNoRadioGroup", () => {
  it("renders yes/no options", () => {
    renderWithProvider(YesNoRadioGroup, { name: "accept", label: "Accept terms?" })

    expect(screen.getByRole("radio", { name: /yes/i })).toBeTruthy()
    expect(screen.getByRole("radio", { name: /no/i })).toBeTruthy()
  })

  it("sets data-purpose=binary-choice", () => {
    renderWithProvider(YesNoRadioGroup, { name: "accept", label: "Accept terms?" })

    const wrapper = screen.getByRole("radiogroup").closest("[data-purpose]")
    expect(wrapper?.getAttribute("data-purpose")).toBe("binary-choice")
  })
})

describe("RatingRadioGroup", () => {
  it("renders default range 1-5", () => {
    renderWithProvider(RatingRadioGroup, { name: "rate", label: "Rating" })
    expect(screen.getAllByRole("radio")).toHaveLength(5)
  })

  it("sets data-purpose=rating", () => {
    renderWithProvider(RatingRadioGroup, { name: "rate", label: "Rating" })

    const wrapper = screen.getByRole("radiogroup").closest("[data-purpose]")
    expect(wrapper?.getAttribute("data-purpose")).toBe("rating")
  })
})

describe("OptionRadioGroup", () => {
  it("sets data-purpose=selection", () => {
    renderWithProvider(OptionRadioGroup, {
      name: "theme",
      label: "Theme",
      options: [{ value: "light", label: "Light" }],
    })

    const wrapper = screen.getByRole("radiogroup").closest("[data-purpose]")
    expect(wrapper?.getAttribute("data-purpose")).toBe("selection")
  })

  it("allows switching selection", async () => {
    const user = userEvent.setup()

    renderWithProvider(OptionRadioGroup, {
      name: "theme",
      label: "Theme",
      options: [
        { value: "light", label: "Light" },
        { value: "dark", label: "Dark" },
      ],
      defaultValue: "light",
    })

    const light = screen.getByRole("radio", { name: /light/i })
    const dark = screen.getByRole("radio", { name: /dark/i })

    expect(light).toBeChecked()
    await user.click(dark)
    expect(dark).toBeChecked()
  })
})
