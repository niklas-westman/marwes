import { storybookA11yPolicy, storybookDatePickerArgTypes, storybookLayout } from "@marwes-ui/core"
import type { Meta, StoryObj } from "@storybook/svelte"
import DatePickerDemo from "./DatePickerDemo.svelte"

const meta = {
  title: "DatePicker/Atom",
  component: DatePickerDemo,
  parameters: {
    ...storybookLayout.padded,
    ...storybookA11yPolicy.smoke,
  },
  tags: ["autodocs"],
  argTypes: storybookDatePickerArgTypes,
} satisfies Meta<typeof DatePickerDemo>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Mobile: Story = {
  args: { device: "mobile" },
}

export const CustomLabels: Story = {
  args: {
    monthLabelOverride: "June 2026",
    previousYearLabel: "Go to previous year",
    previousMonthLabel: "Go to previous month",
    nextMonthLabel: "Go to next month",
    nextYearLabel: "Go to next year",
    cancelLabel: "Today",
    applyLabel: "Done",
  },
}
