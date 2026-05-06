import { storybookA11yPolicy, storybookLayout } from "@marwes-ui/core"
import { ConfirmDialog, Paragraph } from "@marwes-ui/react"
import type { Meta, StoryObj } from "@storybook/react"

const meta: Meta<typeof ConfirmDialog> = {
  title: "Dialog/Purpose/ConfirmDialog",
  component: ConfirmDialog,
  parameters: {
    ...storybookLayout.centered,
    ...storybookA11yPolicy.smoke,
  },
}

export default meta

type Story = StoryObj<typeof ConfirmDialog>

export const Default: Story = {
  args: {
    open: true,
    title: "Publish update",
    description: "This sends the release to subscribers immediately.",
  },
  render: (args) => (
    <ConfirmDialog {...args} portalTarget={null}>
      <Paragraph>Review the release summary before confirming.</Paragraph>
    </ConfirmDialog>
  ),
}
