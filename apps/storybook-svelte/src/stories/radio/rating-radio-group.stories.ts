import { storybookA11yPolicy, storybookLayout } from "@marwes-ui/core"
import { RatingRadioGroup } from "@marwes-ui/svelte"
import type { Meta, StoryObj } from "@storybook/svelte"

const meta = {
  title: "Radio/Purpose/Rating",
  component: RatingRadioGroup,
  parameters: {
    ...storybookLayout.centered,
    ...storybookA11yPolicy.smoke,
  },
  tags: ["autodocs"],
} satisfies Meta<typeof RatingRadioGroup>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    name: "satisfaction",
    label: "How satisfied are you?",
    defaultValue: "3",
  },
}

export const CustomRange: Story = {
  args: {
    name: "priority",
    label: "Priority level",
    min: 1,
    max: 3,
    defaultValue: "2",
  },
}

export const Controlled: Story = {
  args: {
    name: "controlled-rating",
    label: "Rating",
    value: "4",
  },
}

export const CustomLabels: Story = {
  args: {
    name: "custom-labels",
    label: "Experience rating",
    lowLabel: "Poor",
    highLabel: "Excellent",
    defaultValue: "3",
  },
}
