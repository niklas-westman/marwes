import { storybookA11yPolicy, storybookLayout } from "@marwes-ui/core"
import type { InfoDialogProps } from "@marwes-ui/vue"
import { InfoDialog, Paragraph } from "@marwes-ui/vue"
import type { Meta, StoryObj } from "@storybook/vue3-vite"

const meta = {
  title: "Dialog/Purpose/InfoDialog",
  component: InfoDialog as unknown as object,
  parameters: {
    ...storybookLayout.centered,
    ...storybookA11yPolicy.smoke,
  },
} satisfies Meta<InfoDialogProps>

export default meta

type Story = StoryObj<InfoDialogProps>

export const Default: Story = {
  render: () => ({
    components: { InfoDialog, Paragraph },
    template: `
      <InfoDialog
        :open="true"
        :portalTarget="null"
        title="Scheduled maintenance"
        description="The workspace will be read-only for ten minutes."
      >
        <Paragraph>Save your drafts before the maintenance window begins.</Paragraph>
      </InfoDialog>
    `,
  }),
}
