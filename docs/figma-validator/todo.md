# Figma Validator Implementation Checklist

## Context For The Next Session

The validator is a local-only design parity tool. It intentionally does not call the Figma API because request budget should stay with the existing sync/fetcher flow.

Current fetcher config:

```text
.pi/figma-sync.json
```

Current local Figma target:

```text
.figma/marwes
```

Current validator entry point:

```text
scripts/figma-validator.mjs
```

Current validator commands:

```bash
pnpm colors:check
pnpm figma:validate -- --family checkbox
pnpm figma:validate -- --all
pnpm figma:validate -- --family checkbox --json
```

Current known state:

- `pnpm colors:check` passes.
- `pnpm figma:validate -- --family checkbox` passes fetch freshness, Figma references, and framework surfaces.
- `pnpm figma:validate -- --family checkbox` exits non-zero because Figma token parity is blocked by the missing variable map artifact.
- The validator already contains the code path that will read `.figma/marwes/tokens/variables.json`, traverse raw Figma `boundVariables`, resolve `VariableID:*` values, and compare resolved token names to registry `design.figmaTokens`.

The next owner should focus on `figma-sync`, not on moving API access into the validator.

## Phase 1: Local Validator Spine

- [x] Add `pnpm figma:validate`.
- [x] Add `pnpm colors:check`.
- [x] Read `.pi/figma-sync.json` instead of hardcoding `.figma/marwes`.
- [x] Support `--family <family>`.
- [x] Support `--all`.
- [x] Support `--json`.
- [x] Validate local Figma freshness.
- [x] Validate registry Figma reference files.
- [x] Validate core, presets, React, Vue, and Svelte family surfaces.
- [x] Report missing `.figma/marwes/tokens/variables.json` as blocked.

## Phase 2: Preset Token Cleanup

- [x] Replace or expose `--mw-color-text-link`.
- [x] Replace or expose `--mw-color-page`.
- [x] Replace or expose `--mw-color-icon-muted`.
- [x] Replace or expose `--mw-color-surface-muted`.
- [x] Replace or expose `--mw-color-accent`.
- [x] Replace or expose `--mw-color-on-primary`.
- [x] Replace or expose `--mw-color-primary-subtle`.
- [x] Replace or expose `--mw-color-toast-warning-border`.
- [x] Replace or expose `--mw-color-toast-info-border`.
- [x] Make `pnpm colors:check` pass.

## Phase 3: Figma Sync Variable Map

### Goal

Update the existing Figma sync/fetcher so every sync writes this local artifact:

```text
.figma/marwes/tokens/variables.json
```

This artifact must let the validator answer one question without calling Figma:

```text
For this raw node bound variable ID, what Figma token name/path and mode values does it represent?
```

### Why The Current `.figma` Output Is Not Enough

The raw file already has node bindings:

```text
.figma/marwes/_raw/VTv3dNTvt7R5EytQF47XbB_full.json
```

Example binding shape:

```json
{
  "boundVariables": {
    "fills": [
      {
        "type": "VARIABLE_ALIAS",
        "id": "VariableID:1358:5083"
      }
    ]
  }
}
```

But the current generated token file is grouped by hex:

```text
.figma/marwes/tokens/colors.json
```

That is not enough. Multiple semantic tokens can share a hex value, so hex matching can produce false confidence. The validator needs Figma variable identity, not just resolved color values.

### Required Artifact Contract

Minimum useful shape:

```json
{
  "fileKey": "VTv3dNTvt7R5EytQF47XbB",
  "syncedAt": "2026-05-14T18:09:00.000Z",
  "collections": [
    {
      "id": "VariableCollectionId:...",
      "name": "Marwes colors",
      "modes": [
        { "id": "1:0", "name": "Light" },
        { "id": "1:1", "name": "Dark" }
      ]
    }
  ],
  "variables": [
    {
      "id": "VariableID:5:917",
      "name": "surface/primary",
      "collectionId": "VariableCollectionId:...",
      "resolvedType": "COLOR",
      "scopes": ["ALL_SCOPES"],
      "valuesByMode": {
        "Light": "#ffffff",
        "Dark": "#0f0f0f"
      }
    }
  ]
}
```

The exact object shape can evolve, but these fields are required by intent:

- raw Figma variable ID, for example `VariableID:5:917`
- stable Figma token name/path, for example `surface/primary`
- collection ID
- collection name when available
- resolved type, especially `COLOR`
- scopes when available
- mode names and values, especially light/dark color values

The current validator accepts either:

- `{ "variables": [{ "id": "...", "name": "..." }] }`
- an object whose values include objects with `id` and `name`

Preferred shape is the first one.

### Where The Validator Uses It

In `scripts/figma-validator.mjs`, see:

- `checkFigmaTokenParity`
- `loadVariableMap`
- `collectBoundVariableIdsForNodes`

The flow is:

1. Read `.pi/figma-sync.json`.
2. Resolve `target.liveDir`.
3. Look for `${target.liveDir}/tokens/variables.json`.
4. Load raw Figma JSON from `${target.liveDir}/_raw/*_full.json`.
5. Traverse registry `design.nodeReferences`.
6. Collect nested node `boundVariables`.
7. Resolve each `VariableID:*` through `variables.json`.
8. Compare resolved names against `docs/registry/families/<family>/registry.generated.json -> design.figmaTokens`.

### Implementation Notes For `figma-sync`

- Keep `.pi/figma-sync.json` as the source of truth.
- Do not require validator commands to fetch or refresh Figma.
- Write `variables.json` during the same sync that writes `manifest.json`, `_raw`, and `tokens/colors.json`.
- If Figma API output has aliases, preserve both the raw variable ID and enough resolved value data to debug alias chains later.
- Normalize color values to lowercase hex where possible, but do not lose the original value if Figma returns a different shape.
- Include all variables, not only color variables, if the fetcher can do that cheaply. The validator can filter by `resolvedType`.
- Avoid deriving token names from node names or hex groups. Use Figma variable names from the variables endpoint/export data.

### Verification Commands After Updating `figma-sync`

After running the existing sync/fetcher and producing `.figma/marwes/tokens/variables.json`:

```bash
pnpm colors:check
pnpm figma:validate -- --family checkbox
pnpm figma:validate -- --family checkbox --json
```

Expected result after the artifact exists:

- `pnpm colors:check` should still pass.
- `pnpm figma:validate -- --family checkbox` should no longer show `[block] Figma token parity`.
- Figma token parity should become either:
  - `[pass]` if registry `design.figmaTokens` already matches real Figma usage.
  - `[fail]` if the validator can now see actual drift.

If it fails, do not hide the failure by weakening the validator. Use the output to decide whether the registry token list, component CSS mapping, or Figma component binding is wrong.

- [ ] Update the Figma sync/fetcher to write `.figma/marwes/tokens/variables.json`.
- [ ] Preserve raw `VariableID:*` values.
- [ ] Include token name/path, collection ID, resolved type, scopes, and mode values.
- [ ] Confirm the validator can parse the artifact shape without changing API/network behavior.
- [ ] Run `pnpm figma:validate -- --family checkbox` and confirm token parity moves from `[block]` to `[pass]` or `[fail]`.

## Phase 4: Token Parity Hardening

Do this after Phase 3. This phase is about making the validator report more useful after it can resolve real Figma variable names.

- [ ] Compare raw Figma token usage against registry `design.figmaTokens`.
- [ ] Add documented overrides for intentional abstraction cases.
- [ ] Report expected, actual, and source node references for mismatches.
- [ ] Add a focused fixture or sample artifact for variable-map parsing.

## Phase 5: Broader Family Coverage

- [ ] Run `pnpm figma:validate -- --all`.
- [ ] Fix missing Figma references in registry families.
- [ ] Decide how generated registry should represent Svelte paths.
- [ ] Decide whether `figma:validate` should become part of `pnpm check:repo-map`.

## Phase 6: Rendered Parity

- [ ] Choose the source of rendered package output for React, Vue, and Svelte.
- [ ] Choose the source of Figma screenshots from the local `.figma` output.
- [ ] Add a visual comparison mode after token parity is deterministic.
- [ ] Keep rendered parity separate from the first deterministic validator gate until noise is understood.
