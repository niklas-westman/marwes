import { storybookA11yPolicy, storybookLayout } from "@marwes-ui/core"
import type { ConfirmDialogProps } from "@marwes-ui/vue"
import { ConfirmDialog, Paragraph } from "@marwes-ui/vue"
import type { Meta, StoryObj } from "@storybook/vue3-vite"

const meta = {
  title: "Dialog/Purpose/ConfirmDialog",
  component: ConfirmDialog as unknown as object,
  parameters: {
    ...storybookLayout.centered,
    ...storybookA11yPolicy.smoke,
  },
  tags: ["autodocs"],
} satisfies Meta<ConfirmDialogProps>

export default meta

type Story = StoryObj<ConfirmDialogProps>

export const Default: Story = {
  render: () => ({
    components: { ConfirmDialog, Paragraph },
    template: `
      <ConfirmDialog
        :open="true"
        :portalTarget="null"
        title="Publish update"
        description="This sends the release to subscribers immediately."
      >
        <Paragraph>Review the release summary before confirming.</Paragraph>
      </ConfirmDialog>
    `,
  }),
}
