import { storybookA11yPolicy, storybookLayout } from "@marwes-ui/core"
import { FeatureToggle } from "@marwes-ui/svelte"
import type { Meta, StoryObj } from "@storybook/svelte"

const meta = {
  title: "Switch/Purpose/FeatureToggle",
  component: FeatureToggle,
  parameters: {
    ...storybookLayout.centered,
    ...storybookA11yPolicy.smoke,
  },
  tags: ["autodocs"],
} satisfies Meta<typeof FeatureToggle>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    label: "Enable beta dashboard",
    description: "Turn on early access to the redesigned analytics experience.",
    switch: { checked: true },
  },
}

export const Controlled: Story = {
  args: {
    ...Default.args,
    switch: { checked: true },
  },
}
