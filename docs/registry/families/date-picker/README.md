# Date Picker Registry

> Family: `date-picker`
>
> Local design refs only — this page uses synced files under `.figma/` and makes no Figma API calls.

## Registry files

- [`registry.meta.json`](./registry.meta.json)
- [`registry.generated.json`](./registry.generated.json)
- [`../../../../artifacts/component-registry.json`](../../../../artifacts/component-registry.json)

## Summary

The Date Picker family is Marwes' base calendar selection surface. It ships the synced desktop/mobile shell, weekday grid, day-state styling, navigation controls, and action bar.

The base component does not own calendar math, parsing, popover state, or form-field orchestration. Those belong in product state or a future DatePickerField molecule.
