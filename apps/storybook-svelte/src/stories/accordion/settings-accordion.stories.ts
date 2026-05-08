import { storybookA11yPolicy, storybookLayout } from "@marwes-ui/core"
import { SettingsAccordion } from "@marwes-ui/svelte"
import type { Meta, StoryObj } from "@storybook/svelte"

const settingsItems = [
  {
    value: "notifications",
    title: "Notifications",
    content: "Configure your notification preferences.",
  },
  { value: "privacy", title: "Privacy", content: "Manage your privacy settings." },
  { value: "profile", title: "Profile", content: "Edit your display name, avatar, and bio." },
]

const meta = {
  title: "Accordion/Purpose/Settings",
  component: SettingsAccordion,
  parameters: {
    ...storybookLayout.padded,
    ...storybookA11yPolicy.smoke,
  },
  tags: ["autodocs"],
} satisfies Meta<typeof SettingsAccordion>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    label: "Account Settings",
    items: settingsItems,
    defaultOpenItems: ["notifications"],
  },
}
