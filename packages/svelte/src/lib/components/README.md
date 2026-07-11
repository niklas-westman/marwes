# Svelte Components

## Cross-Framework Contract

Svelte component families follow the role-identical adapter architecture in
`docs/reference/adapter-architecture.md`.

- Each shipped family keeps `.svelte` components, `types.ts`, and a family
  `index.ts` barrel.
- Public value and type exports are surfaced through
  `packages/svelte/src/lib/index.ts`.
- Components call the shared core recipes and consume preset CSS through the
  package entry import.
- Storybook coverage lives in `apps/storybook-svelte/src/stories/<family>/`
  with `Introduction.mdx` and matching stories.
- Shared contracts live in `packages/svelte/src/tests/` when React, Vue, and
  Svelte can all exercise the same behavior.

## Svelte Syntax Notes

Svelte-specific differences should stay syntax-level:

- use `bind:value` and `bind:checked` for supported form state
- use lowercase event props such as `onclick`, `onvaluechange`, and
  `oncheckedchange`
- use snippets/content projection for component content
- use Svelte context helpers for provider-backed theme access

Do not add component-local parity notes that say a family is missing or behind.
Use Storybook, shared contracts, and the adapter architecture check as the
current source of truth.
