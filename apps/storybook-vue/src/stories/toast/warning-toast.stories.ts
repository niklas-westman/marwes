import { storybookA11yPolicy, storybookLayout } from "@marwes-ui/core"
import type { WarningToastProps } from "@marwes-ui/vue"
import { WarningToast } from "@marwes-ui/vue"
import type { Meta, StoryObj } from "@storybook/vue3-vite"

const meta = {
  title: "Toast/Purpose/WarningToast",
  component: WarningToast as unknown as object,
  parameters: {
    ...storybookLayout.centered,
    ...storybookA11yPolicy.smoke,
  },
  tags: ["autodocs"],
} satisfies Meta<WarningToastProps>

export default meta

type Story = StoryObj<WarningToastProps>

export const Default: Story = {
  render: () => ({
    components: { WarningToast },
    template: "<WarningToast>Storage is almost full.</WarningToast>",
  }),
}
