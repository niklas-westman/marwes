import { storybookA11yPolicy, storybookLayout } from "@marwes-ui/core"
import type { SettingsAccordionProps } from "@marwes-ui/vue"
import { SettingsAccordion } from "@marwes-ui/vue"
import type { Meta, StoryObj } from "@storybook/vue3-vite"

const settingsItems = [
  { value: "profile", title: "Profile", content: "Edit your display name, avatar, and bio." },
  {
    value: "notifications",
    title: "Notifications",
    content: "Configure email and push notification preferences.",
  },
  { value: "privacy", title: "Privacy", content: "Manage data sharing and visibility settings." },
]

const meta = {
  title: "Accordion/Purpose/Settings",
  component: SettingsAccordion as unknown as object,
  parameters: {
    ...storybookLayout.centered,
    ...storybookA11yPolicy.smoke,
  },
  tags: ["autodocs"],
  decorators: [
    () => ({
      ...storybookA11yPolicy.smoke,
      template: '<div style="width: 66vw"><story /></div>',
    }),
  ],
} satisfies Meta<SettingsAccordionProps>

export default meta
type Story = StoryObj<SettingsAccordionProps>

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
