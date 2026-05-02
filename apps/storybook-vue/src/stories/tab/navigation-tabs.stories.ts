import { storybookLayout } from "@marwes-ui/core"
import type { NavigationTabsProps } from "@marwes-ui/vue"
import { NavigationTabs } from "@marwes-ui/vue"
import type { Meta, StoryObj } from "@storybook/vue3-vite"

const meta = {
  title: "Tab/Purpose/NavigationTabs",
  component: NavigationTabs as unknown as object,
  parameters: storybookLayout.centered,
  tags: ["autodocs"],
  render: (args: NavigationTabsProps) => ({
    components: { NavigationTabs },
    setup() {
      return { args }
    },
    template: `
      <div style="width: min(66vw, 540px);">
        <NavigationTabs v-bind="args" />
      </div>
    `,
  }),
} satisfies Meta<NavigationTabsProps>

export default meta

type Story = StoryObj<NavigationTabsProps>

export const Default: Story = {
  args: {
    label: "Primary navigation",
    tabs: [
      { value: "overview", label: "Overview", panel: "Key product summary and checkpoints." },
      { value: "roadmap", label: "Roadmap", panel: "Upcoming milestones and owners." },
      { value: "billing", label: "Billing", panel: "Invoices, usage, and plan details." },
    ],
    defaultActiveTab: "overview",
  },
}
