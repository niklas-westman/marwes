import { storybookA11yPolicy, storybookLayout } from "@marwes-ui/core"
import { H1 } from "@marwes-ui/svelte"
import type { Meta, StoryObj } from "@storybook/svelte"
import HeadingShowcase from "./HeadingShowcase.svelte"

const meta = {
  title: "Heading/Atom",
  component: H1,
  parameters: {
    ...storybookLayout.padded,
    ...storybookA11yPolicy.smoke,
  },
  tags: ["autodocs"],
} satisfies Meta<typeof H1>

export default meta
type Story = StoryObj<typeof meta>

export const HeadingOne: Story = {
  args: { children: "This is a Heading 1" },
}

export const WithSizeOverride: Story = {
  args: { children: "H1 with h3 size", size: "h3" },
}

export const AllLevels: Story = {
  render: () => ({
    Component: HeadingShowcase,
    props: { story: "all-levels" },
  }),
}

export const SizeOverrides: Story = {
  render: () => ({
    Component: HeadingShowcase,
    props: { story: "size-override" },
  }),
}
