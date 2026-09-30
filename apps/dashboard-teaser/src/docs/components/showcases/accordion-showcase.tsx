import { FAQAccordion, SectionsAccordion, SettingsAccordion } from "@marwes-ui/react"
import { useState } from "react"

import { ShowcaseCard, ShowcaseGrid } from "./showcase-layout"

function AccordionShowcase(): JSX.Element {
  const [openFaq, setOpenFaq] = useState<string[]>(["pricing"])
  const [openSettings, setOpenSettings] = useState<string[]>(["notifications", "privacy"])

  return (
    <ShowcaseGrid>
      <ShowcaseCard>
        <h3>Single-open FAQ</h3>
        <p>Only one answer stays open at a time, matching typical FAQ behavior.</p>
        <FAQAccordion
          label="Billing FAQ"
          items={[
            {
              value: "pricing",
              title: "How is pricing calculated?",
              content: "Per active seat, billed monthly.",
            },
            {
              value: "refunds",
              title: "Can I get a refund?",
              content: "Yes, within 30 days of purchase.",
            },
          ]}
          openItems={openFaq}
          onOpenItemsChange={setOpenFaq}
        />
      </ShowcaseCard>
      <ShowcaseCard>
        <h3>Multi-open settings</h3>
        <p>Independent sections can stay open together without closing each other.</p>
        <SettingsAccordion
          label="Workspace settings"
          items={[
            { value: "notifications", title: "Notifications", content: "Email and in-app alerts." },
            { value: "privacy", title: "Privacy", content: "Profile visibility and data sharing." },
          ]}
          openItems={openSettings}
          onOpenItemsChange={setOpenSettings}
        />
      </ShowcaseCard>
      <ShowcaseCard>
        <h3>Disabled section</h3>
        <p>A locked section stays visible in place instead of disappearing from the list.</p>
        <SectionsAccordion
          label="Report sections"
          items={[
            { value: "summary", title: "Summary", content: "Key metrics for the period." },
            {
              value: "raw-data",
              title: "Raw data",
              content: "Not available on the current plan.",
              disabled: true,
            },
          ]}
          defaultOpenItems={["summary"]}
        />
      </ShowcaseCard>
    </ShowcaseGrid>
  )
}

export default AccordionShowcase
