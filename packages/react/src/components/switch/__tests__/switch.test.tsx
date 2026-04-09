import type * as React from "react"

import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it, vi } from "vitest"
import { Switch } from ".."
import { MarwesProvider } from "../../../provider/marwes-provider"

function renderWithProvider(ui: React.ReactElement) {
  return render(<MarwesProvider>{ui}</MarwesProvider>)
}

describe("React adapter specifics: Switch", () => {
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

  it("renders a disabled button and does not emit checked changes", async () => {
    const onCheckedChange = vi.fn()

    renderWithProvider(
      <Switch ariaLabel="Disabled switch" checked disabled onCheckedChange={onCheckedChange} />,
    )

    const switchButton = screen.getByRole("switch", { name: "Disabled switch" })
    expect(switchButton).toBeDisabled()

    await userEvent.setup().click(switchButton)

    expect(onCheckedChange).not.toHaveBeenCalled()
  })
})
