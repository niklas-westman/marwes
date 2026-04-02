import { storybookLayout } from "@marwes-ui/core"
import type { DialogProps } from "@marwes-ui/vue"
import { CancelButton, ConfirmButton, Dialog, Paragraph } from "@marwes-ui/vue"
import type { Meta, StoryObj } from "@storybook/vue3-vite"

const meta = {
  title: "Dialog/Purpose/ConfirmDialog",
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
        title="Publish update"
        description="This sends the release to subscribers immediately."
        :dataAttributes="{ 'data-purpose': 'confirm-dialog', 'data-intent': 'confirm' }"
      >
        <Paragraph>Review the release summary before confirming.</Paragraph>
        <template #footer>
          <CancelButton>Cancel</CancelButton>
          <ConfirmButton>Confirm</ConfirmButton>
        </template>
      </Dialog>
    `,
  }),
}
