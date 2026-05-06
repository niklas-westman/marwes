import { storybookA11yPolicy, storybookLayout } from "@marwes-ui/core"
import type { SettingsTabsProps } from "@marwes-ui/vue"
import { SettingsTabs } from "@marwes-ui/vue"
import type { Meta, StoryObj } from "@storybook/vue3-vite"

const meta = {
  title: "Tab/Purpose/SettingsTabs",
  component: SettingsTabs as unknown as object,
  parameters: {
    ...storybookLayout.centered,
    ...storybookA11yPolicy.smoke,
  },
  tags: ["autodocs"],
  render: (args: SettingsTabsProps) => ({
    ...storybookA11yPolicy.smoke,
    components: { SettingsTabs },
    setup() {
      return { args }
    },
    template: `
      <div style="width: min(66vw, 540px);">
        <SettingsTabs v-bind="args" />
      </div>
    `,
  }),
} satisfies Meta<SettingsTabsProps>

export default meta

type Story = StoryObj<SettingsTabsProps>

export const Default: Story = {
  args: {
    label: "Workspace settings",
    tabs: [
      { value: "general", label: "General", panel: "Name, locale, and workspace defaults." },
      {
        value: "notifications",
        label: "Notifications",
        panel: "Delivery channels, digests, and escalation rules.",
      },
      {
        value: "security",
        label: "Security",
        panel: "SSO, session controls, and audit retention.",
      },
    ],
    defaultActiveTab: "general",
  },
}
