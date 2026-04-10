import { storybookLayout } from "@marwes-ui/core"
import { CancelButton, DestructiveButton, Dialog, Paragraph } from "@marwes-ui/react"
import type { Meta, StoryObj } from "@storybook/react"

const meta: Meta<typeof Dialog> = {
  title: "Dialog/Purpose/DestructiveDialog",
  component: Dialog,
  parameters: storybookLayout.centered,
  tags: ["autodocs"],
}

export default meta

type Story = StoryObj<typeof Dialog>

export const Default: Story = {
  args: {
    title: "Delete workspace",
    description: "This action permanently removes all projects, members, and history.",
  },
  render: (args) => (
    <Dialog
      {...args}
      dataAttributes={{ "data-purpose": "destructive-dialog", "data-intent": "destructive" }}
      footer={
        <>
          <CancelButton>Cancel</CancelButton>
          <DestructiveButton>Delete</DestructiveButton>
        </>
      }
    >
      <Paragraph>Make sure you exported anything you need before continuing.</Paragraph>
    </Dialog>
  ),
}
