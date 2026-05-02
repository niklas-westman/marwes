import { render, screen } from "@testing-library/react"
import type * as React from "react"
import { describe, expect, it } from "vitest"
import { MarwesProvider } from "../../../provider/marwes-provider"
import { FeatureToggle, PermissionSwitch, PreferenceSwitch } from "../variants"

function renderWithProvider(ui: React.ReactElement) {
  return render(<MarwesProvider>{ui}</MarwesProvider>)
}

describe("FeatureToggle", () => {
  it("adds feature-toggle data-purpose metadata", () => {
    renderWithProvider(<FeatureToggle label="Enable beta dashboard" switch={{ checked: true }} />)

    const wrapper = screen
      .getByRole("switch", { name: /enable beta dashboard/i })
      .closest(".mw-switch-field")
    expect(wrapper?.getAttribute("data-purpose")).toBe("feature-toggle")
  })
})

describe("PreferenceSwitch", () => {
  it("adds preference data-purpose metadata", () => {
    renderWithProvider(<PreferenceSwitch label="Use compact layout" switch={{ checked: false }} />)

    const wrapper = screen
      .getByRole("switch", { name: /use compact layout/i })
      .closest(".mw-switch-field")
    expect(wrapper?.getAttribute("data-purpose")).toBe("preference")
  })
})

describe("PermissionSwitch", () => {
  it("adds permission data-purpose metadata", () => {
    renderWithProvider(<PermissionSwitch label="Can manage billing" switch={{ checked: true }} />)

    const wrapper = screen
      .getByRole("switch", { name: /can manage billing/i })
      .closest(".mw-switch-field")
    expect(wrapper?.getAttribute("data-purpose")).toBe("permission")
  })
})
