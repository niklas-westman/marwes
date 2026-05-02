import { storybookDividerArgTypes, storybookLayout } from "@marwes-ui/core"
import type { DividerProps } from "@marwes-ui/vue"
import { Divider, H1, H2, H3, Paragraph } from "@marwes-ui/vue"
import type { Meta, StoryObj } from "@storybook/vue3-vite"

const spacingHighlight = "rgba(14, 165, 233, 0.16)"
const panelBorder = "rgba(148, 163, 184, 0.35)"
const horizontalBandStyle = `
  width: 100%;
  border-radius: 12px;
  background: ${spacingHighlight};
  box-shadow: inset 0 0 0 1px ${panelBorder};
`
const verticalStageStyle = `
  display: flex;
  align-items: center;
  height: 140px;
  padding: 0 1rem;
  border-radius: 12px;
  background: ${spacingHighlight};
  box-shadow: inset 0 0 0 1px ${panelBorder};
`
const contentBlockStyle = `
  margin: 0;
  padding: 0.75rem 1rem;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.96);
  box-shadow: inset 0 0 0 1px ${panelBorder};
`

function renderDividerPreview(args: DividerProps) {
  if (args.orientation === "vertical") {
    return {
      components: { Divider, Paragraph },
      setup() {
        return { args, contentBlockStyle, verticalStageStyle }
      },
      template: `
        <div :style="verticalStageStyle">
          <Paragraph :style="contentBlockStyle">Left content</Paragraph>
          <Divider v-bind="args" />
          <Paragraph :style="contentBlockStyle">Right content</Paragraph>
        </div>
      `,
    }
  }

  return {
    components: { Divider },
    setup() {
      return { args, horizontalBandStyle }
    },
    template: `
      <div :style="horizontalBandStyle">
        <Divider v-bind="args" />
      </div>
    `,
  }
}

const meta = {
  title: "Divider/Atom",
  component: Divider as unknown as object,
  parameters: storybookLayout.padded,
  tags: ["autodocs"],
  argTypes: storybookDividerArgTypes,
  args: {
    size: "md",
    orientation: "horizontal",
  },
  render: (args: DividerProps) => renderDividerPreview(args),
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
  args: {
    size: "xxl",
  },
}

export const AllSizes: Story = {
  render: () => ({
    components: { Divider, Paragraph },
    setup() {
      return { horizontalBandStyle }
    },
    template: `
      <div style="width: 600px;">
        <Paragraph>xxs (1px)</Paragraph>
        <div :style="horizontalBandStyle">
          <Divider size="xxs" />
        </div>

        <Paragraph>xs (8px)</Paragraph>
        <div :style="horizontalBandStyle">
          <Divider size="xs" />
        </div>

        <Paragraph>sm (16px)</Paragraph>
        <div :style="horizontalBandStyle">
          <Divider size="sm" />
        </div>

        <Paragraph>md (32px)</Paragraph>
        <div :style="horizontalBandStyle">
          <Divider size="md" />
        </div>

        <Paragraph>lg (48px)</Paragraph>
        <div :style="horizontalBandStyle">
          <Divider size="lg" />
        </div>

        <Paragraph>xl (64px)</Paragraph>
        <div :style="horizontalBandStyle">
          <Divider size="xl" />
        </div>

        <Paragraph>xxl (80px)</Paragraph>
        <div :style="horizontalBandStyle">
          <Divider size="xxl" />
        </div>
      </div>
    `,
  }),
}

export const Vertical: Story = {
  args: {
    orientation: "vertical",
    size: "sm",
  },
}

export const VerticalSizes: Story = {
  render: () => ({
    components: { Divider, Paragraph },
    setup() {
      return { contentBlockStyle, verticalStageStyle }
    },
    template: `
      <div :style="verticalStageStyle">
        <Paragraph :style="contentBlockStyle">xxs</Paragraph>
        <Divider orientation="vertical" size="xxs" />

        <Paragraph :style="contentBlockStyle">xs</Paragraph>
        <Divider orientation="vertical" size="xs" />

        <Paragraph :style="contentBlockStyle">sm</Paragraph>
        <Divider orientation="vertical" size="sm" />

        <Paragraph :style="contentBlockStyle">md</Paragraph>
        <Divider orientation="vertical" size="md" />

        <Paragraph :style="contentBlockStyle">lg</Paragraph>
        <Divider orientation="vertical" size="lg" />

        <Paragraph :style="contentBlockStyle">xl</Paragraph>
        <Divider orientation="vertical" size="xl" />

        <Paragraph :style="contentBlockStyle">xxl</Paragraph>
        <Divider orientation="vertical" size="xxl" />
      </div>
    `,
  }),
}

export const WithContent: Story = {
  render: () => ({
    components: { Divider, H2, Paragraph },
    setup() {
      return { horizontalBandStyle }
    },
    template: `
      <div style="max-width: 600px;">
        <H2 style="margin: 0 0 1rem 0;">Section One</H2>
        <Paragraph style="margin: 0 0 1rem 0;">
          This is the first section of content. It contains some introductory text that explains the
          purpose of this section.
        </Paragraph>

        <div :style="horizontalBandStyle">
          <Divider size="sm" />
        </div>

        <H2 style="margin: 0 0 1rem 0;">Section Two</H2>
        <Paragraph style="margin: 0 0 1rem 0;">
          This is the second section. The divider above visually separates it from the previous
          content while maintaining semantic meaning.
        </Paragraph>

        <div :style="horizontalBandStyle">
          <Divider size="sm" />
        </div>

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
    setup() {
      return { horizontalBandStyle }
    },
    template: `
      <div style="max-width: 600px;">
        <H1 style="margin: 0 0 1rem 0;">Main Title</H1>
        <div :style="horizontalBandStyle">
          <Divider size="lg" />
        </div>

        <H2 style="margin: 0 0 1rem 0;">Major Section</H2>
        <Paragraph style="margin: 0 0 1rem 0;">Content of the major section.</Paragraph>
        <div :style="horizontalBandStyle">
          <Divider size="md" />
        </div>

        <H3 style="margin: 0 0 1rem 0;">Subsection</H3>
        <Paragraph style="margin: 0 0 1rem 0;">Content of the subsection.</Paragraph>
        <div :style="horizontalBandStyle">
          <Divider size="sm" />
        </div>

        <Paragraph style="margin: 0 0 1rem 0;">Minor Point</Paragraph>
        <Paragraph style="margin: 0;">Minor details separated by a thin divider.</Paragraph>
        <div :style="horizontalBandStyle">
          <Divider size="xxs" />
        </div>
      </div>
    `,
  }),
}
