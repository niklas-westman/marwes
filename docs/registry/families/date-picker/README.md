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

## Field error and hydration contract

The field wrapper exposes `aria-invalid="true"` on its calendar region while an error
is present, and removes that state when the error is cleared. An explicitly
invalid nested control remains invalid after the field error is removed.
Core resolves the `invalid` option and each adapter applies the shared HTML mapping.
The visible label and description/error references are update- and hydration-tested
in React, Vue and Svelte. This coverage does not declare official SSR support.

React and Vue identify weekday header columns by position, matching Svelte. Weekday
abbreviations can repeat (`T` and `S` in English), so they cannot be used as unique
render keys. Regression tests cover repeated labels and localization updates.
