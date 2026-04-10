import { storybookLayout } from "@marwes-ui/core"
import type { DialogProps } from "@marwes-ui/vue"
import { CancelButton, DestructiveButton, Dialog, Paragraph } from "@marwes-ui/vue"
import type { Meta, StoryObj } from "@storybook/vue3-vite"

const meta = {
  title: "Dialog/Purpose/DestructiveDialog",
  component: Dialog as unknown as object,
  parameters: storybookLayout.centered,
  tags: ["autodocs"],
} satisfies Meta<DialogProps>

export default meta

type Story = StoryObj<DialogProps>

export const Default: Story = {
  render: () => ({
    components: { CancelButton, DestructiveButton, Dialog, Paragraph },
    template: `
      <Dialog
        title="Delete workspace"
        description="This action permanently removes all projects, members, and history."
        :dataAttributes="{ 'data-purpose': 'destructive-dialog', 'data-intent': 'destructive' }"
      >
        <Paragraph>Make sure you exported anything you need before continuing.</Paragraph>
        <template #footer>
          <CancelButton>Cancel</CancelButton>
          <DestructiveButton>Delete</DestructiveButton>
        </template>
      </Dialog>
    `,
  }),
}
