import { Breadcrumb } from "@marwes-ui/react"

import { ShowcaseCard, ShowcaseStack } from "./showcase-layout"

function BreadcrumbShowcase(): JSX.Element {
  return (
    <ShowcaseStack>
      <ShowcaseCard>
        <h3>Typical trail</h3>
        <p>The current page defaults to the last item and gets a real aria-current.</p>
        <Breadcrumb
          homeHref="/"
          items={[
            { label: "Projects", href: "/projects" },
            { label: "Marwes UI", href: "/projects/marwes-ui" },
            { label: "Component docs" },
          ]}
        />
      </ShowcaseCard>
      <ShowcaseCard>
        <h3>Deeper trail</h3>
        <p>Longer hierarchies stay legible with short, honest labels at every level.</p>
        <Breadcrumb
          homeHref="/"
          items={[
            { label: "Workspace", href: "/workspace" },
            { label: "Reports", href: "/workspace/reports" },
            { label: "Q3 2026", href: "/workspace/reports/q3-2026" },
            { label: "Revenue" },
          ]}
        />
      </ShowcaseCard>
      <ShowcaseCard>
        <h3>Without a home link</h3>
        <p>A short two-level trail works without showing a separate home anchor.</p>
        <Breadcrumb items={[{ label: "Settings", href: "/settings" }, { label: "Billing" }]} />
      </ShowcaseCard>
    </ShowcaseStack>
  )
}

export default BreadcrumbShowcase
