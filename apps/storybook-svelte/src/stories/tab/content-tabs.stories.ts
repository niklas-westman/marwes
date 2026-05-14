import { storybookA11yPolicy, storybookLayout } from "@marwes-ui/core"
import { ContentTabs } from "@marwes-ui/svelte"
import type { Meta, StoryObj } from "@storybook/svelte"

const meta = {
  title: "Tab/Purpose/ContentTabs",
  component: ContentTabs,
  parameters: {
    ...storybookLayout.padded,
    ...storybookA11yPolicy.smoke,
  },
  tags: ["autodocs"],
} satisfies Meta<typeof ContentTabs>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    tabs: [
      { value: "overview", label: "Overview", panel: "Overview content for this item." },
      { value: "details", label: "Details", panel: "Detailed specifications and information." },
      { value: "reviews", label: "Reviews", panel: "User reviews and ratings." },
    ],
    defaultActiveTab: "overview",
  },
}
