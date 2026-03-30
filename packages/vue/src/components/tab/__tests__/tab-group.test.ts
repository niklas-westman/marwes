import userEvent from "@testing-library/user-event"
import { render, screen } from "@testing-library/vue"
import { describe, expect, it, vi } from "vitest"
import { defineComponent, h } from "vue"
import { MarwesProvider } from "../../../provider/marwes-provider"
import { TabGroup, type TabGroupProps } from "../tab-group"

function renderTabGroup(props: TabGroupProps & Record<string, unknown>) {
  return render(
    defineComponent({
      setup() {
        return () =>
          h(MarwesProvider, null, {
            default: () => h(TabGroup as unknown as string, props),
          })
      },
    }),
  )
}

const testTabs = [
  { value: "overview", label: "Overview", panel: "Overview panel" },
  { value: "analytics", label: "Analytics", panel: "Analytics panel", disabled: true },
  { value: "settings", label: "Settings", panel: "Settings panel" },
]

describe("Vue TabGroup", () => {
  it("renders a labeled tablist with the selected panel", () => {
    renderTabGroup({
      label: "Account sections",
      tabs: testTabs,
      defaultActiveTab: "overview",
    })

    const tablist = screen.getByRole("tablist", { name: /account sections/i })
    expect(tablist).toBeTruthy()

    const overviewTab = screen.getByRole("tab", { name: /overview/i })
    expect(overviewTab.getAttribute("aria-selected")).toBe("true")

    const panel = screen.getByRole("tabpanel")
    expect(panel.textContent).toContain("Overview panel")
    expect(panel.querySelector(".mw-p")).not.toBeNull()
    expect(screen.getByText("Settings panel").closest("[hidden]")).not.toBeNull()
  })

  it("uses keyboard navigation and skips disabled tabs", async () => {
    const user = userEvent.setup()
    renderTabGroup({
      label: "Account sections",
      tabs: testTabs,
    })

    const overviewTab = screen.getByRole("tab", { name: /overview/i })
    overviewTab.focus()

    await user.keyboard("{ArrowRight}")

    const settingsTab = screen.getByRole("tab", { name: /settings/i })
    expect(settingsTab.getAttribute("aria-selected")).toBe("true")
    expect(document.activeElement).toBe(settingsTab)
    expect(screen.getByRole("tabpanel").textContent).toContain("Settings panel")
  })

  it("supports controlled activeTab state via update:activeTab", async () => {
    const user = userEvent.setup()
    const updateHandler = vi.fn()

    renderTabGroup({
      label: "Account sections",
      tabs: testTabs,
      activeTab: "overview",
      "onUpdate:activeTab": updateHandler,
    })

    await user.click(screen.getByRole("tab", { name: /settings/i }))

    expect(updateHandler).toHaveBeenCalledWith("settings")
    expect(screen.getByRole("tabpanel").textContent).toContain("Overview panel")
  })
})
