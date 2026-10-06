---
"@marwes-ui/core": minor
"@marwes-ui/react": minor
"@marwes-ui/presets": minor
"@marwes-ui/vue": minor
"@marwes-ui/svelte": minor
---

Make React, Vue and Svelte render the same DOM for the same options by moving more decisions into core and enforcing them with shared contract tests.

**Core**
- Typed ARIA mapping: every family exports a `to<Family>HtmlAttributes` mapper built with `defineHtmlAttributeMapper`, so a new accessibility field cannot be silently skipped by an adapter. Parts that used to be hand-wired per adapter are now modeled in core: select combobox and options, date-picker cells, tab list and panel, tooltip group, field wrappers, accordion trigger and panel, banner dismiss, input-field actions and rich-text toolbar buttons.
- New recipes for avatar group, avatar badge and badge group; Button now resolves spinner inversion in its recipe.
- Provider option types are defined once in core and extended by each adapter.
- `IconOptions` accepts pixel `size` and numeric `strokeWidth`, `createIconRecipe` emits the preset size class (`mw-icon--sm`, `mw-icon--custom` for pixel sizes) and `resolveIconA11y` honours `ariaHidden`.

**Icon (all adapters)**
- Icon now renders through the core recipe. It gains the `mw-icon` base, size and colour classes, sets `--mw-icon-size` and `--mw-icon-stroke-width` inline, and adds `color` and `ariaHidden` props.
- Dialog and Drawer close buttons keep their previous icon size: the preset lets the icon shrink inside the button, as it did before icons carried the `mw-icon` class.
- Svelte `Icon` now throws for an unknown icon name, like React and Vue, instead of rendering nothing.

**Fixes**
- React: `AvatarBadge` now forwards `label`; `SegmentedControl` gains the `label` prop that core, Vue and Svelte already had.
- Svelte: `RadioGroupField` `disabled` now disables every child `Radio`; `TabGroup`, `SegmentedControl` and `Pagination` render their initial selection during server rendering instead of after hydration.
- Vue prop lists are compile-checked against the core option types, so a new core option can no longer be left out of a component.
- Dangling `aria-describedby` references, a disabled `Select` proxy bug and InputOtp falsy-value handling are fixed in all three adapters.

**Behavior changes to be aware of**
- Svelte tab lists without a label are named "Tabs", matching React and Vue.
- Empty date-picker cells are `aria-hidden`.
- Listbox and option elements in the select combobox use `tabindex="-1"`.
