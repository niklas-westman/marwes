import { storybookA11yPolicy, storybookLayout } from "@marwes-ui/core"
import { Dialog } from "@marwes-ui/svelte"
import type { Meta, StoryObj } from "@storybook/svelte"

const meta = {
  title: "Dialog/Atom",
  component: Dialog,
  parameters: {
    ...storybookLayout.centered,
    ...storybookA11yPolicy.smoke,
  },
  tags: ["autodocs"],
  argTypes: {
    size: { control: "select", options: ["small", "medium", "large"] },
    dismissible: { control: "boolean" },
    modal: { control: "boolean" },
  },
} satisfies Meta<typeof Dialog>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    title: "Dialog title",
    description:
      "Describe the dialog purpose. Provide enough context for the user to understand the action or information being presented.",
    size: "medium",
    dismissible: true,
    modal: false,
  },
}

export const ContentOnly: Story = {
  args: {
    title: "Content-only dialog",
    dismissible: false,
  },
}
