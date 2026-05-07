import { storybookA11yPolicy, storybookLayout } from "@marwes-ui/core"
import { ButtonSpinner } from "@marwes-ui/svelte"
import type { Meta, StoryObj } from "@storybook/svelte"

const meta = {
  title: "Spinner/Molecule/ButtonSpinner",
  component: ButtonSpinner,
  parameters: {
    ...storybookLayout.centered,
    ...storybookA11yPolicy.smoke,
  },
  tags: ["autodocs"],
} satisfies Meta<typeof ButtonSpinner>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {},
}

export const Inverted: Story = {
  args: { inverted: true },
}
