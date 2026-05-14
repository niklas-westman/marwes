import { storybookA11yPolicy, storybookLayout } from "@marwes-ui/core"
import type { Meta, StoryObj } from "@storybook/svelte"
import InfoDialogStory from "./InfoDialogStory.svelte"

const meta = {
  title: "Dialog/Purpose/InfoDialog",
  component: InfoDialogStory,
  parameters: {
    ...storybookLayout.centered,
    ...storybookA11yPolicy.smoke,
  },
} satisfies Meta<typeof InfoDialogStory>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    title: "Scheduled maintenance",
    description: "The workspace will be read-only for ten minutes.",
  },
}
