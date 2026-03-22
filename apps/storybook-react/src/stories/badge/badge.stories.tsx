import { storybookLayout } from "@marwes-ui/core"
import { Badge } from "@marwes-ui/react"
import type { Meta, StoryObj } from "@storybook/react"
import * as React from "react"

const VARIANTS = ["neutral", "brand", "info", "success", "warning", "error"] as const

const meta: Meta<typeof Badge> = {
  title: "Badge/Atom",
  component: Badge,
  parameters: storybookLayout.centered,
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: VARIANTS,
    },
    ariaLabel: { control: "text" },
  },
}

export default meta

type Story = StoryObj<typeof Badge>

export const Default: Story = {
  args: { children: "Neutral", variant: "neutral" },
}

export const AllVariants: Story = {
  render: () => (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 8, alignItems: "center" }}>
      {VARIANTS.map((v) => (
        <Badge key={v} variant={v}>
          {v.charAt(0).toUpperCase() + v.slice(1)}
        </Badge>
      ))}
    </div>
  ),
}

export const DarkVariants: Story = {
  render: () => (
    <div
      className="mw-theme--dark"
      style={{
        display: "flex",
        flexWrap: "wrap",
        gap: 8,
        alignItems: "center",
        padding: 16,
        background: "#111827",
        borderRadius: 8,
      }}
    >
      {VARIANTS.map((v) => (
        <Badge key={v} variant={v}>
          {v.charAt(0).toUpperCase() + v.slice(1)}
        </Badge>
      ))}
    </div>
  ),
}
