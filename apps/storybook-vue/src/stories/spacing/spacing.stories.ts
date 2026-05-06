import { storybookA11yPolicy, storybookLayout, storybookSpacingArgTypes } from "@marwes-ui/core"
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
  parameters: {
    ...storybookLayout.padded,

    ...storybookA11yPolicy.smoke,
  },
  tags: ["autodocs"],
  argTypes: storybookSpacingArgTypes,
  args: {
    size: "sp-24",
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
  args: { size: "sp-8" },
}

export const Small: Story = {
  args: { size: "sp-16" },
}

export const Large: Story = {
  args: { size: "sp-32" },
}

export const ExtraLarge: Story = {
  args: { size: "sp-40" },
}

/**
 * Full spacing scale from sp-0 to sp-120.
 */
export const AllSizes: Story = {
  render: () => ({
    components: { Spacing, Paragraph },
    setup() {
      const sizes = [
        { size: "sp-0", pixels: "0px" },
        { size: "sp-2", pixels: "2px" },
        { size: "sp-4", pixels: "4px" },
        { size: "sp-8", pixels: "8px" },
        { size: "sp-16", pixels: "16px" },
        { size: "sp-24", pixels: "24px" },
        { size: "sp-32", pixels: "32px" },
        { size: "sp-40", pixels: "40px" },
        { size: "sp-48", pixels: "48px" },
        { size: "sp-56", pixels: "56px" },
        { size: "sp-64", pixels: "64px" },
        { size: "sp-72", pixels: "72px" },
        { size: "sp-80", pixels: "80px" },
        { size: "sp-88", pixels: "88px" },
        { size: "sp-96", pixels: "96px" },
        { size: "sp-104", pixels: "104px" },
        { size: "sp-112", pixels: "112px" },
        { size: "sp-120", pixels: "120px" },
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
        <Spacing :size="Spacings['sp-24']" />
        <Paragraph>This is a paragraph</Paragraph>
      </div>
    `,
  }),
}
