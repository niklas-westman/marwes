<script lang="ts">
  // Atom is no longer publicly exported; deep-import for story documentation.
  import DatePicker from "../../../../../packages/svelte/src/lib/components/date-picker/DatePicker.svelte"
  import type { DatePickerDay } from "@marwes-ui/core"

  const WEEKDAY_LABELS = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"]

  const MONTHS = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
  ]

  let year = $state(2026)
  let month = $state(2) // March (0-indexed)

  const monthLabel = $derived(`${MONTHS[month]} ${year}`)

  function getDaysInMonth(y: number, m: number): number {
    return new Date(y, m + 1, 0).getDate()
  }

  function getFirstDayOffset(y: number, m: number): number {
    const day = new Date(y, m, 1).getDay()
    return day === 0 ? 6 : day - 1 // Monday-based
  }

  const weeks = $derived.by((): DatePickerDay[][] => {
    const daysInMonth = getDaysInMonth(year, month)
    const offset = getFirstDayOffset(year, month)
    const result: DatePickerDay[][] = []
    let week: DatePickerDay[] = []

    for (let i = 0; i < offset; i++) {
      week.push({ label: "", state: "null" })
    }

    for (let d = 1; d <= daysInMonth; d++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`
      week.push({
        label: String(d),
        date: dateStr,
        state: "default",
        ariaLabel: `${MONTHS[month]} ${d}, ${year}`,
      })

      if (week.length === 7) {
        result.push(week)
        week = []
      }
    }

    if (week.length > 0) {
      while (week.length < 7) {
        week.push({ label: "", state: "null" })
      }
      result.push(week)
    }

    return result
  })

  function previousMonth(): void {
    if (month === 0) {
      month = 11
      year -= 1
    } else {
      month -= 1
    }
  }

  function nextMonth(): void {
    if (month === 11) {
      month = 0
      year += 1
    } else {
      month += 1
    }
  }

  function previousYear(): void {
    year -= 1
  }

  function nextYear(): void {
    year += 1
  }
</script>

<DatePicker
  {monthLabel}
  weekdayLabels={WEEKDAY_LABELS}
  {weeks}
  device="desktop"
  onpreviousyear={previousYear}
  onpreviousmonth={previousMonth}
  onnextmonth={nextMonth}
  onnextyear={nextYear}
/>
