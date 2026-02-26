import type { ParagraphProps } from "@marwes-ui/vue"
import { Divider, H1, Paragraph } from "@marwes-ui/vue"
import type { Meta, StoryObj } from "@storybook/vue3-vite"

const meta = {
  title: "Typography/Paragraph",
  component: Paragraph as unknown as object,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
  argTypes: {
    size: {
      control: "select",
      options: ["sm", "md", "lg"],
    },
  },
} satisfies Meta<ParagraphProps>

export default meta
type Story = StoryObj<ParagraphProps>

export const Default: Story = {
  render: () => ({
    components: { Paragraph },
    template: `
      <Paragraph>
        This is a standard paragraph with medium size. It's the default size used for most body text in your application.
      </Paragraph>
    `,
  }),
}

export const Small: Story = {
  render: () => ({
    components: { Paragraph },
    template: `
      <Paragraph size="sm">
        This is a small paragraph. Use this for secondary information, disclaimers, or less important text that needs to be de-emphasized.
      </Paragraph>
    `,
  }),
}

export const Medium: Story = {
  render: () => ({
    components: { Paragraph },
    template: `
      <Paragraph size="md">
        This is a medium paragraph. This is the default size and is ideal for standard body text, descriptions, and general content.
      </Paragraph>
    `,
  }),
}

export const Large: Story = {
  render: () => ({
    components: { Paragraph },
    template: `
      <Paragraph size="lg">
        This is a large paragraph. Use this for lead paragraphs, introductions, or text that needs more emphasis and better readability.
      </Paragraph>
    `,
  }),
}

export const AllSizes: Story = {
  render: () => ({
    components: { Divider, Paragraph },
    template: `
      <div style="display: flex; flex-direction: column;">
        <div>
          <Paragraph style="display: block;">Small (sm)</Paragraph>
          <Paragraph size="sm">
            This is a small paragraph. Use for footnotes, disclaimers, or secondary information.
          </Paragraph>
        </div>

        <Divider size="xs" />

        <div>
          <Paragraph style="display: block;">Medium (md) - Default</Paragraph>
          <Paragraph size="md">
            This is a medium paragraph. This is the default size for body text and standard content.
          </Paragraph>
        </div>

        <Divider size="xs" />

        <div>
          <Paragraph style="display: block;">Large (lg)</Paragraph>
          <Paragraph size="lg">
            This is a large paragraph. Use for lead paragraphs or emphasized content.
          </Paragraph>
        </div>
      </div>
    `,
  }),
}

export const LongText: Story = {
  render: () => ({
    components: { Paragraph },
    template: `
      <div style="max-width: 600px;">
        <Paragraph>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
        </Paragraph>
      </div>
    `,
  }),
}

export const WithCustomClass: Story = {
  render: () => ({
    components: { Paragraph },
    template: `
      <Paragraph className="custom-paragraph" style="color: var(--mw-primary); font-style: italic;">
        This paragraph has custom styling applied.
      </Paragraph>
    `,
  }),
}

export const ArticleExample: Story = {
  render: () => ({
    components: { H1, Paragraph },
    template: `
      <div style="max-width: 800px;">
        <H1 style="margin-bottom: 16px;">Understanding Design Systems</H1>

        <Paragraph size="lg" style="margin-bottom: 24px;">
          A design system is a collection of reusable components, guided by clear standards, that can be assembled together to build any number of applications.
        </Paragraph>

        <Paragraph style="margin-bottom: 16px;">
          Design systems enable teams to build better products faster by making design reusable. Rather than reinventing the wheel every time a new feature is needed, teams can leverage pre-built components that follow established patterns and guidelines.
        </Paragraph>

        <Paragraph style="margin-bottom: 16px;">
          Components in a design system are like building blocks. Each component is designed to work well on its own, but they're even more powerful when combined. This modular approach allows for consistent user experiences across different products and platforms.
        </Paragraph>

        <Paragraph size="sm" style="margin-top: 32px;">
          Note: This example demonstrates how different paragraph sizes can be used together to create visual hierarchy and improve readability in long-form content.
        </Paragraph>
      </div>
    `,
  }),
}

export const MultipleParagraphs: Story = {
  render: () => ({
    components: { Paragraph },
    template: `
      <div style="max-width: 600px;">
        <Paragraph style="margin-bottom: 16px;">
          First paragraph. This demonstrates how you might use multiple paragraphs in a real document. Note that spacing is controlled by the user.
        </Paragraph>

        <Paragraph style="margin-bottom: 16px;">
          Second paragraph. The components themselves don't include margin, which gives you full control over spacing in your layouts.
        </Paragraph>

        <Paragraph>
          Third paragraph. This approach follows the principle that components should be simple and composable, letting you decide how they fit together.
        </Paragraph>
      </div>
    `,
  }),
}
