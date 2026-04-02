import { storybookLayout } from "@marwes-ui/core"
import { ConfirmButton, Dialog, Paragraph } from "@marwes-ui/react"
import type { Meta, StoryObj } from "@storybook/react"

const meta: Meta<typeof Dialog> = {
  title: "Dialog/Purpose/InfoDialog",
  component: Dialog,
  parameters: storybookLayout.centered,
  tags: ["autodocs"],
}

export default meta

type Story = StoryObj<typeof Dialog>

export const Default: Story = {
  args: {
    title: "Scheduled maintenance",
    description: "The workspace will be read-only for ten minutes.",
  },
  render: (args) => (
    <Dialog
      {...args}
      dataAttributes={{ "data-purpose": "info-dialog", "data-intent": "info" }}
      footer={<ConfirmButton>Okay</ConfirmButton>}
    >
      <Paragraph>Save your drafts before the maintenance window begins.</Paragraph>
    </Dialog>
  ),
}
