# @marwes-ui/vue

## 1.11.0

### Minor Changes

- [#76](https://github.com/niklas-westman/marwes/pull/76) [`e98450b`](https://github.com/niklas-westman/marwes/commit/e98450bc9a5ad1835a7c29e49b67ce0fc255477b) Thanks [@niklas-westman](https://github.com/niklas-westman)! - Add the public `resolveButtonIcons` helper and share purpose-icon resolution
  across React, Vue and Svelte.

  Align purpose Button icon defaults with the pinned Figma design: trailing Check
  for Confirm/Success and X for Destructive; leading CheckCircle, Edit, Upload,
  Download, Search and Refresh for the corresponding wrappers. Explicit caller icons replace
  canonical defaults without injecting an extra icon. Loading continues to replace
  icons with the spinner.

  Calibrate Check, CheckCircle, Edit and Search glyph geometry to the independently
  exported Figma outlines while retaining configurable stroked SVG rendering.

  Match Classic Spinner geometry to its canonical Figma master: a full viewport
  ring and the exported rounded lower-right indicator outline.

  Render RefreshCw from the exact canonical Figma outline at resolved stroke width
  2; retain configurable stroked geometry for every other requested width.

  Share the existing Icon color selection between stroked and canonical filled
  geometries so primary, secondary, muted and inherited colors remain consistent.

### Patch Changes

- [#76](https://github.com/niklas-westman/marwes/pull/76) [`e98450b`](https://github.com/niklas-westman/marwes/commit/e98450bc9a5ad1835a7c29e49b67ce0fc255477b) Thanks [@niklas-westman](https://github.com/niklas-westman)! - Align default border and disabled action paints with the captured Figma palette.
  Correct small destructive-button spacing and icon size, Checkbox fractional
  strokes and dark indeterminate fills, and Dialog description/divider opacity,
  header spacing and close-control geometry. Use the low-contrast dark Radio
  border and medium-contrast disabled Radio border roles.

  Round Secondary Button intrinsic widths to Figma's whole-pixel surface bounds
  in supporting browsers, with ordinary intrinsic sizing as the fallback.

  Match dark Secondary Button default text and outline to Figma's light neutral
  paint, and use geometric text rendering for Text Button glyph alignment.

  Align standard small and large Button geometry with the pinned Figma selections
  (32px and 48px heights), preserving the distinct 36px destructive small style.

  Match Primary, Success, Destructive and Neutral state overlays without dimming
  labels, preserve independent disabled paint alpha, and align error icon/label
  roles. Keep loading buttons semantically disabled while retaining their loading
  design. Use the captured Success action surface in both modes and the captured
  Destructive surface in dark mode; status colors remain separate. Align outlined
  loading spinner paints and compact navigation-link geometry with Figma.

  Map the Neutral visual role and Cancel, Copy, Filter, Sort, Close and Refresh
  purposes to Figma Ghost. Align default purpose icons with their catalog
  selections and retain purpose markers across React, Vue and Svelte so styles
  apply consistently. These runtime changes require fresh final parity evidence;
  they do not promote staged Figma references.

  Correct the shared disabled-text role to Figma black/white at 30% alpha while
  preserving the separate subtle-gray role. This shared token update requires fresh
  validation of other families that consume disabled text.

  Use the pinned 60% black/white secondary-text role for Link labels and retain the
  transparent Figma Pill element. This shared muted-text correction also invalidates
  older evidence for consuming families.

  Match Figma auto-width label boxes by removing trailing tracking from the text
  advance and rounding up to whole pixels in supporting Chromium versions. Keep
  labels left aligned within those boxes. Match the separate IconButton md size
  collection at 32px and its 15% contrast outline, without changing ordinary Button
  md geometry or any public size names.

  Use the owner-approved standard keyboard-focus geometry across Button variants,
  purpose wrappers and IconButton: a 2px ring with a 4px clear gap. Correct the
  shared dark focus-ring token to the pinned Semantic `focus/ring` alias (#ABABFD).
  Increased-contrast focus remains a separate design policy.

  Preserve the Figma `fi` ligature in Button labels with nonzero tracking by
  explicitly enabling `liga` on the Button root. Caller font-feature overrides
  continue to inherit into labels. This corrects Confirm/Success shaping without
  replacing accessible HTML text or changing visual thresholds.

  Paint the standard focus ring using its source-derived rounded border geometry,
  with a native system-color focus outline in forced-colors mode. Preserve real
  keyboard focus and caller font-feature overrides.

- Updated dependencies [[`e98450b`](https://github.com/niklas-westman/marwes/commit/e98450bc9a5ad1835a7c29e49b67ce0fc255477b), [`e98450b`](https://github.com/niklas-westman/marwes/commit/e98450bc9a5ad1835a7c29e49b67ce0fc255477b)]:
  - @marwes-ui/core@1.11.0
  - @marwes-ui/presets@1.11.0

## 1.10.1

### Patch Changes

- [#66](https://github.com/niklas-westman/marwes/pull/66) [`13573f5`](https://github.com/niklas-westman/marwes/commit/13573f560d0256ed66b10119ff042a891c8764d5) Thanks [@niklas-westman](https://github.com/niklas-westman)! - Expose error invalid states on SegmentedControlField, PaginationField and DatePickerField across adapters. Keep Svelte AccordionField descriptions consistent with their ARIA references, and translate InputOtp maxlength to React's maxLength attribute. Give DatePicker weekday columns stable keys when abbreviations repeat. Add shared field update/hydration contracts and public-component hydration smoke coverage; this does not declare official SSR support.

- [#66](https://github.com/niklas-westman/marwes/pull/66) [`13573f5`](https://github.com/niklas-westman/marwes/commit/13573f560d0256ed66b10119ff042a891c8764d5) Thanks [@niklas-westman](https://github.com/niklas-westman)! - Render Vue DialogModal Teleport children correctly and clear Svelte toast dismissal timers on unmount. Add hydrated lifecycle contracts for modal variants, tooltip, toast and presentation overlays, plus Node evidence for initially-open modal behavior.

- [#66](https://github.com/niklas-westman/marwes/pull/66) [`13573f5`](https://github.com/niklas-westman/marwes/commit/13573f560d0256ed66b10119ff042a891c8764d5) Thanks [@niklas-westman](https://github.com/niklas-westman)! - Include initial normalized RichText content in server HTML across adapters while preserving editor cursor behavior, and forward Vue RichTextField's nested editor value callback. Add update/hydration state contracts for OTP, RichText, CheckboxGroup and DatePicker and uncontrolled defaults for existing controls.

- [#66](https://github.com/niklas-westman/marwes/pull/66) [`13573f5`](https://github.com/niklas-westman/marwes/commit/13573f560d0256ed66b10119ff042a891c8764d5) Thanks [@niklas-westman](https://github.com/niklas-westman)! - Preserve browser layout synchronization while avoiding React server layout-effect warnings. Add Node-only component smoke tests and hydrated rerender/element retention verification across adapters. This adds evidence, not an official SSR support promise.

- [#66](https://github.com/niklas-westman/marwes/pull/66) [`13573f5`](https://github.com/niklas-westman/marwes/commit/13573f560d0256ed66b10119ff042a891c8764d5) Thanks [@niklas-westman](https://github.com/niklas-westman)! - Preserve RichText edits across React 19 rerenders and avoid duplicate unchanged blur callbacks in all adapters. Build core declarations with TypeScript to keep packed SSR consumer builds within memory limits.

- Updated dependencies [[`13573f5`](https://github.com/niklas-westman/marwes/commit/13573f560d0256ed66b10119ff042a891c8764d5), [`13573f5`](https://github.com/niklas-westman/marwes/commit/13573f560d0256ed66b10119ff042a891c8764d5), [`13573f5`](https://github.com/niklas-westman/marwes/commit/13573f560d0256ed66b10119ff042a891c8764d5), [`13573f5`](https://github.com/niklas-westman/marwes/commit/13573f560d0256ed66b10119ff042a891c8764d5), [`13573f5`](https://github.com/niklas-westman/marwes/commit/13573f560d0256ed66b10119ff042a891c8764d5)]:
  - @marwes-ui/core@1.10.1
  - @marwes-ui/presets@1.10.1

## 1.10.0

### Minor Changes

- [#64](https://github.com/niklas-westman/marwes/pull/64) [`73b7b97`](https://github.com/niklas-westman/marwes/commit/73b7b974c8951f2562ad94ebff2e1587f8cf0762) Thanks [@niklas-westman](https://github.com/niklas-westman)! - Add the `fullWidth` option to `Button` and every button component. When true the button fills the width of its container instead of hugging its content, and renders the class `mw-btn--full-width` and `data-full-width="true"`. Without the option nothing changes.

### Patch Changes

- Updated dependencies [[`73b7b97`](https://github.com/niklas-westman/marwes/commit/73b7b974c8951f2562ad94ebff2e1587f8cf0762)]:
  - @marwes-ui/core@1.10.0
  - @marwes-ui/presets@1.10.0

## 1.9.0

### Minor Changes

- [#62](https://github.com/niklas-westman/marwes/pull/62) [`f46a7cf`](https://github.com/niklas-westman/marwes/commit/f46a7cf1a959a81ff49cbb4f933913033e23f020) Thanks [@niklas-westman](https://github.com/niklas-westman)! - Add the `ui.radiusButton` theme option. It sets the corner radius of buttons in px and falls back to `ui.radius`, so an application can have pill-shaped buttons (for example `radiusButton: 90`) while inputs and other components keep `ui.radius`. The resolved value is emitted as `--mw-ui-radius-button` and exposed as `mwThemeVars.ui.radiusButton`; the firstEdition button stylesheet uses it with `--mw-ui-radius` as fallback. Without the option, rendering is unchanged.

### Patch Changes

- Updated dependencies [[`f46a7cf`](https://github.com/niklas-westman/marwes/commit/f46a7cf1a959a81ff49cbb4f933913033e23f020)]:
  - @marwes-ui/core@1.9.0
  - @marwes-ui/presets@1.9.0

## 1.8.0

### Minor Changes

- [#59](https://github.com/niklas-westman/marwes/pull/59) [`7aba648`](https://github.com/niklas-westman/marwes/commit/7aba648dc08c1950330629b455eb3c1f9b76c6b5) Thanks [@niklas-westman](https://github.com/niklas-westman)! - Add the `Stack` layout family: `Stack` and `StackItem` in React, Vue and Svelte. `Stack` is a flex container with `direction` (`row` | `column`), `gap` / `rowGap` / `columnGap`, `padding` / `paddingX` / `paddingY` / per-side padding, `alignItems` (`start` | `center` | `end`; cross-axis stretch is declared as child `fill`), `justifyContent`, `wrap` and `as`. `StackItem` is a declared child with `horizontalSizing` / `verticalSizing` (`fix` | `hug` | `fill`). Gap and padding accept only `Spacings` tokens and resolve to `var(--mw-spacing-<token>)`; values outside the allowed sets throw a `TypeError`. Every resolved value is emitted as a `data-*` attribute so layout can be verified against design auto layout. The firstEdition preset gains `stack.css`. No existing component changes.

### Patch Changes

- Updated dependencies [[`7aba648`](https://github.com/niklas-westman/marwes/commit/7aba648dc08c1950330629b455eb3c1f9b76c6b5)]:
  - @marwes-ui/core@1.8.0
  - @marwes-ui/presets@1.8.0

## 1.7.1

### Patch Changes

- [#57](https://github.com/niklas-westman/marwes/pull/57) [`89b5389`](https://github.com/niklas-westman/marwes/commit/89b5389a7f18b2daf53921daa86529d338486eaf) Thanks [@niklas-westman](https://github.com/niklas-westman)! - `SwitchField` now sets `aria-invalid="true"` on the switch while an error is shown, so assistive technology announces the invalid state the same way it does for `Checkbox` and `Slider`. Previously the error text was only linked through `aria-describedby`. `Switch` accepts a new optional `invalid` option for the same purpose.

- Updated dependencies [[`89b5389`](https://github.com/niklas-westman/marwes/commit/89b5389a7f18b2daf53921daa86529d338486eaf)]:
  - @marwes-ui/core@1.7.1
  - @marwes-ui/presets@1.7.1

## 1.7.0

### Minor Changes

- [#55](https://github.com/niklas-westman/marwes/pull/55) [`24218f3`](https://github.com/niklas-westman/marwes/commit/24218f31a0b0065fa3a6bcc43347d54fcc4552ae) Thanks [@niklas-westman](https://github.com/niklas-westman)! - Vue: generate component ids with `useId()` so server-rendered markup hydrates without id mismatches, and keep the server-rendered selection of `Select` through hydration. The Vue peer dependency minimum is now 3.5 (was 3.4). Adds shared update and hydration contracts for Input, Select and TabGroup across React, Vue and Svelte.

### Patch Changes

- [#55](https://github.com/niklas-westman/marwes/pull/55) [`24218f3`](https://github.com/niklas-westman/marwes/commit/24218f31a0b0065fa3a6bcc43347d54fcc4552ae) Thanks [@niklas-westman](https://github.com/niklas-westman)! - Vue: change callbacks passed as props (`onValueChange`, `onChange`, `onCheckedChange`, `onOpenChange`) on Input, Textarea, Select, InputOtp, RichText, Slider, Radio, RadioGroupField, Checkbox, Switch and TooltipGroup now run once per change instead of twice (four times for RadioGroupField).

- Updated dependencies [[`24218f3`](https://github.com/niklas-westman/marwes/commit/24218f31a0b0065fa3a6bcc43347d54fcc4552ae), [`24218f3`](https://github.com/niklas-westman/marwes/commit/24218f31a0b0065fa3a6bcc43347d54fcc4552ae)]:
  - @marwes-ui/core@1.7.0
  - @marwes-ui/presets@1.7.0

## 1.6.1

### Patch Changes

- [#53](https://github.com/niklas-westman/marwes/pull/53) [`fdf87a5`](https://github.com/niklas-westman/marwes/commit/fdf87a5f227c5b513c39b65b37d2968710d21efc) Thanks [@niklas-westman](https://github.com/niklas-westman)! - Vue `MarwesProvider` now re-reads the stored theme preference when `storageKey` changes after mount, matching the React and Svelte providers. Adds a shared provider behavior contract that all three adapters run.

- Updated dependencies [[`fdf87a5`](https://github.com/niklas-westman/marwes/commit/fdf87a5f227c5b513c39b65b37d2968710d21efc)]:
  - @marwes-ui/core@1.6.1
  - @marwes-ui/presets@1.6.1

## 1.6.0

### Minor Changes

- [#50](https://github.com/niklas-westman/marwes/pull/50) [`1940d60`](https://github.com/niklas-westman/marwes/commit/1940d60225522c2ab1ab77b392d533a84b42d183) Thanks [@niklas-westman](https://github.com/niklas-westman)! - Make React, Vue and Svelte render the same DOM for the same options by moving more decisions into core and enforcing them with shared contract tests.

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

- [#50](https://github.com/niklas-westman/marwes/pull/50) [`1940d60`](https://github.com/niklas-westman/marwes/commit/1940d60225522c2ab1ab77b392d533a84b42d183) Thanks [@niklas-westman](https://github.com/niklas-westman)! - Support native `type="submit"` and `type="reset"` on Button and visual button wrappers. Buttons still default to `type="button"`; existing submit/reset actions retain precedence. Clarify form behavior in Storybook and forward `ariaLabelledBy` through Vue button wrappers.

### Patch Changes

- [#50](https://github.com/niklas-westman/marwes/pull/50) [`1940d60`](https://github.com/niklas-westman/marwes/commit/1940d60225522c2ab1ab77b392d533a84b42d183) Thanks [@niklas-westman](https://github.com/niklas-westman)! - Use the accessible warning border token for warning badges in light and dark themes, matching the Figma border color while preserving theme customization.

- Updated dependencies [[`1940d60`](https://github.com/niklas-westman/marwes/commit/1940d60225522c2ab1ab77b392d533a84b42d183), [`1940d60`](https://github.com/niklas-westman/marwes/commit/1940d60225522c2ab1ab77b392d533a84b42d183), [`1940d60`](https://github.com/niklas-westman/marwes/commit/1940d60225522c2ab1ab77b392d533a84b42d183)]:
  - @marwes-ui/core@1.6.0
  - @marwes-ui/presets@1.6.0

## 1.5.1

### Patch Changes

- [#48](https://github.com/niklas-westman/marwes/pull/48) [`d46cf44`](https://github.com/niklas-westman/marwes/commit/d46cf445819c13def85c504c055dcf1d30a30e5c) Thanks [@niklas-westman](https://github.com/niklas-westman)! - Refresh development dependency security: require devalue 5.9.3 for Svelte tooling and patch braces to reject excessive pattern nesting in release tooling. Published component APIs are unchanged by this dependency maintenance.

- [#48](https://github.com/niklas-westman/marwes/pull/48) [`d46cf44`](https://github.com/niklas-westman/marwes/commit/d46cf445819c13def85c504c055dcf1d30a30e5c) Thanks [@niklas-westman](https://github.com/niklas-westman)! - Support native `type="submit"` and `type="reset"` on Button and visual button wrappers. Buttons still default to `type="button"`; existing submit/reset actions retain precedence. Clarify form behavior in Storybook and forward `ariaLabelledBy` through Vue button wrappers.

- [#48](https://github.com/niklas-westman/marwes/pull/48) [`d46cf44`](https://github.com/niklas-westman/marwes/commit/d46cf445819c13def85c504c055dcf1d30a30e5c) Thanks [@niklas-westman](https://github.com/niklas-westman)! - Use the accessible warning border token for warning badges in light and dark themes, matching the Figma border color while preserving theme customization.

- Updated dependencies [[`d46cf44`](https://github.com/niklas-westman/marwes/commit/d46cf445819c13def85c504c055dcf1d30a30e5c), [`d46cf44`](https://github.com/niklas-westman/marwes/commit/d46cf445819c13def85c504c055dcf1d30a30e5c), [`d46cf44`](https://github.com/niklas-westman/marwes/commit/d46cf445819c13def85c504c055dcf1d30a30e5c)]:
  - @marwes-ui/core@1.5.1
  - @marwes-ui/presets@1.5.1

## 1.5.0

### Minor Changes

- [#44](https://github.com/niklas-westman/marwes/pull/44) [`6dbb453`](https://github.com/niklas-westman/marwes/commit/6dbb45356374cc50cb40204fd1dac5effc243b53) Thanks [@niklas-westman](https://github.com/niklas-westman)! - Improve `IconButton` accessible-name support through `label`, `ariaLabel`, or `ariaLabelledBy`, align external-label behavior across adapters, and document the boundary between CSS-variable theme helpers and resolved `useTheme()` values. Preserve optional naming props for backward compatibility, keep the runtime warning for unnamed icon-only buttons, and export an opt-in `AccessibleButtonName` helper for consumers that want a stricter naming contract.

### Patch Changes

- [#44](https://github.com/niklas-westman/marwes/pull/44) [`6dbb453`](https://github.com/niklas-westman/marwes/commit/6dbb45356374cc50cb40204fd1dac5effc243b53) Thanks [@niklas-westman](https://github.com/niklas-westman)! - Publish generated public component inventories, Field- and Purpose-first setup guidance, consistent package metadata, and framework-specific links to the canonical Marwes consumer documentation.

- [#44](https://github.com/niklas-westman/marwes/pull/44) [`6dbb453`](https://github.com/niklas-westman/marwes/commit/6dbb45356374cc50cb40204fd1dac5effc243b53) Thanks [@niklas-westman](https://github.com/niklas-westman)! - Restore density-aware spacing between AccordionField group labels and accordion items in React and Vue. Native fieldset legends do not receive the fieldset's grid gap; the shared preset now applies that spacing explicitly while preserving Svelte's existing grid-based label spacing.

- Updated dependencies [[`6dbb453`](https://github.com/niklas-westman/marwes/commit/6dbb45356374cc50cb40204fd1dac5effc243b53), [`6dbb453`](https://github.com/niklas-westman/marwes/commit/6dbb45356374cc50cb40204fd1dac5effc243b53), [`6dbb453`](https://github.com/niklas-westman/marwes/commit/6dbb45356374cc50cb40204fd1dac5effc243b53)]:
  - @marwes-ui/core@1.5.0
  - @marwes-ui/presets@1.5.0

## 1.4.1

### Patch Changes

- [#42](https://github.com/niklas-westman/marwes/pull/42) [`af9416c`](https://github.com/niklas-westman/marwes/commit/af9416cafa45a0e75d108bfd0f1bd849f6084b4c) Thanks [@niklas-westman](https://github.com/niklas-westman)! - Docs polish: root README now leads with the marwes.io hub link (matching every package README) and the Packages table lists all seven published packages — the previously missing `@marwes-ui/svelte`, `@marwes-ui/cli`, and `create-marwes` are now included with usage hints.

- Updated dependencies [[`af9416c`](https://github.com/niklas-westman/marwes/commit/af9416cafa45a0e75d108bfd0f1bd849f6084b4c)]:
  - @marwes-ui/core@1.4.1
  - @marwes-ui/presets@1.4.1

## 1.4.0

### Minor Changes

- [#39](https://github.com/niklas-westman/marwes/pull/39) [`965a3af`](https://github.com/niklas-westman/marwes/commit/965a3af4fd05bf5342a687c55d52188c7c22ae62) Thanks [@niklas-westman](https://github.com/niklas-westman)! - Add the next Marwes component family wave and finish release-blocking component polish.

  Adds `Banner`, `Breadcrumb`, `ContextMenu`, `Drawer`, `Pagination`, `ProgressBar`, `SegmentedControl`, and `Text` across the shared core recipes, firstEdition preset CSS, React, Vue, and Svelte packages.

  Each new family includes Storybook stories and `Introduction.mdx` documentation aligned with the existing component documentation pattern, plus registry artifacts, taxonomy/docs checks, and framework adapter coverage for a release-ready public package surface.

  Adds `IconButton`, the `danger` button variant, the `sp-12` spacing token, native select chevron parity, wrapper-adaptive field widths, TabGroup overflow containment, and DialogModal surface controls across React, Vue, Svelte, presets, Storybook documentation, and registry artifacts.

  Adds `label` as a consumer-friendly accessible-name alias for standalone controls that previously required `ariaLabel`, and cleans up Storybook consistency auditing so grouped React/Vue variant exports are compared against Svelte one-file component exports without false parity failures.

  Cleans up Svelte adapter diagnostics by removing stale state-capture warnings, preserving shared ARIA contracts with explicit Svelte annotations, and aligning purpose radio groups with controlled/uncontrolled behavior.

  Aligns Svelte package styling behavior with React and Vue by loading firstEdition CSS from the public package entry, preserving the CSS side effect in package metadata, and adding shared contract enrollment for the remaining cross-framework Svelte surfaces.

  Adds a cross-framework adapter architecture map and `pnpm check:adapter-architecture` guardrail so React, Vue, and Svelte package structure, Storybook introductions, root exports, shared contracts, and package CSS policy cannot drift silently.

- [#40](https://github.com/niklas-westman/marwes/pull/40) [`5bb997c`](https://github.com/niklas-westman/marwes/commit/5bb997cb03c037233afc3e42288f6ed037d1b1c5) Thanks [@niklas-westman](https://github.com/niklas-westman)! - Complete the `label` accessible-name alias rollout across standalone controls.

  `Radio` and `InputOtp` now accept `label` alongside `ariaLabel`, matching the pattern already used by `Checkbox`, `Switch`, `Slider`, `Input`, `Select`, `Textarea`, and `RichText`. `IconButton` prop types now surface `label` explicitly for IDE discoverability (the underlying `Button` recipe already resolved it). Consumers can now use `label="…"` uniformly across every standalone control; `ariaLabel` continues to work.

### Patch Changes

- Updated dependencies [[`965a3af`](https://github.com/niklas-westman/marwes/commit/965a3af4fd05bf5342a687c55d52188c7c22ae62), [`5bb997c`](https://github.com/niklas-westman/marwes/commit/5bb997cb03c037233afc3e42288f6ed037d1b1c5)]:
  - @marwes-ui/core@1.4.0
  - @marwes-ui/presets@1.4.0

## 1.3.0

### Minor Changes

- [#37](https://github.com/niklas-westman/marwes/pull/37) [`cc771ca`](https://github.com/niklas-westman/marwes/commit/cc771cac66b833a7b7e40f6402d406982119275d) Thanks [@niklas-westman](https://github.com/niklas-westman)! - Release 1.3.0 — Svelte adapter and cross-framework alignment.

  **@marwes-ui/svelte (new)**
  New public Svelte 5 adapter with 112 component exports across 24 component families.
  Full parity with React and Vue adapters. Ships MarwesProvider, useTheme, useThemeMode,
  useToast, and SSR helpers.

  **@marwes-ui/presets**

  - Badge: neutral label uses text/secondary (#595959), warning label uses direct Amber/700 (#B45309)
  - Tab: transparent background, text/primary label, opacity-based hover (5% text color)
  - Toast: subtle icon fallbacks (#595959 light / #A3A3A3 dark), warning text aligned with badge/stat-tile, dark mode intent colors show through in text/action
  - Toast/StatTile: small action and trend text now use readable status text tokens so Storybook a11y smoke passes color contrast in light and dark mode
  - Spinner: dots-round, dots-square, lines use per-segment opacity cycling (no SVG rotation)
  - Accordion/Toast: dark mode surface set to #0F0F0F

  **@marwes-ui/react / @marwes-ui/vue**

  - Storybook theme toggle synced with iframe background
  - All stories aligned across React, Svelte, and Vue
  - Added storybook alignment audit script

  **@marwes-ui/core**

  - EditButton, VerifyButton, RefreshButton default icons added to Svelte adapter

### Patch Changes

- Updated dependencies [[`cc771ca`](https://github.com/niklas-westman/marwes/commit/cc771cac66b833a7b7e40f6402d406982119275d)]:
  - @marwes-ui/core@1.3.0
  - @marwes-ui/presets@1.3.0

## 1.2.0

### Minor Changes

- [#35](https://github.com/niklas-westman/marwes/pull/35) [`a9e69b8`](https://github.com/niklas-westman/marwes/commit/a9e69b8040d97e2496eb0d718d6707dc86ceed3b) Thanks [@niklas-westman](https://github.com/niklas-westman)! - Add Date Picker component across core recipes, firstEdition preset CSS, React adapter, Vue adapter, tests, and Storybook coverage.

- [#35](https://github.com/niklas-westman/marwes/pull/35) [`a9e69b8`](https://github.com/niklas-westman/marwes/commit/a9e69b8040d97e2496eb0d718d6707dc86ceed3b) Thanks [@niklas-westman](https://github.com/niklas-westman)! - Add Skeleton atom across core recipes, firstEdition preset CSS, React adapter, Vue adapter, tests, and Storybook coverage.

- [#35](https://github.com/niklas-westman/marwes/pull/35) [`a9e69b8`](https://github.com/niklas-westman/marwes/commit/a9e69b8040d97e2496eb0d718d6707dc86ceed3b) Thanks [@niklas-westman](https://github.com/niklas-westman)! - Add StatTile across core recipes, firstEdition preset CSS, React adapter, Vue adapter, tests, and Storybook coverage.

### Patch Changes

- [#35](https://github.com/niklas-westman/marwes/pull/35) [`a9e69b8`](https://github.com/niklas-westman/marwes/commit/a9e69b8040d97e2496eb0d718d6707dc86ceed3b) Thanks [@niklas-westman](https://github.com/niklas-westman)! - Promote Storybook accessibility smoke coverage across React and Vue stories, and fix related contrast, labeling, date picker, select field, and dialog modal accessibility issues.

- Updated dependencies [[`a9e69b8`](https://github.com/niklas-westman/marwes/commit/a9e69b8040d97e2496eb0d718d6707dc86ceed3b), [`a9e69b8`](https://github.com/niklas-westman/marwes/commit/a9e69b8040d97e2496eb0d718d6707dc86ceed3b), [`a9e69b8`](https://github.com/niklas-westman/marwes/commit/a9e69b8040d97e2496eb0d718d6707dc86ceed3b), [`a9e69b8`](https://github.com/niklas-westman/marwes/commit/a9e69b8040d97e2496eb0d718d6707dc86ceed3b)]:
  - @marwes-ui/core@1.2.0
  - @marwes-ui/presets@1.2.0

## 1.1.0

### Minor Changes

- [#29](https://github.com/niklas-westman/marwes/pull/29) [`ac9f0c0`](https://github.com/niklas-westman/marwes/commit/ac9f0c0b3807169cd89d268d043895186438a591) Thanks [@niklas-westman](https://github.com/niklas-westman)! - Run package test scripts with `NODE_ENV=test` for stable local and changed-scope validation.

### Patch Changes

- Updated dependencies [[`ac9f0c0`](https://github.com/niklas-westman/marwes/commit/ac9f0c0b3807169cd89d268d043895186438a591)]:
  - @marwes-ui/core@1.1.0
  - @marwes-ui/presets@1.1.0

## 1.0.5

### Patch Changes

- [#27](https://github.com/niklas-westman/marwes/pull/27) [`a7798a1`](https://github.com/niklas-westman/marwes/commit/a7798a13f315275a6ef1de65caa0dfe148cd53fa) Thanks [@niklas-westman](https://github.com/niklas-westman)! - enabled the possibility of SSR

- Updated dependencies [[`a7798a1`](https://github.com/niklas-westman/marwes/commit/a7798a13f315275a6ef1de65caa0dfe148cd53fa)]:
  - @marwes-ui/core@1.0.5
  - @marwes-ui/presets@1.0.5

## 1.0.4

### Patch Changes

- [#25](https://github.com/niklas-westman/marwes/pull/25) [`e6eed2a`](https://github.com/niklas-westman/marwes/commit/e6eed2a392e33dd171d3b082df25d056564c00cf) Thanks [@niklas-westman](https://github.com/niklas-westman)! - updated tailwind docs support

- Updated dependencies [[`e6eed2a`](https://github.com/niklas-westman/marwes/commit/e6eed2a392e33dd171d3b082df25d056564c00cf)]:
  - @marwes-ui/presets@1.0.4
  - @marwes-ui/core@1.0.4

## 1.0.3

### Patch Changes

- [#23](https://github.com/niklas-westman/marwes/pull/23) [`6a76863`](https://github.com/niklas-westman/marwes/commit/6a7686369b018c8e8738581b29526d52210996cc) Thanks [@niklas-westman](https://github.com/niklas-westman)! - adds optional global theme-mode synchronization

- Updated dependencies [[`6a76863`](https://github.com/niklas-westman/marwes/commit/6a7686369b018c8e8738581b29526d52210996cc)]:
  - @marwes-ui/presets@1.0.3
  - @marwes-ui/core@1.0.3

## 1.0.2

### Patch Changes

- [#21](https://github.com/niklas-westman/marwes/pull/21) [`63b33bc`](https://github.com/niklas-westman/marwes/commit/63b33bc8ffd47854869153df46cab24334ff954f) Thanks [@niklas-westman](https://github.com/niklas-westman)! - adding system theme support

- Updated dependencies [[`63b33bc`](https://github.com/niklas-westman/marwes/commit/63b33bc8ffd47854869153df46cab24334ff954f)]:
  - @marwes-ui/presets@1.0.2
  - @marwes-ui/core@1.0.2

## 1.0.1

### Patch Changes

- [#19](https://github.com/niklas-westman/marwes/pull/19) [`0920746`](https://github.com/niklas-westman/marwes/commit/09207469a0502f72784cbde1c9e3cba9799fac95) Thanks [@niklas-westman](https://github.com/niklas-westman)! - clarify theme toggle and update readme

- Updated dependencies [[`0920746`](https://github.com/niklas-westman/marwes/commit/09207469a0502f72784cbde1c9e3cba9799fac95)]:
  - @marwes-ui/presets@1.0.1
  - @marwes-ui/core@1.0.1

## 1.0.0

### Major Changes

- [#14](https://github.com/niklas-westman/marwes/pull/14) [`4ddb109`](https://github.com/niklas-westman/marwes/commit/4ddb109745b9e062cddcf1f1d9c8b8c661608d56) Thanks [@niklas-westman](https://github.com/niklas-westman)! - Release Marwes 1.0.0 with the stabilized public package set, including the Marwes-first Select default, `sp-*` spacing tokens, vertical slider support, designer-feedback polish, and aligned React and Vue adapter contracts.

### Minor Changes

- [#14](https://github.com/niklas-westman/marwes/pull/14) [`4ddb109`](https://github.com/niklas-westman/marwes/commit/4ddb109745b9e062cddcf1f1d9c8b8c661608d56) Thanks [@niklas-westman](https://github.com/niklas-westman)! - Lock purpose buttons to their canonical semantics and visual treatments across React and Vue, rename `DangerButton` to `DestructiveButton`, remove `variant` from purpose-button controls and typed APIs, ignore forbidden overrides with development warnings, and update Storybook docs and tests to direct intentional exceptions through the base `Button` API.

- [#14](https://github.com/niklas-westman/marwes/pull/14) [`4ddb109`](https://github.com/niklas-westman/marwes/commit/4ddb109745b9e062cddcf1f1d9c8b8c661608d56) Thanks [@niklas-westman](https://github.com/niklas-westman)! - Remove the `BadgeVariant.brand` option from the badge API, preset styles, and Storybook examples across React and Vue.

### Patch Changes

- [#14](https://github.com/niklas-westman/marwes/pull/14) [`4ddb109`](https://github.com/niklas-westman/marwes/commit/4ddb109745b9e062cddcf1f1d9c8b8c661608d56) Thanks [@niklas-westman](https://github.com/niklas-westman)! - Add the first Avatar release with the base atom, `AvatarBadge`, `AvatarGroup`, and the semantic purpose wrappers `ProfileAvatar`, `PresenceAvatar`, and `TeamAvatarGroup`, including core contracts, firstEdition preset styling, React and Vue adapters, Storybook docs and stories, and cross-adapter contract coverage.

- [#14](https://github.com/niklas-westman/marwes/pull/14) [`4ddb109`](https://github.com/niklas-westman/marwes/commit/4ddb109745b9e062cddcf1f1d9c8b8c661608d56) Thanks [@niklas-westman](https://github.com/niklas-westman)! - Extend `Button` loading support with normalized object configuration, loading label replacement, non-blocking loading mode, custom spinner variants, and the `SpinnerVariants` runtime export alias.

- [#14](https://github.com/niklas-westman/marwes/pull/14) [`4ddb109`](https://github.com/niklas-westman/marwes/commit/4ddb109745b9e062cddcf1f1d9c8b8c661608d56) Thanks [@niklas-westman](https://github.com/niklas-westman)! - Align checkbox group field layout and option typography with the latest Figma checkbox group reference in React, Vue, and firstEdition presets.

- [#14](https://github.com/niklas-westman/marwes/pull/14) [`4ddb109`](https://github.com/niklas-westman/marwes/commit/4ddb109745b9e062cddcf1f1d9c8b8c661608d56) Thanks [@niklas-westman](https://github.com/niklas-westman)! - Clarify the Dialog accessibility contract by keeping the raw `Dialog` shell non-modal by default, moving modal semantics to `DialogModal`, adding shared React/Vue modal contract coverage, strengthening focus-fallback styling, and aligning Storybook docs and stories with the actual dialog layers.

- [#14](https://github.com/niklas-westman/marwes/pull/14) [`4ddb109`](https://github.com/niklas-westman/marwes/commit/4ddb109745b9e062cddcf1f1d9c8b8c661608d56) Thanks [@niklas-westman](https://github.com/niklas-westman)! - Add `RichText` and `RichTextField` to the input family, including core contracts, preset styling, React and Vue adapters, Storybook stories, and accessibility/test coverage.

- [#14](https://github.com/niklas-westman/marwes/pull/14) [`4ddb109`](https://github.com/niklas-westman/marwes/commit/4ddb109745b9e062cddcf1f1d9c8b8c661608d56) Thanks [@niklas-westman](https://github.com/niklas-westman)! - Add the first Slider release with core recipe and accessibility mapping, firstEdition preset styling, React and Vue adapters, `SliderField` molecule wrappers, Storybook docs and stories, and test coverage.

- [#14](https://github.com/niklas-westman/marwes/pull/14) [`4ddb109`](https://github.com/niklas-westman/marwes/commit/4ddb109745b9e062cddcf1f1d9c8b8c661608d56) Thanks [@niklas-westman](https://github.com/niklas-westman)! - Add the first Spinner release with the synced `classic`, `ring`, `dual`, `dots-round`, `dots-square`, `lines`, and `cross` styles, token and custom sizing, firstEdition preset animation, React and Vue adapters, Button loading integration, `ButtonSpinner` and `EmptyStateSpinner` purpose wrappers, Storybook docs and stories, and cross-adapter contract coverage.

- [#14](https://github.com/niklas-westman/marwes/pull/14) [`4ddb109`](https://github.com/niklas-westman/marwes/commit/4ddb109745b9e062cddcf1f1d9c8b8c661608d56) Thanks [@niklas-westman](https://github.com/niklas-westman)! - Add the first Tooltip family release with the standalone `Tooltip` atom and the Figma-aligned `TooltipGroup` molecule, including core contracts, firstEdition preset styling, React and Vue adapters, Storybook docs and stories, and adapter test coverage.

- Updated dependencies [[`4ddb109`](https://github.com/niklas-westman/marwes/commit/4ddb109745b9e062cddcf1f1d9c8b8c661608d56), [`4ddb109`](https://github.com/niklas-westman/marwes/commit/4ddb109745b9e062cddcf1f1d9c8b8c661608d56), [`4ddb109`](https://github.com/niklas-westman/marwes/commit/4ddb109745b9e062cddcf1f1d9c8b8c661608d56), [`4ddb109`](https://github.com/niklas-westman/marwes/commit/4ddb109745b9e062cddcf1f1d9c8b8c661608d56), [`4ddb109`](https://github.com/niklas-westman/marwes/commit/4ddb109745b9e062cddcf1f1d9c8b8c661608d56), [`4ddb109`](https://github.com/niklas-westman/marwes/commit/4ddb109745b9e062cddcf1f1d9c8b8c661608d56), [`4ddb109`](https://github.com/niklas-westman/marwes/commit/4ddb109745b9e062cddcf1f1d9c8b8c661608d56), [`4ddb109`](https://github.com/niklas-westman/marwes/commit/4ddb109745b9e062cddcf1f1d9c8b8c661608d56), [`4ddb109`](https://github.com/niklas-westman/marwes/commit/4ddb109745b9e062cddcf1f1d9c8b8c661608d56), [`4ddb109`](https://github.com/niklas-westman/marwes/commit/4ddb109745b9e062cddcf1f1d9c8b8c661608d56), [`4ddb109`](https://github.com/niklas-westman/marwes/commit/4ddb109745b9e062cddcf1f1d9c8b8c661608d56)]:
  - @marwes-ui/core@1.0.0
  - @marwes-ui/presets@1.0.0
