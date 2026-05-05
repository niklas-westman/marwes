import { storybookDatePickerArgTypes, storybookLayout } from "@marwes-ui/core"
import { DatePicker, type DatePickerProps } from "@marwes-ui/vue"
import type { Meta, StoryObj } from "@storybook/vue3-vite"

const meta = {
  title: "DatePicker/Atom",
  component: DatePicker as unknown as object,
  parameters: storybookLayout.padded,
  tags: ["autodocs"],
  argTypes: storybookDatePickerArgTypes,
  args: {
    device: "desktop",
    monthLabel: "March 2026",
  },
} satisfies Meta<DatePickerProps>

export default meta
type Story = StoryObj<DatePickerProps>

export const Default: Story = {}

export const Mobile: Story = {
  args: {
    device: "mobile",
  },
}

export const CustomLabels: Story = {
  args: {
    monthLabel: "June 2026",
    previousYearLabel: "Go to previous year",
    previousMonthLabel: "Go to previous month",
    nextMonthLabel: "Go to next month",
    nextYearLabel: "Go to next year",
    cancelLabel: "Today",
    applyLabel: "Done",
  },
}
