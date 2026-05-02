import { storybookLayout } from "@marwes-ui/core"
import type { InfoToastProps } from "@marwes-ui/vue"
import { InfoToast } from "@marwes-ui/vue"
import type { Meta, StoryObj } from "@storybook/vue3-vite"

const meta = {
  title: "Toast/Purpose/InfoToast",
  component: InfoToast as unknown as object,
  parameters: storybookLayout.centered,
  tags: ["autodocs"],
} satisfies Meta<InfoToastProps>

export default meta

type Story = StoryObj<InfoToastProps>

export const Default: Story = {
  render: () => ({
    components: { InfoToast },
    template: "<InfoToast>New release notes are available.</InfoToast>",
  }),
}
