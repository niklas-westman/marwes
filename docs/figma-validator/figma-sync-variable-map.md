# Figma Sync Variable Map Handoff

## Goal

The validator reads the local `.figma` folder and should not call the Figma API by default. To validate Figma token parity deterministically, the sync/fetcher should export one additional artifact:

```text
.figma/marwes/tokens/variables.json
```

## Why This Is Needed

The current `.figma/marwes/_raw/*_full.json` file includes node `boundVariables` such as `VariableID:5:917`.

The current `.figma/marwes/tokens/colors.json` file is useful, but it is grouped by resolved hex value and `usedIn` nodes. Hex values are not enough for parity validation because multiple semantic tokens can intentionally resolve to the same value.

The validator needs the Figma variable identity:

```text
VariableID:* -> collection -> token name/path -> mode values
```

## Proposed Artifact Shape

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

Exact property names can change, but the artifact must preserve the raw Figma variable ID and provide a stable token name/path plus mode values.

## Validator Contract

The validator will:

1. Read `.pi/figma-sync.json` to locate `liveDir`.
2. Read `.figma/marwes/tokens/variables.json`.
3. Traverse raw node `boundVariables`.
4. Resolve each `VariableID:*` to a Figma token name.
5. Compare actual Figma usage with registry `design.figmaTokens` and Marwes CSS token mappings.

Until this artifact exists, `pnpm figma:validate -- --family <family>` reports Figma token parity as blocked while still running local reference and package surface checks.

## Non-Goals

- Do not move Figma API calls into the validator.
- Do not replace `.pi/figma-sync.json`.
- Do not validate token parity by resolved hex alone.
