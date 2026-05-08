# Extra Implementation Plan: High-Risk Svelte Widgets

Date: 2026-05-07
Status: Active execution plan

## Context

All MVP and low-risk items from `implementation-svelte.md` are complete (421/430 checked).
This document tracks the remaining high-risk interactive widgets that require portal/overlay
patterns, focus management, and extra a11y review.

## Current Baseline

- 94 component exports in `@marwes-ui/svelte`
- 30 tests passing
- 89 storybook stories
- 0 typecheck errors
- 526 source files pass boundary check

---

## Commit 1: Dialog (5 components)

### Components
- [ ] `Dialog` — base dialog atom using `<dialog>` element
- [ ] `DialogModal` — modal molecule with backdrop, focus trap, scroll lock
- [ ] `ConfirmDialog` — purpose wrapper (`data-purpose="confirm"`)
- [ ] `DestructiveDialog` — purpose wrapper (`data-purpose="destructive"`)
- [ ] `InfoDialog` — purpose wrapper (`data-purpose="info"`)

### Implementation notes
- Use native `<dialog>` element with `.showModal()` for modal behavior
- Focus trap via native `<dialog>` inert behavior (no library needed)
- Scroll lock via `<dialog>` native backdrop
- `open` prop controls visibility via `$effect` calling `.showModal()` / `.close()`
- `onclose` callback when dialog closes
- Must handle Escape key (native `<dialog>` handles this)
- Spread `kit.dataAttributes` from core recipe

### Source reference
- `packages/core/src/components/atoms/dialog/*`
- `packages/react/src/components/dialog/*`
- `packages/vue/src/components/dialog/*`
- `packages/presets/src/firstEdition/dialog.css`
- `packages/presets/src/firstEdition/molecules/dialog-modal.css`

### Validation
- [ ] `pnpm --filter @marwes-ui/svelte test:typecheck`
- [ ] `pnpm --filter @marwes-ui/svelte build`
- [ ] `pnpm check:adapter-boundaries`

---

## Commit 2: Toast (8 components)

### Components
- [ ] `Toast` — base toast atom
- [ ] `ToastContainer` — stacking container molecule
- [ ] `ToastProvider` — context provider with auto-dismiss
- [ ] `useToast` — imperative toast trigger hook
- [ ] `ErrorToast` — purpose wrapper
- [ ] `InfoToast` — purpose wrapper
- [ ] `SuccessToast` — purpose wrapper
- [ ] `WarningToast` — purpose wrapper

### Implementation notes
- `ToastProvider` uses Svelte context + `$state` array for toast queue
- `useToast()` returns `{ toast, dismiss }` from context
- Auto-dismiss via `$effect` with `setTimeout`
- `ToastContainer` renders portal-like fixed container (can use `<div>` at body level)
- Each toast has enter/exit animation via CSS transitions
- Purpose wrappers set `variant` and `data-purpose`

### Source reference
- `packages/core/src/components/atoms/toast/*`
- `packages/react/src/components/toast/*`
- `packages/vue/src/components/toast/*`
- `packages/presets/src/firstEdition/toast.css`
- `packages/presets/src/firstEdition/molecules/toast-container.css`

### Validation
- [ ] `pnpm --filter @marwes-ui/svelte test:typecheck`
- [ ] `pnpm --filter @marwes-ui/svelte build`
- [ ] `pnpm check:adapter-boundaries`

---

## Commit 3: Tooltip (2 components)

### Components
- [ ] `Tooltip` — tooltip atom with positioning
- [ ] `TooltipGroup` — grouped tooltips molecule

### Implementation notes
- Position calculation using CSS anchor positioning or manual offset
- Show on hover (with delay) and focus
- Hide on mouse leave and blur
- `ariaDescribedBy` wiring between trigger and tooltip content
- Render inline (no portal needed for most cases)
- `TooltipGroup` shares hover delay state across tooltips

### Source reference
- `packages/core/src/components/atoms/tooltip/*`
- `packages/react/src/components/tooltip/*`
- `packages/vue/src/components/tooltip/*`
- `packages/presets/src/firstEdition/tooltip.css`

### Validation
- [ ] `pnpm --filter @marwes-ui/svelte test:typecheck`
- [ ] `pnpm --filter @marwes-ui/svelte build`
- [ ] `pnpm check:adapter-boundaries`

---

## Commit 4: InputOtp (1 component)

### Components
- [ ] `InputOtp` — multi-digit OTP input with focus management

### Implementation notes
- Renders N individual `<input>` elements (one per digit)
- Auto-advance focus on digit entry
- Backspace moves focus back
- Paste handling distributes digits across inputs
- Exposes single `value` string via `bind:value`
- Uses core recipe for class/a11y output

### Source reference
- `packages/core/src/components/atoms/input/input-otp-*`
- `packages/react/src/components/input/input-otp.tsx`
- `packages/vue/src/components/input/input-otp.ts`
- `packages/presets/src/firstEdition/input-otp.css`

### Validation
- [ ] `pnpm --filter @marwes-ui/svelte test:typecheck`
- [ ] `pnpm --filter @marwes-ui/svelte build`
- [ ] `pnpm check:adapter-boundaries`

---

## Commit 5: DatePicker + RichText (3 components)

### Components
- [ ] `DatePicker` — calendar date selection widget
- [ ] `RichText` — contenteditable rich text atom
- [ ] `RichTextField` — molecule with label/helper/error wiring

### Implementation notes

**DatePicker:**
- Calendar grid with month/year navigation
- Keyboard navigation (arrows, Home/End, PageUp/PageDown)
- `bind:value` for selected date string
- Uses core recipe for grid layout and a11y

**RichText:**
- Contenteditable div with formatting toolbar
- Toolbar buttons for bold, italic, lists, headings
- `bind:value` for HTML content string
- Uses `execCommand` or `document.queryCommandState` pattern

### Source reference
- `packages/core/src/components/atoms/date-picker/*`
- `packages/core/src/components/atoms/input/rich-text-*`
- `packages/react/src/components/date-picker/*`
- `packages/react/src/components/input/rich-text*.tsx`
- `packages/presets/src/firstEdition/date-picker.css`
- `packages/presets/src/firstEdition/rich-text.css`

### Validation
- [ ] `pnpm --filter @marwes-ui/svelte test:typecheck`
- [ ] `pnpm --filter @marwes-ui/svelte build`
- [ ] `pnpm check:adapter-boundaries`

---

## Post-completion

After all 5 commits:
- [ ] Update `implementation-svelte.md` checkboxes
- [ ] Add storybook stories for all new components
- [ ] Run full validation suite
- [ ] Update parity artifact
