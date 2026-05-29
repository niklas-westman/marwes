# Design Governance

Marwes design governance is the local workflow that keeps design, registry, and
runtime implementation in sync.

```text
Figma truth -> registry contract -> runtime result
```

Figma is the source of truth. The repo then proves that truth in two places:

- the registry contract under `docs/registry/families`
- the runtime implementation in core theme tokens and firstEdition preset CSS

## Package

The workflow lives in the private workspace package:

```text
packages/design-governance
```

Use the root aliases for day-to-day work:

```bash
pnpm design:sync
pnpm design:validate -- --family badge
pnpm design:validate:runtime -- --family badge
pnpm design:check
```

## Refresh Workflow

For the recurring Marwes Figma refresh:

1. Copy or refresh the Marwes Figma file.
2. Update `.pi/figma-sync.json` to the copied file key.
3. Run raw sync:

```bash
pnpm design:sync -- --mode cache --skip-variables
```

Use `--mode remote` only when a live Figma fetch is intended.

4. Start the variable receiver:

```bash
pnpm figma:variables:sync -- --accept-any-file --no-refresh
```

5. In Figma Desktop, run:

```text
Plugins > Development > Marwes Variables Bridge
```

Import the plugin from:

```text
packages/design-governance/figma-plugin/manifest.json
```

6. Validate the touched family:

```bash
pnpm design:validate -- --family badge
```

7. Before pushing, run:

```bash
pnpm design:check
```

## Validation Layers

`design:validate` checks:

- local Figma cache freshness
- Figma file references from the registry
- bound Figma token parity
- runtime token parity
- framework surface paths

Runtime token parity catches cases where Figma and the registry agree, but the
implementation still uses the wrong Marwes CSS variable.

Example:

```text
Figma token: status-display/border
Alias: status/success/border
Expected CSS var: --mw-color-status-success-border
Found CSS var: --mw-color-status-success-border-strong
```

## Git Gate

`pnpm design:check` is part of the pre-push gate. If it reports missing
`.figma/marwes` artifacts or a missing `variables.json`, refresh with:

```bash
pnpm design:sync
```

Do not silence failures by weakening the validator. Decide whether Figma,
registry metadata, or runtime code is wrong, then fix that layer.
