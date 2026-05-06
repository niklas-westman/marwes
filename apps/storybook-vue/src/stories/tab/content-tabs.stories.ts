import { storybookA11yPolicy, storybookLayout } from "@marwes-ui/core"
import type { ContentTabsProps } from "@marwes-ui/vue"
import { ContentTabs } from "@marwes-ui/vue"
import type { Meta, StoryObj } from "@storybook/vue3-vite"

const meta = {
  title: "Tab/Purpose/ContentTabs",
  component: ContentTabs as unknown as object,
  parameters: {
    ...storybookLayout.centered,
    ...storybookA11yPolicy.smoke,
  },
  tags: ["autodocs"],
  render: (args: ContentTabsProps) => ({
    ...storybookA11yPolicy.smoke,
    components: { ContentTabs },
    setup() {
      return { args }
    },
    template: `
      <div style="width: min(66vw, 540px);">
        <ContentTabs v-bind="args" />
      </div>
    `,
  }),
} satisfies Meta<ContentTabsProps>

export default meta

type Story = StoryObj<ContentTabsProps>

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
