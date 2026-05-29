# Marwes Design Governance

Private repo tooling for keeping Marwes aligned with Figma.

```text
Figma truth -> registry contract -> runtime result
```

Figma is the source of truth. This package owns the local sync and validation
loop that proves the generated `.figma` artifacts, registry metadata, theme
tokens, preset CSS, and framework surfaces still agree.

## Commands

Sync the current configured Figma target:

```bash
pnpm --filter @marwes-ui/design-governance sync -- --mode cache
```

Use `--mode remote` only when the local cache is missing or stale and a live
Figma fetch is intended.

Validate one family:

```bash
pnpm --filter @marwes-ui/design-governance validate -- --family badge
```

Validate runtime token parity only:

```bash
pnpm --filter @marwes-ui/design-governance validate-runtime -- --family badge
```

Validate every registry family:

```bash
pnpm --filter @marwes-ui/design-governance validate -- --all
```

Root aliases are available for normal use:

```bash
pnpm design:sync
pnpm design:validate -- --family badge
pnpm design:validate:runtime -- --family badge
pnpm design:suggest-tokens card
pnpm design:check
```

## Figma Plugin

Import the bridge plugin from:

```text
packages/design-governance/figma-plugin/manifest.json
```

Run it in Figma Desktop with:

```text
Plugins > Development > Marwes Variables Bridge
```

The plugin exports local variables plus document-bound variables that are not
returned by Figma's local variable export.

## Validation Layers

- **Fetch freshness**: confirms `.figma/marwes` has the required local artifacts.
- **Figma references**: checks registry Figma files still exist in the current export.
- **Figma token parity**: compares registry `figmaTokens` with bound Figma variable names.
- **Runtime token parity**: follows Figma token aliases to expected Marwes CSS vars and checks preset CSS/theme exposure.
- **Framework surfaces**: checks core, preset, React, Vue, and Svelte surface files exist.

## Failure Meaning

- Missing Figma files usually means the registry contract points at stale node exports.
- Missing Figma tokens usually means the registry token list is stale or Figma bindings changed.
- Runtime token parity failures mean the registry and Figma agree, but the shipped theme/preset runtime uses the wrong CSS token.

Do not weaken validators to make drift disappear. Fix the layer that is no
longer aligned with Figma truth.

## Suggest Tokens

Discover which Figma variables are bound to a family's nodes:

```bash
pnpm design:suggest-tokens card
```

Outputs all color-relevant tokens with markers:
- `✓` already declared in `figmaTokens`
- `+` bound in Figma but not declared
- `✗` declared but not bound (stale)

## Verbose Mode

Pass `--verbose` to see which alias→CSS-var mappings are unsupported:

```bash
pnpm design:validate:runtime -- --family badge --verbose
```
