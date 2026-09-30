import { DatePickerField } from "@marwes-ui/react"

import { ShowcaseCard, ShowcaseStack } from "./showcase-layout"

interface ShowcaseDay {
  label: string
  state?: "null"
  isToday?: boolean
}

const weekdayLabels = ["S", "M", "T", "W", "T", "F", "S"] as const

function day(label: string, opts: Partial<ShowcaseDay> = {}): ShowcaseDay {
  return { label, ...opts }
}

const marchWeeks: ShowcaseDay[][] = [
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

function DatePickerShowcase(): JSX.Element {
  return (
    <ShowcaseStack>
      <ShowcaseCard>
        <h3>Single date</h3>
        <p>A labeled calendar with connected helper text and today's date distinguished.</p>
        <DatePickerField
          label="Trip start date"
          helperText="Pick the day you'd like the booking to begin."
          datePicker={{
            monthLabel: "March 2026",
            weekdayLabels: [...weekdayLabels],
            weeks: marchWeeks,
          }}
        />
      </ShowcaseCard>
      <ShowcaseCard>
        <h3>Invalid</h3>
        <p>The calendar stays visible while a truthful error explains what is required.</p>
        <DatePickerField
          label="Trip start date"
          error="Pick a date before continuing."
          datePicker={{
            monthLabel: "March 2026",
            weekdayLabels: [...weekdayLabels],
            weeks: marchWeeks,
          }}
        />
      </ShowcaseCard>
      <ShowcaseCard>
        <h3>Compact device</h3>
        <p>A device-adapted layout keeps the same labeled field contract.</p>
        <DatePickerField
          label="Trip start date"
          helperText="Pick the day you'd like the booking to begin."
          datePicker={{
            device: "mobile",
            monthLabel: "March 2026",
            weekdayLabels: [...weekdayLabels],
            weeks: marchWeeks,
          }}
        />
      </ShowcaseCard>
    </ShowcaseStack>
  )
}

export default DatePickerShowcase
