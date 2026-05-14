import { storybookA11yPolicy, storybookLayout } from "@marwes-ui/core"
import type { Meta, StoryObj } from "@storybook/svelte"
import ConfirmDialogStory from "./ConfirmDialogStory.svelte"

const meta = {
  title: "Dialog/Purpose/ConfirmDialog",
  component: ConfirmDialogStory,
  parameters: {
    ...storybookLayout.centered,
    ...storybookA11yPolicy.smoke,
  },
} satisfies Meta<typeof ConfirmDialogStory>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    title: "Publish update",
    description: "This sends the release to subscribers immediately.",
  },
}
