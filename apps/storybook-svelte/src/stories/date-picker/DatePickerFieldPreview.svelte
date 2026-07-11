<script lang="ts">
  import { DatePickerField } from "@marwes-ui/svelte"
  import type { DatePickerDay, DatePickerDevice } from "@marwes-ui/core"

  interface Props {
    label?: string
    helperText?: string
    error?: string
    device?: DatePickerDevice
  }

  let {
    label = "Trip start date",
    helperText = "Pick the day you'd like the booking to begin.",
    error,
    device,
  }: Props = $props()

  function day(dayLabel: string, opts: Partial<DatePickerDay> = {}): DatePickerDay {
    return { label: dayLabel, ...opts }
  }

  const weekdayLabels = ["S", "M", "T", "W", "T", "F", "S"]

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
    [
      day("16"),
      day("17"),
      day("18"),
      day("19"),
      day("20", { isToday: true }),
      day("21"),
      day("22"),
    ],
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
</script>

<div style="width: 360px;">
  <DatePickerField
    {label}
    {helperText}
    {error}
    datePicker={{
      device,
      monthLabel: "March 2026",
      weekdayLabels,
      weeks: marchWeeks,
    }}
  />
</div>
