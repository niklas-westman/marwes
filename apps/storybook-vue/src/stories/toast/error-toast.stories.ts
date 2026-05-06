import { storybookA11yPolicy, storybookLayout } from "@marwes-ui/core"
import type { ErrorToastProps } from "@marwes-ui/vue"
import { ErrorToast } from "@marwes-ui/vue"
import type { Meta, StoryObj } from "@storybook/vue3-vite"

const meta = {
  title: "Toast/Purpose/ErrorToast",
  component: ErrorToast as unknown as object,
  parameters: {
    ...storybookLayout.centered,
    ...storybookA11yPolicy.smoke,
  },
  tags: ["autodocs"],
} satisfies Meta<ErrorToastProps>

export default meta

type Story = StoryObj<ErrorToastProps>

export const Default: Story = {
  render: () => ({
    components: { ErrorToast },
    template: "<ErrorToast>Publishing failed. Please try again.</ErrorToast>",
  }),
}
