import { storybookA11yPolicy, storybookLayout } from "@marwes-ui/core"
import type { Meta, StoryObj } from "@storybook/svelte"
import ToastContainerStory from "./ToastContainerStory.svelte"
import ToastDemo from "./ToastDemo.svelte"

const meta = {
  title: "Toast/Molecule",
  component: ToastContainerStory,
  parameters: {
    ...storybookLayout.fullscreen,
    ...storybookA11yPolicy.smoke,
  },
  tags: ["autodocs"],
} satisfies Meta<typeof ToastContainerStory>

export default meta
type Story = StoryObj<typeof meta>

export const Stacked: Story = {
  args: {
    placement: "top-right",
    toasts: [
      { id: "saved", message: "Project saved.", intent: "success", duration: null },
      { id: "warning", message: "Storage is almost full.", intent: "warning", duration: null },
      { id: "error", message: "Publishing failed.", intent: "error", duration: null },
    ],
  },
}

export const BottomLeft: Story = {
  args: {
    placement: "bottom-left",
    toasts: [
      { id: "info", message: "Release notes are available.", intent: "info", duration: null },
      { id: "saved", message: "Auto-save complete.", intent: "success", duration: null },
    ],
  },
}

export const ImperativeAPI: Story = {
  render: () => ({
    Component: ToastDemo,
  }),
}
