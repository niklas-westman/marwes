# AI Metadata Protocol

Marwes treats semantic metadata as a product contract, not just a helpful convention.

This document defines the canonical semantic protocol for covered component families.

## Protocol goal

The semantic layer should be:
- source-owned in `@marwes-ui/core`
- emitted consistently by React and Vue adapters
- testable through shared contracts
- documented in one canonical place

## Ownership model

### Core owns
- canonical attribute vocabulary
- per-family semantic definitions
- purpose definitions
- helper builders and public semantic types

### Adapters own
- DOM emission of resolved semantic attributes
- framework-specific prop plumbing

### Storybook and docs own
- examples and explanation only
- they must not invent semantics independently from the core registry

## Canonical attribute set

### Base protocol attributes

| Attribute | Meaning | Notes |
|---|---|---|
| `data-component` | stable component family identity | canonical for covered families |
| `data-variant` | visual or structural variant | emitted when the family defines variants |
| `data-action` | actionable control intent | currently most important for button family |
| `data-purpose` | higher-level semantic usage intent | primary purpose-wrapper marker |
| `data-intent` | message or workflow intent | important for toast and dialog |
| `data-outcome` | expected result polarity | currently used for positive button outcomes |
| `data-destructive` | destructive risk marker | boolean string |
| `data-confirmation-required` | explicit confirmation marker | boolean string |
| `data-size` | size token | family-specific size surface |
| `data-orientation` | orientation token | used only where relevant |

### Registry-first attributes

These are part of the semantic registry, but do not need to be emitted everywhere immediately:

| Attribute | Meaning |
|---|---|
| `data-layer` | architectural layer: `atom`, `molecule`, or `purpose` |
| `data-context` | narrow contextual qualifier for a semantic surface |

## Family-local attributes

The following can remain local implementation details unless promoted later:
- `data-error`
- `data-disabled`
- `data-open`
- `data-type`
- `data-footer`
- `data-dismissible`

These are useful, but they are not part of the first canonical cross-family protocol.

## Wave 1 covered families

Track C currently defines canonical semantics for these families:
- `button`
- `badge`
- `avatar`
- `toast`
- `dialog`

## Wave 1 purpose vocabulary

### Button
- `destructive`
- `create`
- `submit`
- `cancel`
- `navigation`
- `save`
- `confirm`
- `verify`
- `edit`
- `close`
- `refresh`
- `upload`
- `download`
- `copy`
- `search`
- `filter`
- `sort`
- `dropdown`
- `success`

### Badge
- `status`
- `priority`
- `notification`

### Avatar
- `profile`
- `presence`
- `team`

### Toast
- `success-toast`
- `error-toast`
- `warning-toast`
- `info-toast`

### Dialog
- `confirm-dialog`
- `destructive-dialog`
- `info-dialog`

## Practical examples

### Button family
- base button emits `data-component="button"`
- purpose wrappers emit canonical combinations of:
  - `data-purpose`
  - `data-action`
  - `data-outcome`
  - `data-destructive`
  - `data-confirmation-required`

### Toast family
- base toast emits `data-component="toast"`
- purpose toasts emit:
  - `data-purpose`
  - `data-intent`

### Dialog family
- base dialog emits `data-component="dialog"`
- purpose dialogs emit:
  - `data-purpose`
  - `data-intent`
  - destructive markers where applicable

## Generated trust artifacts

Track D generates machine-readable artifacts at the repo root:
- `artifacts/component-manifest.json`
- `artifacts/purpose-registry.json`
- `artifacts/framework-parity.json`
- `artifacts/design-provenance.json`

Use them for:
- AI agent ingestion
- parity auditing
- docs verification
- design-to-runtime traceability

## Source anchors

Current source registry lives in:
- `packages/core/src/semantics/semantic-types.ts`
- `packages/core/src/semantics/semantic-attributes.ts`
- `packages/core/src/semantics/family-semantics.ts`
- `packages/core/src/semantics/purpose-semantics.ts`
- `packages/core/src/semantics/semantic-builders.ts`

## Testing expectations

For covered families, React and Vue should agree on:
- `data-component`
- `data-purpose`
- `data-action` where applicable
- `data-intent` where applicable
- `data-outcome` where applicable
- destructive and confirmation markers where applicable

See also:
- [Architecture](./architecture.md)
- [Specification](./spec.md)
- [Testing](./testing.md)
