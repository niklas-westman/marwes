# Adding Native Token Families

React Native components use explicit token data generated from semantic preset CSS variables. This keeps web and native aligned on design intent without translating CSS layout, pseudo-elements, masks, or keyframes.

## Source Files

| Purpose | Path |
|---|---|
| Family manifest | `scripts/react-native-token-manifest.ts` |
| Extraction and parsing logic | `scripts/react-native-token-extractor.ts` |
| CLI entrypoint | `scripts/generate-react-native-tokens.ts` |
| Generated token data | `packages/react-native/src/styles/native-tokens/generated/first-edition.native-token-data.ts` |
| Resolved token helpers | `packages/react-native/src/styles/native-tokens/generated/first-edition.native-tokens.ts` |
| Token types | `packages/react-native/src/styles/native-tokens/native-token-types.ts` |

## Workflow

1. Add semantic `--mw-<family>-*` variables to the relevant preset CSS file.
2. Add any new shared theme variable mappings to `firstEditionThemeVarPaths` in `scripts/react-native-token-manifest.ts`.
3. Add a family manifest entry in `scripts/react-native-token-manifest.ts` using selector and variable pointers.
4. Extend `generateFirstEditionNativeTokenData()` in `scripts/react-native-token-extractor.ts` to read the family and emit typed data.
5. Add or update token types in `packages/react-native/src/styles/native-tokens/native-token-types.ts`.
6. Add resolver helpers in `packages/react-native/src/styles/native-tokens/generated/first-edition.native-tokens.ts`.
7. Run `pnpm native-tokens:generate`.
8. Run `pnpm native-tokens:check`, `pnpm test:core`, and `pnpm --filter @marwes-ui/react-native typecheck`.

## Rules

- Keep the manifest explicit and family-scoped.
- Extract semantic component variables only.
- Do not add arbitrary CSS declaration translation.
- Add a parsing test before extending extractor behavior.
- If a generated token file is edited manually or becomes stale, `pnpm native-tokens:check` must fail.
