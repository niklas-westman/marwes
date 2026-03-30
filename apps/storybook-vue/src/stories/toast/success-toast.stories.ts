import { storybookLayout } from "@marwes-ui/core"
import type { SuccessToastProps } from "@marwes-ui/vue"
import { SuccessToast } from "@marwes-ui/vue"
import type { Meta, StoryObj } from "@storybook/vue3-vite"

const meta = {
  title: "Toast/Purpose/SuccessToast",
  component: SuccessToast as unknown as object,
  parameters: storybookLayout.centered,
  tags: ["autodocs"],
} satisfies Meta<SuccessToastProps>

export default meta

type Story = StoryObj<SuccessToastProps>

export const Default: Story = {
  render: () => ({
    components: { SuccessToast },
    template: "<SuccessToast>Project saved successfully.</SuccessToast>",
  }),
}
