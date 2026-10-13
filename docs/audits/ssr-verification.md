# SSR verification evidence

This audit tracks evidence for a future support decision. It is not an SSR support declaration.

## Delivery tracker

- [x] Node server smoke and hydrated rerender/identity tracking.
- [x] Overlay lifecycle contracts and initially-open Node probes; browser integration remains pending.
- [x] Remaining control state contracts and uncontrolled-default regressions.
- [x] Packed production Next.js/Nuxt/SvelteKit consumers and React 18/19 checks.
- [x] Theme/browser evidence and dedicated CI matrix.

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

## Theme and CSP evidence

All five production/browser consumers were run with Node **24.15.0**. `--themes` pauses external JavaScript modules while the nonce-bearing pre-hydration theme script executes, measures computed background/text colors, then releases hydration and compares the result. This tests the intended pre-hydration bootstrap rather than disabling the script that selects the theme.

| Scenario | Next / React 18 / React 19 | Nuxt | SvelteKit |
| --- | --- | --- | --- |
| Closed SSR, hydrated interaction | Verified | Verified | Verified |
| Initially-open modal | Blocked: absent server portal, React hydration errors | Verified with `#teleports` | Verified inline |
| `style-tag`: light/dark/system, conflicting storage | Verified | Verified | Verified |
| `inline`: matching light/dark and system-light fallback | Verified | Verified | Verified |
| `inline`: system-dark or storage differs from server default | Blocked: color flash | Blocked: color flash | Blocked: color flash |
| Head helper nonce under enforced script CSP | Verified fixture | Verified fixture | Verified fixture |
| Strict style CSP, custom themes, arbitrary Nuxt portal targets | Not verified | Not verified | Not verified |
| Streaming/Suspense, edge runtimes, multiple roots with caller prefixes | Not verified | Not verified | Not verified |

The inline mismatch changes white/near-black server colors to the opposite palette after hydration despite the bootstrap selecting the correct root class. This is a render-policy/configuration decision; no public theme API or SSR support promise is added. The script-CSP probe asserts the helpers already carry their nonce and adds nonces to framework bootstrap scripts in the test response. It enforces `script-src 'self' 'nonce-ssr-fixture'`; it does **not** verify a framework's deployment nonce middleware or strict style CSP.

Known blockers remain in reports and full browser logs. Only the specific observed inline flash with no console issues and React's absent initially-open portal with the observed hydration errors are classified as blocked. Timeouts, new warnings/errors and other regressions fail CI. `--strict-probes` rejects every blocked result.

## Product proposals, separate from these fixes

1. Decide React initially-open semantics: defer portal creation until hydration has completed, or introduce an explicit SSR portal integration contract. The current closed-then-open path is verified; changing the initial render policy needs a separate behavior review.
2. Document `style-tag` plus matching server head helpers as the tested way to avoid a stored/system-theme flash. Decide separately whether inline variables must support mismatching client preferences before first paint.
3. Define the promised framework/version, portal and CSP scope only after reviewing this matrix. Keep unverified modes outside the promise until they have equivalent production evidence.

## Validation and visual gate

Final adapter suites passed: React **1,282**, Vue **1,285**, Svelte **1,468** tests; core **736** tests. Node-only public SSR suites passed **132 / 130 / 129**. Contract and adapter test typechecks, workspace typecheck and changed-scope validation passed. Svelte retains the existing TabGroup accessibility compile warning.

Focused design/runtime validation uses `input`, `dialog`, `toast`, `checkbox` and `pagination`. Reflection doctor passed. Reflection visual/review retains the unrelated **button.text.light** baseline mismatch (112 pixels, 47/48 cases pass per adapter). No baseline was changed; visual approval remains blocked separately from SSR:

- `.reflection/react/runs/2026-10-13T19-43-46Z-local/report.md`
- `.reflection/vue/runs/2026-10-13T19-43-47Z-local/report.md`
- `.reflection/svelte/runs/2026-10-13T19-43-48Z-local/report.md`

CI keeps the existing Node 20 package jobs and peer ranges, adds true Node SSR smoke there, and runs a separate Node 24.15.0 production matrix. It uploads `.cache/ssr/<framework>/` including reports, server/browser logs, consumer locks, screenshots and traces even on failure. Local results do not imply that the newly added remote CI jobs have already passed.
