# UPGRADE.md — Component Library: Atom/Molecule/Purpose Migration

## Overview

Upgrade all components to the gold-standard Atom → Molecule → Purpose pattern established by Accordion, Badge, Button, Checkbox, and Input.

Each component gets:

- **Folder-based story structure** with `Introduction.mdx` and `__tests__/`
- **Consistent Storybook titles**: `Component/Atom`, `Component/Molecule`, `Component/Purpose/Variant`
- **Taxonomy tests** and **Introduction docs tests**
- **Rich Introduction.mdx** with architecture diagrams and dynamic content from `@marwes-ui/core`

## Component Tiers

| Tier | Components | Work |
| ---- | ---------- | ---- |
| **A — Tests only** | Radio | Add `__tests__/` |
| **B — Molecule + Purpose** | Switch, Card, Tab, Toast | New code + stories + docs + tests |
| **C — Structure migration** | Divider, Heading, Icon, Paragraph | Move files, update titles, rewrite docs, add tests |

## Execution Order

One component at a time. Fully complete before moving on.

| # | Component | Effort | Why |
| --- | --------- | ------ | --- |
| 1 | **Radio** | ~5 min | Copy taxonomy/docs tests from Badge, change names |
| 2 | **Switch** | ~45 min | SwitchField ≈ CheckboxField, same pattern |
| 3 | **Card** | ~30 min | Purpose variants only — no molecule needed |
| 4 | **Tab** | ~2 hrs | TabGroup with keyboard nav is genuinely complex |
| 5 | **Toast** | ~3 hrs | ToastContainer + useToast hook, new imperative pattern |
| 6 | **Divider** | ~15 min | Move to folder, update title, rewrite docs, add tests |
| 7 | **Heading** | ~15 min | Same as Divider |
| 8 | **Paragraph** | ~15 min | Same as Divider |
| 9 | **Icon** | ~15 min | Same as Divider |
| | **Total** | **~5–6 hrs** | |

## Per-Component Plans

### 1. Radio (Tier A)

**Status:** ✅ Atom/Molecule/Purpose stories + rich Introduction.mdx. ❌ Missing `__tests__/`.

**Deliverables:**

- `apps/storybook-react/src/stories/radio/__tests__/radio-taxonomy.test.ts`
- `apps/storybook-react/src/stories/radio/__tests__/radio-introduction-docs.test.ts`

### 2. Switch (Tier B)

**Status:** Atom only. Missing `onCheckedChange`, no molecule, no purpose variants.

| Layer | Files |
| ----- | ----- |
| Core | `buildSwitchFieldA11yIds()` in `field-helpers.ts` |
| React | Enhance `switch.tsx` (add `onCheckedChange`, controlled/uncontrolled) |
| React Molecule | `switch-field.tsx` (label, description, error — like CheckboxField) |
| React Purpose | `variants.tsx` — `FeatureToggle`, `PreferenceSwitch`, `PermissionSwitch` |
| Vue | Mirror molecule + purpose |
| Presets | `molecules/switch-field.css` |
| Core docs | `switchWhyPurposeComponents` + `switchPurposeComponentReference` in `docs-copy.ts` |
| Stories | Atom (update), molecule, 3 purpose stories, rich Introduction.mdx |
| Tests | `__tests__/switch-taxonomy.test.ts`, `switch-introduction-docs.test.ts` |
| Exports | Update `packages/react/src/index.ts` |

### 3. Card (Tier B — Purpose Only)

**Status:** Atom only. Empty `CardOptions`.

| Layer | Files |
| ----- | ----- |
| Core | Add `dataAttributes` support to card types |
| React Purpose | `variants.tsx` — `ProductCard`, `ProfileCard`, `StatCard` |
| Vue | Mirror purpose |
| Core docs | `cardWhyPurposeComponents` + `cardPurposeComponentReference` in `docs-copy.ts` |
| Stories | Atom (keep), 3 purpose stories, rich Introduction.mdx (2-layer: Atom → Purpose) |
| Tests | `__tests__/card-taxonomy.test.ts`, `card-introduction-docs.test.ts` |
| Exports | Update `packages/react/src/index.ts` |

**No molecule** — cards aren't form fields.

### 4. Tab (Tier B)

**Status:** Atom only. Tab is a single button — no tablist, tabpanel, keyboard nav.

| Layer | Files |
| ----- | ----- |
| Core | `tab-group-types.ts`, `tab-group-a11y.ts` |
| React Molecule | `tab-group.tsx` — `role="tablist"`, `TabPanel`, arrow/Home/End keyboard nav, controlled/uncontrolled `activeTab` |
| React Purpose | `variants.tsx` — `NavigationTabs`, `ContentTabs`, `SettingsTabs` |
| Vue | Mirror molecule + purpose |
| Presets | `molecules/tab-group.css` |
| Core docs | `tabWhyPurposeComponents` + `tabPurposeComponentReference` in `docs-copy.ts` |
| Stories | Atom (update), molecule, 3 purpose stories, rich Introduction.mdx |
| Tests | `__tests__/tab-taxonomy.test.ts`, `tab-introduction-docs.test.ts` |
| Exports | Update `packages/react/src/index.ts` |

**Note:** Most complex molecule — keyboard navigation and panel management.

### 5. Toast (Tier B)

**Status:** Atom only. No toast management exists in the codebase.

| Layer | Files |
| ----- | ----- |
| Core | `toast-container-types.ts` |
| React Purpose | `variants.tsx` — `SuccessToast`, `ErrorToast`, `WarningToast`, `InfoToast` |
| React Molecule | `toast-container.tsx` — positioned container, stacking. `useToast()` hook — imperative API with auto-dismiss |
| Vue | Mirror molecule + purpose + `useToast` composable |
| Presets | `molecules/toast-container.css` — positioning, stacking, animations |
| Core docs | `toastWhyPurposeComponents` + `toastPurposeComponentReference` in `docs-copy.ts` |
| Stories | Atom (update), molecule, 4 purpose stories, rich Introduction.mdx |
| Tests | `__tests__/toast-taxonomy.test.ts`, `toast-introduction-docs.test.ts` |
| Exports | Update `packages/react/src/index.ts` |

**Note:** Heaviest lift. Introduces imperative `useToast()` pattern + `ToastProvider` context.

### 6–9. Divider, Heading, Paragraph, Icon (Tier C)

**Status:** Flat files, old title pattern (`Atoms/Divider`, `Typography/Heading`, etc.), minimal docs.

**Same steps for each:**

| Step | What |
| ---- | ---- |
| Move | `component.stories.tsx` → `component/component.stories.tsx` |
| Move | `component.Introduction.mdx` → `component/Introduction.mdx` |
| Update title | `"Atoms/Divider"` → `"Divider/Atom"` etc. |
| Rewrite Introduction.mdx | Single-layer architecture (Atom only), consistent format |
| Add tests | `__tests__/component-taxonomy.test.ts`, `component-introduction-docs.test.ts` |
| Delete old files | Remove flat files |
| Vue mirror | Same changes in `apps/storybook-vue/` |

**No new React/Vue/core code.** Documentation + structure only.

## Cross-Cutting

- **Exports:** New molecules/variants added to `packages/react/src/index.ts`
- **Vue parity:** Every React molecule/variant gets a Vue mirror
- **Preset CSS:** New molecules need CSS in `packages/presets/src/firstEdition/molecules/` + import in `styles.css`
- **Core docs-copy:** Each component with purpose variants needs `*WhyPurposeComponents` + `*PurposeComponentReference` in `docs-copy.ts`

## Verification (after each component)

```bash
pnpm test
pnpm tsc --noEmit
pnpm lint
```
