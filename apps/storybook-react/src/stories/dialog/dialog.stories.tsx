import { storybookLayout } from "@marwes-ui/core"
import { CancelButton, ConfirmButton, Dialog, Paragraph } from "@marwes-ui/react"
import type { Meta, StoryObj } from "@storybook/react"

const meta: Meta<typeof Dialog> = {
  title: "Dialog/Atom",
  component: Dialog,
  parameters: storybookLayout.centered,
  tags: ["autodocs"],
  argTypes: {
    size: { control: "select", options: ["small", "medium", "large"] },
    showFooter: { control: "boolean" },
    dismissible: { control: "boolean" },
    modal: { control: "boolean" },
  },
}

export default meta

type Story = StoryObj<typeof Dialog>

export const Default: Story = {
  args: {
    title: "Dialog title",
    description:
      "Describe the dialog purpose. Provide enough context for the user to understand the action or information being presented.",
    size: "medium",
    showFooter: true,
    dismissible: true,
    modal: false,
  },
  render: (args) => (
    <Dialog
      {...args}
      footer={
        <>
          <CancelButton>Cancel</CancelButton>
          <ConfirmButton>Confirm</ConfirmButton>
        </>
      }
    >
      <Paragraph>
        Use the raw dialog surface when parent code owns the surrounding shell. `Dialog` does not
        claim modal behavior by default.
      </Paragraph>
    </Dialog>
  ),
}

export const ContentOnly: Story = {
  args: {
    title: "Content-only dialog",
    dismissible: false,
    showFooter: false,
  },
  render: (args) => (
    <Dialog {...args}>
      <Paragraph>
        This layout is useful when parent code owns the surrounding chrome, actions, and any modal
        boundary behavior.
      </Paragraph>
    </Dialog>
  ),
}
