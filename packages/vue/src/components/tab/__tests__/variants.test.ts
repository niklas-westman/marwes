/**
 * Vue adapter: Tests Tab purpose/variant components — verifies that each
 * purpose wrapper renders with the correct semantic defaults and metadata.
 */
import { render, screen } from "@testing-library/vue"
import { describe, expect, it } from "vitest"
import { defineComponent, h } from "vue"
import { MarwesProvider } from "../../../provider/marwes-provider"
import { ContentTabs, NavigationTabs, SettingsTabs } from "../variants"

function renderWithProvider(component: string, props: Record<string, unknown>) {
  return render(
    defineComponent({
      setup() {
        return () =>
          h(MarwesProvider, null, {
            default: () => h(component, props),
          })
      },
    }),
  )
}

const testTabs = [
  { value: "overview", label: "Overview", panel: "Overview panel" },
  { value: "details", label: "Details", panel: "Details panel" },
]

describe("Vue NavigationTabs", () => {
  it("adds navigation data-purpose metadata", () => {
    renderWithProvider(NavigationTabs as unknown as string, { label: "Navigation", tabs: testTabs })

    const wrapper = screen.getByRole("tablist", { name: /navigation/i }).closest(".mw-tab-group")
    expect(wrapper?.getAttribute("data-purpose")).toBe("navigation-tabs")
  })
})

describe("Vue ContentTabs", () => {
  it("adds content data-purpose metadata", () => {
    renderWithProvider(ContentTabs as unknown as string, { label: "Content", tabs: testTabs })

    const wrapper = screen.getByRole("tablist", { name: /content/i }).closest(".mw-tab-group")
    expect(wrapper?.getAttribute("data-purpose")).toBe("content-tabs")
  })
})

describe("Vue SettingsTabs", () => {
  it("adds settings data-purpose metadata", () => {
    renderWithProvider(SettingsTabs as unknown as string, { label: "Settings", tabs: testTabs })

    const wrapper = screen.getByRole("tablist", { name: /settings/i }).closest(".mw-tab-group")
    expect(wrapper?.getAttribute("data-purpose")).toBe("settings-tabs")
  })
})
