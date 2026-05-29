# Figma Validator

> Superseded by `@marwes-ui/design-governance`.
>
> Active usage now lives in `packages/design-governance` and
> [Design Governance](../design-governance.md). The old `pnpm figma:validate`
> command remains as a compatibility alias, but new work should use
> `pnpm design:validate` or
> `pnpm --filter @marwes-ui/design-governance validate`.

## Purpose

The Figma validator is the local design-parity gate for Marwes component families.

It validates code against the latest synced `.figma` folder. It does not call the Figma API by default, because the API request budget belongs to the existing sync/fetcher flow.

```text
.pi/figma-sync.json + figma-node-fetch
        |
        v
.figma/marwes/*
        |
        v
pnpm design:validate
        |
        +-- fetch freshness
        +-- Figma references
        +-- Figma token parity
        +-- runtime token parity
        +-- framework surfaces
```

## Fetcher vs Validator

Fetcher responsibility:

- Read `.pi/figma-sync.json`.
- Talk to Figma.
- Update `.figma/marwes`.
- Archive generated sync output.
- Eventually write `.figma/marwes/tokens/variables.json`.

Validator responsibility:

- Read `.pi/figma-sync.json` to locate the selected local target.
- Read `.figma/marwes` artifacts.
- Read registry family metadata.
- Read package and preset files.
- Report drift between Figma, registry, presets, and framework package surfaces.
- Avoid direct Figma API calls by default.

## Commands

Validate one family:

```bash
pnpm design:validate -- --family checkbox
```

Validate every registry family:

```bash
pnpm design:check
```

Emit JSON for tooling or CI:

```bash
pnpm design:validate -- --family checkbox --json
```

Check Marwes color exposure and preset CSS variable usage:

```bash
pnpm colors:check
```

Emit JSON for the color check:

```bash
pnpm colors:check -- --json
```

## Current Check Layers

### Fetch Freshness

Confirms the selected local target exists and has the required generated files:

- `.figma/marwes/manifest.json`
- `.figma/marwes/components/_index.json`
- `.figma/marwes/tokens/colors.json`

This proves the validator is reading the expected local Figma cache.

### Figma References

Reads each selected family registry from `docs/registry/families/<family>/registry.generated.json` and checks that the referenced Figma files exist:

- `design.componentJsons`
- `design.pageReferences`
- `design.curatedReferences`
- `design.nodeReferences`

### Figma Token Parity

This layer reads:

```text
.figma/marwes/tokens/variables.json
```

The raw Figma dump contains `VariableID:*` bindings. The variable artifact maps
each variable ID to a stable Figma token name and mode values.

When that artifact exists, the validator is wired to:

1. Read the variable map.
2. Traverse raw node `boundVariables`.
3. Resolve each `VariableID:*` to a Figma token name.
4. Compare actual Figma token usage against registry `design.figmaTokens`.

The current `.figma/marwes/tokens/colors.json` is not enough for this layer because it is grouped by resolved hex values. Hex-based parity is unsafe when different semantic tokens intentionally share the same value.

### Runtime Token Parity

Runtime token parity is owned by `@marwes-ui/design-governance`.

It follows Figma token aliases from `.figma/marwes/tokens/variables.json` to the
expected Marwes CSS custom properties, then checks the selected family preset CSS
and theme token exposure. This catches cases where Figma and the registry agree
but the runtime still uses the wrong CSS variable.

Example:

```text
Figma token: status-display/border
Alias: status/success/border
Expected CSS var: --mw-color-status-success-border
Found CSS var: --mw-color-status-success-border-strong
```

### Framework Surfaces

Checks that each selected family has the expected local package surfaces:

- core files from registry links
- preset files from registry links
- React files from registry links
- Vue files from registry links
- Svelte `packages/svelte/src/lib/components/<family>/index.ts`

This is a surface-existence check. It does not replace package tests or visual checks.

### Color Contract

`pnpm colors:check` validates:

- the generated color contract can resolve its source paths in `docs/marwes-colors.json`
- theme color variables are exposed by the theme implementation
- preset CSS references only known `--mw-color-*` variables

This check is intentionally strict. If it fails, either the preset should use an exposed token or the theme/token contract needs an intentional addition.

## Reading Output

Example:

```text
figma:validate checkbox

Target: marwes
Source: .figma/marwes

Family: checkbox

[pass] Fetch freshness
[pass] Figma references
[block] Figma token parity
       missing: .figma/marwes/tokens/variables.json
       blocked until figma-sync writes VariableID -> token name -> mode values
[pass] Framework surfaces
```

Status meanings:

- `[pass]`: the layer completed successfully
- `[fail]`: the layer found drift that should be fixed
- `[block]`: the layer cannot run because a required upstream artifact is missing

The command exits non-zero for both `[fail]` and `[block]`. This keeps CI honest: blocked parity is not a silent pass.

## Known Current State

At the time this guide was added:

- `pnpm figma:validate -- --family checkbox` passes local freshness, Figma references, and framework surfaces.
- Figma token parity is blocked by the missing `.figma/marwes/tokens/variables.json`.
- `pnpm colors:check` passes after exposing `surface.brand`, `text.link`, and `icon.muted` plus replacing remaining legacy preset aliases.

## Related Docs

- [Figma sync variable map handoff](./figma-sync-variable-map.md)
- [Figma validator implementation checklist](./todo.md)
- [Family validation](../reference/family-validation.md)
- [Figma to Marwes](../guides/figma-to-marwes.md)
