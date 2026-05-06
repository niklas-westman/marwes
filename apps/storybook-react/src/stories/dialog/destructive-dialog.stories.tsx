import { storybookA11yPolicy, storybookLayout } from "@marwes-ui/core"
import { DestructiveDialog, Paragraph } from "@marwes-ui/react"
import type { Meta, StoryObj } from "@storybook/react"

const meta: Meta<typeof DestructiveDialog> = {
  title: "Dialog/Purpose/DestructiveDialog",
  component: DestructiveDialog,
  parameters: {
    ...storybookLayout.centered,
    ...storybookA11yPolicy.smoke,
  },
}

export default meta

type Story = StoryObj<typeof DestructiveDialog>

export const Default: Story = {
  args: {
    open: true,
    title: "Delete workspace",
    description: "This action permanently removes all projects, members, and history.",
  },
  render: (args) => (
    <DestructiveDialog {...args} portalTarget={null}>
      <Paragraph>Make sure you exported anything you need before continuing.</Paragraph>
    </DestructiveDialog>
  ),
}
