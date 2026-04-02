import { storybookLayout } from "@marwes-ui/core"
import type { DialogProps } from "@marwes-ui/vue"
import { CancelButton, ConfirmButton, Dialog, Paragraph } from "@marwes-ui/vue"
import type { Meta, StoryObj } from "@storybook/vue3-vite"

const meta = {
  title: "Dialog/Molecule",
  component: Dialog as unknown as object,
  parameters: storybookLayout.centered,
  tags: ["autodocs"],
} satisfies Meta<DialogProps>

export default meta

type Story = StoryObj<DialogProps>

export const Default: Story = {
  render: () => ({
    components: { CancelButton, ConfirmButton, Dialog, Paragraph },
    template: `
      <Dialog
        title="Invite teammates"
        description="Select a role and invite collaborators to the workspace."
        size="medium"
      >
        <Paragraph>DialogModal owns the scrim, portal rendering, close affordances, and focus restoration.</Paragraph>
        <template #footer>
          <CancelButton>Cancel</CancelButton>
          <ConfirmButton>Continue</ConfirmButton>
        </template>
      </Dialog>
    `,
  }),
}

export const LockedDismissal: Story = {
  render: () => ({
    components: { ConfirmButton, Dialog, Paragraph },
    template: `
      <Dialog
        title="Migration in progress"
        description="Keep this dialog open until the migration finishes."
        size="small"
        :dismissible="false"
      >
        <Paragraph>The migration runs in the background and will notify you when it is safe to continue.</Paragraph>
        <template #footer>
          <ConfirmButton>Continue</ConfirmButton>
        </template>
      </Dialog>
    `,
  }),
}
