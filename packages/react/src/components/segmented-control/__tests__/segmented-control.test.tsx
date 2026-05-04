import { SegmentedControlVariant } from "@marwes-ui/core"
import { fireEvent, render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import type * as React from "react"
import { describe, expect, it } from "vitest"
import { runSegmentedControlContract } from "../../../../../../tests/contracts/segmented-control.contract"
import { MarwesProvider } from "../../../provider/marwes-provider"
import { SegmentedControl } from "../segmented-control"

const defaultOptions = [
  { value: "list", label: "List" },
  { value: "grid", label: "Grid" },
  { value: "cards", label: "Cards" },
]

function renderWithProvider(ui: React.ReactElement) {
  return render(<MarwesProvider>{ui}</MarwesProvider>)
}

runSegmentedControlContract("react", {
  async renderSegmentedControl(args = {}) {
    const { options, ...restArgs } = args

    renderWithProvider(
      <SegmentedControl ariaLabel="View mode" options={options ?? defaultOptions} {...restArgs} />,
    )
  },
  getByRole(role, options) {
    return screen.getByRole(role, options)
  },
  getAllByRole(role) {
    return screen.getAllByRole(role)
  },
  async click(element) {
    await userEvent.setup().click(element)
  },
  keyDown(element, key) {
    fireEvent.keyDown(element, { key })
  },
})

describe("React adapter specifics: SegmentedControl", () => {
  it("renders option icons inside the item shell", () => {
    renderWithProvider(
      <SegmentedControl
        ariaLabel="Theme"
        options={[
          { value: "light", label: "Light", icon: <span data-testid="light-icon">☀</span> },
          { value: "dark", label: "Dark", icon: <span data-testid="dark-icon">☾</span> },
        ]}
      />,
    )

    expect(
      screen.getByTestId("light-icon").closest(".mw-segmented-control__item-icon"),
    ).not.toBeNull()
  })

  it("applies the contrast variant class", () => {
    renderWithProvider(
      <SegmentedControl
        ariaLabel="Theme mode"
        variant={SegmentedControlVariant.contrast}
        options={defaultOptions}
      />,
    )

    const group = screen.getByRole("radiogroup", { name: /theme mode/i })
    expect(group).toHaveClass("mw-segmented-control--contrast")
    expect(group).toHaveAttribute("data-variant", "contrast")
  })

  it("merges className with the recipe output", () => {
    renderWithProvider(
      <SegmentedControl ariaLabel="View mode" className="custom-class" options={defaultOptions} />,
    )

    expect(screen.getByRole("radiogroup", { name: /view mode/i })).toHaveClass(
      "mw-segmented-control",
      "custom-class",
    )
  })
})
