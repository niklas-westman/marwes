import { storybookA11yPolicy, storybookLayout, storybookSkeletonArgTypes } from "@marwes-ui/core"
import type { SkeletonProps } from "@marwes-ui/vue"
import { H2, Paragraph, Skeleton } from "@marwes-ui/vue"
import type { Meta, StoryObj } from "@storybook/vue3-vite"

const stageStyle = "display: grid; gap: 1rem; width: min(720px, 100%);"
const cardStyle = `
  display: grid;
  gap: 0.875rem;
  width: 320px;
  padding: 1rem;
  border-radius: 16px;
  border: 1px solid color-mix(in srgb, var(--mw-color-border) 72%, transparent);
  background: var(--mw-color-surface);
`

const meta = {
  title: "Skeleton/Atom",
  component: Skeleton as unknown as object,
  parameters: {
    ...storybookLayout.padded,
    ...storybookA11yPolicy.smoke,
  },
  tags: ["autodocs"],
  argTypes: storybookSkeletonArgTypes,
  args: {
    variant: "text",
    animation: "pulse",
    decorative: true,
  },
} satisfies Meta<SkeletonProps>

export default meta
type Story = StoryObj<SkeletonProps>

export const Default: Story = {}

export const Circular: Story = {
  args: { variant: "circular" },
}

export const Rectangular: Story = {
  args: { variant: "rectangular" },
}

export const Wave: Story = {
  args: {
    variant: "rectangular",
    width: 280,
    height: 120,
    animation: "wave",
  },
}

export const FigmaShapes: Story = {
  render: () => ({
    components: { Skeleton, Paragraph },
    setup() {
      return { stageStyle }
    },
    template: `
      <div :style="stageStyle">
        <Paragraph>Text — 120×12 / radius 4</Paragraph>
        <Skeleton variant="text" animation="none" />
        <Paragraph>Circular — 40×40 / radius 100</Paragraph>
        <Skeleton variant="circular" animation="none" />
        <Paragraph>Rectangular — 120×120 / radius 4</Paragraph>
        <Skeleton variant="rectangular" animation="none" />
      </div>
    `,
  }),
}

export const LoadingCard: Story = {
  render: (args: SkeletonProps) => ({
    components: { Skeleton },
    setup() {
      return { args, cardStyle }
    },
    template: `
      <output :style="cardStyle" aria-busy="true" aria-label="Loading account summary">
        <div style="display: flex; align-items: center; gap: 0.75rem;">
          <Skeleton v-bind="args" variant="circular" :width="48" :height="48" />
          <div style="display: grid; gap: 0.5rem; flex: 1;">
            <Skeleton v-bind="args" width="70%" :height="12" />
            <Skeleton v-bind="args" width="45%" :height="12" />
          </div>
        </div>
        <Skeleton v-bind="args" variant="rectangular" width="100%" :height="120" :radius="12" />
        <div style="display: grid; gap: 0.5rem;">
          <Skeleton v-bind="args" width="92%" :height="12" />
          <Skeleton v-bind="args" width="78%" :height="12" />
        </div>
      </output>
    `,
  }),
}

export const AccessibleStatus: Story = {
  render: () => ({
    components: { H2, Skeleton },
    setup() {
      return { stageStyle }
    },
    template: `
      <div :style="stageStyle">
        <H2>Standalone loading region</H2>
        <Skeleton variant="rectangular" :width="320" :height="160" ariaLabel="Loading dashboard panel" />
      </div>
    `,
  }),
}
