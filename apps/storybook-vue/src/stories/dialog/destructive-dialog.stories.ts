import { storybookA11yPolicy, storybookLayout } from "@marwes-ui/core"
import type { DestructiveDialogProps } from "@marwes-ui/vue"
import { DestructiveDialog, Paragraph } from "@marwes-ui/vue"
import type { Meta, StoryObj } from "@storybook/vue3-vite"

const meta = {
  title: "Dialog/Purpose/DestructiveDialog",
  component: DestructiveDialog as unknown as object,
  parameters: {
    ...storybookLayout.centered,
    ...storybookA11yPolicy.smoke,
  },
} satisfies Meta<DestructiveDialogProps>

export default meta

type Story = StoryObj<DestructiveDialogProps>

export const Default: Story = {
  render: () => ({
    components: { DestructiveDialog, Paragraph },
    template: `
      <DestructiveDialog
        :open="true"
        :portalTarget="null"
        title="Delete workspace"
        description="This action permanently removes all projects, members, and history."
      >
        <Paragraph>Make sure you exported anything you need before continuing.</Paragraph>
      </DestructiveDialog>
    `,
  }),
}
