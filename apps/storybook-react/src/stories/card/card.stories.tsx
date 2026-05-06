import { storybookA11yPolicy, storybookLayout } from "@marwes-ui/core"
import { Card, type CardProps, MarwesProvider, ThemeMode } from "@marwes-ui/react"
import type { Meta, StoryObj } from "@storybook/react"
import * as React from "react"

const cardStatePreviews: Array<{
  label: string
  props: CardProps
}> = [
  {
    label: "Default",
    props: {
      title: "Card title",
      children: "Resting state with the default border and neutral surface.",
    },
  },
  {
    label: "Hover",
    props: {
      title: "Card title",
      className: "mw-card--state-hover",
      children: "Hover state uses the darker border from the live Figma sync.",
    },
  },
  {
    label: "Pressed",
    props: {
      title: "Card title",
      className: "mw-card--state-pressed",
      children: "Pressed state keeps the stronger border treatment.",
    },
  },
  {
    label: "Disabled",
    props: {
      title: "Card title",
      className: "mw-card--disabled",
      "aria-disabled": "true",
      children: "Disabled state mutes the surface and typography.",
    },
  },
  {
    label: "Focus",
    props: {
      title: "Card title",
      className: "mw-card--state-focus",
      tabIndex: 0,
      children: "Focus state previews the keyboard border color from Figma.",
    },
  },
]

const meta: Meta<typeof Card> = {
  title: "Card/Atom",
  component: Card,
  parameters: {
    ...storybookLayout.centered,
    ...storybookA11yPolicy.smoke,
  },
  tags: ["autodocs"],
}

export default meta
type Story = StoryObj<typeof Card>

export const Default: Story = {
  args: {
    title: "Card title",
    children: "This is the card body. Use it to display any content.",
  },
}

export const BodyOnly: Story = {
  args: {
    children: "A card without a title keeps the same 24px outer padding from Figma.",
  },
}

export const RichContent: Story = {
  render: () => (
    <Card title="Richer content">
      <p style={{ margin: 0 }}>Cards accept any React content as children.</p>
      <p style={{ margin: "8px 0 0" }}>Use them to group related information.</p>
    </Card>
  ),
}

export const StateMatrix: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      <div
        style={{ display: "grid", gap: 16, gridTemplateColumns: "repeat(2, minmax(320px, 1fr))" }}
      >
        {cardStatePreviews.map((preview) => (
          <div key={preview.label} style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <span style={{ fontSize: 12, color: "#666666" }}>{preview.label}</span>
            <Card {...preview.props} />
          </div>
        ))}
      </div>

      <MarwesProvider theme={{ mode: ThemeMode.dark }}>
        <div
          style={{
            display: "grid",
            gap: 16,
            gridTemplateColumns: "repeat(2, minmax(320px, 1fr))",
            padding: 24,
            background: "#2e2e2e",
            borderRadius: 12,
          }}
        >
          {cardStatePreviews.map((preview) => (
            <div
              key={`dark-${preview.label}`}
              style={{ display: "flex", flexDirection: "column", gap: 8 }}
            >
              <span style={{ fontSize: 12, color: "#d4d4d4" }}>{preview.label}</span>
              <Card {...preview.props} />
            </div>
          ))}
        </div>
      </MarwesProvider>
    </div>
  ),
}
