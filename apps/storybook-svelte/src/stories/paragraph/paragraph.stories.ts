import { storybookA11yPolicy, storybookLayout } from "@marwes-ui/core"
import { Paragraph } from "@marwes-ui/svelte"
import type { Meta, StoryObj } from "@storybook/svelte"
import ParagraphShowcase from "./ParagraphShowcase.svelte"

const meta = {
  title: "Paragraph/Atom",
  component: Paragraph,
  parameters: { ...storybookLayout.padded, ...storybookA11yPolicy.smoke },
  tags: ["autodocs"],
  argTypes: {
    size: {
      control: "select",
      options: ["sm", "md", "lg"],
    },
  },
} satisfies Meta<typeof Paragraph>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    children:
      "This is a standard paragraph with medium size. It's the default size used for most body text in your application.",
  },
}

export const Small: Story = {
  args: {
    size: "sm",
    children:
      "This is a small paragraph. Use this for secondary information, disclaimers, or less important text.",
  },
}

export const Medium: Story = {
  args: {
    size: "md",
    children:
      "This is a medium paragraph. This is the default size and is ideal for standard body text.",
  },
}

export const Large: Story = {
  args: {
    size: "lg",
    children:
      "This is a large paragraph. Use this for lead paragraphs, introductions, or text that needs more emphasis.",
  },
}

export const AllSizes: Story = {
  render: () => ({
    Component: ParagraphShowcase,
    props: { showcase: "all-sizes" },
  }),
}

export const LongText: Story = {
  render: () => ({
    Component: ParagraphShowcase,
    props: { showcase: "long-text" },
  }),
}

export const WithCustomClass: Story = {
  render: () => ({
    Component: ParagraphShowcase,
    props: { showcase: "with-custom-class" },
  }),
}

export const ArticleExample: Story = {
  render: () => ({
    Component: ParagraphShowcase,
    props: { showcase: "article" },
  }),
}

export const MultipleParagraphs: Story = {
  render: () => ({
    Component: ParagraphShowcase,
    props: { showcase: "multiple" },
  }),
}
