import { storybookA11yPolicy, storybookLayout } from "@marwes-ui/core"
import { Dialog } from "@marwes-ui/svelte"
import type { Meta, StoryObj } from "@storybook/svelte"
import DialogAtomStory from "./DialogAtomStory.svelte"

const meta = {
  title: "Dialog/Atom",
  component: Dialog,
  parameters: {
    ...storybookLayout.centered,
    ...storybookA11yPolicy.smoke,
  },
  argTypes: {
    size: { control: "select", options: ["small", "medium", "large"] },
    showFooter: { control: "boolean" },
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
    showFooter: true,
    dismissible: true,
    modal: false,
  },
  render: (args) => ({ Component: DialogAtomStory, props: args }),
}

export const ContentOnly: Story = {
  args: {
    title: "Content-only dialog",
    dismissible: false,
    showFooter: false,
  },
  render: (args) => ({ Component: DialogAtomStory, props: args }),
}
