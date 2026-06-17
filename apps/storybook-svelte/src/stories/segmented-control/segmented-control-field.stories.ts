import { storybookA11yPolicy, storybookLayout } from "@marwes-ui/core"
import type { Meta, StoryObj } from "@storybook/svelte"
import SegmentedControlFieldPreview from "./SegmentedControlFieldPreview.svelte"

const meta = {
  title: "SegmentedControl/Molecule/SegmentedControlField",
  component: SegmentedControlFieldPreview,
  parameters: {
    ...storybookLayout.centered,
    ...storybookA11yPolicy.smoke,
  },
  tags: ["autodocs"],
  argTypes: {
    disabled: { control: "boolean" },
    fullWidth: { control: "boolean" },
  },
} satisfies Meta<typeof SegmentedControlFieldPreview>

export default meta
type Story = StoryObj<typeof meta>

export const Basic: Story = {
  args: {
    label: "Row density",
    description: "Choose how much vertical space each row takes.",
  },
}

export const WithoutDescription: Story = {
  args: {
    label: "Row density",
    description: undefined,
  },
}

export const Invalid: Story = {
  args: {
    label: "Row density",
    description: undefined,
    error: "Choose a density before saving.",
  },
}

export const Disabled: Story = {
  args: {
    label: "Row density",
    description: "Choose how much vertical space each row takes.",
    disabled: true,
  },
}

export const FullWidth: Story = {
  args: {
    label: "Row density",
    description: "Choose how much vertical space each row takes.",
    fullWidth: true,
  },
}
