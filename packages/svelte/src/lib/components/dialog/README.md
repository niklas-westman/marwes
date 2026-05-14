# Dialog — Parity Findings

## Svelte vs React/Vue

### Aligned ✅
- `Dialog` atom with `createDialogRecipe`
- Header with title, close button (via `IconName.X`)
- Content area with optional description
- Footer via Svelte snippet: `{#snippet footer({ close })}...{/snippet}`
- `aria-labelledby` wired to title, `aria-describedby` wired to description
- `aria-label` fallback when no visible title
- `aria-modal` only when `modal` is explicitly true
- `DialogModal` molecule with scrim, focus trap, escape/scrim-click dismiss, focus restoration
- `ConfirmDialog`, `DestructiveDialog`, `InfoDialog` purpose wrappers with `createPurposeSemanticAttributes`
- `bind:open` two-way binding on modal components

### Svelte-specific
- Footer uses Svelte snippets instead of React render props: `{#snippet footer({ close })}` vs `footer={({ close }) => ...}`
- No `portalTarget` prop — Svelte renders modals in-place (no React portal equivalent needed)

### Notes
- All purpose dialogs set correct `data-purpose` attributes.
- Focus management follows the same algorithm: first focusable element, or dialog surface as fallback.
