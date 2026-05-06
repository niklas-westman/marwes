import { storybookA11yPolicy, storybookLayout } from "@marwes-ui/core"
import type { DialogProps } from "@marwes-ui/vue"
import { CancelButton, ConfirmButton, Dialog, Paragraph } from "@marwes-ui/vue"
import type { Meta, StoryObj } from "@storybook/vue3-vite"

const meta = {
  title: "Dialog/Atom",
  component: Dialog as unknown as object,
  parameters: {
    ...storybookLayout.centered,
    ...storybookA11yPolicy.smoke,
  },
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
        <Paragraph>
          Use the raw dialog surface when parent code owns the surrounding shell. <code>Dialog</code>
          does not claim modal behavior by default.
        </Paragraph>
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
        <Paragraph>
          This layout is useful when parent code owns the surrounding chrome, actions, and any modal boundary behavior.
        </Paragraph>
      </Dialog>
    `,
  }),
}
