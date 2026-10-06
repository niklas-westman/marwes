/**
 * Shared contract for Tab/TabGroup — tablist naming from visible label,
 * aria-label fallback, selected tab/panel wiring, and automatic Arrow activation
 * with disabled tab skipping.
 */
import type { TabOptions } from "@marwes-ui/core"
import { describe, expect, it } from "vitest"

export type TabContractItem = {
  value: string
  label: string
  panel: string
  disabled?: boolean
  ariaLabel?: string
}

export type TabContractHarness = {
  renderTabGroup(args?: {
    label?: string
    ariaLabel?: string
    defaultActiveTab?: string
    activeTab?: string
    onActiveTabChange?: (value: string) => void
    tabs?: TabContractItem[]
  }): Promise<void> | void
  getByRole(role: "tablist" | "tab" | "tabpanel", options?: { name?: RegExp | string }): HTMLElement
  click(element: HTMLElement): Promise<void>
  keyboard(text: string): Promise<void>
  /** Renders the base component with raw core options. */
  renderTabOptions(options: TabOptions): Promise<void> | void
  getTabRoot(): HTMLElement
}

function getControlledPanelElement(tab: HTMLElement): HTMLElement | null {
  const panelId = tab.getAttribute("aria-controls")

  if (!panelId) {
    return null
  }

  const panel = document.getElementById(panelId)
  return panel instanceof HTMLElement ? panel : null
}

type TabOptionCase = {
  options: TabOptions
  expectRendered: (tab: HTMLElement) => void
}

// Exhaustive on purpose: a new core TabOptions field fails to compile until every adapter's
// handling of it is described by a case.
const tabOptionCases: Record<keyof TabOptions, TabOptionCase> = {
  selected: {
    options: { selected: true },
    expectRendered: (tab) => {
      expect(tab).toHaveAttribute("aria-selected", "true")
      expect(tab).toHaveAttribute("tabindex", "0")
      expect(tab).toHaveClass("mw-tab--selected")
    },
  },
  disabled: {
    options: { disabled: true },
    expectRendered: (tab) => {
      expect(tab).toHaveAttribute("aria-disabled", "true")
      expect(tab).toHaveClass("mw-tab--disabled")
    },
  },
  ariaLabel: {
    options: { ariaLabel: "Overview tab" },
    expectRendered: (tab) => expect(tab).toHaveAttribute("aria-label", "Overview tab"),
  },
  label: {
    options: { label: "Overview tab" },
    expectRendered: (tab) => expect(tab).toHaveAttribute("aria-label", "Overview tab"),
  },
  ariaControls: {
    options: { ariaControls: "panel-1" },
    expectRendered: (tab) => expect(tab).toHaveAttribute("aria-controls", "panel-1"),
  },
}

export function runTabContract(adapterName: string, harness: TabContractHarness): void {
  describe(`Tab contract: ${adapterName}`, () => {
    it("names the tablist from a visible label", async () => {
      await harness.renderTabGroup({
        label: "Account sections",
        defaultActiveTab: "overview",
      })

      const tablist = harness.getByRole("tablist", { name: /account sections/i })
      const labelId = tablist.getAttribute("aria-labelledby")
      const labelElement = labelId ? document.getElementById(labelId) : null

      expect(tablist).toBeInTheDocument()
      expect(tablist).toHaveAttribute("aria-labelledby")
      expect(tablist).not.toHaveAttribute("aria-label")
      expect(labelElement).toHaveClass("mw-text", "mw-text--label")
    })

    it("falls back to aria-label when no visible label is provided", async () => {
      await harness.renderTabGroup({
        ariaLabel: "Profile sections",
        defaultActiveTab: "overview",
      })

      const tablist = harness.getByRole("tablist", { name: /profile sections/i })

      expect(tablist).toBeInTheDocument()
      expect(tablist).toHaveAttribute("aria-label", "Profile sections")
      expect(tablist).not.toHaveAttribute("aria-labelledby")
    })

    it("wires each selected tab to its tabpanel", async () => {
      await harness.renderTabGroup({
        label: "Account sections",
        defaultActiveTab: "overview",
      })

      const overviewTab = harness.getByRole("tab", { name: /overview/i })
      const overviewPanel = getControlledPanelElement(overviewTab)

      expect(overviewTab).toHaveAttribute("aria-selected", "true")
      expect(overviewTab.id).toBeTruthy()
      expect(overviewPanel).not.toBeNull()
      expect(overviewPanel).toHaveAttribute("role", "tabpanel")
      expect(overviewPanel).toHaveAttribute("aria-labelledby", overviewTab.id)
      expect(overviewPanel).toHaveTextContent("Overview panel")
      expect(overviewPanel).toHaveAttribute("tabindex", "0")
    })

    it("uses automatic activation on Arrow navigation and skips disabled tabs", async () => {
      await harness.renderTabGroup({
        label: "Account sections",
        defaultActiveTab: "overview",
      })

      const overviewTab = harness.getByRole("tab", { name: /overview/i })
      overviewTab.focus()

      await harness.keyboard("{ArrowRight}")

      const settingsTab = harness.getByRole("tab", { name: /settings/i })
      expect(settingsTab).toHaveAttribute("aria-selected", "true")
      expect(document.activeElement).toBe(settingsTab)
      expect(getControlledPanelElement(settingsTab)).toHaveTextContent("Settings panel")

      await harness.keyboard("{ArrowLeft}")

      expect(overviewTab).toHaveAttribute("aria-selected", "true")
      expect(document.activeElement).toBe(overviewTab)
      expect(getControlledPanelElement(overviewTab)).toHaveTextContent("Overview panel")
    })

    it("wraps across enabled tabs and supports Home and End", async () => {
      await harness.renderTabGroup({
        label: "Account sections",
        defaultActiveTab: "overview",
      })

      const overviewTab = harness.getByRole("tab", { name: /overview/i })
      overviewTab.focus()

      await harness.keyboard("{End}")

      const settingsTab = harness.getByRole("tab", { name: /settings/i })
      expect(settingsTab).toHaveAttribute("aria-selected", "true")
      expect(document.activeElement).toBe(settingsTab)

      await harness.keyboard("{ArrowRight}")

      expect(overviewTab).toHaveAttribute("aria-selected", "true")
      expect(document.activeElement).toBe(overviewTab)

      await harness.keyboard("{Home}")

      expect(overviewTab).toHaveAttribute("aria-selected", "true")
      expect(document.activeElement).toBe(overviewTab)
    })

    it("falls back to the first enabled tab when defaultActiveTab points to a disabled tab", async () => {
      await harness.renderTabGroup({
        label: "Account sections",
        defaultActiveTab: "analytics",
      })

      const overviewTab = harness.getByRole("tab", { name: /overview/i })

      expect(overviewTab).toHaveAttribute("aria-selected", "true")
      expect(getControlledPanelElement(overviewTab)).toHaveTextContent("Overview panel")
    })

    it("falls back to the first enabled tab when activeTab points to a disabled tab", async () => {
      await harness.renderTabGroup({
        label: "Account sections",
        activeTab: "analytics",
      })

      const overviewTab = harness.getByRole("tab", { name: /overview/i })

      expect(overviewTab).toHaveAttribute("aria-selected", "true")
      expect(getControlledPanelElement(overviewTab)).toHaveTextContent("Overview panel")
    })

    it("does not activate disabled tabs when clicked", async () => {
      await harness.renderTabGroup({
        label: "Account sections",
        defaultActiveTab: "overview",
      })

      const overviewTab = harness.getByRole("tab", { name: /overview/i })
      const analyticsTab = harness.getByRole("tab", { name: /analytics/i })

      expect(analyticsTab).toBeDisabled()
      expect(analyticsTab).toHaveAttribute("aria-disabled", "true")

      await harness.click(analyticsTab)

      expect(overviewTab).toHaveAttribute("aria-selected", "true")
      expect(getControlledPanelElement(overviewTab)).toHaveTextContent("Overview panel")
    })

    it("keeps selection controlled while still emitting the next tab value", async () => {
      const emittedValues: string[] = []

      await harness.renderTabGroup({
        label: "Account sections",
        activeTab: "overview",
        onActiveTabChange: (value) => {
          emittedValues.push(value)
        },
      })

      const settingsTab = harness.getByRole("tab", { name: /settings/i })
      await harness.click(settingsTab)

      const overviewTab = harness.getByRole("tab", { name: /overview/i })

      expect(emittedValues).toEqual(["settings"])
      expect(overviewTab).toHaveAttribute("aria-selected", "true")
      expect(getControlledPanelElement(overviewTab)).toHaveTextContent("Overview panel")
    })

    it("names an unlabelled tablist 'Tabs' instead of leaving it anonymous", async () => {
      await harness.renderTabGroup({ defaultActiveTab: "overview" })

      const tablist = harness.getByRole("tablist", { name: /tabs/i })

      expect(tablist).toHaveAttribute("aria-label", "Tabs")
      expect(tablist).not.toHaveAttribute("aria-labelledby")
    })

    it("hides inactive panels and keeps them labelled by their tab", async () => {
      await harness.renderTabGroup({ label: "Account sections", defaultActiveTab: "overview" })

      const settingsTab = harness.getByRole("tab", { name: /settings/i })
      const settingsPanel = getControlledPanelElement(settingsTab)

      expect(settingsPanel).not.toBeNull()
      expect(settingsPanel).toHaveAttribute("hidden")
      expect(settingsPanel).not.toHaveAttribute("tabindex")
      expect(settingsPanel).toHaveAttribute("role", "tabpanel")
      expect(settingsPanel).toHaveAttribute("aria-labelledby", settingsTab.id)
    })

    it("keeps only the selected enabled tab in the tab order", async () => {
      await harness.renderTabGroup({ label: "Account sections", defaultActiveTab: "overview" })

      expect(harness.getByRole("tab", { name: /overview/i })).toHaveAttribute("tabindex", "0")
      expect(harness.getByRole("tab", { name: /settings/i })).toHaveAttribute("tabindex", "-1")

      const analyticsTab = harness.getByRole("tab", { name: /analytics/i })
      expect(analyticsTab).toHaveAttribute("tabindex", "-1")
      expect(analyticsTab).toHaveAttribute("aria-disabled", "true")
    })

    describe("every core option reaches the DOM", () => {
      it.each(Object.entries(tabOptionCases))("%s", async (_optionName, optionCase) => {
        await harness.renderTabOptions(optionCase.options)

        const element = harness.getTabRoot()
        expect(element).toBeInTheDocument()
        optionCase.expectRendered?.(element)
      })
    })
  })
}
