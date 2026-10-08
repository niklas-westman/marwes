/**
 * Shared contract for TabGroup transitions — controlled activeTab updates, disabled-state changes
 * and a server-rendered active tab surviving hydration. Complements tab.contract.ts, which only
 * renders once.
 */
import { describe, expect, it } from "vitest"

export interface TabUpdatesItem {
  value: string
  label: string
  panel: string
  disabled?: boolean
}

export interface TabUpdatesProps {
  ariaLabel: string
  tabs: TabUpdatesItem[]
  activeTab?: string
  onActiveTabChange?: (value: string) => void
}

export interface TabUpdatesHarness {
  render(props: TabUpdatesProps): Promise<void> | void
  /** Re-renders the already mounted TabGroup with new props and flushes updates. */
  rerender(props: TabUpdatesProps): Promise<void> | void
  /**
   * Server-renders the props, mounts that markup into the document, hydrates it on the client and
   * resolves with every warning or error the framework reported while doing so.
   */
  hydrate(props: TabUpdatesProps): Promise<string[]>
  getTab(name: string): HTMLElement
  getAllTabs(): HTMLElement[]
  getVisiblePanels(): HTMLElement[]
  click(element: HTMLElement): Promise<void>
  keyboard(text: string): Promise<void>
}

const ariaLabel = "Sections"

function tabs(overrides: Record<string, Partial<TabUpdatesItem>> = {}): TabUpdatesItem[] {
  return [
    { value: "overview", label: "Overview", panel: "Overview panel" },
    { value: "analytics", label: "Analytics", panel: "Analytics panel" },
    { value: "settings", label: "Settings", panel: "Settings panel" },
  ].map((tab) => ({ ...tab, ...overrides[tab.value] }))
}

function expectOnlyTabActive(h: TabUpdatesHarness, activeLabel: string, activePanel: string): void {
  const selectedTabs = h.getAllTabs().filter((tab) => tab.getAttribute("aria-selected") === "true")

  expect(selectedTabs).toHaveLength(1)
  expect(selectedTabs[0]).toBe(h.getTab(activeLabel))
  expect(selectedTabs[0]).toHaveAttribute("tabindex", "0")

  for (const tab of h.getAllTabs()) {
    if (tab !== selectedTabs[0]) {
      expect(tab).toHaveAttribute("tabindex", "-1")
    }
  }

  const panels = h.getVisiblePanels()
  expect(panels).toHaveLength(1)
  expect(panels[0]).toHaveTextContent(activePanel)
  expect(panels[0]?.getAttribute("aria-labelledby")).toBe(selectedTabs[0]?.id)
  expect(selectedTabs[0]?.getAttribute("aria-controls")).toBe(panels[0]?.id)
}

export function runTabUpdatesContract(adapterName: string, h: TabUpdatesHarness): void {
  describe(`Tab updates contract: ${adapterName}`, () => {
    it("moves selection, roving tabindex and visible panel together on a controlled update", async () => {
      const changes: string[] = []
      const onActiveTabChange = (value: string): void => {
        changes.push(value)
      }

      await h.render({ ariaLabel, tabs: tabs(), activeTab: "overview", onActiveTabChange })
      expectOnlyTabActive(h, "Overview", "Overview panel")

      await h.rerender({ ariaLabel, tabs: tabs(), activeTab: "settings", onActiveTabChange })

      expectOnlyTabActive(h, "Settings", "Settings panel")
      expect(changes).toEqual([])
    })

    it("skips a tab that becomes disabled during arrow navigation", async () => {
      await h.render({ ariaLabel, tabs: tabs() })
      await h.rerender({ ariaLabel, tabs: tabs({ analytics: { disabled: true } }) })

      await h.click(h.getTab("Overview"))
      await h.keyboard("{ArrowRight}")

      expectOnlyTabActive(h, "Settings", "Settings panel")
    })

    it("keeps exactly one enabled tab active when the active tab becomes disabled", async () => {
      await h.render({ ariaLabel, tabs: tabs(), activeTab: "analytics" })
      expectOnlyTabActive(h, "Analytics", "Analytics panel")

      await h.rerender({
        ariaLabel,
        tabs: tabs({ analytics: { disabled: true } }),
        activeTab: "analytics",
      })

      const selectedTabs = h
        .getAllTabs()
        .filter((tab) => tab.getAttribute("aria-selected") === "true")
      expect(selectedTabs).toHaveLength(1)
      expect(selectedTabs[0]).toBeEnabled()
      expect(h.getVisiblePanels()).toHaveLength(1)
    })

    it("keeps the server-rendered active tab and stays interactive after hydration", async () => {
      const changes: string[] = []
      const issues = await h.hydrate({
        ariaLabel,
        tabs: tabs(),
        activeTab: "settings",
        onActiveTabChange: (value) => changes.push(value),
      })

      expect(issues).toEqual([])
      expectOnlyTabActive(h, "Settings", "Settings panel")

      await h.click(h.getTab("Overview"))
      expect(changes).toEqual(["overview"])
    })
  })
}
