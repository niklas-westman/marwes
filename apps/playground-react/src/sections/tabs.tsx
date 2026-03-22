import { Tab } from "@marwes-ui/react"
import { useState } from "react"
import { ComponentRow, PreviewSection, SectionDescription, SectionTitle } from "./section.styles"

const TABS = ["Overview", "Activity", "Settings", "Team"] as const

function TabsSection(): JSX.Element {
  const [active, setActive] = useState(0)

  return (
    <PreviewSection>
      <SectionTitle>Tabs</SectionTitle>

      <SectionDescription>States — default, selected, disabled</SectionDescription>
      <ComponentRow>
        <Tab>Inactive</Tab>
        <Tab selected>Selected</Tab>
        <Tab disabled>Disabled</Tab>
      </ComponentRow>

      <div style={{ marginTop: 24 }}>
        <SectionDescription>Interactive tab group</SectionDescription>
        <div
          role="tablist"
          aria-label="Demo tabs"
          style={{ display: "flex", borderBottom: "1px solid var(--mw-color-border, #e5e7eb)" }}
        >
          {TABS.map((label, i) => (
            <Tab
              key={label}
              selected={active === i}
              ariaControls={`tabs-panel-${i}`}
              onClick={() => setActive(i)}
            >
              {label}
            </Tab>
          ))}
        </div>
        <div
          id={`tabs-panel-${active}`}
          role="tabpanel"
          aria-label={TABS[active]}
          style={{ padding: "16px 0", fontSize: 13, color: "var(--mw-color-text-muted)" }}
        >
          Panel: {TABS[active]}
        </div>
      </div>
    </PreviewSection>
  )
}

export { TabsSection }
