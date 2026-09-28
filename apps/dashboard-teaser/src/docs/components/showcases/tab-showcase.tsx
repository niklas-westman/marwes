import { ContentTabs, NavigationTabs, SettingsTabs } from "@marwes-ui/react"

import { ShowcaseCard, ShowcaseGrid } from "./showcase-layout"

function TabShowcase(): JSX.Element {
  return (
    <ShowcaseGrid>
      <ShowcaseCard>
        <h3>Primary navigation</h3>
        <p>Switching tabs moves between related views without a full page navigation.</p>
        <NavigationTabs
          label="Account"
          defaultActiveTab="overview"
          tabs={[
            { value: "overview", label: "Overview", panel: "Account overview" },
            { value: "activity", label: "Activity", panel: "Recent account activity" },
            { value: "billing", label: "Billing", panel: "Invoices and payment methods" },
          ]}
        />
      </ShowcaseCard>
      <ShowcaseCard>
        <h3>Content sections</h3>
        <p>Grouped content switches in place while staying on the same page.</p>
        <ContentTabs
          label="Documentation"
          defaultActiveTab="usage"
          tabs={[
            { value: "usage", label: "Usage", panel: "How to use this component." },
            { value: "api", label: "API", panel: "Full prop reference." },
          ]}
        />
      </ShowcaseCard>
      <ShowcaseCard>
        <h3>Disabled category</h3>
        <p>An unavailable settings category stays visible instead of disappearing.</p>
        <SettingsTabs
          label="Settings"
          defaultActiveTab="general"
          tabs={[
            { value: "general", label: "General", panel: "Workspace name and timezone." },
            {
              value: "billing",
              label: "Billing",
              panel: "Requires an admin role.",
              disabled: true,
            },
          ]}
        />
      </ShowcaseCard>
    </ShowcaseGrid>
  )
}

export default TabShowcase
