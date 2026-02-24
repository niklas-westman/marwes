import type { HeadingProps } from "@marwes-ui/vue"
import { H1, H2, H3, Paragraph } from "@marwes-ui/vue"
import type { Meta, StoryObj } from "@storybook/vue3-vite"

const meta = {
  title: "Typography/Heading",
  component: H1 as unknown as object,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
} satisfies Meta<HeadingProps>

export default meta
type Story = StoryObj<HeadingProps>

export const HeadingOne: Story = {
  render: () => ({
    components: { H1 },
    template: "<H1>This is a Heading 1</H1>",
  }),
}

export const HeadingTwo: Story = {
  render: () => ({
    components: { H2 },
    template: "<H2>This is a Heading 2</H2>",
  }),
}

export const HeadingThree: Story = {
  render: () => ({
    components: { H3 },
    template: "<H3>This is a Heading 3</H3>",
  }),
}

export const AllLevels: Story = {
  render: () => ({
    components: { H1, H2, H3 },
    template: `
      <div style="display: flex; flex-direction: column; gap: 24px;">
        <H1>Heading 1 - Page Title</H1>
        <H2>Heading 2 - Section Title</H2>
        <H3>Heading 3 - Subsection Title</H3>
      </div>
    `,
  }),
}

export const SizeOverride: Story = {
  render: () => ({
    components: { H1 },
    template: `
      <div style="display: flex; flex-direction: column; gap: 16px;">
        <H1>Normal H1 (h1 size)</H1>
        <H1 size="h2">H1 with h2 size (semantic h1, visual h2)</H1>
        <H1 size="h3">H1 with h3 size (semantic h1, visual h3)</H1>
      </div>
    `,
  }),
}

export const WithCustomClass: Story = {
  render: () => ({
    components: { H1 },
    template: `
      <H1 className="custom-class" style="color: var(--mw-primary);">
        Styled Heading
      </H1>
    `,
  }),
}

export const WithID: Story = {
  render: () => ({
    components: { H1, H2, H3, Paragraph },
    template: `
      <div style="display: flex; flex-direction: column; gap: 16px;">
        <H1 id="introduction">Introduction</H1>
        <H2 id="getting-started">Getting Started</H2>
        <H3 id="installation">Installation</H3>
        <Paragraph>
          Use these IDs for anchor links: #introduction, #getting-started, #installation
        </Paragraph>
      </div>
    `,
  }),
}

export const LongText: Story = {
  render: () => ({
    components: { H1, H2 },
    template: `
      <div style="max-width: 600px;">
        <H1>
          This is a Very Long Heading That Might Wrap to Multiple Lines Depending on the Viewport Width
        </H1>
        <H2>This is also a long heading but at H2 level with different styling</H2>
      </div>
    `,
  }),
}

export const ContentHierarchy: Story = {
  render: () => ({
    components: { H1, H2, H3, Paragraph },
    template: `
      <div style="max-width: 800px;">
        <H1>Design System Documentation</H1>
        <Paragraph style="margin-top: 16px; margin-bottom: 32px;">
          A comprehensive guide to building with Marwes components.
        </Paragraph>

        <H2 style="margin-top: 32px;">Getting Started</H2>
        <Paragraph style="margin-top: 12px; margin-bottom: 24px;">
          Learn how to set up and use the design system in your project.
        </Paragraph>

        <H3 style="margin-top: 24px;">Installation</H3>
        <Paragraph style="margin-top: 8px;">
          Install the required packages using your package manager.
        </Paragraph>

        <H3 style="margin-top: 24px;">Configuration</H3>
        <Paragraph style="margin-top: 8px;">
          Configure your theme and provider settings.
        </Paragraph>

        <H2 style="margin-top: 32px;">Components</H2>
        <Paragraph style="margin-top: 12px;">Explore the available component library.</Paragraph>
      </div>
    `,
  }),
}
