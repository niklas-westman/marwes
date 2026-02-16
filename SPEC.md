# Marwes Specification

This file is the canonical specification for Marwes.
If implementation, docs, or behavior diverge from this file, either the implementation is wrong or this spec must be updated explicitly.

## 1. Product Intent
Marwes is a component system that prioritizes:
- Strong defaults
- Small override API
- Consistent accessibility behavior
- Framework-agnostic core logic

## 2. Current Status (2026-02-11)
- Repository version: `0.0.0`
- Delivery phase: v0.1 foundation
- Implemented atoms: Button, Input, Checkbox, Icon, H1, H2, H3, Paragraph
- Implemented molecules: CheckboxField
- In active scope: Select (native), Textarea, FormField, Card, Divider, Spinner

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
- Multi-framework adapters beyond React

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

