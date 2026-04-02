import { storybookLayout } from "@marwes-ui/core"
import type { DialogProps } from "@marwes-ui/vue"
import { ConfirmButton, Dialog, Paragraph } from "@marwes-ui/vue"
import type { Meta, StoryObj } from "@storybook/vue3-vite"

const meta = {
  title: "Dialog/Purpose/InfoDialog",
  component: Dialog as unknown as object,
  parameters: storybookLayout.centered,
  tags: ["autodocs"],
} satisfies Meta<DialogProps>

export default meta

type Story = StoryObj<DialogProps>

export const Default: Story = {
  render: () => ({
    components: { ConfirmButton, Dialog, Paragraph },
    template: `
      <Dialog
        title="Scheduled maintenance"
        description="The workspace will be read-only for ten minutes."
        :dataAttributes="{ 'data-purpose': 'info-dialog', 'data-intent': 'info' }"
      >
        <Paragraph>Save your drafts before the maintenance window begins.</Paragraph>
        <template #footer>
          <ConfirmButton>Okay</ConfirmButton>
        </template>
      </Dialog>
    `,
  }),
}
