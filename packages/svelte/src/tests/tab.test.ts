/**
 * Svelte adapter: Tests TabGroup and Tab components — tablist role,
 * tab selection, aria-selected, and panel rendering.
 */
import { render } from "@testing-library/svelte"
import { describe, expect, it } from "vitest"
import ContentTabs from "../lib/components/tab/ContentTabs.svelte"
import NavigationTabs from "../lib/components/tab/NavigationTabs.svelte"
import SettingsTabs from "../lib/components/tab/SettingsTabs.svelte"
import TabGroup from "../lib/components/tab/TabGroup.svelte"

describe("TabGroup", () => {
  const defaultTabs = [
    { value: "a", label: "Tab A", panel: "Panel A" },
    { value: "b", label: "Tab B", panel: "Panel B" },
  ]

  it("renders a tablist", () => {
    const { container } = render(TabGroup, {
      props: { label: "Test tabs", tabs: defaultTabs },
    })
    const tablist = container.querySelector('[role="tablist"]')
    expect(tablist).not.toBeNull()
  })

  it("renders tab buttons", () => {
    const { container } = render(TabGroup, {
      props: { label: "Test tabs", tabs: defaultTabs },
    })
    const tabs = container.querySelectorAll('[role="tab"]')
    expect(tabs.length).toBe(2)
  })

  it("renders tab panels", () => {
    const { container } = render(TabGroup, {
      props: { label: "Test tabs", tabs: defaultTabs },
    })
    const panels = container.querySelectorAll('[role="tabpanel"]')
    expect(panels.length).toBeGreaterThanOrEqual(1)
  })

  it("selects the first tab by default", () => {
    const { container } = render(TabGroup, {
      props: { label: "Test tabs", tabs: defaultTabs },
    })
    const firstTab = container.querySelector('[role="tab"]')
    expect(firstTab?.getAttribute("aria-selected")).toBe("true")
  })

  it("includes mw-tab-group class", () => {
    const { container } = render(TabGroup, {
      props: { label: "Test tabs", tabs: defaultTabs },
    })
    const el = container.querySelector(".mw-tab-group")
    expect(el).not.toBeNull()
  })

  it("renders tab labels", () => {
    const { container } = render(TabGroup, {
      props: { label: "Test tabs", tabs: defaultTabs },
    })
    const tabs = container.querySelectorAll('[role="tab"]')
    expect(tabs[0]?.textContent).toContain("Tab A")
    expect(tabs[1]?.textContent).toContain("Tab B")
  })

  it.each([
    [NavigationTabs, "navigation-tabs"],
    [ContentTabs, "content-tabs"],
    [SettingsTabs, "settings-tabs"],
  ])("places purpose metadata on the tab group root", (Component, purpose) => {
    const { container } = render(Component, {
      props: { label: "Test tabs", tabs: defaultTabs },
    })

    const group = container.querySelector(".mw-tab-group")
    expect(group?.getAttribute("data-purpose")).toBe(purpose)
    expect(group?.parentElement?.getAttribute("data-purpose")).toBeNull()
  })
})
