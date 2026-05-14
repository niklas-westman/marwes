# DatePicker — Parity Findings

## Svelte vs React/Vue

### Aligned ✅
- `DatePicker` atom with `createDatePickerRecipe`
- Month grid with weekday headers and day buttons
- Navigation controls: previous/next month/year
- Footer with cancel/apply buttons
- Day states: default, hover, selected, range, range-hover, disabled, null
- `aria-label`, `aria-pressed` on selected days, `disabled` on empty/disabled days
- Device variants: desktop, mobile
- All label props for customization

### Notes
- Date parsing, formatting, popover state, and form orchestration are intentionally outside the component scope.
- The consumer provides `weeks`, `weekdayLabels`, and `monthLabel` data — the component is a pure rendering surface.
