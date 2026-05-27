# Spec: Figma Component Validator

## Requirements

1. Keep `.pi/figma-sync.json` as the source of truth for fetching and locating the latest local Figma export.
2. Do not make the validator fetch Figma by default. Figma API requests are limited, so the validator must read the latest `.figma/<target>` output produced by the existing sync flow.
3. Add a validator that can run across all component families or one selected family.
4. Validate each selected family across the design source, package adapters, and presets:
   - Figma component reference exists in the current `.figma` export.
   - Figma variable bindings can be resolved to token names, not only hex values.
   - Registry `design.figmaTokens` matches the actual Figma variable usage or has an explicit documented override.
   - Preset CSS references only exposed Marwes token variables.
   - React, Vue, Svelte, and preset package surfaces exist for the family where that family claims framework support.
5. Add a color-token contract generated from `docs/marwes-colors.json` so undefined or legacy `--mw-color-*` preset usage fails validation.
6. Report validator output in a family-oriented format that makes drift actionable: missing Figma refs, missing variable map entries, token mismatches, missing package surfaces, and preset CSS token failures.
7. Treat full visual one-to-one validation as a staged layer after token and structural validation are reliable.

## Architecture

The current Figma sync flow remains the fetcher:

- `.pi/figma-sync.json` defines the default target, Figma file URL, `liveDir`, archive path, docs file, token environment variable, env files, and manual reference files.
- `.pi/settings.json` points at the existing `figma-node-fetch` tooling.
- The validator reads this config to locate `.figma/marwes`, its manifest, component index, raw file, and any generated token artifacts.

Add a repo-local validator layer under `scripts/figma-validator/` or an equivalent small module directory:

- `config`: read `.pi/figma-sync.json`, select target, resolve `liveDir`, and fail clearly if the sync output is missing or stale.
- `color-contract`: flatten `docs/marwes-colors.json` into semantic paths and public CSS variable names; include alias or intentionally-unexposed metadata where needed.
- `preset-css`: scan `packages/presets/src/firstEdition/**/*.css` for `var(--mw-color-*)` and validate every referenced variable against the color contract.
- `registry`: read generated family registries or their source data to find family names, framework support, preset files, and Figma node/page references.
- `figma-source`: read `.figma/<target>/manifest.json`, `components/_index.json`, and raw Figma node data for selected families.
- `figma-token-usage`: traverse raw Figma nodes under the selected Figma references and collect `boundVariables` by node, property, variable ID, and resolved token name.
- `framework-surface`: validate expected React, Vue, Svelte, and preset files/tests/stories for a family using existing registry conventions.
- `report`: emit concise text output by default and JSON output for CI/artifacts.

The required fetcher enhancement is narrow if the current `.figma` folder cannot provide variable definitions. The current raw Figma dump contains `VariableID:*` bindings, and `.figma/marwes/tokens/colors.json` contains hex-based usage, but the local generated `.figma` artifacts do not expose a reliable `VariableID -> Figma token name -> mode values` map. The fetcher should continue doing the sync, but it likely needs to write a variable map artifact such as `.figma/marwes/tokens/variables.json`. The validator can then resolve bindings deterministically instead of guessing by resolved hex values.

The validator should be modeled as layered family validation, not only token validation:

1. Fetch freshness: prove the selected `.figma` target exists, has a manifest, and contains the referenced Figma nodes/components.
2. Design identity: prove each registry family points at the intended Figma component or page reference.
3. Token parity: prove Figma variable bindings resolve to known token names and match registry `design.figmaTokens`.
4. Preset parity: prove preset CSS uses exposed Marwes variables and maps component roles to the expected semantic tokens.
5. Framework surface parity: prove React, Vue, and Svelte expose the expected family/component API surface and adapter files.
6. Rendered parity: compare framework-rendered output against the Figma component once token and structure checks are stable.

This means the first implementation should build the validator spine and cheap deterministic checks first, then add visual parity as a second stage. A visual check without token and reference certainty would be noisy because multiple semantic tokens can resolve to the same color.

The user-visible validator output should make this structure visible:

```text
.pi/figma-sync.json + figma-node-fetch
        |
        v
.figma/marwes/*
        |
        v
figma validator
        |
        +-- fetch freshness
        +-- design identity
        +-- token parity
        +-- preset parity
        +-- framework surface parity
        +-- rendered parity
```

A family run should read like this:

```text
figma:validate checkbox

Target: marwes
Source: .figma/marwes
Family: checkbox

[pass] Figma references
[pass] Framework surfaces
[fail] Token parity
       Figma uses:   surface.primary
       Preset uses:  surface
       Expected CSS: --mw-color-surface-primary
       Found CSS:    --mw-color-surface
[pass] CSS token exposure
```

Suggested commands:

- `pnpm figma:validate -- --all`
- `pnpm figma:validate -- --family checkbox`
- `pnpm colors:check`

Suggested staging:

1. Token contract and preset CSS validation.
2. Figma variable map requirement and binding extraction.
3. Registry token validation against real Figma usage.
4. Package/framework surface validation by family.
5. Optional visual parity validation using rendered stories and Figma screenshots.

## Acceptance Criteria

- GIVEN `.pi/figma-sync.json` has `defaultTarget: "marwes"` WHEN `pnpm figma:validate -- --all` runs THEN the validator reads `.figma/marwes` and does not call the Figma API directly.
- GIVEN Figma API request budget is limited WHEN validator commands run THEN no network request to Figma is made unless an explicit future `--fetch` mode is added and requested.
- GIVEN a family name WHEN `pnpm figma:validate -- --family <family>` runs THEN only that family is checked across Figma references, registry metadata, React, Vue, Svelte, and presets.
- GIVEN preset CSS references `var(--mw-color-*)` WHEN `pnpm colors:check` runs THEN every referenced color variable must exist in the generated contract from `docs/marwes-colors.json` or fail with file and variable details.
- GIVEN the Figma raw dump contains `boundVariables` WHEN the variable map artifact exists THEN validator output reports semantic Figma token names instead of only `VariableID:*`.
- GIVEN registry `design.figmaTokens` drifts from actual Figma bindings WHEN validator runs THEN it fails the affected family and lists expected, actual, and source node references.
- GIVEN a selected family claims framework support WHEN validator runs THEN the corresponding React, Vue, Svelte, and preset surfaces must exist or the family must mark that support as intentionally absent.
- GIVEN the local `.figma` export is missing required artifacts WHEN validator runs THEN it fails with a message telling the user to run the existing sync/fetcher, not a silent pass.
- GIVEN JSON output is requested WHEN validator runs THEN it emits stable machine-readable results suitable for CI and generated reports.

## Out of Scope

- Replacing `.pi/figma-sync.json` or the existing Figma sync/fetcher workflow.
- Fetching fresh Figma data from inside validator checks by default.
- Proving pixel-perfect visual parity for every component in the first validator increment.
- Rewriting component implementations or preset architecture while building the validator.
- Using `.figma/nodes.json` as the primary source of truth for current tokens; it can be a fallback/reference only because it is currently stale.

---
Ready to proceed to tickets? Confirm to continue.
