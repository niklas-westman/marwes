import { storybookLayout, storybookSkeletonArgTypes } from "@marwes-ui/core"
import type { SkeletonProps } from "@marwes-ui/react"
import { H2, Paragraph, Skeleton } from "@marwes-ui/react"
import type { Meta, StoryObj } from "@storybook/react-vite"

const stageStyle = {
  display: "grid",
  gap: "1rem",
  width: "min(720px, 100%)",
}

const cardStyle = {
  display: "grid",
  gap: "0.875rem",
  width: "320px",
  padding: "1rem",
  borderRadius: "16px",
  border: "1px solid color-mix(in srgb, var(--mw-color-border) 72%, transparent)",
  background: "var(--mw-color-surface)",
}

const meta = {
  title: "Skeleton/Atom",
  component: Skeleton,
  parameters: storybookLayout.padded,
  tags: ["autodocs"],
  argTypes: storybookSkeletonArgTypes,
  args: {
    variant: "text",
    animation: "pulse",
    decorative: true,
  },
} satisfies Meta<typeof Skeleton>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Circular: Story = {
  args: {
    variant: "circular",
  },
}

export const Rectangular: Story = {
  args: {
    variant: "rectangular",
  },
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
  render: () => (
    <div style={{ ...stageStyle, alignItems: "start" }}>
      <Paragraph>Text — 120×12 / radius 4</Paragraph>
      <Skeleton variant="text" animation="none" />
      <Paragraph>Circular — 40×40 / radius 100</Paragraph>
      <Skeleton variant="circular" animation="none" />
      <Paragraph>Rectangular — 120×120 / radius 4</Paragraph>
      <Skeleton variant="rectangular" animation="none" />
    </div>
  ),
}

export const LoadingCard: Story = {
  render: (args: SkeletonProps) => (
    <div style={cardStyle} aria-label="Loading account summary">
      <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
        <Skeleton {...args} variant="circular" width={48} height={48} />
        <div style={{ display: "grid", gap: "0.5rem", flex: 1 }}>
          <Skeleton {...args} width="70%" height={12} />
          <Skeleton {...args} width="45%" height={12} />
        </div>
      </div>
      <Skeleton {...args} variant="rectangular" width="100%" height={120} radius={12} />
      <div style={{ display: "grid", gap: "0.5rem" }}>
        <Skeleton {...args} width="92%" height={12} />
        <Skeleton {...args} width="78%" height={12} />
      </div>
    </div>
  ),
}

export const AccessibleStatus: Story = {
  render: () => (
    <div style={stageStyle}>
      <H2>Standalone loading region</H2>
      <Skeleton
        variant="rectangular"
        width={320}
        height={160}
        ariaLabel="Loading dashboard panel"
      />
    </div>
  ),
}
