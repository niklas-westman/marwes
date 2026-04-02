import { storybookLayout } from "@marwes-ui/core"
import { CancelButton, ConfirmButton, Dialog, Paragraph } from "@marwes-ui/react"
import type { Meta, StoryObj } from "@storybook/react"

const meta: Meta<typeof Dialog> = {
  title: "Dialog/Molecule",
  component: Dialog,
  parameters: storybookLayout.centered,
  tags: ["autodocs"],
  argTypes: {
    size: { control: "select", options: ["small", "medium", "large"] },
  },
}

export default meta

type Story = StoryObj<typeof Dialog>

export const Default: Story = {
  args: {
    title: "Invite teammates",
    description: "Select a role and invite collaborators to the workspace.",
    size: "medium",
  },
  render: (args) => (
    <Dialog
      {...args}
      footer={
        <>
          <CancelButton>Cancel</CancelButton>
          <ConfirmButton>Continue</ConfirmButton>
        </>
      }
    >
      <Paragraph>
        DialogModal owns the scrim, portal rendering, close affordances, and focus restoration.
      </Paragraph>
    </Dialog>
  ),
}

export const LockedDismissal: Story = {
  args: {
    title: "Migration in progress",
    description: "Keep this dialog open until the migration finishes.",
    dismissible: false,
    size: "small",
  },
  render: (args) => (
    <Dialog {...args} footer={<ConfirmButton>Continue</ConfirmButton>}>
      <Paragraph>
        The migration runs in the background and will notify you when it is safe to continue.
      </Paragraph>
    </Dialog>
  ),
}
