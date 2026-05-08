# Svelte Adapter — Remaining Work

Date: 2026-05-07  
Package: `packages/svelte` / `@marwes-ui/svelte`  
Branch: `add/svelte` (60 commits)

---

## Current State

| Metric | Value |
|--------|-------|
| Component exports (`export { default as ...}`) | 112 |
| Function/helper exports (useTheme, useToast, etc.) | 5 |
| Core re-exports (BadgeVariant, ThemeMode, etc.) | via barrel |
| Storybook story files | 89 |
| Introduction.mdx files | 19 |
| Storybook wrapper .svelte files | 7 |
| Unit tests | 30 (5 test files) |
| Typecheck errors | 0 (warnings are benign) |
| Source files passing boundary check | 551 |
| Component families | 24 directories |

### Fully implemented component families

accordion, avatar, badge, button, card, checkbox, date-picker, dialog,
divider, icon, input (incl. InputOtp, RichText, RichTextField, purpose fields),
paragraph, radio, select, skeleton, slider, spacing, spinner, stat-tile,
switch, tab, textarea, toast, tooltip, typography (H1/H2/H3)

### Key files

| File | Purpose |
|------|---------|
| `packages/svelte/src/lib/index.ts` | Public API — all exports |
| `packages/svelte/src/lib/components/` | 24 component family directories |
| `packages/svelte/src/lib/provider/` | MarwesProvider, useTheme, useThemeMode |
| `packages/svelte/src/lib/internal/` | merge-class, css-vars, attrs, svg-attrs |
| `packages/svelte/src/lib/ssr.ts` | SSR helpers re-export |
| `packages/svelte/src/tests/` | 5 test files + type fixtures |
| `apps/storybook-svelte/` | Storybook app with 89 stories |
| `apps/playground-svelte/` | Visual playground app |
| `docs/guides/svelte-adapter.md` | Svelte adapter usage guide |

### Validation commands

```bash
pnpm --filter @marwes-ui/svelte test:typecheck   # 0 errors
pnpm --filter @marwes-ui/svelte build            # svelte-package → dist
pnpm --filter @marwes-ui/svelte test             # 30 tests
pnpm check:adapter-boundaries                    # 551 source files
pnpm parity:summary:check                        # parity check
pnpm dev:storybook:svelte                        # visual (port 6007)
pnpm dev:playground:svelte                       # visual (port 5173)
```

---

## TODO

### 1. Parity Artifact — Update `svelte: true` for all families

14 families are implemented but still show `svelte: false` in the parity artifact.

**File**: `artifacts/framework-parity.json`

- [ ] `accordion` → set `"svelte": true`
- [ ] `avatar` → set `"svelte": true`
- [ ] `checkbox` → set `"svelte": true`
- [ ] `date-picker` → set `"svelte": true`
- [ ] `dialog` → set `"svelte": true`
- [ ] `radio` → set `"svelte": true`
- [ ] `skeleton` → set `"svelte": true`
- [ ] `slider` → set `"svelte": true`
- [ ] `stat-tile` → set `"svelte": true`
- [ ] `switch` → set `"svelte": true`
- [ ] `tab` → set `"svelte": true`
- [ ] `toast` → set `"svelte": true`
- [ ] `tooltip` → set `"svelte": true`
- [ ] Run `pnpm parity:summary` to regenerate `docs/reference/framework-parity-summary.md`
- [ ] Run `pnpm parity:summary:check` to verify

---

### 2. Storybook Stories for New Widgets

17 components have no storybook stories yet. For each, create a story file
matching the React storybook pattern. Reference: `apps/storybook-react/src/stories/`

**Important**: Dialog, Toast, and DatePicker stories need wrapper `.svelte`
components because they require interactive state (open/close, trigger buttons,
data providers) that can't be expressed through Storybook args alone. Follow the
existing pattern used by `BadgeGroupStory.svelte`, `RadioGroupFieldStory.svelte`, etc.

#### 2.1 Dialog family — create `apps/storybook-svelte/src/stories/dialog/`

- [ ] `Introduction.mdx` — Meta title: `"Dialog/Introduction"`. Document Dialog atom, DialogModal molecule, ConfirmDialog/DestructiveDialog/InfoDialog purpose wrappers. Show Svelte snippet-based footer pattern. Reference: `apps/storybook-react/src/stories/dialog/Introduction.mdx` (142 lines)
- [ ] `DialogStory.svelte` — Wrapper component with trigger button and `let open = $state(false)` that toggles a DialogModal. Accepts props to forward to the inner dialog.
- [ ] `dialog.stories.ts` — title: `"Dialog/Atom"`. Stories: Default (with title, description, children). Uses `Dialog` directly (no modal wrapper needed for atom). Reference: `apps/storybook-react/src/stories/dialog/dialog.stories.tsx`
- [ ] `dialog-modal.stories.ts` — title: `"Dialog/Molecule"`. Uses `DialogStory.svelte` wrapper. Stories: Default. Reference: `apps/storybook-react/src/stories/dialog/dialog-modal.stories.tsx`
- [ ] `confirm-dialog.stories.ts` — title: `"Dialog/Purpose/ConfirmDialog"`. Uses wrapper. Args: `{ title: "Publish update", description: "This will make changes visible to users." }`. Reference: `apps/storybook-react/src/stories/dialog/confirm-dialog.stories.tsx`
- [ ] `destructive-dialog.stories.ts` — title: `"Dialog/Purpose/DestructiveDialog"`. Args: `{ title: "Delete workspace", description: "This action cannot be undone." }`. Reference: `apps/storybook-react/src/stories/dialog/destructive-dialog.stories.tsx`
- [ ] `info-dialog.stories.ts` — title: `"Dialog/Purpose/InfoDialog"`. Args: `{ title: "Scheduled maintenance", description: "The system will be briefly unavailable." }`. Reference: `apps/storybook-react/src/stories/dialog/info-dialog.stories.tsx`

#### 2.2 Toast family — create `apps/storybook-svelte/src/stories/toast/`

- [ ] `Introduction.mdx` — Meta title: `"Toast/Introduction"`. Document Toast atom, ToastContainer, ToastProvider/useToast, and 4 purpose variants. Reference: `apps/storybook-react/src/stories/toast/Introduction.mdx` (156 lines)
- [ ] `toast.stories.ts` — title: `"Toast/Atom"`. Stories: Default, Dismissible. Children via SnippetRenderer (`children: "Notification message"`). Reference: `apps/storybook-react/src/stories/toast/toast.stories.tsx`
- [ ] `ToastDemo.svelte` — Wrapper that renders `<ToastProvider>` with trigger buttons calling `useToast().show(...)`. Used by the molecule story.
- [ ] `toast-container.stories.ts` — title: `"Toast/Molecule"`. Uses `ToastDemo.svelte`. Stories: Default. Reference: `apps/storybook-react/src/stories/toast/toast-container.stories.tsx`
- [ ] `error-toast.stories.ts` — title: `"Toast/Purpose/ErrorToast"`. Children: `"Something went wrong"`. Reference: `apps/storybook-react/src/stories/toast/error-toast.stories.tsx`
- [ ] `info-toast.stories.ts` — title: `"Toast/Purpose/InfoToast"`. Children: `"Your changes have been saved"`. Reference: `apps/storybook-react/src/stories/toast/info-toast.stories.tsx`
- [ ] `success-toast.stories.ts` — title: `"Toast/Purpose/SuccessToast"`. Children: `"Operation completed"`. Reference: `apps/storybook-react/src/stories/toast/success-toast.stories.tsx`
- [ ] `warning-toast.stories.ts` — title: `"Toast/Purpose/WarningToast"`. Children: `"Session expiring soon"`. Reference: `apps/storybook-react/src/stories/toast/warning-toast.stories.tsx`

#### 2.3 Tooltip family — create `apps/storybook-svelte/src/stories/tooltip/`

- [ ] `Introduction.mdx` — Meta title: `"Tooltip/Introduction"`. Document Tooltip atom and TooltipGroup. Reference: `apps/storybook-react/src/stories/tooltip/Introduction.mdx` (50 lines)
- [ ] `tooltip.stories.ts` — title: `"Tooltip/Atom"`. Stories: Default. Children: `"Tooltip content"`. Reference: `apps/storybook-react/src/stories/tooltip/tooltip.stories.tsx`
- [ ] `tooltip-group.stories.ts` — title: `"Tooltip/Molecule/TooltipGroup"`. Stories: Default. Args: `{ content: "Helpful information" }`. Reference: `apps/storybook-react/src/stories/tooltip/tooltip-group.stories.tsx`

#### 2.4 Input additions — add to `apps/storybook-svelte/src/stories/input/`

- [ ] `input-otp.stories.ts` — title: `"Input/Molecule/InputOtp"`. Stories: Default, WithError, CustomLength. Args: `{ label: "Verification code" }`. Reference: `apps/storybook-react/src/stories/input/input-otp.stories.tsx`
- [ ] `rich-text.stories.ts` — title: `"Input/Atom/RichText"`. Stories: Default, WithPlaceholder, Disabled. Reference: `apps/storybook-react/src/stories/input/rich-text.stories.tsx`
- [ ] `rich-text-field.stories.ts` — title: `"Input/Molecule/RichTextField"`. Stories: Default, WithError. Args: `{ label: "Description", editor: { placeholder: "Enter formatted text..." } }`. Reference: `apps/storybook-react/src/stories/input/rich-text-field.stories.tsx`

#### 2.5 DatePicker — create `apps/storybook-svelte/src/stories/date-picker/`

- [ ] `Introduction.mdx` — Meta title: `"DatePicker/Introduction"`. Brief. Reference: `apps/storybook-react/src/stories/date-picker/Introduction.mdx` (16 lines)
- [ ] `DatePickerDemo.svelte` — Wrapper that provides month label, weekday labels, weeks data, and handles nav callbacks with `$state` for month/year tracking.
- [ ] `date-picker.stories.ts` — title: `"DatePicker/Atom"`. Uses `DatePickerDemo.svelte`. Stories: Default. Reference: `apps/storybook-react/src/stories/date-picker/date-picker.stories.tsx`

#### 2.6 Update existing Introduction.mdx

- [ ] `apps/storybook-svelte/src/stories/input/Introduction.mdx` — Add InputOtp, RichText, RichTextField to the architecture diagram, component reference, and story coverage sections.

---

### 3. Additional Tests

5 test files to bring coverage closer to React's ~65 test files. Focus on
interactive components and newly added widgets.

Location: `packages/svelte/src/tests/`

- [ ] `checkbox.test.ts` — Checkbox renders `<input type="checkbox">`, has `mw-checkbox` class, `bind:checked` updates, indeterminate state via `$effect`, `oncheckedchange` fires with boolean. Reference: `packages/react/src/components/checkbox/__tests__/checkbox.test.tsx`
- [ ] `switch.test.ts` — Switch renders `<button role="switch">`, `aria-checked` toggles, `oncheckedchange` fires, disabled prevents toggle, CSS vars applied via `style`. Reference: `packages/react/src/components/switch/__tests__/switch.test.tsx`
- [ ] `dialog.test.ts` — Dialog renders `<section role="dialog">`, DialogModal shows/hides based on `open` prop, escape key calls close, focus moves into dialog on open. Reference: `packages/react/src/components/dialog/__tests__/dialog.test.tsx`
- [ ] `toast.test.ts` — Toast renders with `role="status"` and `aria-live`, purpose toasts set correct `data-purpose`. Reference: `packages/react/src/components/toast/__tests__/toast-container.test.tsx`
- [ ] `passive-primitives.test.ts` (optional) — Badge has `mw-badge` class, Card has `mw-card` with header/body structure, Divider renders `<hr>`, Spacing renders decorative div, Skeleton has correct data attrs.

---

### 4. Pre-Publish

- [ ] Run `pnpm changeset` and create changeset entry for `@marwes-ui/svelte` describing the new public package with 112 component exports.

---

### 5. Blocked (not actionable now)

| Item | Blocker |
|------|---------|
| `pnpm validate:packages` | Pre-existing core OOM (`ERR_WORKER_OUT_OF_MEMORY` in tsup). Not Svelte-related. |
| `test:storybook:a11y` for Svelte | Storybook upstream bug [#29424](https://github.com/storybookjs/storybook/issues/29424). |

---

## Technical Notes for Next Session

- **`exactOptionalPropertyTypes: true`** in tsconfig causes type errors when spreading optional props to core recipe functions. Pattern: destructure the optional prop, then conditionally spread `...(prop ? { prop } : {})`.
- **SVG attributes**: Core generates camelCase attrs (strokeDasharray). Svelte needs kebab-case. Use `svgAttrsToKebab()` from `src/lib/internal/svg-attrs.ts`.
- **Composed Storybook stories**: Svelte Storybook can't render component-children via args. Create `.svelte` wrapper components that accept data props and render compositions. Existing wrappers: `BadgeGroupStory.svelte`, `RadioGroupFieldStory.svelte`, `DividerPreview.svelte`, `HeadingShowcase.svelte`, `IconGallery.svelte`, `AvatarGallery.svelte`, `SpinnerGallery.svelte`.
- **Dialog/Toast stories**: Need wrapper components with trigger buttons + open state (`let open = $state(false)`).
- **Select chevron icon**: Must use explicit `width="16" height="16"` with React's 16×16 filled SVG path, not the 24×24 stroked version.
- **Provider warnings**: ~20 benign Svelte warnings about `$state` initial values referencing other reactive values. Intentional — `$effect` keeps them synced.
- **Build**: Uses `@sveltejs/package` (svelte-package), not tsup.
- **Playground**: `pnpm dev:playground:svelte` (port 5173).
