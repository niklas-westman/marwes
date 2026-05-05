import { storybookDatePickerArgTypes, storybookLayout } from "@marwes-ui/core"
import { DatePicker, SelectField } from "@marwes-ui/react"
import type { Meta, StoryObj } from "@storybook/react-vite"
import type * as React from "react"

type DatePickerStoryProps = React.ComponentProps<typeof DatePicker>

const dateFieldOptions = [{ value: "", label: "DD / MM / YYYY" }]

function FigmaRangeReference(args: DatePickerStoryProps) {
  return (
    <div className="mw-date-picker-demo">
      <div className="mw-date-picker-demo__fields">
        <SelectField
          label="Start date"
          helperText="Hint text"
          variant="date"
          select={{
            placeholder: "DD / MM / YYYY",
            options: dateFieldOptions,
          }}
        />
        <SelectField
          label="End date"
          helperText="Hint text"
          variant="date"
          select={{
            placeholder: "DD / MM / YYYY",
            options: dateFieldOptions,
          }}
        />
      </div>
      <DatePicker {...args} />
    </div>
  )
}

const meta = {
  title: "DatePicker/Atom",
  component: DatePicker,
  parameters: storybookLayout.padded,
  tags: ["autodocs"],
  argTypes: storybookDatePickerArgTypes,
  args: {
    device: "desktop",
    monthLabel: "March 2026",
  },
} satisfies Meta<typeof DatePicker>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: (args) => <FigmaRangeReference {...args} />,
}

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
