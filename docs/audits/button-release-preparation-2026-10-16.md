# Button release preparation — 2026-10-16

Status: preparation in progress; not a release approval or full-family certification.
The current packages remain at 1.10.1. The proposed next fixed-group release is
1.11.0 because `resolveButtonIcons` is an additive public core export. Changesets
cover core, presets, React, Vue and Svelte together. Do not run versioning or publish
as part of evidence preparation.

## Consumer changes to review

- Align Secondary and Ghost paints, borders, state overlays, disabled/error roles
  and intrinsic surface/label sizing with the pinned October 14 Figma source.
- Standard small/large Button heights become 32px/48px; destructive small retains
  its separate 36px selection. IconButton medium is 32px. These visible changes
  require consumers to inspect compact layouts despite compatible public types.
- Purpose wrappers use canonical leading/trailing icons across all adapters.
  Caller-provided icons replace defaults; loading substitutes its spinner. The
  new core helper centralizes this behavior without a private-governance runtime
  dependency. No new false/null icon opt-out API is introduced.
- Standard keyboard focus uses the approved 2px ring and 4px clear gap. Dark focus
  resolves to #ABABFD. Increased-contrast policy remains a separate design question.
- Canonical icon/spinner geometry and shared semantic tokens also affect other
  families. The existing parity changeset includes Checkbox, Radio and Dialog;
  this checkout must not be presented as a Button-only release.
- Chromium supports the calibrated intrinsic label/surface rounding. Other
  browsers retain ordinary intrinsic sizing and are not currently certified.

## Release gates

- [ ] Fresh canonical Button proof across React/Vue/Svelte in Chromium, including
  native held Pressed capture and stable loading capture on Reflection 0.6.0.
- [ ] Resolve remaining text-rendering differences using independent source
  evidence; retain native screenshot failures until resolved.
- [x] Enroll the first two primary-focus selections with independent source
  geometry, keyboard proof and mode-correct Figma references. Preserve the other
  50 required focus selections as explicit gaps.
- [ ] Classify remaining public selection/source gaps. Only confirmed missing
  designs may be explicitly skipped for visual review and flagged at report top;
  missing mappings/fixtures do not establish missing designs or family completion.
- [ ] Owner reviews exact staged source/reference changes and exact run evidence.
  Promotion and run acceptance are separate decisions; rerun active inputs after
  approved promotion. Current October14 inputs remain staged.
- [ ] Button family tests, all public typechecks/builds, SSR and consumer smoke/API
  checks; meaningful controls for geometry, paint, interaction and missing evidence.
- [ ] Reverify shared-token/icon/spinner consumers, including existing Checkbox,
  Radio and Dialog changes. Settle the final release scope explicitly.
- [ ] `pnpm validate:release`, `pnpm design:check`, governance CI and required
  Reflection doctor/visual/review gates pass with current committed inputs.
- [ ] Clean-checkout verification works without Figma credentials/local raw capture.
- [ ] Review final diff and generated release notes, then seek release authorization.

## Evidence collected in this pass

- Changeset checker passes after making each fixed-group changeset list all five
  packages and marking the new public helper as minor.
- Core Button recipe, purpose-icon and HTML-attribute tests: 45 passed.
- Public-package/contract typechecks pass, with the existing Svelte TabGroup
  accessibility warning (noninteractive element with nonnegative tabindex).
- React/Vue/Svelte SSR checks pass; preserve that separate TabGroup warning.
- All public package tests pass: 5,109 tests across core, presets, React, Vue,
  Svelte and both CLI packages. Public builds and the public API artifact check
  pass. Clean packed-artifact consumer smoke passes for React, Vue and Svelte.
- Reflection doctor and fixture checks pass (20 fixture tests).
- Corrected the 20 focused lint/format errors in the new icon tests, Button CSS
  and Vue Button file. Core purpose-icon import ordering is corrected; Svelte
  purpose-icon/marker tests pass (29 tests). Full governance lint cleanup and
  checks follow before final evidence.
- Added source-backed explicit common ligature shaping on the Button root.
  Diagnostic scope:185 selections across all three adapters on Darwin arm64,
 170 visual passes/15 failures each; eight recoveries per adapter and no new failed
  selection. This does not replace the pending fresh canonical run.
- Primary-focus diagnosis isolated49 ring-corner pixels from native CSS outline
  painting. Master and documented example exports are byte-identical in both
  modes. A source-derived border pseudo-element removes all ring differences;
  targeted comparisons pass at34 label pixels across all six adapter/mode pairs.
  Independent source assertions, actual Tab focus, pointer/layout controls and
  forced-colors fallback tests pass. Exact-stage canonical verification follows.
- Linux arm64 control uses exact Reflection0.6.0/Playwright1.60.0, exact font bytes
  and source-correct representative bounds. It retains text failures (2passes,
  19failures in21 selected cases before and after ligature correction); it does
  not establish Ubuntu AMD64 CI parity or justify claiming all failures are fixed.
- The first full0.6.0 audit is historical/invalid: concurrent public builds emitted
  ignored declarations inside source folders, changing its conservative input
  fingerprint. Complete all build/check mutations before freezing final evidence.

Local logs are under `.reflection/button-last-mile-0.6.0/`. Generated reports,
images and diagnostic live SVGs stay ignored local/CI artifacts. The pinned Figma
version is 2410234809276115335, file nybMu3iJUnnOvWtuxjMG8b. Live outlined source
exports support diagnosis, not silent replacement of pinned expectations.

## Formatting and source integrity

Root lint started clean at HEAD31870a11. Current governance additions required
normal code hygiene. Keep all code lint rules enabled. Machine-captured
`reflection-families/*/source/snapshot.json` is exempt only from formatting so
original hash-bound bytes remain intact; normal snapshot/schema/provenance gates
remain required. Biome accepts files up to8MiB so large structural contracts are
actually checked. Hand-authored contracts are formatted before restaging.

## Current inventory and release dependencies

The required inventory is273 selections:203 mapped and70 missing fixtures.
This includes52 focus obligations, of which the first two primary-focus cases
are enrolled. Fourteen selections explicitly need design; those may skip visual
review under the owner's instruction, remain in the denominator, and never
receive invented visual passes. Six selections need source mapping rather than
new design. Missing mapping/fixtures are independent blockers.

The release dependency audit now passes after Vue/server-renderer3.5.42 and
source-map-js1.2.2. A parent-scoped read-yaml-file2.1.0 override removes the
unpatched sprintf-js path from Changesets tooling; its actual workspace discovery,
async/sync CommonJS API, BOM/anchor and missing-file behavior were independently
checked before applying. Existing documented dev-tool exceptions remain unchanged.
Reflection stays exactly0.6.0. Changesets status proposes1.11.0 for all five public
packages; versioning has not been applied.

The Vue patch initially exposed an orphan ignored pnpm hoist to3.5.28 in this
local installation. Removing only that stale symlink and running a frozen-lockfile
install restores identical Vue3.5.42 runtime exports for components and Test Utils.
The two focused recovery suites pass31 tests; package gates are rerunning.

The wider React Storybook accessibility run passes455/458 stories. The three
failures are Accordion/Disabled (non-control FAQ label and expanded content at
2.09:1 contrast) and Color/All Colors plus Semantic Only (green swatch label at
4.04:1). Keep these release blockers; do not exempt the non-control text as a
disabled control or change pinned tokens just to pass an audit.

Repository-map checks pass after regenerating registry/publication artifacts and
excluding ignored `.reflection` capture copies from documentation traversal.
A control proves real broken documentation links still fail.

## Release-check update

The final public package gate passes5,109 tests, all public typechecks and builds.
All three SSR suites pass. Button plus Color story accessibility checks pass
44React,44Vue and50Svelte stories. The swatch fix returns the actual black used
by the contrast calculation, removes Vue's unaccounted dark overlay, and handles
Svelte alpha colors over the preview's white backing. This changes documentation
previews, not production palette tokens. The wider React audit now has only the
Accordion Disabled contrast failure; equivalent pre-fix full Vue/Svelte audits
show the same Accordion issue.

`pnpm design:check` still fails outside the focused Button check. Preserve its
family-specific findings in `design-check-final.log`; do not present focused
Button validation as a passing all-family gate.

The post-swatch-fix full Storybook accessibility runs confirm1,421 passing stories
and three failures: AccordionField/Disabled once per adapter (React457/458,
Vue452/453, Svelte512/513). All three Storybook typechecks pass. Packed-artifact
consumer smoke passes React, Vue and Svelte after the dependency patches.

Niklas confirms Instrument Sans originated from Google Fonts. This establishes
the provider, not the exact historical authoring binary. Compare current official
served files and the existing tested variable font before proposing a replacement;
keep the pinned image thresholds and real HTML labels unchanged.

Google Fonts provider controls are complete: current official500static WOFF2
produces byte-identical actual images in all19 Darwin and19 Linuxarm64 controls.
The currently served font's differing scan-control table therefore supplies no
measured improvement; its tested outlines/shaping match the bundled file. See
[the provider audit](button-google-font-provenance-2026-10-16.md). Retain the existing
font and all native failures.

## Bounded handoff: proposals are not enrollment

The current integrated inventory remains273 required/203 mapped/70 missing
fixtures. Additional ignored proposals have not been applied:

- `.reflection/focus-fifty-enrollment-proposal/`:50 focus selections, with150
  all-adapter structural/keyboard diagnostics; independent Figma references and
  canonical visual proof remain outstanding.
- `.reflection/focus-composition-proposal/compiler/`:81 passing isolated tests.
- `.reflection/focus-composition-plugin-proposal/`:25 passing proposal tests,
  but independent review found a blocking live-paint acknowledgment gap. Reject
  unsupported fills/blends/alpha and bind native resolved mode paints to pinned
  source expectations before any stageable native capture. Do not treat the
  existing proposal as capture-ready.
- `.reflection/button-last-mile-0.6.0/mapping-six-proposal/proposed-four/`:
  source-complete FullWidth and Border=False selections in both modes, with
  bounded production CSS corrections and isolated all-adapter defect controls.
  Fresh Figma references and canonical enrollment remain outstanding.
- Primary loading's two selections need authoritative variable1362:7421 and
  its alias/collection provenance. Current Frame Prep cannot read that graph.
  An ignored imported-variable reader proposal is incomplete; do not apply it
  without review, tests and an actual read-only source capture.

Future integration must merge guarded additive fragments: the proposals overlap
contracts and adapter fixtures. No whole-file overwrite, source promotion, owner
acceptance, version application or publishing is authorized by these diagnostics.

## Final checkpoint

See [the final debrief](button-debrief-2026-10-16.md) for the completed fresh
all-adapter run:172/187 visual pass per adapter,15 failures,187 structural
and191 behavior/integrity passes. Run freshness is current; review unreviewed,
stage unapproved/unpromoted. The additional proposals remain unapplied.
