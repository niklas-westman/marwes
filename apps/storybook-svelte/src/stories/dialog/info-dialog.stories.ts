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
  tags: ["autodocs"],
} satisfies Meta<typeof InfoDialogStory>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    title: "Scheduled maintenance",
    description: "The system will be briefly unavailable.",
  },
}
