# SSR verification evidence

This audit tracks evidence for a future support decision. It is not an SSR support declaration.

## Delivery tracker

- [x] Node server smoke and hydrated rerender/identity tracking.
- [ ] Overlay lifecycle contracts and initially-open probes.
- [ ] Remaining control state contracts.
- [ ] Packed production Next.js/Nuxt/SvelteKit consumers and React 18/19 checks.
- [ ] Theme/browser evidence and dedicated CI matrix.

## Server and harness evidence

Run `pnpm test:ssr:packages`. The public component inventory is rendered with Node-only Vitest configs, without window/document. Server console warnings fail this suite separately from hydration warnings. React uses an ordinary effect on the server and keeps its layout effect in browsers for Checkbox's native mixed property, RichText DOM synchronization and Pagination measurement. The original Node smoke failed on those families before this fix.

Hydration harnesses retain controls and generated IDs and can update the hydrated instance. A shared regression exercises multiple fields/providers, controlled values and error removal. Svelte uses a reactive test host around both server and client markup to drive updates without remounting.

## Remaining product decisions

Initially-open modal semantics must be verified per adapter. Do not standardize render/portal policy without a separate decision. Existing Reflection text-button baseline differences remain a separate visual gate.
