import { storybookDividerArgTypes, storybookLayout } from "@marwes-ui/core"
import type { DividerProps } from "@marwes-ui/vue"
import { Divider, H1, H2, H3, Paragraph } from "@marwes-ui/vue"
import type { Meta, StoryObj } from "@storybook/vue3-vite"

const meta = {
  title: "Atoms/Divider",
  component: Divider as unknown as object,
  parameters: storybookLayout.padded,
  tags: ["autodocs"],
  argTypes: storybookDividerArgTypes,
  args: {
    size: "md",
    orientation: "horizontal",
  },
} satisfies Meta<DividerProps>

export default meta
type Story = StoryObj<DividerProps>

export const Default: Story = {}

export const Hairline: Story = {
  args: {
    size: "xxs",
  },
}

export const Small: Story = {
  args: {
    size: "sm",
  },
}

export const Large: Story = {
  args: {
    size: "lg",
  },
}

export const ExtraLarge: Story = {
  render: () => ({
    components: { Divider },
    template: `<Divider size="xxl" />`,
  }),
}

export const AllSizes: Story = {
  render: () => ({
    components: { Divider, Paragraph },
    template: `
      <div style="width: 600px;">
        <Paragraph>xxs (1px)</Paragraph>
        <Divider size="xxs" />

        <Paragraph>xs (8px)</Paragraph>
        <Divider size="xs" />

        <Paragraph>sm (16px)</Paragraph>
        <Divider size="sm" />

        <Paragraph>md (32px)</Paragraph>
        <Divider size="md" />

        <Paragraph>lg (48px)</Paragraph>
        <Divider size="lg" />

        <Paragraph>xl (64px)</Paragraph>
        <Divider size="xl" />

        <Paragraph>xxl (80px)</Paragraph>
        <Divider size="xxl" />
      </div>
    `,
  }),
}

export const Vertical: Story = {
  args: {
    orientation: "vertical",
    size: "sm",
  },
  render: (args) => ({
    components: { Divider, Paragraph },
    setup() {
      return { args }
    },
    template: `
      <div style="display: flex; align-items: center; height: 120px;">
        <Paragraph>Left content</Paragraph>
        <Divider v-bind="args" />
        <Paragraph>Right content</Paragraph>
      </div>
    `,
  }),
}

export const VerticalSizes: Story = {
  render: () => ({
    components: { Divider, Paragraph },
    template: `
      <div style="display: flex; align-items: center; height: 120px; gap: 0;">
        <Paragraph>xxs</Paragraph>
        <Divider orientation="vertical" size="xxs" />

        <Paragraph>xs</Paragraph>
        <Divider orientation="vertical" size="xs" />

        <Paragraph>sm</Paragraph>
        <Divider orientation="vertical" size="sm" />

        <Paragraph>md</Paragraph>
        <Divider orientation="vertical" size="md" />

        <Paragraph>lg</Paragraph>
        <Divider orientation="vertical" size="lg" />

        <Paragraph>xl</Paragraph>
        <Divider orientation="vertical" size="xl" />

        <Paragraph>xxl</Paragraph>
        <Divider orientation="vertical" size="xxl" />
      </div>
    `,
  }),
}

export const WithContent: Story = {
  render: () => ({
    components: { Divider, H2, Paragraph },
    template: `
      <div style="max-width: 600px;">
        <H2 style="margin: 0 0 1rem 0;">Section One</H2>
        <Paragraph style="margin: 0 0 1rem 0;">
          This is the first section of content. It contains some introductory text that explains the
          purpose of this section.
        </Paragraph>

        <Divider size="sm" />

        <H2 style="margin: 0 0 1rem 0;">Section Two</H2>
        <Paragraph style="margin: 0 0 1rem 0;">
          This is the second section. The divider above visually separates it from the previous
          content while maintaining semantic meaning.
        </Paragraph>

        <Divider size="sm" />

        <H2 style="margin: 0 0 1rem 0;">Section Three</H2>
        <Paragraph style="margin: 0;">
          Final section of content. Dividers help organize information and improve readability of
          long-form content.
        </Paragraph>
      </div>
    `,
  }),
}

export const VisualHierarchy: Story = {
  render: () => ({
    components: { Divider, H1, H2, H3, Paragraph },
    template: `
      <div style="max-width: 600px;">
        <H1 style="margin: 0 0 1rem 0;">Main Title</H1>
        <Divider size="lg" />

        <H2 style="margin: 0 0 1rem 0;">Major Section</H2>
        <Paragraph style="margin: 0 0 1rem 0;">Content of the major section.</Paragraph>
        <Divider size="md" />

        <H3 style="margin: 0 0 1rem 0;">Subsection</H3>
        <Paragraph style="margin: 0 0 1rem 0;">Content of the subsection.</Paragraph>
        <Divider size="sm" />

        <Paragraph style="margin: 0 0 1rem 0;">Minor Point</Paragraph>
        <Paragraph style="margin: 0;">Minor details separated by a thin divider.</Paragraph>
        <Divider size="xxs" />
      </div>
    `,
  }),
}
