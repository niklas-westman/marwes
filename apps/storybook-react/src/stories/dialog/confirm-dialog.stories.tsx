import { storybookLayout } from "@marwes-ui/core"
import { CancelButton, ConfirmButton, Dialog, Paragraph } from "@marwes-ui/react"
import type { Meta, StoryObj } from "@storybook/react"

const meta: Meta<typeof Dialog> = {
  title: "Dialog/Purpose/ConfirmDialog",
  component: Dialog,
  parameters: storybookLayout.centered,
  tags: ["autodocs"],
}

export default meta

type Story = StoryObj<typeof Dialog>

export const Default: Story = {
  args: {
    title: "Publish update",
    description: "This sends the release to subscribers immediately.",
  },
  render: (args) => (
    <Dialog
      {...args}
      dataAttributes={{ "data-purpose": "confirm-dialog", "data-intent": "confirm" }}
      footer={
        <>
          <CancelButton>Cancel</CancelButton>
          <ConfirmButton>Confirm</ConfirmButton>
        </>
      }
    >
      <Paragraph>Review the release summary before confirming.</Paragraph>
    </Dialog>
  ),
}
