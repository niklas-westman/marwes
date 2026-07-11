import { storybookA11yPolicy, storybookLayout } from "@marwes-ui/core"
import { CancelButton, ConfirmButton, DialogModal, Paragraph } from "@marwes-ui/react"
import type { Meta, StoryObj } from "@storybook/react"

const meta: Meta<typeof DialogModal> = {
  title: "Dialog/Molecule",
  component: DialogModal,
  parameters: {
    ...storybookLayout.centered,
    ...storybookA11yPolicy.smoke,
  },
  argTypes: {
    size: { control: "select", options: ["small", "medium", "large"] },
    surfaceWidth: { control: "text" },
    tone: { control: "select", options: ["default", "calm"] },
    divider: { control: "select", options: ["visible", "hidden"] },
  },
}

export default meta

type Story = StoryObj<typeof DialogModal>

export const Default: Story = {
  args: {
    open: true,
    title: "Invite teammates",
    description: "Select a role and invite collaborators to the workspace.",
    size: "medium",
  },
  render: (args) => (
    <DialogModal
      {...args}
      portalTarget={null}
      footer={({ close }) => (
        <>
          <CancelButton onClick={close}>Cancel</CancelButton>
          <ConfirmButton onClick={close}>Continue</ConfirmButton>
        </>
      )}
    >
      <Paragraph>
        DialogModal owns the scrim, portal rendering, modal semantics, close affordances, and focus
        restoration.
      </Paragraph>
    </DialogModal>
  ),
}

export const LockedDismissal: Story = {
  args: {
    open: true,
    title: "Migration in progress",
    description: "Keep this dialog open until the migration finishes.",
    dismissible: false,
    closeOnEscape: false,
    closeOnScrimClick: false,
    size: "small",
  },
  render: (args) => (
    <DialogModal {...args} portalTarget={null} footer={<ConfirmButton>Continue</ConfirmButton>}>
      <Paragraph>
        The migration runs in the background and will notify you when it is safe to continue.
      </Paragraph>
    </DialogModal>
  ),
}

export const CalmSurface: Story = {
  args: {
    open: true,
    title: "Review export",
    description: "Confirm the file settings before the export starts.",
    surfaceWidth: "640px",
    tone: "calm",
    divider: "hidden",
    size: "medium",
  },
  render: (args) => (
    <DialogModal {...args} portalTarget={null} footer={<ConfirmButton>Export</ConfirmButton>}>
      <Paragraph>
        The custom surface width, calmer scrim, and hidden dividers are controlled by DialogModal
        props.
      </Paragraph>
    </DialogModal>
  ),
}
