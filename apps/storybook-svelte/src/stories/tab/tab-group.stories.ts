import { storybookA11yPolicy, storybookLayout } from "@marwes-ui/core"
import { TabGroup } from "@marwes-ui/svelte"
import type { Meta, StoryObj } from "@storybook/svelte"

const meta = {
  title: "Tab/Molecule",
  component: TabGroup,
  parameters: { ...storybookLayout.padded, ...storybookA11yPolicy.smoke },
  tags: ["autodocs"],
} satisfies Meta<typeof TabGroup>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    tabs: [
      { value: "tab1", label: "Overview", panel: "Overview content goes here." },
      { value: "tab2", label: "Details", panel: "Detailed information here." },
      { value: "tab3", label: "Settings", panel: "Settings panel." },
    ],
    defaultActiveTab: "tab1",
  },
}

export const Playground: Story = {
  args: {
    label: "Workspace sections",
    tabs: [
      {
        value: "overview",
        label: "Overview",
        panel: "Workspace summary, recent activity, and linked resources.",
      },
      {
        value: "activity",
        label: "Activity",
        panel: "Recent edits, approvals, and delivery milestones.",
      },
      { value: "members", label: "Members", panel: "Roles, permissions, and collaborator access." },
    ],
    defaultActiveTab: "overview",
  },
}

export const Controlled: Story = {
  args: {
    label: "Account management",
    tabs: [
      { value: "overview", label: "Overview", panel: "Workspace summary." },
      { value: "activity", label: "Activity", panel: "Recent edits." },
      { value: "members", label: "Members", panel: "Roles and permissions." },
    ],
    activeTab: "activity",
  },
}

export const WithDisabledTab: Story = {
  args: {
    tabs: [
      { value: "tab1", label: "Active", panel: "Active tab." },
      { value: "tab2", label: "Disabled", panel: "Cannot see this.", disabled: true },
      { value: "tab3", label: "Another", panel: "Another tab." },
    ],
  },
}
