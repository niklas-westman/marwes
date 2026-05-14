import { storybookA11yPolicy, storybookLayout } from "@marwes-ui/core"
import { NavigationTabs } from "@marwes-ui/svelte"
import type { Meta, StoryObj } from "@storybook/svelte"

const meta = {
  title: "Tab/Purpose/NavigationTabs",
  component: NavigationTabs,
  parameters: {
    ...storybookLayout.padded,
    ...storybookA11yPolicy.smoke,
  },
  tags: ["autodocs"],
} satisfies Meta<typeof NavigationTabs>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    tabs: [
      { value: "home", label: "Home", panel: "Home page content." },
      { value: "projects", label: "Projects", panel: "Your project list." },
      { value: "settings", label: "Settings", panel: "Account settings." },
    ],
    defaultActiveTab: "home",
  },
}
