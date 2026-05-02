import type * as React from "react"

import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it } from "vitest"
import { Switch, SwitchField } from ".."
import { runSwitchContract } from "../../../../../../tests/contracts/switch.contract"
import { MarwesProvider } from "../../../provider/marwes-provider"

function renderWithProvider(ui: React.ReactElement) {
  return render(<MarwesProvider>{ui}</MarwesProvider>)
}

runSwitchContract("react", {
  async renderSwitch(args = {}) {
    const switchProps = {
      ...(args.ariaLabel !== undefined ? { ariaLabel: args.ariaLabel } : {}),
      ...(args.checked !== undefined ? { checked: args.checked } : {}),
      ...(args.disabled !== undefined ? { disabled: args.disabled } : {}),
      ...(args.onCheckedChange !== undefined ? { onCheckedChange: args.onCheckedChange } : {}),
    }

    renderWithProvider(<Switch {...switchProps} />)
  },
  async renderSwitchField(args) {
    const fieldProps = {
      label: args.label,
      ...(args.description !== undefined ? { description: args.description } : {}),
      ...(args.error !== undefined ? { error: args.error } : {}),
      ...(args.ariaDescribedBy !== undefined ? { ariaDescribedBy: args.ariaDescribedBy } : {}),
      switch: {
        ...(args.checked !== undefined ? { checked: args.checked } : {}),
        ...(args.onCheckedChange !== undefined ? { onCheckedChange: args.onCheckedChange } : {}),
      },
    }

    renderWithProvider(<SwitchField {...fieldProps} />)
  },
  getByRole(role, options) {
    return screen.getByRole(role, options)
  },
  getByText(text) {
    return screen.getByText(text)
  },
  queryDescriptionRegion() {
    return document.querySelector(".mw-switch-field__description")
  },
  queryErrorRegion() {
    return document.querySelector(".mw-switch-field__error")
  },
  async click(element) {
    await userEvent.setup().click(element)
  },
})

describe("React adapter specifics: Switch", () => {
  it("uses visible child content as the accessible name for direct switch usage", () => {
    renderWithProvider(<Switch>Enable notifications</Switch>)

    expect(screen.getByRole("switch", { name: /enable notifications/i })).toBeInTheDocument()
  })

  it("applies size modifier classes for the public size API", () => {
    renderWithProvider(
      <>
        <Switch ariaLabel="Compact switch" size="compact" />
        <Switch ariaLabel="Wide switch" size="wide" />
        <Switch ariaLabel="Rich switch" size="rich" />
      </>,
    )

    expect(screen.getByRole("switch", { name: "Compact switch" })).toHaveClass("mw-switch--compact")
    expect(screen.getByRole("switch", { name: "Wide switch" })).toHaveClass("mw-switch--wide")
    expect(screen.getByRole("switch", { name: "Rich switch" })).toHaveClass("mw-switch--rich")
  })

  it("merges className with the recipe output", () => {
    renderWithProvider(<Switch ariaLabel="Custom switch" size="wide" className="custom-class" />)

    const switchButton = screen.getByRole("switch", { name: "Custom switch" })
    expect(switchButton).toHaveClass("mw-switch", "mw-switch--wide", "custom-class")
  })
})
