import type { DatePickerDay, DatePickerDevice } from "@marwes-ui/core"

export interface DatePickerProps {
  monthLabel?: string
  weekdayLabels?: string[]
  weeks?: DatePickerDay[][]
  device?: DatePickerDevice
  previousYearLabel?: string
  previousMonthLabel?: string
  nextMonthLabel?: string
  nextYearLabel?: string
  cancelLabel?: string
  applyLabel?: string
  calendarLabel?: string
  dataAttributes?: Record<string, string>
  onpreviousyear?: () => void
  onpreviousmonth?: () => void
  onnextmonth?: () => void
  onnextyear?: () => void
  ondayselect?: (day: DatePickerDay) => void
  oncancel?: () => void
  onapply?: () => void
  class?: string
}
