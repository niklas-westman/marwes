# UPGRADE.md — Component Library: Atom/Molecule/Purpose Migration

## Overview

Upgrade all components to the gold-standard Atom → Molecule → Purpose pattern established by Accordion, Badge, Button, Checkbox, and Input.

Completed so far: **Radio, Switch, Card, Tab, Toast**.
Next up: **Divider**.

Each component gets:

- **Folder-based story structure** with `Introduction.mdx` and `__tests__/`
- **Consistent Storybook titles**: `Component/Atom`, `Component/Molecule`, `Component/Purpose/Variant`
- **Taxonomy tests** and **Introduction docs tests**
- **Rich Introduction.mdx** with architecture diagrams and dynamic content from `@marwes-ui/core`

## Component Tiers

| Tier | Components | Work |
| ---- | ---------- | ---- |
| **Done** | Radio, Switch, Card, Tab, Toast | Completed in React + Vue with stories, docs, tests, exports, and preset support where needed |
| **C — Structure migration** | Divider, Heading, Icon, Paragraph | Move files, update titles, rewrite docs, add tests |

## Execution Order

One component at a time. Fully complete before moving on.

| # | Component | Effort | Why |
| --- | --------- | ------ | --- |
| 1 | **Radio** | Done | Taxonomy/docs tests added |
| 2 | **Switch** | Done | Molecule + purpose variants shipped |
| 3 | **Card** | Done | Purpose variants + docs/tests shipped |
| 4 | **Tab** | Done | TabGroup, TabPanel, purpose variants, docs/tests shipped |
| 5 | **Toast** | Done | ToastContainer + useToast hook, new imperative pattern |
| 6 | **Divider** | Next | Move to folder, update title, rewrite docs, add tests |
| 7 | **Heading** | Queued | Same as Divider |
| 8 | **Paragraph** | Queued | Same as Divider |
| 9 | **Icon** | Queued | Same as Divider |
| | **Remaining** | **~1.5–2 hrs** | Tier C migrations |

## Per-Component Plans

### 1. Radio (Tier A)

**Status:** ✅ Complete.

React + Vue Storybook docs/tests are in place.

### 2. Switch (Tier B)

**Status:** ✅ Complete.

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

**Status:** ✅ Complete.

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

**Status:** ✅ Complete.

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

**Delivered:** `TabGroup`, `TabPanel`, keyboard navigation, purpose variants, preset CSS, React/Vue Storybook docs/tests, and package exports.

### 5. Toast (Tier B)

**Status:** ✅ Complete.

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

**Delivered:** `ToastContainer`, `ToastProvider`, `useToast`, purpose variants, preset CSS, React/Vue Storybook docs/tests, and package exports.

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

- **Exports:** New molecules/variants added to `packages/react/src/index.ts` and `packages/vue/src/index.ts`
- **Vue parity:** Every React molecule/variant gets a Vue mirror
- **Preset CSS:** New molecules need CSS in `packages/presets/src/firstEdition/molecules/` + import in `styles.css`
- **Core docs-copy:** Each component with purpose variants needs `*WhyPurposeComponents` + `*PurposeComponentReference` in `docs-copy.ts`

## Verification (after each component)

```bash
pnpm typecheck
pnpm test
pnpm lint
```
