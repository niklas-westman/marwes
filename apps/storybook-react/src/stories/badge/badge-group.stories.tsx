import { BadgeVariant, storybookLayout } from "@marwes-ui/core"
import { Badge, BadgeGroup } from "@marwes-ui/react"
import type { Meta, StoryObj } from "@storybook/react"
import * as React from "react"

const VARIANTS = Object.values(BadgeVariant)

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
        <Badge variant={BadgeVariant.info}>Frontend</Badge>
        <Badge variant={BadgeVariant.success}>Approved</Badge>
        <Badge variant={BadgeVariant.warning}>Review</Badge>
      </>
    ),
  },
}

export const AllVariants: Story = {
  args: {
    label: "All Variants",
  },
  argTypes: {
    children: { control: false, table: { disable: true } },
  },
  render: (args) => {
    const { children: _children, ...groupProps } = args

    return (
      <BadgeGroup {...groupProps}>
        {VARIANTS.map((variant) => (
          <Badge key={variant} variant={variant}>
            {variant.charAt(0).toUpperCase() + variant.slice(1)}
          </Badge>
        ))}
      </BadgeGroup>
    )
  },
}

export const WithCustomClass: Story = {
  args: {
    label: "Custom Styled",
    className: "custom-badge-group",
    children: (
      <>
        <Badge>Alpha</Badge>
        <Badge>Beta</Badge>
      </>
    ),
  },
}
