import { storybookLayout } from "@marwes-ui/core"
import { SettingsAccordion } from "@marwes-ui/react"
import type { Meta, StoryObj } from "@storybook/react"

const settingsItems = [
  { value: "profile", title: "Profile", children: "Edit your display name, avatar, and bio." },
  {
    value: "notifications",
    title: "Notifications",
    children: "Configure email and push notification preferences.",
  },
  { value: "privacy", title: "Privacy", children: "Manage data sharing and visibility settings." },
]

const meta: Meta<typeof SettingsAccordion> = {
  title: "Accordion/Context/Settings",
  component: SettingsAccordion,
  parameters: storybookLayout.centered,
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <div style={{ width: "66vw" }}>
        <Story />
      </div>
    ),
  ],
}

export default meta

type Story = StoryObj<typeof SettingsAccordion>

export const Default: Story = {
  args: {
    label: "Account Settings",
    items: settingsItems,
    defaultOpenItems: ["profile"],
  },
}

export const AllOpen: Story = {
  args: {
    label: "Account Settings",
    items: settingsItems,
    defaultOpenItems: ["profile", "notifications", "privacy"],
  },
}
