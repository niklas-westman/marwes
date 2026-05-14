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

export const HeadingTwo: Story = {
  render: () => ({
    Component: HeadingShowcase,
    props: { story: "heading-two" },
  }),
}

export const HeadingThree: Story = {
  render: () => ({
    Component: HeadingShowcase,
    props: { story: "heading-three" },
  }),
}

export const AllLevels: Story = {
  render: () => ({
    Component: HeadingShowcase,
    props: { story: "all-levels" },
  }),
}

export const SizeOverride: Story = {
  render: () => ({
    Component: HeadingShowcase,
    props: { story: "size-override" },
  }),
}

export const WithCustomClass: Story = {
  render: () => ({
    Component: HeadingShowcase,
    props: { story: "with-custom-class" },
  }),
}

export const WithID: Story = {
  render: () => ({
    Component: HeadingShowcase,
    props: { story: "with-id" },
  }),
}

export const LongText: Story = {
  render: () => ({
    Component: HeadingShowcase,
    props: { story: "long-text" },
  }),
}

export const ContentHierarchy: Story = {
  render: () => ({
    Component: HeadingShowcase,
    props: { story: "content-hierarchy" },
  }),
}
