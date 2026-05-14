import { storybookA11yPolicy, storybookLayout } from "@marwes-ui/core"
import { InfoToast } from "@marwes-ui/svelte"
import type { Meta, StoryObj } from "@storybook/svelte"

const meta = {
  title: "Toast/Purpose/InfoToast",
  component: InfoToast,
  parameters: {
    ...storybookLayout.centered,
    ...storybookA11yPolicy.smoke,
  },
  tags: ["autodocs"],
} satisfies Meta<typeof InfoToast>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    children: "Your changes have been saved",
  },
}
