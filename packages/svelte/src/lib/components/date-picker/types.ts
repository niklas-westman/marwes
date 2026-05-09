import type { DatePickerDay, DatePickerOptions } from "@marwes-ui/core"

export interface DatePickerProps extends DatePickerOptions {
  weeks?: DatePickerDay[][]
  weekdayLabels?: string[]
  onpreviousyear?: () => void
  onpreviousmonth?: () => void
  onnextmonth?: () => void
  onnextyear?: () => void
  ondayselect?: (day: DatePickerDay) => void
  oncancel?: () => void
  onapply?: () => void
  class?: string
}
