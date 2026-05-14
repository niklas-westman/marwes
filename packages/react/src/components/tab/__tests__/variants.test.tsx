/**
 * React adapter: Tests Tab purpose/variant components — verifies that each
 * purpose wrapper renders with the correct semantic defaults and metadata.
 */
import { render, screen } from "@testing-library/react"
import type * as React from "react"
import { describe, expect, it } from "vitest"
import { MarwesProvider } from "../../../provider/marwes-provider"
import { ContentTabs, NavigationTabs, SettingsTabs } from "../variants"

function renderWithProvider(ui: React.ReactElement) {
  return render(<MarwesProvider>{ui}</MarwesProvider>)
}

const testTabs = [
  { value: "overview", label: "Overview", panel: "Overview panel" },
  { value: "details", label: "Details", panel: "Details panel" },
]

describe("NavigationTabs", () => {
  it("adds navigation data-purpose metadata", () => {
    renderWithProvider(<NavigationTabs label="Navigation" tabs={testTabs} />)

    const wrapper = screen.getByRole("tablist", { name: /navigation/i }).closest(".mw-tab-group")
    expect(wrapper?.getAttribute("data-purpose")).toBe("navigation-tabs")
  })
})

describe("ContentTabs", () => {
  it("adds content data-purpose metadata", () => {
    renderWithProvider(<ContentTabs label="Content" tabs={testTabs} />)

    const wrapper = screen.getByRole("tablist", { name: /content/i }).closest(".mw-tab-group")
    expect(wrapper?.getAttribute("data-purpose")).toBe("content-tabs")
  })
})

describe("SettingsTabs", () => {
  it("adds settings data-purpose metadata", () => {
    renderWithProvider(<SettingsTabs label="Settings" tabs={testTabs} />)

    const wrapper = screen.getByRole("tablist", { name: /settings/i }).closest(".mw-tab-group")
    expect(wrapper?.getAttribute("data-purpose")).toBe("settings-tabs")
  })
})
