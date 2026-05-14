import { storybookA11yPolicy, storybookLayout } from "@marwes-ui/core"
import { SettingsTabs } from "@marwes-ui/svelte"
import type { Meta, StoryObj } from "@storybook/svelte"

const meta = {
  title: "Tab/Purpose/SettingsTabs",
  component: SettingsTabs,
  parameters: {
    ...storybookLayout.padded,
    ...storybookA11yPolicy.smoke,
  },
  tags: ["autodocs"],
} satisfies Meta<typeof SettingsTabs>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    tabs: [
      { value: "general", label: "General", panel: "General account preferences." },
      { value: "security", label: "Security", panel: "Password and two-factor settings." },
      { value: "billing", label: "Billing", panel: "Subscription and payment info." },
    ],
    defaultActiveTab: "general",
  },
}
