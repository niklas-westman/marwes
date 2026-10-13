# SSR verification evidence

This audit tracks evidence for a future support decision. It is not an SSR support declaration.

## Delivery tracker

- [x] Node server smoke and hydrated rerender/identity tracking.
- [x] Overlay lifecycle contracts and initially-open Node probes; browser integration remains pending.
- [x] Remaining control state contracts and uncontrolled-default regressions.
- [x] Packed production Next.js/Nuxt/SvelteKit consumers and React 18/19 checks.
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

## Control state evidence

InputOtp and RichText contracts cover controlled updates, uncontrolled defaults, normalization, disabled/readOnly and callbacks after hydration. CheckboxGroup contracts cover selected values, group/option disabling and callback order. Svelte exposes the group as composition, so its fixture drives public Checkbox children rather than claiming a built-in options/value API. DatePicker contracts use its existing `state` values and day/navigation callbacks; no internal date state is added.

Existing input/select/textarea/checkbox/slider/radio/tab/accordion contracts now exercise uncontrolled defaults after hydration; segmented control exercises its uncontrolled initial selection. True Node tests found that every adapter left the RichText editor empty on the server. Each now seeds normalized HTML once and retains imperative synchronization for later edits to avoid resetting the cursor. Vue RichTextField also forwards the nested editor callback while preserving its field event.

## Packed production consumers

`pnpm consumer:ssr --framework next|nuxt|sveltekit|react18|react19` requires Node 24.15+ in the 24 series. It builds and packs the five release packages, installs their tarballs in isolated temporary apps, builds for production and runs Chromium against the production server. No source aliases or disabled SSR are used. Build caches are keyed by package inputs, dependency fingerprints and Node version.

The first matrix pins Next 16.4.0 / React 19.2.4, Nuxt 4.6.1 / Vue 3.5.28, and SvelteKit 3.0.1 / Svelte 5.57.1 / Vite 8.0.12. Separate basic React probes use 18.3.1 and 19.2.4. Nuxt uses `build.transpile: ["@marwes-ui/vue"]` to compile the package's CSS import on the server and `#teleports` for SSR portals. Next places providers and interactive controls behind a client boundary inside its server layout.

The browser suite verifies server-rendered field/editor/tab state, hydration without suppressed console diagnostics, editing, modal focus trapping and restoration, scroll cleanup, toast dismissal and real client navigation. React initially-open probes retain the production hydration error and absent server dialog as **blocked**. Nuxt's `#teleports` and SvelteKit's inline initially-open probes pass. Other Nuxt portal targets are **not verified** for SSR.

Browser editing reproduced duplicate unchanged RichText blur callbacks in all adapters. A shared regression fails before the fix. React 19 additionally reapplied the server seed when a new `dangerouslySetInnerHTML` object was created during rerenders; keeping the initial markup object stable preserves subsequent edits. Core's bundled declaration worker exhausted memory; the build now uses ordinary `tsc` declaration emission after the JavaScript bundle, preserving type output and type checking.

Artifacts live in `.cache/ssr/<framework>/`: package/consumer build logs, manifests, consumer lock, server HTML/logs, browser JSON, failure screenshots and Playwright traces. Known product probes are reported as blocked without making them accepted support claims; `--strict-probes` makes blocked probes fail the command.
