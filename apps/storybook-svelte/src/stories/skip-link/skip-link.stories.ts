import { storybookA11yPolicy, storybookLayout } from "@marwes-ui/core"
import type { Meta, StoryObj } from "@storybook/svelte"
import SkipLinkPreview from "./SkipLinkPreview.svelte"

const meta = {
  title: "SkipLink/Atom",
  component: SkipLinkPreview,
  parameters: {
    ...storybookLayout.centered,
    ...storybookA11yPolicy.smoke,
  },
  tags: ["autodocs"],
  argTypes: {
    href: { control: "text" },
    label: { control: "text" },
  },
} satisfies Meta<typeof SkipLinkPreview>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    href: "#main",
    label: "Skip to main content",
  },
}
