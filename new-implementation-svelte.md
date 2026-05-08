# Svelte Adapter — Remaining Work

Date: 2026-05-07
Package: `packages/svelte` / `@marwes-ui/svelte`

## Current State

- **117 component exports** in `packages/svelte/src/lib/index.ts`
- **89 storybook stories** in `apps/storybook-svelte/src/stories/`
- **19 Introduction.mdx** documentation files
- **30 tests** passing in `packages/svelte/src/tests/`
- **0 typecheck errors** (`pnpm --filter @marwes-ui/svelte test:typecheck`)
- **551 source files** pass adapter boundary check

All component families from React are now implemented in Svelte, including
the high-risk interactive widgets (Dialog, Toast, Tooltip, DatePicker,
RichText, InputOtp).

---

## 1. Storybook Stories for New Widgets

18 new components have no storybook stories yet. Each needs a story file
and the family needs an Introduction.mdx if missing.

### 1.1 Dialog family

React reference: `apps/storybook-react/src/stories/dialog/`

Create folder: `apps/storybook-svelte/src/stories/dialog/`

- [ ] `Introduction.mdx` — Meta title `"Dialog/Introduction"`. Document Dialog atom, DialogModal molecule, and 3 purpose wrappers. Include Svelte code examples with `{#snippet footer}` pattern. ~100 lines matching React's 142-line version.
- [ ] `dialog.stories.ts` — title `"Dialog/Atom"`. Stories: `Default` (with title/description/children), `WithFooter`, `Dismissible`. Component: `Dialog` from `@marwes-ui/svelte`.
- [ ] `dialog-modal.stories.ts` — title `"Dialog/Molecule"`. Stories: `Default` (open via args). Needs a wrapper `.svelte` component since DialogModal requires `open` state + button trigger. Component: `DialogModal`.
- [ ] `confirm-dialog.stories.ts` — title `"Dialog/Purpose/ConfirmDialog"`. Stories: `Default`. Args: `{ title: "Publish update", description: "This will make changes visible." }`. Needs wrapper for open state.
- [ ] `destructive-dialog.stories.ts` — title `"Dialog/Purpose/DestructiveDialog"`. Stories: `Default`. Args: `{ title: "Delete workspace", description: "This cannot be undone." }`.
- [ ] `info-dialog.stories.ts` — title `"Dialog/Purpose/InfoDialog"`. Stories: `Default`. Args: `{ title: "Scheduled maintenance", description: "The system will be down briefly." }`.

**Note**: Dialog stories need wrapper `.svelte` components because dialogs require a trigger button + open state management that can't be expressed through args alone.

### 1.2 Toast family

React reference: `apps/storybook-react/src/stories/toast/`

Create folder: `apps/storybook-svelte/src/stories/toast/`

- [ ] `Introduction.mdx` — Meta title `"Toast/Introduction"`. Document Toast atom, ToastContainer molecule, ToastProvider/useToast, and 4 purpose variants. ~120 lines.
- [ ] `toast.stories.ts` — title `"Toast/Atom"`. Stories: `Default`, `WithIcon`, `WithAction`, `Dismissible`. Component: `Toast`. Children via SnippetRenderer.
- [ ] `toast-container.stories.ts` — title `"Toast/Molecule"`. Needs wrapper component that renders ToastProvider + trigger buttons. Stories: `Default`.
- [ ] `error-toast.stories.ts` — title `"Toast/Purpose/ErrorToast"`. Stories: `Default`. Children: `"Something went wrong"`.
- [ ] `info-toast.stories.ts` — title `"Toast/Purpose/InfoToast"`. Stories: `Default`. Children: `"Your changes have been saved"`.
- [ ] `success-toast.stories.ts` — title `"Toast/Purpose/SuccessToast"`. Stories: `Default`. Children: `"Operation completed successfully"`.
- [ ] `warning-toast.stories.ts` — title `"Toast/Purpose/WarningToast"`. Stories: `Default`. Children: `"Your session is about to expire"`.

### 1.3 Tooltip family

React reference: `apps/storybook-react/src/stories/tooltip/`

Create folder: `apps/storybook-svelte/src/stories/tooltip/`

- [ ] `Introduction.mdx` — Meta title `"Tooltip/Introduction"`. Document Tooltip atom and TooltipGroup. ~50 lines.
- [ ] `tooltip.stories.ts` — title `"Tooltip/Atom"`. Stories: `Default`. Component: `Tooltip`. Children: `"Tooltip content"`.
- [ ] `tooltip-group.stories.ts` — title `"Tooltip/Molecule/TooltipGroup"`. Stories: `Default`, `CustomIcon`. Args: `{ content: "Helpful information" }`.

### 1.4 Input additions

React reference: `apps/storybook-react/src/stories/input/`

Add to existing folder: `apps/storybook-svelte/src/stories/input/`

- [ ] `input-otp.stories.ts` — title `"Input/Molecule/InputOtp"`. Stories: `Default`, `WithError`, `CustomLength`. Args: `{ label: "Verification code" }`. Component: `InputOtp`.
- [ ] `rich-text.stories.ts` — title `"Input/Atom/RichText"`. Stories: `Default`, `WithPlaceholder`, `Disabled`. Component: `RichText`.
- [ ] `rich-text-field.stories.ts` — title `"Input/Molecule/RichTextField"`. Stories: `Default`, `WithError`. Args: `{ label: "Description", editor: { placeholder: "Enter formatted text..." } }`. Component: `RichTextField`.

### 1.5 DatePicker

React reference: `apps/storybook-react/src/stories/date-picker/`

Create folder: `apps/storybook-svelte/src/stories/date-picker/`

- [ ] `Introduction.mdx` — Meta title `"DatePicker/Introduction"`. Brief (React's is only 16 lines). Document DatePicker atom.
- [ ] `date-picker.stories.ts` — title `"DatePicker/Atom"`. Stories: `Default`. Needs wrapper `.svelte` component that provides month/weeks data and handles navigation callbacks. Component: `DatePicker`.

### 1.6 Update existing Introduction.mdx

- [ ] `apps/storybook-svelte/src/stories/input/Introduction.mdx` — Add InputOtp, RichText, RichTextField to the architecture diagram and story coverage section.

---

## 2. Parity Artifact Update

The framework parity JSON and summary need updating for newly implemented families.

File: `artifacts/framework-parity.json`

- [ ] Set `"svelte": true` for `"dialog"` family
- [ ] Set `"svelte": true` for `"toast"` family
- [ ] Set `"svelte": true` for `"tooltip"` family
- [ ] Set `"svelte": true` for `"date-picker"` family (was false)

Then regenerate summary:

- [ ] Run `pnpm parity:summary` to regenerate `docs/reference/framework-parity-summary.md`
- [ ] Run `pnpm parity:summary:check` to verify

---

## 3. Additional Tests

Current: 30 tests in 5 files. React has ~65 test files. Priority tests
to add for coverage of critical paths.

Location: `packages/svelte/src/tests/`

- [ ] `checkbox.test.ts` — Checkbox renders, `bind:checked` works, indeterminate state, `oncheckedchange` fires. Reference: `packages/react/src/components/checkbox/__tests__/checkbox.test.tsx`
- [ ] `switch.test.ts` — Switch renders button with `role="switch"`, `aria-checked` toggles, `oncheckedchange` fires, disabled state. Reference: `packages/react/src/components/switch/__tests__/switch.test.tsx`
- [ ] `dialog.test.ts` — Dialog renders section, DialogModal shows/hides, escape closes, focus trap works. Reference: `packages/react/src/components/dialog/__tests__/dialog.test.tsx`
- [ ] `toast.test.ts` — Toast renders with role/aria-live, ToastProvider context works. Reference: `packages/react/src/components/toast/__tests__/toast-container.test.tsx`
- [ ] `passive-primitives.test.ts` (optional) — Badge, Card, Divider, Spacing, Skeleton, StatTile basic rendering.

---

## 4. Pre-Publish

- [ ] Add changeset for `@marwes-ui/svelte` — run `pnpm changeset` and describe the new public package/API surface.

---

## 5. Blocked Items (not actionable)

These are tracked but cannot be resolved right now:

- `pnpm validate:packages` — blocked by pre-existing core OOM (`ERR_WORKER_OUT_OF_MEMORY` in tsup build). Not Svelte-related.
- `test:storybook:a11y` for Svelte — blocked by upstream Storybook bug ([#29424](https://github.com/storybookjs/storybook/issues/29424)). Stories render once the fix ships.

---

## Validation Commands

```bash
# Package validation
pnpm --filter @marwes-ui/svelte test:typecheck   # 0 errors expected
pnpm --filter @marwes-ui/svelte build            # svelte-package → dist
pnpm --filter @marwes-ui/svelte test             # 30+ tests expected

# Cross-package validation
pnpm check:adapter-boundaries                    # 551+ source files
pnpm parity:summary:check                        # parity artifact consistent

# Visual verification
pnpm dev:storybook:svelte                        # port 6007
pnpm dev:playground:svelte                       # port 5173
```

## Technical Notes

- **`exactOptionalPropertyTypes: true`** — destructure optional props, then conditionally spread: `...(prop ? { prop } : {})`
- **SVG attributes** — core generates camelCase (strokeDasharray). Svelte needs kebab-case. Use `svgAttrsToKebab()` from `internal/svg-attrs.ts`
- **Composed stories** — Svelte Storybook can't render component-children via args. Create `.svelte` wrapper components for composed content (e.g., BadgeGroupStory, RadioGroupFieldStory, DividerPreview)
- **Dialog stories** — need wrapper components with trigger button + open state
- **Toast stories** — need wrapper with ToastProvider context
- **Select chevron** — must use explicit `width="16" height="16"` with React's 16×16 filled SVG path
