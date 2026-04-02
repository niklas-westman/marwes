import { storybookLayout, storybookSpacingArgTypes } from "@marwes-ui/core"
import type { SpacingProps } from "@marwes-ui/vue"
import { H1, Paragraph, Spacing, Spacings } from "@marwes-ui/vue"
import type { Meta, StoryObj } from "@storybook/vue3-vite"

const panelBorder = "rgba(148, 163, 184, 0.35)"
const spacingHighlight = "rgba(14, 165, 233, 0.16)"
const spacerWrapStyle = `
  width: 100%;
  border-radius: 12px;
  background: ${spacingHighlight};
  box-shadow: inset 0 0 0 1px ${panelBorder};
  overflow: hidden;
`

const meta = {
  title: "Spacing/Atom",
  component: Spacing as unknown as object,
  parameters: storybookLayout.padded,
  tags: ["autodocs"],
  argTypes: storybookSpacingArgTypes,
  args: {
    size: "md",
  },
  render: (args: SpacingProps) => ({
    components: { Spacing },
    setup() {
      return { args, spacerWrapStyle }
    },
    template: `
      <div :style="spacerWrapStyle">
        <Spacing v-bind="args" />
      </div>
    `,
  }),
} satisfies Meta<SpacingProps>

export default meta
type Story = StoryObj<SpacingProps>

export const Default: Story = {}

export const ExtraSmall: Story = {
  args: { size: "xs" },
}

export const Small: Story = {
  args: { size: "sm" },
}

export const Large: Story = {
  args: { size: "lg" },
}

export const ExtraLarge: Story = {
  args: { size: "xl" },
}

/**
 * All 9 size variants from smallest (xxxs=2px) to largest (xxxl=56px).
 */
export const AllSizes: Story = {
  render: () => ({
    components: { Spacing, Paragraph },
    setup() {
      const sizes = [
        { size: "xxxs", pixels: "2px" },
        { size: "xxs", pixels: "4px" },
        { size: "xs", pixels: "8px" },
        { size: "sm", pixels: "16px" },
        { size: "md", pixels: "24px" },
        { size: "lg", pixels: "32px" },
        { size: "xl", pixels: "40px" },
        { size: "xxl", pixels: "48px" },
        { size: "xxxl", pixels: "56px" },
        { size: "4xl", pixels: "64px" },
        { size: "5xl", pixels: "72px" },
        { size: "6xl", pixels: "80px" },
        { size: "7xl", pixels: "88px" },
        { size: "8xl", pixels: "96px" },
        { size: "9xl", pixels: "104px" },
        { size: "10xl", pixels: "112px" },
        { size: "11xl", pixels: "120px" },
      ]
      return { sizes, spacerWrapStyle }
    },
    template: `
      <div style="width: 600px;">
        <div v-for="item in sizes" :key="item.size">
          <Paragraph>{{ item.size }} ({{ item.pixels }})</Paragraph>
          <div :style="spacerWrapStyle">
            <Spacing :size="item.size" />
          </div>
        </div>
      </div>
    `,
  }),
}

/**
 * Demonstrates Spacings const for token-driven usage without magic strings.
 */
export const InContext: Story = {
  render: () => ({
    components: { Spacing, H1, Paragraph },
    setup() {
      return { Spacings }
    },
    template: `
      <div style="max-width: 600px;">
        <H1>This is a title</H1>
        <Spacing :size="Spacings.md" />
        <Paragraph>This is a paragraph</Paragraph>
      </div>
    `,
  }),
}
