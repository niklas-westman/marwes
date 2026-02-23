# Marwes Specification

This file is the canonical specification for Marwes.
If implementation, docs, or behavior diverge from this file, either the implementation is wrong or this spec must be updated explicitly.

## 1. Product Intent
Marwes is a component system that prioritizes:
- Strong defaults
- Small override API
- Consistent accessibility behavior
- Framework-agnostic core logic

## 2. Current Status (2026-02-18)
- Repository version: `0.0.3`
- Delivery phase: v0.1 foundation
- Implemented atoms: Button, Input, Checkbox, Icon, H1, H2, H3, Paragraph, Divider
- Implemented molecules: CheckboxField
- In active scope: Select (native), Textarea, FormField, Card, Spinner

## 3. Core Principles
- Simple surface API, strong internal consistency
- Core is framework agnostic (no React, no DOM runtime behavior)
- Presets are static CSS (`.mw-*` classes and `--mw-*` vars)
- Accessibility behavior is authored in core
- Strict TypeScript (no `any`)

## 4. Architecture Contract
Marwes uses three layers:
1. `@marwes-ui/core`
   - Theme contract + normalization
   - Component recipes
   - A11y mappings
2. `@marwes-ui/presets`
   - Static CSS and preset defaults
3. `@marwes-ui/react`
   - Thin adapter that applies core RenderKit output

### RenderKit Contract
Core recipes return:
```ts
{
  tag: string,
  className: string,
  vars: Record<string, string>,
  a11y: Record<string, unknown>,
  policy?: {
    blockClick?: boolean,
    preventDefault?: boolean,
  }
}
```

Adapter requirements:
- Render `tag`
- Apply `className`
- Apply `style={vars}`
- Apply typed `a11y`
- Respect `policy`

## 5. v0.1 Scope
### In Scope
- Core theme system
- Foundational form and typography components
- React adapter for in-scope components
- Storybook and playground validation

### Out of Scope
- Complex widgets (DatePicker, DataTable, Combobox)
- Runtime CSS-in-JS

## 6. Spec-Driven Development Workflow (Required)
Every non-trivial change must follow this sequence:

1. **Spec first**
   - Add or update requirement(s) in this file.
2. **Acceptance criteria**
   - Each requirement includes testable outcomes.
3. **Implementation mapping**
   - Identify impacted files across core/presets/react.
4. **Validation**
   - Typecheck/build and targeted behavior checks.
5. **Documentation + changelog**
   - Update relevant docs when behavior/API changes.
6. **Decision capture**
   - Record architecture/product tradeoffs in Section 9.

## 7. Requirement Template (Use For New Work)
Copy this block when adding a feature or behavior:

```md
### REQ-XXX: <short name>
- Problem:
- Scope:
- Non-goals:
- Acceptance criteria:
  - [ ] AC1 ...
  - [ ] AC2 ...
- Validation:
  - Unit:
  - Integration/manual:
- Files expected to change:
```

## 8. Traceability Matrix (Use In PRs)
Keep this mapping in PR description (or add temporarily to this file for major work):

| Requirement | Core files | Preset files | Adapter files | Tests/Verification |
|---|---|---|---|---|
| REQ-XXX | `...` | `...` | `...` | `...` |

## 9. Open Decisions
- DEC-001: Should v0.1 Select stay native only?
  - Status: Open
  - Lean: Yes
- DEC-002: Should value controls standardize on `onValueChange` at core boundaries?
  - Status: Open
  - Lean: Yes
- DEC-003: Preset naming after v1 (`firstEdition` keep or version by era)?
  - Status: Open
  - Lean: Keep for v0.x
- DEC-004: Vue adapter event API should be React-parity only or dual (Vue emits + parity callbacks)?
  - Status: Resolved (see Decision Log)
  - Lean: Dual support
- DEC-005: Where should adapter-shared non-rendering logic live?
  - Status: Resolved (see Decision Log)
  - Lean: Extend `@marwes-ui/core`

## 10. Decision Log
Use this format when resolving an open decision:

```md
### DEC-00X - <title>
- Date: YYYY-MM-DD
- Decision:
- Rationale:
- Impacted docs/files:
```

## 11. Constraints
- Browser support: modern evergreen browsers
- Accessibility baseline: WCAG 2.1 AA
- Core runtime dependencies: zero
- Styling contract: static CSS + CSS variables

## 12. Component Requirements

### REQ-VUE-001: Vue Adapter Package (`@marwes-ui/vue`)
- **Problem**: Marwes core and presets are framework-agnostic, but only a React adapter exists, which blocks Vue users from consuming the same components and behaviors.
- **Scope**:
  - Add a new `@marwes-ui/vue` package under `packages/`
  - Implement a Vue provider/composables layer equivalent to React (`MarwesProvider`, `useSystem`, `useTheme`)
  - Implement Vue components for the current React export surface (atoms + molecules + semantic variants)
  - Keep core recipes/a11y as the source of truth (no duplicated a11y logic in Vue)
  - Support Vue-idiomatic events/model binding while preserving parity callback props where practical
- **Non-goals**:
  - Rewriting `@marwes-ui/core` recipes around Vue-specific types
  - Replacing `@marwes-ui/react` or changing its public API semantics
  - Introducing a runtime styling system or Vue-only preset CSS
- **Acceptance criteria**:
  - [ ] `packages/vue` builds as `@marwes-ui/vue` with ESM + types and publishes from `dist/`
  - [ ] Vue provider/composables use `createSystem`/`switchMode` from core and support light/dark mode
  - [ ] Vue adapter exports the same component set currently exported by `@marwes-ui/react` for in-scope components
  - [ ] Vue adapter renders core RenderKit outputs (className, vars, typed a11y) without re-implementing core a11y logic
  - [ ] Vue adapter supports idiomatic Vue event usage (`emits` / `v-model` where applicable) and parity callbacks (`onValueChange`, `onCheckedChange`)
  - [ ] React adapter behavior remains unchanged for existing stories/manual checks
- **Validation**:
  - Unit: TypeScript typecheck passes for `packages/vue`
  - Integration/manual: Verify representative components in Vue Storybook (button, input, checkbox, divider, field)
- **Files expected to change**:
  - New package: `packages/vue/*`
  - Root config: `tsconfig.base.json`, `package.json` scripts if needed
  - Shared logic: `packages/core/src/*` (adapter-independent helpers only)
  - Docs/changelog: package README/CHANGELOG and root docs as needed

### REQ-VUE-002: Vue Storybook Parity (`apps/storybook-vue`)
- **Problem**: There is no Vue Storybook to validate and demonstrate the Vue adapter with the same preset/theme behavior used in React Storybook.
- **Scope**:
  - Add `apps/storybook-vue` using `@storybook/vue3-vite`
  - Mirror local workspace aliasing used in React Storybook for `@marwes-ui/core`, `@marwes-ui/presets`, and adapter package source files
  - Add a Vue preview decorator that wraps stories in `MarwesProvider` and supports theme mode toolbar switching
  - Create a representative initial story set, then expand toward parity with React Storybook
- **Non-goals**:
  - Exact 1:1 file duplication of every React story before the app is functional
  - Replacing React Storybook as the primary reference during migration
- **Acceptance criteria**:
  - [ ] `apps/storybook-vue` runs locally and renders Vue adapter components using `firstEdition` preset CSS
  - [ ] Theme toolbar switches between light and dark mode using Vue `MarwesProvider`
  - [ ] Vue Storybook includes smoke stories for representative atoms/molecules
  - [ ] Storybook local aliases resolve package source code (not only published `dist`)
  - [ ] Custom RenderKit debug panel is reusable or functionally matched for Vue stories
- **Validation**:
  - Integration/manual: `storybook dev` launches and representative stories render correctly
  - Build: `storybook build` succeeds for Vue Storybook app
- **Files expected to change**:
  - New app: `apps/storybook-vue/*`
  - Shared Storybook helpers/config (if extracted)
  - Root workspace config (if additional scripts/aliases are needed)

### REQ-VUE-003: Shared Adapter/Story Logic Extraction (Duplication Reduction)
- **Problem**: Copying React adapter and stories directly into Vue will create maintenance-heavy duplication for logic that is framework-independent.
- **Scope**:
  - Extract adapter-independent derivation logic into `@marwes-ui/core` (e.g., id suffix naming, `aria-describedby` merging, field state derivation, data-only semantic variant prop composition)
  - Extract reusable Storybook fixtures/config data where framework-neutral (args, argTypes, common parameters, icon option lists)
  - Keep rendering, framework lifecycle hooks, and framework-specific story render functions in adapter/app layers
- **Non-goals**:
  - Creating a generic cross-framework rendering abstraction
  - Moving React/Vue component rendering into core
- **Acceptance criteria**:
  - [ ] New shared helpers in core are framework-agnostic and contain no React/Vue imports
  - [ ] React and Vue adapters both consume shared helpers for at least one molecule/variant flow
  - [ ] Shared Storybook fixture/config extraction reduces repeated args/argTypes definitions for equivalent stories
  - [ ] Shared extraction does not change visual output or a11y behavior of React stories
- **Validation**:
  - Unit/type: Shared helpers typecheck in core and adapter consumers typecheck
  - Integration/manual: React and Vue story parity check for at least one shared fixture-backed component
- **Files expected to change**:
  - `packages/core/src/*` (new helper modules + exports)
  - `packages/react/src/*` (consuming helpers)
  - `packages/vue/src/*` (consuming helpers)
  - `apps/storybook-react/src/*` and `apps/storybook-vue/src/*` (shared story fixtures if extracted)

### REQ-DIV-001: Divider Component
- **Figma reference**: node-id=1-932
- **Problem**: Need a semantic separator component for visually dividing content sections
- **Scope**: 
  - Horizontal and vertical orientation support
  - 7 size variants matching Figma spec (1px, 8px, 16px, 32px, 48px, 64px, 80px)
  - Semantic HTML using `<hr>` element
  - Built-in spacing based on divider size
  - Light and dark mode support via theme colors
- **Non-goals**:
  - Text-embedded dividers ("or" dividers) in v0.1
  - Custom colors beyond theme tokens in v0.1
  - Animated dividers
- **Acceptance criteria**:
  - [x] Core recipe produces RenderKit with correct className, vars, and a11y props
  - [x] Size API uses semantic names (xxs, xs, sm, md, lg, xl, xxl) mapped to pixel values
  - [x] Orientation prop supports "horizontal" (default) and "vertical"
  - [x] Generates aria-orientation attribute based on orientation
  - [x] Uses theme.color.border for divider color
  - [x] Preset CSS implements all 7 size variants with correct dimensions
  - [x] React adapter applies RenderKit to semantic `<hr>` element
  - [x] Storybook story demonstrates all sizes and both orientations
- **Validation**:
  - Unit: TypeScript typecheck passes, build completes
  - Integration/manual: Visual verification in Storybook against Figma designs
- **Files expected to change**:
  - Core: `packages/core/src/components/atoms/divider/` (types, recipe, index)
  - Core exports: `packages/core/src/components/atoms/index.ts`
  - Preset: `packages/presets/src/firstEdition/divider.css`
  - Preset imports: `packages/presets/src/firstEdition/styles.css`
  - React: `packages/react/src/components/divider.tsx`
  - React exports: `packages/react/src/index.ts`
  - Stories: `apps/storybook-react/src/stories/divider.stories.tsx`

**Design decisions**:
- Size mapping: xxs=1px, xs=8px, sm=16px, md=32px, lg=48px, xl=64px, xxl=80px
- Spacing: Built-in via CSS based on size (larger dividers = more surrounding space)
- Element: `<hr>` for semantic meaning and native accessibility
- Orientation: Explicit prop for better API clarity and accessibility

### DEC-004 - Vue adapter event API supports parity callbacks and Vue emits
- Date: 2026-02-23
- Decision:
  - `@marwes-ui/vue` will support Vue-idiomatic emits / `v-model` style usage for value controls while also accepting parity callback props such as `onValueChange` and `onCheckedChange`.
- Rationale:
  - This preserves cross-framework API familiarity for Marwes docs/examples and internal conventions while giving Vue users ergonomic integration with standard Vue patterns.
- Impacted docs/files:
  - `SPEC.md`
  - `packages/vue/*`
  - Vue Storybook examples/docs

### DEC-005 - Adapter-independent helper extraction extends core
- Date: 2026-02-23
- Decision:
  - Adapter-shared non-rendering logic will be added to `@marwes-ui/core` rather than creating a separate internal `adapter-shared` package.
- Rationale:
  - The logic is framework-agnostic and belongs close to RenderKit/a11y contracts. This avoids a fourth architectural layer and keeps shared behavior discoverable.
- Impacted docs/files:
  - `SPEC.md`
  - `packages/core/src/*`
  - `packages/react/src/*`
  - `packages/vue/src/*`
