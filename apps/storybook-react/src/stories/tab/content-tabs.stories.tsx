import { storybookLayout } from "@marwes-ui/core"
import { ContentTabs } from "@marwes-ui/react"
import type { Meta, StoryObj } from "@storybook/react"
import * as React from "react"

const meta: Meta<typeof ContentTabs> = {
  title: "Tab/Purpose/ContentTabs",
  component: ContentTabs,
  parameters: storybookLayout.centered,
  tags: ["autodocs"],
  render: (args) => (
    <div style={{ width: "min(66vw, 540px)" }}>
      <ContentTabs {...args} />
    </div>
  ),
}

export default meta

type Story = StoryObj<typeof ContentTabs>

export const Default: Story = {
  args: {
    label: "Case study sections",
    tabs: [
      { value: "summary", label: "Summary", panel: "A concise overview of the project outcome." },
      {
        value: "research",
        label: "Research",
        panel: "Interview synthesis, market signals, and open questions.",
      },
      {
        value: "results",
        label: "Results",
        panel: "Adoption, retention, and conversion improvements.",
      },
    ],
    defaultActiveTab: "summary",
  },
}
