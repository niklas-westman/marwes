import { storybookLayout } from "@marwes-ui/core"
import { InfoDialog, Paragraph } from "@marwes-ui/react"
import type { Meta, StoryObj } from "@storybook/react"

const meta: Meta<typeof InfoDialog> = {
  title: "Dialog/Purpose/InfoDialog",
  component: InfoDialog,
  parameters: storybookLayout.centered,
  tags: ["autodocs"],
}

export default meta

type Story = StoryObj<typeof InfoDialog>

export const Default: Story = {
  args: {
    open: true,
    title: "Scheduled maintenance",
    description: "The workspace will be read-only for ten minutes.",
  },
  render: (args) => (
    <InfoDialog {...args} portalTarget={null}>
      <Paragraph>Save your drafts before the maintenance window begins.</Paragraph>
    </InfoDialog>
  ),
}
