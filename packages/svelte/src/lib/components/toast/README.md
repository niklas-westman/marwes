# Toast — Parity Findings

## Svelte vs React/Vue

### Aligned ✅
- `Toast` atom with `createToastRecipe`
- `role="status"`, `aria-live`, `aria-atomic="true"`
- Icon, body, action, dismiss button slots
- `ondismiss` callback renders dismiss button
- `ToastContainer` with placement classes and stacking
- `ToastProvider` with context-based `useToast()` controller
- `show()`, `dismiss()`, `clear()` imperative API
- Auto-dismiss with configurable `defaultDuration` (4000ms default)
- Purpose wrappers: `SuccessToast`, `ErrorToast`, `WarningToast`, `InfoToast`
- All purpose toasts set correct `data-purpose` and default icons

### Svelte-specific
- `useToast()` uses Svelte `getContext`/`setContext` instead of React context
- Icon and action slots use Svelte snippets: `{#snippet icon()}...{/snippet}`
- `ManagedToast.message` is a string (React uses `children: ReactNode`)

### Notes
- ToastContainer mouse enter/leave handlers are placeholder stubs — timer pause is handled by the provider layer.
