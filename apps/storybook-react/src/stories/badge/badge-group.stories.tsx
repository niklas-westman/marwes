import { storybookLayout } from "@marwes-ui/core"
import { Badge, BadgeGroup } from "@marwes-ui/react"
import type { Meta, StoryObj } from "@storybook/react"
import * as React from "react"

const VARIANTS = ["neutral", "brand", "info", "success", "warning", "error"] as const

const meta: Meta<typeof BadgeGroup> = {
  title: "Badge/Molecule",
  component: BadgeGroup,
  parameters: storybookLayout.centered,
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <div style={{ width: "66vw" }}>
        <Story />
      </div>
    ),
  ],
}

export default meta

type Story = StoryObj<typeof BadgeGroup>

export const Default: Story = {
  args: {
    label: "Tags",
    children: (
      <>
        <Badge variant="info">Frontend</Badge>
        <Badge variant="success">Approved</Badge>
        <Badge variant="warning">Review</Badge>
      </>
    ),
  },
}

export const AllVariants: Story = {
  render: () => (
    <BadgeGroup label="All Variants">
      {VARIANTS.map((v) => (
        <Badge key={v} variant={v}>
          {v.charAt(0).toUpperCase() + v.slice(1)}
        </Badge>
      ))}
    </BadgeGroup>
  ),
}

export const WithCustomClass: Story = {
  args: {
    label: "Custom Styled",
    className: "custom-badge-group",
    children: (
      <>
        <Badge variant="brand">Alpha</Badge>
        <Badge variant="brand">Beta</Badge>
      </>
    ),
  },
}
