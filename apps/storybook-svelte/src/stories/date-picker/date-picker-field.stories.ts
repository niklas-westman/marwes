import { storybookA11yPolicy, storybookLayout } from "@marwes-ui/core"
import type { Meta, StoryObj } from "@storybook/svelte"
import DatePickerFieldPreview from "./DatePickerFieldPreview.svelte"

const meta = {
  title: "DatePicker/Molecule/DatePickerField",
  component: DatePickerFieldPreview,
  parameters: {
    ...storybookLayout.padded,
    ...storybookA11yPolicy.smoke,
  },
  tags: ["autodocs"],
  argTypes: {
    device: { control: "select", options: [undefined, "desktop", "mobile"] },
  },
} satisfies Meta<typeof DatePickerFieldPreview>

export default meta
type Story = StoryObj<typeof meta>

export const Basic: Story = {
  args: {
    label: "Trip start date",
    helperText: "Pick the day you'd like the booking to begin.",
  },
}

export const WithoutHelperText: Story = {
  args: {
    label: "Trip start date",
  },
}

export const Invalid: Story = {
  args: {
    label: "Trip start date",
    error: "Pick a date before continuing.",
  },
}

export const Mobile: Story = {
  args: {
    label: "Trip start date",
    helperText: "Pick the day you'd like the booking to begin.",
    device: "mobile",
  },
}
