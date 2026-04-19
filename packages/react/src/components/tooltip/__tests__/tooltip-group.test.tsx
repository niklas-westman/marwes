import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import type * as React from "react"
import { describe, expect, it } from "vitest"
import { runTooltipContract } from "../../../../../../tests/contracts/tooltip.contract"
import { MarwesProvider } from "../../../provider/marwes-provider"
import { Tooltip } from "../tooltip"
import { TooltipGroup } from "../tooltip-group"

function renderWithProvider(ui: React.ReactElement) {
  return render(<MarwesProvider>{ui}</MarwesProvider>)
}

runTooltipContract("react", {
  async renderTooltip(args = {}) {
    renderWithProvider(<Tooltip id={args.id}>{args.children ?? "Helpful billing context"}</Tooltip>)
  },
  async renderTooltipGroup(args = {}) {
    renderWithProvider(
      <>
        <TooltipGroup
          content={args.content ?? "Helpful billing context"}
          triggerLabel={args.triggerLabel}
          open={args.open}
          defaultOpen={args.defaultOpen}
          onOpenChange={args.onOpenChange}
          tooltipId={args.tooltipId}
        />
        <button type="button">Outside</button>
      </>,
    )
  },
  getByRole(role, options) {
    return screen.getByRole(role, options)
  },
  queryByRole(role, options) {
    return screen.queryByRole(role, options)
  },
  getByText(text) {
    return screen.getByText(text)
  },
  async hover(element) {
    await userEvent.setup().hover(element)
  },
  async unhover(element) {
    await userEvent.setup().unhover(element)
  },
  async click(element) {
    await userEvent.setup().click(element)
  },
  async tab() {
    await userEvent.setup().tab()
  },
  async keyboard(text) {
    await userEvent.setup().keyboard(text)
  },
})

describe("React TooltipGroup specifics", () => {
  it("supports renderable content inside the tooltip bubble", () => {
    renderWithProvider(
      <TooltipGroup
        content={<strong>Helpful billing context</strong>}
        triggerLabel="Show billing help"
        defaultOpen
      />,
    )

    const tooltip = screen.getByRole("tooltip")
    const emphasizedText = screen.getByText("Helpful billing context")

    expect(tooltip).toContainElement(emphasizedText)
    expect(emphasizedText.tagName).toBe("STRONG")
  })
})
