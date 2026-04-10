import { render, screen } from "@testing-library/react"
import type * as React from "react"
import { describe, expect, it } from "vitest"
import { MarwesProvider } from "../../../provider/marwes-provider"
import { Tooltip } from "../tooltip"

function renderWithProvider(ui: React.ReactElement) {
  return render(<MarwesProvider>{ui}</MarwesProvider>)
}

describe("Tooltip (Atom)", () => {
  it("renders a tooltip bubble with the core recipe class", () => {
    renderWithProvider(<Tooltip>Tooltip text</Tooltip>)

    const tooltip = screen.getByRole("tooltip")
    expect(tooltip.tagName).toBe("SPAN")
    expect(tooltip.className).toContain("mw-tooltip")
    expect(tooltip).toHaveAttribute("data-component", "tooltip")
  })

  it("passes through the id and merges className", () => {
    renderWithProvider(
      <Tooltip id="help-tooltip" className="custom-tooltip">
        Tooltip text
      </Tooltip>,
    )

    const tooltip = screen.getByRole("tooltip")
    expect(tooltip.id).toBe("help-tooltip")
    expect(tooltip.className).toContain("custom-tooltip")
  })
})
