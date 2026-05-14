import { storybookA11yPolicy, storybookLayout } from "@marwes-ui/core"
import type { Meta, StoryObj } from "@storybook/svelte"
import DestructiveDialogStory from "./DestructiveDialogStory.svelte"

const meta = {
  title: "Dialog/Purpose/DestructiveDialog",
  component: DestructiveDialogStory,
  parameters: {
    ...storybookLayout.centered,
    ...storybookA11yPolicy.smoke,
  },
} satisfies Meta<typeof DestructiveDialogStory>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    title: "Delete workspace",
    description: "This action permanently removes all projects, members, and history.",
  },
}
