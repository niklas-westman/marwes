import { storybookLayout } from "@marwes-ui/core"
import type { DialogProps } from "@marwes-ui/vue"
import { CancelButton, ConfirmButton, Dialog, Paragraph } from "@marwes-ui/vue"
import type { Meta, StoryObj } from "@storybook/vue3-vite"

const meta = {
  title: "Dialog/Atom",
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
        title="Dialog title"
        description="Describe the dialog purpose. Provide enough context for the user to understand the action or information being presented."
      >
        <Paragraph>Use the raw dialog surface when you need custom modal wiring or bespoke footer content.</Paragraph>
        <template #footer>
          <CancelButton>Cancel</CancelButton>
          <ConfirmButton>Confirm</ConfirmButton>
        </template>
      </Dialog>
    `,
  }),
}

export const ContentOnly: Story = {
  render: () => ({
    components: { Dialog, Paragraph },
    template: `
      <Dialog title="Content-only dialog" :dismissible="false" :showFooter="false">
        <Paragraph>This layout is useful when parent code owns the surrounding chrome and actions.</Paragraph>
      </Dialog>
    `,
  }),
}
