<script lang="ts">
 import { MarwesProvider } from "../../lib/index.js"
 import DatePicker from "../../lib/components/date-picker/DatePicker.svelte"
 let { monthLabel, selectedDate, onDaySelect, onNextMonth }: { monthLabel: string, selectedDate: string, onDaySelect?: (date: string) => void, onNextMonth?: () => void } = $props()
 const weeks = $derived([[{ label: "1", date: "2026-10-01", state: selectedDate === "2026-10-01" ? "selected" as const : "default" as const }, { label: "2", date: "2026-10-02", state: selectedDate === "2026-10-02" ? "selected" as const : "default" as const }, { label: "3", date: "2026-10-03", state: "disabled" as const }]])
</script>
<MarwesProvider><DatePicker {monthLabel} {weeks} ondayselect={(day) => onDaySelect?.(day.date ?? "")} onnextmonth={onNextMonth} /></MarwesProvider>
