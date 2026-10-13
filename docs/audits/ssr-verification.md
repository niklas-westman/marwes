# SSR verification evidence

This audit tracks evidence for a future support decision. It is not an SSR support declaration.

## Delivery tracker

- [x] Node server smoke and hydrated rerender/identity tracking.
- [x] Overlay lifecycle contracts and initially-open Node probes; browser integration remains pending.
- [ ] Remaining control state contracts.
- [ ] Packed production Next.js/Nuxt/SvelteKit consumers and React 18/19 checks.
- [ ] Theme/browser evidence and dedicated CI matrix.

## Server and harness evidence

Run `pnpm test:ssr:packages`. The public component inventory is rendered with Node-only Vitest configs, without window/document. Server console warnings fail this suite separately from hydration warnings. React uses an ordinary effect on the server and keeps its layout effect in browsers for Checkbox's native mixed property, RichText DOM synchronization and Pagination measurement. The original Node smoke failed on those families before this fix.

Hydration harnesses retain controls and generated IDs and can update the hydrated instance. A shared regression exercises multiple fields/providers, controlled values and error removal. Svelte uses a reactive test host around both server and client markup to drive updates without remounting.

## Remaining product decisions

Initially-open modal semantics must be verified per adapter. Do not standardize render/portal policy without a separate decision. Existing Reflection text-button baseline differences remain a separate visual gate.

## Overlay evidence

Hydrated modal tests cover DialogModal and all purpose variants, focus/Tab/Escape/scrim, scroll and focus restoration. React and Vue exercise inline/default/custom portal targets; Svelte currently exposes inline rendering only. Presentation contracts conditionally mount Dialog, Drawer and ContextMenu without assuming an open prop. Tooltip and toast have dedicated hydrated lifecycle contracts.

The contracts reproduced two source bugs: Vue passed a slot object to Teleport instead of child nodes, leaving portals empty; Svelte ToastContainer did not clear pending timers on destruction and invoked dismiss callbacks after unmount. Both are fixed with regression evidence.

Initially-open Node probes record distinct current behavior: React omits modal content on the server (blocked pending first-client-render verification/render-policy decision), Vue emits separate teleport output requiring target integration, and Svelte renders inline modal markup. No adapter behavior is standardized by this work. Browser probes in the production consumers determine the final scenario classification.
