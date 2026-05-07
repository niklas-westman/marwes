import { storybookA11yPolicy, storybookLayout } from "@marwes-ui/core"
import { EmptyStateSpinner } from "@marwes-ui/svelte"
import type { Meta, StoryObj } from "@storybook/svelte"

const meta = {
  title: "Spinner/Molecule/EmptyStateSpinner",
  component: EmptyStateSpinner,
  parameters: {
    ...storybookLayout.centered,
    ...storybookA11yPolicy.smoke,
  },
  tags: ["autodocs"],
} satisfies Meta<typeof EmptyStateSpinner>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {},
}
