# Research: Figma Semantic Color Variable Alignment

## 1. What We Are Solving

Marwes has a canonical semantic color list in `docs/marwes-colors.json`, but the runtime CSS variables, preset CSS usage, registry Figma token metadata, and local `.figma` exports are not tied together strongly enough to prove that shipped components are using the same variables as the Figma components.

## 2. Codebase Context

- `docs/marwes-colors.json` contains 73 semantic color leaves under `semantic`.
- `packages/core/src/theme/theme-css.ts`, `theme-defaults.ts`, `theme-normalize.ts`, `theme-types.ts`, and `theme-vars.ts` define the runtime theme color surface.
- `packages/core/test/theme/marwes-colors-contract.test.ts` validates part of the `docs/marwes-colors.json` mapping, but it is hand-authored and does not cover every semantic leaf or every alias decision.
- `packages/presets/src/firstEdition/**/*.css` consumes `--mw-color-*` variables directly. A scan found preset usage of undefined or legacy variables:
  - `--mw-color-accent`
  - `--mw-color-icon-muted`
  - `--mw-color-on-primary`
  - `--mw-color-page`
  - `--mw-color-surface-muted`
  - `--mw-color-text-link`
  - `--mw-color-toast-info-border`
  - `--mw-color-toast-warning-border`
- `.figma/marwes/manifest.json` says the current synced Figma export is `v4`, last modified `2026-05-13`, synced `2026-05-14`, with 231 components and 127 color entries.
- `.figma/marwes/components/_index.json` gives the current Figma component inventory.
- `.figma/marwes/components/*.json` and `.figma/marwes/pages/**/*.json` mostly expose resolved hex values in simplified JSON, not reliable variable names.
- `.figma/marwes/_raw/VTv3dNTvt7R5EytQF47XbB_full.json` contains real `boundVariables`: 213,741 nodes, 82,575 nodes with variable bindings, and 417 unique variable IDs.
- The local raw Figma dump does not appear to include a variable definition table that maps `VariableID:*` to token names, so bindings are currently resolvable only to IDs and inferred values, not semantic names.
- `.figma/nodes.json` has useful hand-curated `variables` and component `cssTokens`, but it is older (`lastUpdated: 2026-03-18`) and value drift is visible against current `docs/marwes-colors.json`.
- `docs/registry/families/*/registry.generated.json` already has per-family `design.figmaTokens`, but those tokens are authored in `scripts/component-registry-sources.ts`, not derived from the current Figma export.

## 3. Approach Options

Option A: Keep patching component CSS manually from `docs/marwes-colors.json`.

- Lowest immediate cost.
- Does not solve drift.
- Does not prove Figma component variable usage.

Option B: Build a hex-based validator from simplified `.figma/marwes` JSON.

- Uses current local export without new Figma API data.
- Can catch obvious value mismatches.
- Weak when multiple semantic tokens share the same hex value, for example `surface.primary`, `surface.raised`, `surface.staticWhite`, and action labels.

Option C: Add a token contract layer and resolve raw Figma `VariableID` bindings to semantic token names.

- Requires extending the Figma sync/export path to include variable definitions or adding a local generated `VariableID -> token name -> mode values` artifact.
- Enables deterministic component-token validation instead of guessing by hex.
- Scales to component coverage, semantic exposure coverage, and preset CSS variable validation.

**Recommended:** Option C, with Option B as a temporary fallback. The raw Figma dump already has real binding IDs; the missing piece is a variable definition map and a repo-level contract that connects Figma token names to Marwes semantic CSS variables.

## 4. What Needs to Be Built

1. Add a generated token exposure artifact, for example `artifacts/color-token-contract.json`.
   - Source: `docs/marwes-colors.json` plus `docs/marwes-border-strong-tokens.json`.
   - Include semantic path, mode values, public CSS variable, alias status, and out-of-scope reason where a semantic token is intentionally not exposed.

2. Extend the Figma sync output.
   - Add `.figma/marwes/tokens/variables.json` or equivalent.
   - Include variable collection, mode names, variable ID, token path, resolved values, aliases, and scopes.
   - Preserve `VariableID:*` so raw node bindings can be resolved.

3. Generate a Figma component token usage artifact.
   - Traverse `.figma/marwes/_raw/VTv3dNTvt7R5EytQF47XbB_full.json`.
   - Limit first pass to registry `design.nodeReferences` and `design.pageReferences`.
   - Output family, component/page node, child node, property (`fill`, `stroke`, `text`, etc.), variable ID, resolved Figma token name, and resolved value.

4. Make registry Figma tokens generated or validated.
   - Compare `docs/registry/families/*/registry.generated.json -> design.figmaTokens` against the new component token usage artifact.
   - Keep authored overrides only where a family intentionally abstracts multiple Figma tokens into one runtime token.

5. Validate preset CSS against the token contract.
   - Every `var(--mw-color-*)` used in `packages/presets/src/firstEdition/**/*.css` must exist in the token contract.
   - Every family-level preset file should map its component token roles to semantic CSS variables through a documented mapping.

6. Add focused checks.
   - `pnpm colors:check`: semantic token exposure and preset variable existence.
   - `pnpm figma:tokens:check`: Figma variable bindings resolve and registry tokens match.
   - Fold these into `pnpm check:repo-map` once stable.

## 5. Test Strategy

- Unit test the semantic flattener against all 73 `docs/marwes-colors.json` leaves.
- Unit test public CSS var generation so every exposed token maps to current light/dark values.
- Static test all preset CSS `--mw-color-*` usages against the generated token contract.
- Static test registry family `figmaTokens` against actual Figma raw variable bindings.
- Snapshot the generated artifacts and fail in `--check` mode on drift.
- Add a small fixture for ambiguous same-hex tokens to ensure validation uses variable IDs/token paths before falling back to hex.

## 6. Risks and Open Questions

- The current local `.figma/marwes` raw file has binding IDs but not the variable definition table. We need either Figma API variable data in the sync or a separate exported variable map.
- Several semantic tokens share identical hex values, so hex-only validation will create false confidence.
- `.figma/nodes.json` is useful for token names but stale for current values; it should not remain the primary validator.
- Registry `figmaTokens` are currently manually curated, so they can drift from Figma without failing checks.
- The existing dirty worktree includes unrelated changes, so implementation should avoid broad formatting or artifact churn until the plan is approved.

---
Ready to proceed to spec? Confirm to continue.
