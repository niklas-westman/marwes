import { storybookLayout } from "@marwes-ui/core"
import { Card } from "@marwes-ui/react"
import type { Meta, StoryObj } from "@storybook/react"
import * as React from "react"

const meta: Meta<typeof Card> = {
  title: "Card/Atom",
  component: Card,
  parameters: storybookLayout.centered,
  tags: ["autodocs"],
}

export default meta
type Story = StoryObj<typeof Card>

export const Default: Story = {
  args: {
    children: "This is the card body. Use it to display any content.",
  },
}

export const WithTitle: Story = {
  args: {
    title: "Card title",
    children: "This is the card body. Use it to display any content.",
  },
}

export const BodyOnly: Story = {
  args: {
    children: "A card without a title — body receives full top padding.",
  },
}

export const AllVariants: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: 16, width: 360 }}>
      <Card title="With title">
        Cards with a title render a header area above the body content.
      </Card>
      <Card>Cards without a title receive full top padding — the body starts at the top.</Card>
      <Card title="Richer content">
        <p style={{ margin: 0 }}>Cards accept any React content as children.</p>
        <p style={{ margin: "8px 0 0" }}>Use them to group related information.</p>
      </Card>
    </div>
  ),
}

export const DarkVariants: Story = {
  render: () => (
    <div
      className="mw-theme--dark"
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 16,
        width: 360,
        padding: 24,
        background: "#111827",
        borderRadius: 8,
      }}
    >
      <Card title="Dark card">
        Surface, border, title and body all adapt to dark mode automatically.
      </Card>
      <Card>Body-only card in dark mode.</Card>
    </div>
  ),
}
