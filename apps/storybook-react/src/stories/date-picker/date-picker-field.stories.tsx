import type { DatePickerDay } from "@marwes-ui/core"
import { storybookA11yPolicy, storybookLayout } from "@marwes-ui/core"
import { DatePickerField } from "@marwes-ui/react"
import type { Meta, StoryObj } from "@storybook/react"
import * as React from "react"

const weekdayLabels = ["S", "M", "T", "W", "T", "F", "S"] as const

function day(label: string, opts: Partial<DatePickerDay> = {}): DatePickerDay {
  return { label, ...opts }
}

const marchWeeks: DatePickerDay[][] = [
  [
    day("23", { state: "null" }),
    day("24", { state: "null" }),
    day("25", { state: "null" }),
    day("26", { state: "null" }),
    day("27", { state: "null" }),
    day("28", { state: "null" }),
    day("1"),
  ],
  [day("2"), day("3"), day("4"), day("5"), day("6"), day("7"), day("8")],
  [day("9"), day("10"), day("11"), day("12"), day("13"), day("14"), day("15")],
  [day("16"), day("17"), day("18"), day("19"), day("20", { isToday: true }), day("21"), day("22")],
  [day("23"), day("24"), day("25"), day("26"), day("27"), day("28"), day("29")],
  [
    day("30"),
    day("31"),
    day("1", { state: "null" }),
    day("2", { state: "null" }),
    day("3", { state: "null" }),
    day("4", { state: "null" }),
    day("5", { state: "null" }),
  ],
]

const meta: Meta<typeof DatePickerField> = {
  title: "DatePicker/Molecule/DatePickerField",
  component: DatePickerField,
  parameters: {
    ...storybookLayout.padded,
    ...storybookA11yPolicy.smoke,
  },
  tags: ["autodocs"],
  args: {
    label: "Trip start date",
    helperText: "Pick the day you'd like the booking to begin.",
    datePicker: {
      monthLabel: "March 2026",
      weekdayLabels,
      weeks: marchWeeks,
    },
  },
}

export default meta

type Story = StoryObj<typeof DatePickerField>

export const Basic: Story = {
  render: (args) => (
    <div style={{ width: "360px" }}>
      <DatePickerField {...args} />
    </div>
  ),
}

export const WithoutHelperText: Story = {
  args: {
    label: "Trip start date",
    datePicker: {
      monthLabel: "March 2026",
      weekdayLabels,
      weeks: marchWeeks,
    },
  },
  render: (args) => (
    <div style={{ width: "360px" }}>
      <DatePickerField {...args} />
    </div>
  ),
}

export const Invalid: Story = {
  args: {
    label: "Trip start date",
    error: "Pick a date before continuing.",
    datePicker: {
      monthLabel: "March 2026",
      weekdayLabels,
      weeks: marchWeeks,
    },
  },
  render: (args) => (
    <div style={{ width: "360px" }}>
      <DatePickerField {...args} />
    </div>
  ),
}

export const Mobile: Story = {
  args: {
    label: "Trip start date",
    helperText: "Pick the day you'd like the booking to begin.",
    datePicker: {
      device: "mobile",
      monthLabel: "March 2026",
      weekdayLabels,
      weeks: marchWeeks,
    },
  },
  render: (args) => (
    <div style={{ width: "360px" }}>
      <DatePickerField {...args} />
    </div>
  ),
}
