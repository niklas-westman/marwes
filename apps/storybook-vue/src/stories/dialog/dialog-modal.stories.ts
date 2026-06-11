import { storybookA11yPolicy, storybookLayout } from "@marwes-ui/core"
import type { DialogModalProps } from "@marwes-ui/vue"
import { CancelButton, ConfirmButton, DialogModal, Paragraph } from "@marwes-ui/vue"
import type { Meta, StoryObj } from "@storybook/vue3-vite"

const meta = {
  title: "Dialog/Molecule",
  component: DialogModal as unknown as object,
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
} satisfies Meta<DialogModalProps>

export default meta

type Story = StoryObj<DialogModalProps>

export const Default: Story = {
  render: () => ({
    components: { CancelButton, ConfirmButton, DialogModal, Paragraph },
    template: `
      <DialogModal
        :open="true"
        :portalTarget="null"
        title="Invite teammates"
        description="Select a role and invite collaborators to the workspace."
        size="medium"
      >
        <Paragraph>
          DialogModal owns the scrim, portal rendering, modal semantics, close affordances, and focus restoration.
        </Paragraph>
        <template #footer="{ close }">
          <CancelButton @click="close">Cancel</CancelButton>
          <ConfirmButton @click="close">Continue</ConfirmButton>
        </template>
      </DialogModal>
    `,
  }),
}

export const LockedDismissal: Story = {
  render: () => ({
    components: { ConfirmButton, DialogModal, Paragraph },
    template: `
      <DialogModal
        :open="true"
        :portalTarget="null"
        title="Migration in progress"
        description="Keep this dialog open until the migration finishes."
        size="small"
        :dismissible="false"
        :closeOnEscape="false"
        :closeOnScrimClick="false"
      >
        <Paragraph>
          The migration runs in the background and will notify you when it is safe to continue.
        </Paragraph>
        <template #footer>
          <ConfirmButton>Continue</ConfirmButton>
        </template>
      </DialogModal>
    `,
  }),
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
  render: (args) => ({
    components: { ConfirmButton, DialogModal, Paragraph },
    setup() {
      return { args }
    },
    template: `
      <DialogModal v-bind="args" :portalTarget="null">
        <Paragraph>
          The custom surface width, calmer scrim, and hidden dividers are controlled by DialogModal props.
        </Paragraph>
        <template #footer>
          <ConfirmButton>Export</ConfirmButton>
        </template>
      </DialogModal>
    `,
  }),
}
