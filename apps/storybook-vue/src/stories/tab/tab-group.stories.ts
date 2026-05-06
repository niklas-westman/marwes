import { storybookA11yPolicy, storybookLayout } from "@marwes-ui/core"
import type { TabGroupProps } from "@marwes-ui/vue"
import { TabGroup } from "@marwes-ui/vue"
import type { Meta, StoryObj } from "@storybook/vue3-vite"
import { ref } from "vue"

const accountTabs = [
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
  {
    value: "members",
    label: "Members",
    panel: "Roles, permissions, and collaborator access.",
  },
]

const meta = {
  title: "Tab/Molecule",
  component: TabGroup as unknown as object,
  parameters: {
    ...storybookLayout.centered,
    ...storybookA11yPolicy.smoke,
  },
  tags: ["autodocs"],
  render: (args: TabGroupProps) => ({
    ...storybookA11yPolicy.smoke,
    components: { TabGroup },
    setup() {
      return { args }
    },
    template: `
      <div style="width: min(66vw, 540px);">
        <TabGroup v-bind="args" />
      </div>
    `,
  }),
} satisfies Meta<TabGroupProps>

export default meta

type Story = StoryObj<TabGroupProps>

export const Playground: Story = {
  args: {
    label: "Workspace sections",
    tabs: accountTabs,
    defaultActiveTab: "overview",
  },
}

export const Controlled: Story = {
  render: () => ({
    components: { TabGroup },
    setup() {
      const activeTab = ref("activity")
      return { activeTab, tabs: accountTabs }
    },
    template: `
      <div style="display: grid; gap: 12px; width: min(66vw, 540px);">
        <TabGroup
          v-model:activeTab="activeTab"
          label="Account management"
          :tabs="tabs"
        />
        <p style="font-size: 14px; color: #6b7280;">Current tab: {{ activeTab }}</p>
      </div>
    `,
  }),
}

export const WithDisabledTab: Story = {
  args: {
    label: "Release workflow",
    tabs: [
      {
        value: "draft",
        label: "Draft",
        panel: "Prepare copy, assets, and rollout notes.",
      },
      {
        value: "review",
        label: "Review",
        panel: "Collect approvals from design and product.",
        disabled: true,
      },
      {
        value: "publish",
        label: "Publish",
        panel: "Ship the release and notify subscribers.",
      },
    ],
    defaultActiveTab: "draft",
  },
}
