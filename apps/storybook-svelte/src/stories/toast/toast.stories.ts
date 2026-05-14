import { storybookA11yPolicy, storybookLayout } from "@marwes-ui/core"
import { Toast } from "@marwes-ui/svelte"
import type { Meta, StoryObj } from "@storybook/svelte"
import ToastShowcase from "./ToastShowcase.svelte"

const meta = {
  title: "Toast/Atom",
  component: Toast,
  parameters: {
    ...storybookLayout.centered,
    ...storybookA11yPolicy.smoke,
  },
  tags: ["autodocs"],
  argTypes: {
    variant: { control: "select", options: ["subtle", "outline", "rich"] },
    ariaLive: { control: "select", options: ["polite", "assertive"] },
  },
} satisfies Meta<typeof Toast>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    children: "Your changes have been saved.",
  },
}

export const DismissIconEscapeHatch: Story = {
  args: {
    children: "Your changes have been saved.",
    ondismiss: () => {},
  },
}

export const WithCustomAction: Story = {
  args: {
    children: "File uploaded successfully.",
  },
}

export const AllVariants: Story = {
  render: () => ({
    Component: ToastShowcase,
    props: { showcase: "all-variants" },
  }),
}

export const DarkVariants: Story = {
  render: () => ({
    Component: ToastShowcase,
    props: { showcase: "dark-variants" },
  }),
}

export const Urgent: Story = {
  args: {
    children: "Session expired. Please log in again.",
    variant: "rich",
    ariaLive: "assertive",
  },
}
