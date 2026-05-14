/**
 * Vue adapter: Tests the TabGroup component — tab/panel wiring, keyboard navigation,
 * and automatic activation.
 */
import userEvent from "@testing-library/user-event"
import { render, screen } from "@testing-library/vue"
import { describe, expect, it } from "vitest"
import { defineComponent, h } from "vue"
import { runTabContract } from "../../../../../../tests/contracts/tab.contract"
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

runTabContract("vue", {
  async renderTabGroup(args = {}) {
    renderTabGroup({
      ...(args.label !== undefined ? { label: args.label } : {}),
      ...(args.ariaLabel !== undefined ? { ariaLabel: args.ariaLabel } : {}),
      tabs: args.tabs ?? [
        { value: "overview", label: "Overview", panel: "Overview panel" },
        {
          value: "analytics",
          label: "Analytics",
          panel: "Analytics panel",
          disabled: true,
        },
        { value: "settings", label: "Settings", panel: "Settings panel" },
      ],
      ...(args.defaultActiveTab !== undefined ? { defaultActiveTab: args.defaultActiveTab } : {}),
      ...(args.activeTab !== undefined ? { activeTab: args.activeTab } : {}),
      ...(args.onActiveTabChange !== undefined
        ? { "onUpdate:activeTab": args.onActiveTabChange }
        : {}),
    })
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

describe("Vue TabGroup specifics", () => {
  it("wraps string panel content in a Paragraph inside the selected panel", () => {
    renderTabGroup({
      label: "Account sections",
      tabs: [
        { value: "overview", label: "Overview", panel: "Overview panel" },
        { value: "settings", label: "Settings", panel: "Settings panel" },
      ],
      defaultActiveTab: "overview",
    })

    const panel = screen.getByRole("tabpanel")

    expect(panel.textContent).toContain("Overview panel")
    expect(panel.querySelector(".mw-p")).not.toBeNull()
    expect(screen.getByText("Settings panel").closest("[hidden]")).not.toBeNull()
  })
})
