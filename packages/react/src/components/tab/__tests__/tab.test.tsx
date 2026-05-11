/**
 * React adapter: Tests the Tab component — wires the shared cross-adapter contract
 * and verifies adapter-specific rendering concerns.
 */
import { render, screen } from "@testing-library/react"
import type * as React from "react"
import { describe, expect, it } from "vitest"
import { MarwesProvider } from "../../../provider/marwes-provider"
import { Tab } from "../tab"

function renderWithProvider(ui: React.ReactElement) {
  return render(<MarwesProvider>{ui}</MarwesProvider>)
}

describe("React Tab", () => {
  it("uses ariaLabel for icon-only tabs", () => {
    renderWithProvider(
      <div role="tablist" aria-label="Example tabs">
        <Tab ariaLabel="Settings" ariaControls="panel-settings">
          <span aria-hidden="true">⚙️</span>
        </Tab>
      </div>,
    )

    const tab = screen.getByRole("tab", { name: /settings/i })

    expect(tab).toHaveAttribute("aria-label", "Settings")
    expect(tab).toHaveAttribute("aria-controls", "panel-settings")
  })

  it("renders disabled tabs as disabled controls with aria-disabled and tabIndex -1", () => {
    renderWithProvider(
      <div role="tablist" aria-label="Example tabs">
        <Tab disabled ariaControls="panel-settings">
          Settings
        </Tab>
      </div>,
    )

    const tab = screen.getByRole("tab", { name: /settings/i })

    expect(tab).toBeDisabled()
    expect(tab).toHaveAttribute("aria-disabled", "true")
    expect(tab).toHaveAttribute("tabindex", "-1")
  })
})
