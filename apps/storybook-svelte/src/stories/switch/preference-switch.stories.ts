import { storybookA11yPolicy, storybookLayout } from "@marwes-ui/core"
import { PreferenceSwitch } from "@marwes-ui/svelte"
import type { Meta, StoryObj } from "@storybook/svelte"

const meta = {
  title: "Switch/Purpose/Preference",
  component: PreferenceSwitch,
  parameters: {
    ...storybookLayout.centered,
    ...storybookA11yPolicy.smoke,
  },
  tags: ["autodocs"],
} satisfies Meta<typeof PreferenceSwitch>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    label: "Dark mode",
    description: "Switch between light and dark interface themes.",
    switch: { checked: false },
  },
}

export const Controlled: Story = {
  args: {
    ...Default.args,
    switch: { checked: true },
  },
}
