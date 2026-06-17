import { storybookA11yPolicy, storybookLayout } from "@marwes-ui/core"
import { SegmentedControlField } from "@marwes-ui/react"
import type { SegmentedControlItem } from "@marwes-ui/react"
import type { Meta, StoryObj } from "@storybook/react"
import * as React from "react"

type Density = "compact" | "comfortable" | "spacious"

const meta: Meta<typeof SegmentedControlField> = {
  title: "SegmentedControl/Molecule/SegmentedControlField",
  component: SegmentedControlField,
  parameters: {
    ...storybookLayout.centered,
    ...storybookA11yPolicy.smoke,
  },
  tags: ["autodocs"],
}

export default meta

type Story = StoryObj<typeof SegmentedControlField>

const densityItems: SegmentedControlItem<Density>[] = [
  { value: "compact", label: "Compact" },
  { value: "comfortable", label: "Comfortable" },
  { value: "spacious", label: "Spacious" },
]

function ControlledExample(
  props: Partial<React.ComponentProps<typeof SegmentedControlField<Density>>>,
) {
  const [value, setValue] = React.useState<Density>("comfortable")
  return (
    <div style={{ width: "420px" }}>
      <SegmentedControlField<Density>
        label="Row density"
        description="Choose how much vertical space each row takes."
        {...props}
        segmentedControl={{
          items: densityItems,
          ...props.segmentedControl,
          value,
          onValueChange: setValue,
        }}
      />
    </div>
  )
}

export const Basic: Story = {
  render: () => <ControlledExample />,
}

export const WithoutDescription: Story = {
  render: () => <ControlledExample description={undefined} />,
}

export const Invalid: Story = {
  render: () => (
    <ControlledExample description={undefined} error="Choose a density before saving." />
  ),
}

export const Disabled: Story = {
  render: () => <ControlledExample segmentedControl={{ items: densityItems, disabled: true }} />,
}

export const FullWidth: Story = {
  render: () => <ControlledExample segmentedControl={{ items: densityItems, fullWidth: true }} />,
}
