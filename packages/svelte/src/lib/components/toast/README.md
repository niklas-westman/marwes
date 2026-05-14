# Toast

Svelte toast components are aligned with the React and Vue toast family.

## Public Components

- `Toast` — atom for a single live-region notification.
- `ToastContainer` — positioned viewport that renders managed toasts.
- `ToastProvider` — context provider with the imperative toast controller.
- `SuccessToast` — purpose toast with success semantics.
- `ErrorToast` — purpose toast with assertive error semantics.
- `WarningToast` — purpose toast with warning semantics.
- `InfoToast` — purpose toast with informational semantics.

## Shared Contract

- Uses `createToastRecipe` from `@marwes-ui/core`.
- Wires `role="status"` or `role="alert"` from `ariaLive`.
- Sets `aria-live` and `aria-atomic="true"`.
- Supports icon, action, and dismiss slots.
- Renders a dismiss button only when `ondismiss` is provided.
- Applies canonical `data-component`, `data-purpose`, and `data-intent` attributes.
- Keeps `ToastContainer` placement classes and `maxVisible` behavior aligned with React and Vue.
- Keeps provider-managed toasts on the shared imperative API: `show()`, `dismiss()`, and `clear()`.
- Defaults provider-managed toast duration to `4000ms`.
- Keeps `duration={null}` toasts visible until product code dismisses them.
- Pauses auto-dismiss while pointer hover or focus is inside the toast, then resumes with remaining time.

## Svelte Notes

- `useToast()` uses Svelte context through `getContext` and `setContext`.
- Icon, action, and children content use Svelte snippets.
- `ManagedToast.message` is a string, while React/Vue use framework-native node children.
- Event naming follows Svelte conventions: `ondismiss`.
- Class passthrough uses `class`, matching Svelte component conventions.
