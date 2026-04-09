# Introduce a New Component

This page is the practical, reusable part of `UPGRADE.md`: how Marwes is structured, what order to work in, and exactly where each file should go when you introduce a new component.

## The Marwes Rule

Every component must follow the same architecture:

```text
core recipe -> RenderKit -> framework adapters
```

That means:

1. **Core first** in `packages/core`
   - Pure TypeScript
   - No React, no Vue, no DOM
   - Owns types, accessibility logic, and recipe output
2. **Preset CSS second** in `packages/presets`
   - Static CSS only
   - Targets stable Marwes classes and `data-component` selectors
3. **Adapters third** in `packages/react` and `packages/vue`
   - Thin wrappers around the core recipe
   - No business logic that belongs in core
4. **Stories and docs last** in both Storybook apps
   - `Introduction.mdx`
   - atom/molecule/purpose stories
   - taxonomy and docs tests

Do not skip layers, and do not move framework logic into `@marwes-ui/core`.

---

## Required Order of Work

When adding a new component, work in this order:

1. `packages/core/src/components/atoms/<name>/`
2. `packages/presets/src/firstEdition/`
3. `packages/react/src/components/<name>/`
4. `apps/storybook-react/src/stories/<name>/`
5. `packages/vue/src/components/<name>/`
6. `apps/storybook-vue/src/stories/<name>/`
7. package exports
8. tests
9. changeset if the component is intended to ship

---

## File Placement Map

## 1) Core

Create the component folder here:

```text
packages/core/src/components/atoms/<name>/
```

Minimum files:

```text
packages/core/src/components/atoms/<name>/
├── <name>-types.ts
├── <name>-a11y.ts
├── <name>-recipe.ts
└── index.ts
```

Add `<name>-styles.ts` when the component needs style/state mapping in core.

Typical full version:

```text
packages/core/src/components/atoms/<name>/
├── <name>-types.ts
├── <name>-a11y.ts
├── <name>-styles.ts
├── <name>-recipe.ts
├── index.ts
└── __tests__/
    ├── <name>-a11y.test.ts
    ├── <name>-recipe.test.ts
    └── index-exports.test.ts
```

### What belongs in core

- public types and options
- ARIA mapping
- state-to-class/data/vars decisions
- recipe that returns the RenderKit
- shared docs copy when needed for Storybook docs

### What must not be in core

- React hooks
- Vue APIs
- DOM access
- inline styling decisions that belong in preset CSS

---

## 2) Preset CSS

Add the atom CSS here:

```text
packages/presets/src/firstEdition/<name>.css
```

If the component introduces a molecule, place that CSS here:

```text
packages/presets/src/firstEdition/molecules/<molecule-name>.css
```

Examples from the repo:

- `packages/presets/src/firstEdition/switch.css`
- `packages/presets/src/firstEdition/molecules/switch-field.css`
- `packages/presets/src/firstEdition/molecules/tab-group.css`
- `packages/presets/src/firstEdition/molecules/toast-container.css`

After adding CSS files, import them in:

```text
packages/presets/src/firstEdition/styles.css
```

Use the existing selector strategy:

- `.mw-<name>` class names
- `[data-component="<name>"]`
- `data-variant`, `data-action`, and other stable data attributes when needed
- CSS custom properties from the theme, never hardcoded design tokens in adapters

---

## 3) React adapter

Create the React component folder here:

```text
packages/react/src/components/<name>/
```

Typical structure:

```text
packages/react/src/components/<name>/
├── <name>.tsx
├── index.ts
├── variants.tsx                 # optional, for purpose components
├── <molecule-name>.tsx          # optional, e.g. switch-field.tsx
└── __tests__/
    ├── <name>.test.tsx
    ├── variants.test.tsx
    └── <molecule-name>.test.tsx
```

### React rules

- Call the core recipe
- Spread the RenderKit onto the native element
- Keep the adapter thin
- Do not duplicate a11y logic already solved in core
- Use `kit.vars` for CSS variables when needed

---

## 4) React Storybook docs and stories

Create the story folder here:

```text
apps/storybook-react/src/stories/<name>/
```

Typical structure:

```text
apps/storybook-react/src/stories/<name>/
├── Introduction.mdx
├── <name>.stories.tsx
├── <molecule-name>.stories.tsx          # optional
├── <purpose-variant>.stories.tsx        # optional
└── __tests__/
    ├── <name>-taxonomy.test.ts
    └── <name>-introduction-docs.test.ts
```

### Story title conventions

Follow the taxonomy used across the repo:

- `"<Name>/Introduction"`
- `"<Name>/Atom"`
- `"<Name>/Molecule"`
- `"<Name>/Purpose/<VariantName>"`

Examples:

- `"Switch/Atom"`
- `"Switch/Molecule"`
- `"Switch/Purpose/FeatureToggle"`
- `"Tab/Purpose/NavigationTabs"`

### What `Introduction.mdx` should cover

At minimum:

- what the atom is
- whether there is a molecule wrapper
- whether there are purpose components
- when to use each layer
- component reference section
- examples for common usage

If the component has purpose variants, the docs often read copy from:

```text
packages/core/src/storybook/docs-copy.ts
```

Add entries there when needed, for example:

- `<name>WhyPurposeComponents`
- `<name>PurposeComponentReference`

---

## 5) Vue adapter

Mirror the React component structure in:

```text
packages/vue/src/components/<name>/
```

Typical structure:

```text
packages/vue/src/components/<name>/
├── <name>.ts
├── index.ts
├── variants.ts
├── <molecule-name>.ts
└── __tests__/
    ├── <name>.test.ts
    ├── variants.test.ts
    └── <molecule-name>.test.ts
```

The Vue API surface should match React as closely as possible.

---

## 6) Vue Storybook docs and stories

Mirror the React story structure in:

```text
apps/storybook-vue/src/stories/<name>/
```

Typical structure:

```text
apps/storybook-vue/src/stories/<name>/
├── Introduction.mdx
├── <name>.stories.ts
├── <molecule-name>.stories.ts
├── <purpose-variant>.stories.ts
└── __tests__/
    ├── <name>-taxonomy.test.ts
    └── <name>-introduction-docs.test.ts
```

React and Vue should have the same story coverage.

---

## 7) Package exports you must update

After creating the files, update exports so the component is public.

### Core exports

Update:

```text
packages/core/src/components/atoms/<name>/index.ts
packages/core/src/components/atoms/index.ts
packages/core/src/index.ts
```

### React exports

Update:

```text
packages/react/src/components/<name>/index.ts
packages/react/src/index.ts
```

### Vue exports

Update:

```text
packages/vue/src/components/<name>/index.ts
packages/vue/src/index.ts
```

### Preset CSS imports

Update:

```text
packages/presets/src/firstEdition/styles.css
```

---

## Common patterns by component level

## Atom-only component

Use this when the component only needs the raw building block.

```text
packages/core/src/components/atoms/<name>/
packages/presets/src/firstEdition/<name>.css
packages/react/src/components/<name>/
packages/vue/src/components/<name>/
apps/storybook-react/src/stories/<name>/
apps/storybook-vue/src/stories/<name>/
```

Examples in the repo:

- `divider`
- `heading`
- `paragraph`
- `icon`

## Atom + Molecule

Use this when the atom needs a reusable composed wrapper.

Extra files usually look like:

```text
packages/react/src/components/<name>/<name>-field.tsx
packages/vue/src/components/<name>/<name>-field.ts
packages/presets/src/firstEdition/molecules/<name>-field.css
apps/storybook-react/src/stories/<name>/<name>-field.stories.tsx
apps/storybook-vue/src/stories/<name>/<name>-field.stories.ts
```

Examples in the repo:

- `switch-field`
- `accordion-field`
- `radio-group-field`
- `checkbox-field`

## Atom + Molecule + Purpose variants

Use this when Marwes should provide semantic, use-case-specific wrappers.

Extra files usually look like:

```text
packages/react/src/components/<name>/variants.tsx
packages/vue/src/components/<name>/variants.ts
apps/storybook-react/src/stories/<name>/<purpose-variant>.stories.tsx
apps/storybook-vue/src/stories/<name>/<purpose-variant>.stories.ts
```

If the Introduction page explains why these purpose components exist, also update:

```text
packages/core/src/storybook/docs-copy.ts
```

Examples in the repo:

- `card` -> `ProductCard`, `ProfileCard`, `StatCard`
- `switch` -> `FeatureToggle`, `PreferenceSwitch`, `PermissionSwitch`
- `tab` -> `NavigationTabs`, `ContentTabs`, `SettingsTabs`
- `toast` -> `SuccessToast`, `ErrorToast`, `WarningToast`, `InfoToast`

---

## Recommended file tree for a full component

If a component has an atom, a molecule, purpose variants, docs, and tests, the final structure will usually look like this:

```text
packages/core/src/components/atoms/<name>/
├── <name>-types.ts
├── <name>-a11y.ts
├── <name>-styles.ts
├── <name>-recipe.ts
├── index.ts
└── __tests__/

packages/presets/src/firstEdition/
├── <name>.css
└── molecules/
    └── <molecule-name>.css

packages/react/src/components/<name>/
├── <name>.tsx
├── <molecule-name>.tsx
├── variants.tsx
├── index.ts
└── __tests__/

packages/vue/src/components/<name>/
├── <name>.ts
├── <molecule-name>.ts
├── variants.ts
├── index.ts
└── __tests__/

apps/storybook-react/src/stories/<name>/
├── Introduction.mdx
├── <name>.stories.tsx
├── <molecule-name>.stories.tsx
├── <purpose-variant-a>.stories.tsx
├── <purpose-variant-b>.stories.tsx
└── __tests__/

apps/storybook-vue/src/stories/<name>/
├── Introduction.mdx
├── <name>.stories.ts
├── <molecule-name>.stories.ts
├── <purpose-variant-a>.stories.ts
├── <purpose-variant-b>.stories.ts
└── __tests__/
```

---

## Definition of done for a new component

A component is not done when only the atom renders.

It is done when all required layers are complete:

- [ ] core types, a11y, recipe, and tests exist
- [ ] preset CSS exists and is imported in `styles.css`
- [ ] React adapter exists
- [ ] Vue adapter exists
- [ ] React stories exist
- [ ] Vue stories exist
- [ ] `Introduction.mdx` exists in both Storybooks
- [ ] taxonomy tests exist in both Storybooks
- [ ] introduction docs tests exist in both Storybooks
- [ ] exports are wired from package indexes
- [ ] purpose docs copy is added in `packages/core/src/storybook/docs-copy.ts` when needed
- [ ] a changeset is added if this should ship

---

## Validation commands

Run these before considering the component complete:

```bash
pnpm typecheck
pnpm test
pnpm lint
```

Useful package-level commands:

```bash
pnpm dev:packages
pnpm dev:storybook:react
pnpm dev:storybook:vue
pnpm changeset
```

---

## Short checklist

```text
[ ] Add core files in packages/core/src/components/atoms/<name>/
[ ] Add CSS in packages/presets/src/firstEdition/<name>.css
[ ] Import CSS in packages/presets/src/firstEdition/styles.css
[ ] Add React adapter in packages/react/src/components/<name>/
[ ] Add React stories in apps/storybook-react/src/stories/<name>/
[ ] Add Vue adapter in packages/vue/src/components/<name>/
[ ] Add Vue stories in apps/storybook-vue/src/stories/<name>/
[ ] Add docs-copy entries in packages/core/src/storybook/docs-copy.ts if purpose docs are needed
[ ] Update package exports
[ ] Add tests
[ ] Run pnpm typecheck && pnpm test && pnpm lint
[ ] Add changeset if shipping
```
