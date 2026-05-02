# Testing

Marwes uses layered testing that mirrors the architecture:

- `core` tests behavior and contracts
- `presets` tests styling-related integration where needed
- `react` and `vue` test adapters against the real core recipes
- Storybook covers documentation, interaction, and visual verification
- the playground is used for manual integration checks

## Testing map

```mermaid
graph TD
  Core[Core tests] --> Confidence[Behavior confidence]
  Presets[Preset verification] --> Confidence
  React[React adapter tests] --> Confidence
  Vue[Vue adapter tests] --> Confidence
  Storybook[Storybook docs and visual checks] --> Confidence
  Playground[Manual playground checks] --> Confidence
```

## What to test at each layer

### Core
Location:
- `packages/core/src/**/__tests__/`

Test:
- recipe output
- accessibility mapping
- theme normalization and CSS variable generation
- shared helpers
- state and variant mapping

Core tests should run in a non-DOM environment when possible.

### Presets
Location:
- package-specific tests when styling logic needs verification

Test:
- emitted class hooks match CSS expectations
- key visual states are represented in stories
- preset imports and distribution work

### React and Vue adapters
Location:
- `packages/react/src/**/__tests__/`
- `packages/vue/src/**/__tests__/`

Test:
- adapters call the real core recipe
- props and events behave correctly
- accessibility wiring reaches the DOM
- controlled and uncontrolled state behavior
- disabled, invalid, focus, and read-only flows

Do not mock the core recipe in adapter tests.

### Storybook
Use Storybook to verify:
- docs structure
- visual state coverage
- interaction behavior
- accessibility checks
- taxonomy consistency across React and Vue story sets

### Playground
Use the playground for:
- integration sanity checks
- debugging provider and theme behavior
- validating realistic compositions

## Commands

### Repo-wide

```bash
pnpm validate:release
pnpm validate:packages
pnpm validate:docs
pnpm validate:security
pnpm check
pnpm typecheck
pnpm lint
pnpm format:all
pnpm test
pnpm build
```

### Focused package tests

```bash
pnpm validate:family button
pnpm validate:family button --storybook
pnpm test:core
pnpm test:presets
pnpm test:react
pnpm test:vue
pnpm test:packages
```

### Typecheck-only test contracts

```bash
pnpm test:typecheck:contracts
pnpm test:typecheck:packages
```

### Storybook and playground

```bash
pnpm dev:storybook:react
pnpm dev:storybook:vue
pnpm dev:playground
pnpm test:storybook:a11y
```

## Recommended workflow

```mermaid
flowchart LR
  Change[Code change] --> Local[Run focused tests]
  Local --> Stories[Verify in Storybook]
  Stories --> Typecheck[Run pnpm typecheck]
  Typecheck --> Repo[Run broader pnpm test or pnpm test:packages]
  Repo --> Build[Run pnpm build for release-level confidence]
```

## What good test coverage looks like

### Core
- every exported recipe has direct unit coverage
- every a11y mapping has meaningful edge-case coverage
- helper functions have deterministic tests

### Adapters
- public props are exercised through rendered output
- event flows are tested through user interaction
- field wrappers verify labelling and described-by wiring
- covered semantic families verify canonical metadata output

### Stories
- atom, molecule, and purpose layers are represented where applicable
- docs pages reflect the actual exported API
- React and Vue stories stay aligned
- semantic claims in docs should match the core semantic registry for covered families

## Accessibility verification

Use [`docs/reference/accessibility.md`](./accessibility.md) as the canonical cross-family support model.
This file explains the test layers. The accessibility support doc explains what those layers can and cannot prove.

Automated:
- story-level accessibility checks for the first Storybook smoke set via `pnpm test:storybook:a11y`
- adapter tests using semantic queries
- shared React/Vue contracts for covered families
- registry-backed family posture references

Manual:
- keyboard navigation
- focus visibility
- screen reader naming and descriptions
- disabled and invalid state behavior
- live-region timing and interruption feel where relevant

Current honest repo-level boundary:
- Storybook accessibility tooling now has a first enforced smoke set, and that smoke set is part of `pnpm check`
- current smoke-set families are Button, Checkbox, Radio, Toast, and Spinner across React and Vue Storybook apps
- the repo is still not fully hard-gated across every story because only promoted smoke-set stories run in this gate today
- higher-risk families still need manual review even when automated checks pass

### Manual-review-heavy components

Some components need stronger manual review even when automated checks pass.

Current high-attention example:
- `RichText` / `RichTextField`

Why:
- they rely on `contentEditable`
- formatting state depends on browser editing behavior
- formatting actions currently use `document.execCommand()` where available
- assistive technology behavior can vary across browser and screen reader combinations

What automation currently proves for rich text:
- accessible naming and description wiring
- disabled and read-only semantics
- toolbar button semantics such as labels and pressed state
- basic value flow and formatting affordances in adapter tests

What still needs manual review for rich text:
- keyboard editing behavior in real browsers
- screen reader announcement quality during editing
- formatting behavior consistency across supported environments
- caret and selection behavior around formatting boundaries

Rule of thumb:
- use automated tests to protect the component contract
- use manual review to validate the real editing experience

## Family validation

Use [`docs/reference/family-validation.md`](./family-validation.md) as the canonical workflow for validating one component family across core, presets, React, Vue, Storybook, registry, and docs.

Default family gate:

```bash
pnpm validate:family <family>
```

Browser-backed Storybook/a11y family gate:

```bash
pnpm validate:family <family> --storybook
```

## Visual verification

Marwes relies on Storybook for visual inspection and Chromatic-style review workflows where available.

When design changes originate in Figma:
1. confirm the node and states
2. update core and presets
3. verify the story output matches the intended design
4. update docs if the public contract changed

## Related docs

- [Documentation index](../README.md)
- [Accessibility support model](./accessibility.md)
- [Family validation](./family-validation.md)
- [Architecture](./architecture.md)
- [Specification](./spec.md)
- [AI Metadata Protocol](./ai-metadata.md)
- [Governance](./governance.md)
- [Adding Components](../guides/adding-components.md)
