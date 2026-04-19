import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import type * as React from "react"
import { describe, expect, it } from "vitest"
import { runTabContract } from "../../../../../../tests/contracts/tab.contract"
import { MarwesProvider } from "../../../provider/marwes-provider"
import { TabGroup } from "../tab-group"

function renderWithProvider(ui: React.ReactElement) {
  return render(<MarwesProvider>{ui}</MarwesProvider>)
}

runTabContract("react", {
  async renderTabGroup(args = {}) {
    renderWithProvider(
      <TabGroup
        label={args.label}
        ariaLabel={args.ariaLabel}
        tabs={
          args.tabs ?? [
            { value: "overview", label: "Overview", panel: "Overview panel" },
            {
              value: "analytics",
              label: "Analytics",
              panel: "Analytics panel",
              disabled: true,
            },
            { value: "settings", label: "Settings", panel: "Settings panel" },
          ]
        }
        defaultActiveTab={args.defaultActiveTab}
        activeTab={args.activeTab}
        onActiveTabChange={args.onActiveTabChange}
      />,
    )
  },
  getByRole(role, options) {
    return screen.getByRole(role, options)
  },
  async click(element) {
    await userEvent.setup().click(element)
  },
  async keyboard(text) {
    await userEvent.setup().keyboard(text)
  },
})

describe("React TabGroup specifics", () => {
  it("wraps string panel content in a Paragraph inside the selected panel", () => {
    renderWithProvider(
      <TabGroup
        label="Account sections"
        tabs={[
          { value: "overview", label: "Overview", panel: "Overview panel" },
          { value: "settings", label: "Settings", panel: "Settings panel" },
        ]}
        defaultActiveTab="overview"
      />,
    )

    const panel = screen.getByRole("tabpanel")

    expect(panel.textContent).toContain("Overview panel")
    expect(panel.querySelector(".mw-p")).not.toBeNull()
    expect(screen.getByText("Settings panel").closest("[hidden]")).not.toBeNull()
  })
})
