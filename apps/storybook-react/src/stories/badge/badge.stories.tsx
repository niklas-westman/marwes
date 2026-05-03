import { BadgeVariant, storybookLayout } from "@marwes-ui/core"
import { Badge, MarwesProvider } from "@marwes-ui/react"
import type { Meta, StoryObj } from "@storybook/react"
import * as React from "react"

const VARIANTS = Object.values(BadgeVariant)

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
  args: { children: "Neutral", variant: BadgeVariant.neutral },
}

export const AllVariants: Story = {
  args: { ariaLabel: "Badge example" },
  argTypes: {
    children: { control: false, table: { disable: true } },
    id: { control: false, table: { disable: true } },
    variant: { control: false, table: { disable: true } },
  },
  render: (args) => {
    const { children: _children, id: _id, variant: _variant, ...sharedBadgeProps } = args

    return (
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8, alignItems: "center" }}>
        {VARIANTS.map((variant) => (
          <Badge key={variant} {...sharedBadgeProps} variant={variant}>
            {variant.charAt(0).toUpperCase() + variant.slice(1)}
          </Badge>
        ))}
      </div>
    )
  },
}

export const DarkVariants: Story = {
  args: { ariaLabel: "Badge example" },
  argTypes: {
    children: { control: false, table: { disable: true } },
    id: { control: false, table: { disable: true } },
    variant: { control: false, table: { disable: true } },
  },
  render: (args) => {
    const { children: _children, id: _id, variant: _variant, ...sharedBadgeProps } = args

    return (
      <MarwesProvider theme={{ mode: "dark" }}>
        <div
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
          {VARIANTS.map((variant) => (
            <Badge key={variant} {...sharedBadgeProps} variant={variant}>
              {variant.charAt(0).toUpperCase() + variant.slice(1)}
            </Badge>
          ))}
        </div>
      </MarwesProvider>
    )
  },
}
