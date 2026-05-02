import { storybookLayout } from "@marwes-ui/core"
import { RatingRadioGroup } from "@marwes-ui/react"
import type { Meta, StoryObj } from "@storybook/react"
import * as React from "react"

const meta: Meta<typeof RatingRadioGroup> = {
  title: "Radio/Purpose/Rating",
  component: RatingRadioGroup,
  parameters: storybookLayout.centered,
  tags: ["autodocs"],
}

export default meta

type Story = StoryObj<typeof RatingRadioGroup>

export const Default: Story = {
  args: {
    name: "satisfaction",
    label: "How satisfied are you?",
  },
}

export const CustomRange: Story = {
  args: {
    name: "priority",
    label: "Priority level",
    min: 1,
    max: 3,
  },
}

export const CustomLabels: Story = {
  args: {
    name: "priority",
    label: "Priority level",
    min: 1,
    max: 3,
    labelFn: (v: number) => ["Low", "Medium", "High"][v - 1],
  },
}

export const Controlled: Story = {
  render: () => {
    const [value, setValue] = React.useState("3")
    return (
      <div style={{ display: "grid", gap: 12 }}>
        <RatingRadioGroup
          name="satisfaction"
          label="Satisfaction"
          value={value}
          onChange={setValue}
        />
        <p style={{ fontSize: 14, color: "#6b7280" }}>Selected: {value}</p>
      </div>
    )
  },
}
