# Adapter Architecture

This page is the source of truth for how Marwes framework adapters stay aligned.
React, Vue, and Svelte are co-equal framework packages. A component family is not
complete when one adapter lands first; it is complete when core, preset CSS,
React, Vue, Svelte, Storybook, docs, exports, and shared contracts all agree.

## Architecture map

```text
core recipe
  -> preset CSS
  -> React adapter
  -> Vue adapter
  -> Svelte adapter
  -> React, Vue, and Svelte Storybook
  -> shared contracts, registry docs, generated truth, release notes
```

Adapter parity means role-identical architecture and public behavior. It does
not mean identical source syntax. Each framework may use its native component
shape as long as the role, package surface, and contract remain aligned.

## Framework-native source shapes

| Framework | Package source root | Expected source shape |
| --- | --- | --- |
| React | `packages/react/src/components/<family>/` | `.tsx` components plus `index.ts` |
| Vue | `packages/vue/src/components/<family>/` | render-function `.ts` components plus `index.ts` |
| Svelte | `packages/svelte/src/lib/components/<family>/` | `.svelte` components, `types.ts`, and `index.ts` |

These are the allowed source-shape differences. Any new adapter must document its
native shape here before it becomes an accepted exception to file-for-file
layout.

## Required roles per family

Every shipped component family must provide the same roles across React, Vue,
and Svelte unless an explicit Storybook companion exclusion marks the family as
temporarily out of scope.

| Role | Required artifact |
| --- | --- |
| Atom | The base component backed by the core recipe |
| Molecule | Field, group, container, or composed wrapper when the family defines one |
| Purpose wrapper | Named intent wrappers such as `SubmitButton` or `StatusBadge` when the family defines them |
| Family barrel | `index.ts` under each adapter family directory |
| Root export | Public value and type exports from the adapter package entry |
| Story | Storybook coverage for the configured family stems |
| Intro docs | `Introduction.mdx` in each framework Storybook family directory |
| Shared contract | Svelte joins every shared contract that React, Vue, and Svelte can all exercise |
| Local tests | Package-local tests for framework-only behavior, events, binding, or SSR concerns |
| Package entry | Adapter entry imports `@marwes-ui/presets/firstEdition/styles.css` and preserves CSS side effects |

## Public surface rules

- React, Vue, and Svelte family directories must exist together for shipped families.
- Family barrels must expose the same public component and prop type names unless
  the Storybook companion config declares `exportParityExempt`.
- Root package entries must re-export every public family barrel symbol.
- Providers, theme hooks, SSR helpers, and package entry exports must stay
  framework-equivalent even when framework syntax differs.
- Adapter packages must depend on `@marwes-ui/core` and `@marwes-ui/presets`.
- Adapter package entries must load the default firstEdition CSS; consumers can
  still import preset CSS directly when they need standalone CSS assets.

## Storybook rules

Storybook is part of the adapter contract, not a demo afterthought.

- Each framework Storybook family directory must include `Introduction.mdx`.
- Story files must use the configured taxonomy from `.pi/storybook-companion.config.ts`.
- Atom, molecule, variant, and purpose coverage should use the same semantic
  titles across React, Vue, and Svelte.
- Story-only families and temporary exclusions must be declared in the companion
  config instead of being implied by missing files.

## Svelte syntax notes

Svelte uses Svelte-native syntax while preserving the same Marwes behavior:

- form controls support `bind:value` and `bind:checked`
- event props are lowercase, such as `onclick`, `onvaluechange`, and `oncheckedchange`
- component content uses Svelte snippets/content projection
- provider and theme access use Svelte context-backed helpers
- SSR-safe generated IDs use Svelte's `$props.id()` pattern where needed

These differences are syntax boundaries, not parity exceptions.

## Validation

Run the adapter architecture guardrail directly when adapter structure changes:

```bash
pnpm check:adapter-architecture
```

The check reports explicit finding IDs:

- `missing-family-dir`
- `missing-family-barrel`
- `missing-root-export`
- `mismatched-family-value-export`
- `mismatched-family-type-export`
- `missing-story-dir`
- `missing-story`
- `missing-introduction`
- `missing-contract-enrollment`
- `package-css-policy-mismatch`
- `source-shape-mismatch`
- `current-docs-react-vue-bias`

The same guardrail is included in:

```bash
pnpm check:repo-map
pnpm check:changed
```
