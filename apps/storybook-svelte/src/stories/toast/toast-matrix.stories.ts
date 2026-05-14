import { storybookA11yPolicy, storybookLayout } from "@marwes-ui/core"
import type { Meta, StoryObj } from "@storybook/svelte"
import ToastMatrix from "./ToastMatrix.svelte"

const meta = {
  title: "Toast/Purpose/Matrix",
  component: ToastMatrix,
  parameters: {
    ...storybookLayout.fullscreen,
    ...storybookA11yPolicy.smoke,
  },
  tags: ["autodocs"],
} satisfies Meta<typeof ToastMatrix>

export default meta
type Story = StoryObj<typeof meta>

export const Light: Story = {
  args: { dark: false },
}

export const Dark: Story = {
  args: { dark: true },
}
