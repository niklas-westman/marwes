# Marwes library — consumer feedback from dashboard-teaser

This document is feedback from a real consumer (`apps/dashboard-teaser`) of `@marwes-ui/react`, aimed at the library team. It focuses on prop ergonomics, accessibility-prop wiring, and recurring workarounds the consumer has had to invent. Every finding cites a concrete file and line so it can be acted on or rebutted.

The dashboard-teaser imports roughly 30 distinct components from `@marwes-ui/react`. The issues below are not one-offs — most repeat across 3+ files.

---

## 1. Accessibility props

### 1.1 `aria-labelledby` casing is inconsistent across the library

Every component except `Switch` exposes the prop as **camelCase `ariaLabelledBy`** (capital B). `Switch` is the lone outlier with **lowercase `ariaLabelledby`**.

Library side ([packages/core/src/components/atoms/](../../packages/core/src/components/atoms/)):

| Component | Prop name |
|---|---|
| Drawer, Radio, SegmentedControl, ProgressBar, Checkbox, Slider, Dialog, RichText | `ariaLabelledBy` |
| **Switch** | `ariaLabelledby` |

Consumer side, both forms now appear in the same file:

- [PlaygroundControls.tsx:136](src/sections/PlaygroundControls.tsx#L136) — `<Switch ariaLabelledby={labelId} />`
- [PlaygroundControls.tsx:193](src/sections/PlaygroundControls.tsx#L193) — `<SegmentedControl ariaLabelledBy={styleLabelId} />`

This is a paper cut every time. Consumers can't muscle-memory the prop name — they have to look it up per component. TypeScript catches the typo, but the friction is real and AI-assisted edits frequently get it wrong.

**Recommended fix:** rename `Switch`'s prop to `ariaLabelledBy`. Mechanical change across `switch-types.ts`, `switch-a11y.ts`, `Switch.tsx`, and the Svelte/Vue adapters. Keep a deprecated `ariaLabelledby` alias for one release if backwards-compat matters.

### 1.2 Visible labels are not programmatically associated by default

Most form controls in the app sit *visually* near a label without any programmatic link. Examples:

- [InstallationPanel.tsx:160-180](src/sections/InstallationPanel.tsx#L160-L180) — framework selector has a visible label above the `SegmentedControl`; never wired.
- [RowAccordionInput.tsx:92-101](src/sections/rows/RowAccordionInput.tsx#L92-L101) — `Select` with a visible "Purpose" label, no `aria-labelledby`.
- [PlaygroundControls.tsx:197-218](src/sections/PlaygroundControls.tsx#L197-L218) — five additional `SectionLabel` + control pairings (Typography, Colours, Accessibility, Radius, Component props) all unwired. Only the Style pairing was retrofitted in the recent change.

The wiring that *does* exist is bespoke: see [ToggleControlRow](src/sections/PlaygroundControls.tsx#L118-L141), a consumer-invented wrapper that owns a `useId()`, renders a `<span id>`, and threads it into `Switch` via `ariaLabelledby`. This pattern is rebuilt every time a label needs to be tied to a control.

**Recommended fix:** ship a `LabeledControl` (or per-component `*Field` wrapper) that:
- Renders the visible label
- Generates an id via `useId()` internally
- Wires `aria-labelledby` to the slotted control automatically

The library already has `CheckboxField`, `SwitchField`, `RadioGroupField` — extend the pattern to the remaining controls (`SegmentedControlField`, `SelectField`, `InputField` exists but isn't always used). Or expose a generic `Field` primitive consumers can compose with anything.

### 1.3 `ariaLabel` is hidden inside `*Options` on some adapters

`Input` and `Textarea` accept `ariaLabel` only via their `InputOptions` / `TextareaOptions` base type — it doesn't appear in the adapter's own `Props` interface. Consumers can still pass it (see [InstallationPanel.tsx:185, 202](src/sections/InstallationPanel.tsx#L185)) because it's inherited, but TS autocomplete + docs don't surface it well.

**Recommended fix:** re-export key a11y props (`ariaLabel`, `ariaLabelledBy`, `ariaDescribedBy`) at the adapter level so they show up in IDE hover/autocomplete without needing to read the `Options` interface.

---

## 2. Layout / sizing props

### 2.1 No `fullWidth` (or equivalent) on `SegmentedControl`

`width: 100%` is patched in from the consumer in **six** places, in three different forms:

- Inline style: [PlaygroundControls.tsx:194](src/sections/PlaygroundControls.tsx#L194) — `style={{ width: "100%" }}`
- Styled wrapper: [RowSegmented.tsx:10-13](src/sections/rows/RowSegmented.tsx#L10-L13) — `FullWidthSegmentedControl = styled(SegmentedControl)\`width: 100%\``
- Styled wrapper: [InstallationPanel.tsx:52-54](src/sections/InstallationPanel.tsx#L52-L54) — `FrameworkSelector = styled(SegmentedControl)\`width: 100%\``

Three independent reinventions of the same workaround in one app is a strong signal.

**Recommended fix:** add a `fullWidth?: boolean` prop on `SegmentedControl`. Same case for any other control that consumers regularly want to stretch (Select, Pagination).

### 2.2 Consumers reach into internal CSS class names to tune layout

When a component doesn't expose the right prop, the dashboard reaches into its mangled CSS class names. Examples:

- [RowAccordionInput.tsx:28-43](src/sections/rows/RowAccordionInput.tsx#L28-L43) — targets `.mw-select__control` to constrain width
- [RowSwitchCard.tsx:65-74, 108-116](src/sections/rows/RowSwitchCard.tsx#L65-L74) — targets `.mw-checkbox-group-field__options`, `.mw-checkbox-group-field__option`, `.mw-input-otp`, `.mw-input-otp__cells`
- [RowToastMenuAvatar.tsx:31-46](src/sections/rows/RowToastMenuAvatar.tsx#L31-L46) — targets `.mw-segmented-control`, `.mw-toast`, `.mw-context-menu`

This is fragile — a future rename inside the library silently breaks consumer styling and these aren't caught by TypeScript. It also undermines any encapsulation guarantees the library otherwise provides.

**Recommended fix:** audit these overrides. Each one is either:
- A real layout prop the library should expose (`size`, `density`, `width`)
- A theme/token gap (the component should respect a token consumers can override)
- A bug in the default layout

Treat the dashboard-teaser as a beta-test for which knobs are missing.

---

## 3. Type-safe value callbacks

`onValueChange` callbacks across the library return raw `string`, forcing consumers to cast back to their own narrow union types every time. Real instances:

- [PlaygroundControls.tsx:186, 207, 294](src/sections/PlaygroundControls.tsx#L186) — `value as PlaygroundStyle`, `as PlaygroundFont`, `as Density`
- [InstallationPanel.tsx:163, 175](src/sections/InstallationPanel.tsx#L163) — `v as Framework`, `v as PackageManager`
- [RowAccordionInput.tsx:100](src/sections/rows/RowAccordionInput.tsx#L100) — `v as FieldType`
- [RowToastMenuAvatar.tsx:158](src/sections/rows/RowToastMenuAvatar.tsx#L158) — `v as ToastVariant`
- [RowSegmented.tsx:97-99](src/sections/rows/RowSegmented.tsx#L97-L99) — generic `set` helper that re-casts `string` → narrowed type

Every cast is a place where TypeScript stopped helping. None of these are real type-safety failures (the items array constrains the runtime values) — they're just an API choice that throws away the type information consumers already provided.

**Recommended fix:** make components like `SegmentedControl`, `Select`, etc. generic over their item value type, e.g.:

```ts
function SegmentedControl<T extends string = string>(
  props: SegmentedControlProps<T>,
): ReactElement
```

`items: Array<{ value: T; ... }>` and `onValueChange: (value: T) => void` then thread the literal union through automatically — `onValueChange` would deliver `Framework`, not `string`. Existing untyped call sites continue to work because `T` defaults to `string`.

---

## 4. Repeated wrapper patterns that signal missing primitives

| Pattern | Count | Files |
|---|---|---|
| Manual `useId()` + visible label + control wiring | 4+ | PlaygroundControls.tsx (ToggleControlRow x4 callers), RowSwitchCard.tsx (Radio at line 184) |
| Grid row: `<label>...<control />` | 6+ | PlaygroundControls.tsx FieldRow (lines 41-49, used 6×) |
| `styled(SegmentedControl)` for width | 2 components, 4+ call sites | RowSegmented.tsx, InstallationPanel.tsx |
| Class-selector spacing overrides | 4 files | RowAccordionInput, RowSwitchCard, RowToastMenuAvatar, PlaygroundControls |

Each of these would graduate into the library nicely.

---

## 5. Component-level quick notes

- **`Badge`** — no `className`/`style` forwarding visible in the adapter. Consumers haven't needed it yet but it's an asymmetry vs. siblings that *do* forward.
- **`Icon`** — accepts `aria-label` (lowercase, hyphenated) rather than the library-wide `ariaLabel` camelCase pattern. Worth a casing audit across all components.
- **`Drawer`** — exposes both `className` and `panelClassName`, which is good — but the naming convention (`panelClassName`) doesn't exist on `DialogModal`. Worth aligning slot-className naming across overlays.
- **`SegmentedControl`** — recent addition of `ariaLabelledBy` is good; consider the same for items (an item-level `ariaLabelledBy` would help icon-only items reference an external label).

---

## 6. App-level a11y gaps the library could help prevent

These are consumer-side misses in this app, but each is a place where the library could make the wrong thing harder to ship.

### 6.1 Icon-only buttons can lose their accessible name (High)

[RowSpinner.tsx:117-120](src/sections/rows/RowSpinner.tsx#L117-L120):

```tsx
<SpinnerItem key={key} type="button" onClick={() => setActiveVariant(key)}>
  <Spinner variant={key} />
  {options.showLabels && <SpinnerLabel>{label}</SpinnerLabel>}
</SpinnerItem>
```

`Spinner` defaults to `decorative={true}` (i.e. `aria-hidden="true"`) — verified at [packages/core/src/components/atoms/spinner/spinner-a11y.ts](../../packages/core/src/components/atoms/spinner/spinner-a11y.ts) — and when `options.showLabels` is `false`, the button has no other content. Result: a tab-focusable button with no accessible name. Screen readers announce "button" with nothing else.

**Why the library could help:** `<Button>` (and any interactive primitive) could either:
- Refuse to render with neither children nor `ariaLabel` (dev-only warning is enough), or
- Document this trap more prominently in the icon-only patterns.

The dashboard-teaser should fix its own usage either way (the Spinner picker should always render an `ariaLabel` per variant — "Select ring spinner", etc.).

### 6.2 The rendered React app has no heading hierarchy (Medium)

Every "heading" in the dashboard uses `<Text variant={TextVariant.display | overline}>` which renders as a `<span>` / `<div>` (verified — `grep '<h[1-6]'` over `apps/dashboard-teaser/src/` returns nothing). The static `<h1>` in [index.html:23](index.html#L23) is hidden by `.js #root > .seo-fallback { display: none }` once JS boots.

Net effect: screen reader users navigating by heading (`H` key in NVDA/JAWS, rotor in VoiceOver) get an empty document outline. The app is one large unstructured region.

**Why the library could help:** `Text` could accept a `headingLevel?: 1 | 2 | 3 | 4 | 5 | 6` prop that renders the appropriate `<hN>` element while keeping the visual variant. Alternatively, expose a sibling `Heading` component. The current `variant`-only API conflates *visual size* with *semantic level*, which is the root cause of this gap across consumers.

### 6.3 No skip-to-main-content link (Low)

Keyboard-only users have to tab through the header on every visit. Standard accessibility expectation for a multi-section page.

**Why the library could help:** ship a `SkipLink` primitive that's visually hidden until focused. ~30 lines of code; every consumer needs the same one.

### 6.4 Color-only meaning on `Badge` (Low — currently latent, not active)

[RowSwitchCard.tsx:232-236](src/sections/rows/RowSwitchCard.tsx#L232-L236) renders `Badge variant="warning"`, `variant="error"`, etc. — today *with text*, so each one is fine. But the API allows a no-text badge whose meaning is conveyed only by color. WCAG 1.4.1 fail waiting to happen.

**Why the library could help:** when a semantic `variant` is set, require either children text or an `ariaLabel` (dev-only warning). The pattern is easy to lock down.

### 6.5 What I checked and confirmed fine

So this doc doesn't read as "everything is broken":

- **Toast** auto-wires `role="status"` / `role="alert"` + `aria-live` from the variant ([toast-a11y.ts:6](../../packages/core/src/components/atoms/toast/toast-a11y.ts#L6)). Async announcements work.
- **`prefers-reduced-motion`** is handled well via `[data-dashboard-reduce-motion="true"]` in [global-style.ts:26-33](src/styles/global-style.ts#L26-L33), exposed to users via the playground toggle.
- **`<html lang="en">`** correctly set in [index.html:2](index.html#L2).
- **Landmarks** in [index.html](index.html) (`<main>`, `<section aria-labelledby>`, `<nav aria-label>`) are clean. The rendered React app inherits the `<main>` via PageLayout.
- **Native semantics**: no `role="button"` on `<div>` anywhere; all interactive elements use real `<button>` / `<input>` / library components.
- **Avatar `alt`** is set on `src` usages ([RowToastMenuAvatar.tsx:195](src/sections/rows/RowToastMenuAvatar.tsx#L195)).
- **Form fields** in [RowSwitchCard.tsx](src/sections/rows/RowSwitchCard.tsx) and [RowAccordionInput.tsx](src/sections/rows/RowAccordionInput.tsx) use the `*Field` family with proper `label` props.

---

## 7. Prioritized recommendations

In rough order of bang-per-buck:

1. **Fix Switch's `ariaLabelledby` casing** to match the rest of the library. ~10 minutes, removes a real paper cut.
2. **Add accessible names to `RowSpinner` picker buttons** in this app (consumer-side fix, ~5 min). Separately, consider a library-side dev warning for unnamed interactive elements.
3. **Make `SegmentedControl<T extends string>` (and similar) generic.** Kills 8+ `as` casts in this app alone with zero runtime impact.
4. **Add `fullWidth` to `SegmentedControl`.** Retires 6 width-100% workarounds.
5. **Add `headingLevel` to `Text`** (or ship a `Heading` component). Unblocks proper document outline in this app and any other consumer.
6. **Audit class-selector overrides** in this consumer (4 files) and decide per case: ship a prop, expose a token, or fix the default.
7. **Ship a generic `Field`/`LabeledControl` primitive**, or extend the `*Field` family to cover SegmentedControl/Select. Removes `ToggleControlRow`-style boilerplate.
8. **Ship a `SkipLink` primitive** (low effort, every consumer needs it).
9. **Re-export key a11y props on adapter `Props`** so IDEs surface them in autocomplete.

Items 1–3 are mostly mechanical and unblock real consumer cleanup in a single PR each. Items 4–7 are larger and should be planned with the broader component roadmap.

---

## How to verify these claims

Every file:line reference in this doc opens directly in the editor. Cross-reference against the latest `main` — the dashboard-teaser is the source of truth for "what real consumers actually do." If a finding no longer reproduces because the library has moved, that's a win; please update this doc.
