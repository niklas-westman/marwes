# Button audit and first fixture correction — 2026-10-16

Scope: pinned October14 Figma capture, Reflection0.5.1, Chromium, real React/Vue/
Svelte adapters. Active source/reference promotion and owner acceptance remain
separate. All reference images used here are staged, unchanged lossless WebP.

## Untouched checkpoint

Run: `button-1792136451785-358a806e-a07d-4125-a0e3-205ffd16dea0`

Stage: `265825d0-93ac-4797-b7af-1423bbd7f0ff`

Stage hash: `281df9c8465a27ed1ca1c21532fa8abd9140b74fac2b11aa5bf87a7462b751a2`

Input fingerprint: `76a01039fffdbc9997f38ee9d0460e96ce8ed33de828d7faa9bc0ebae9b35567`

The run was current when inspected before applying the fixture correction. That
later source change makes it historical. All three adapters agreed:

| Proof, per adapter | Result |
| --- | --- |
| Structural | 185 passed |
| Behavior | 189 passed, including four behavior-only form fixtures |
| Visual | 132 passed,27 failed,26 Pressed unsupported |
| Declared inventory | 231 item/mode obligations |
| Fixture mapping | 199 mapped,32 missing |
| Enrollment gaps | 58 items:32 missing fixtures and26 unsupported captures |

The full run contains567 case/adapter results. Required-item counts differ from
unique visual-case counts because some obligations share declared fixtures and
four fixtures require behavior only. Missing fixtures remain in the denominator.

The complete693-row comparison export (231 obligations × three adapters) is:
`.reflection/button-audit-0.5.1/button-1792136451785-358a806e-a07d-4125-a0e3-205ffd16dea0/required-item-comparisons.csv`

It includes every required item, gaps, all proof outcomes and exact-run reference,
actual and diff artifact paths. Compact summary: `summary.json` beside that CSV.
Generated captures/exports remain local or retained CI artifacts.

## Confirmed first defect

The outer Button fixture used fractional CSS translation to round an odd-width
control's naturally half-pixel-centered origin. Final bounding boxes were integer,
but borders could be rasterized before translation. Independent same-geometry
experiments isolated64light/66dark exterior pixels on several secondary controls.

The correction uses layout offsets for Button fixture origins. It preserves
control dimensions, typography, public behavior, provider layout, ResizeObserver
realignment and cleanup. Other families retain the previous alignment path.
Production component styles, source bytes and comparison thresholds are unchanged.

The new browser regression compares an odd-width bordered fixture to an
independently absolute-positioned integer-origin oracle. The prior helper fails
its pixel comparison despite identical measured bounds; the correction passes.
Resize/cleanup and non-Button compatibility controls also pass, alongside actual
React/Vue/Svelte geometry checks. Independent review found no blocking issue.

## Post-fix verification

The full three-adapter run is complete and its input binding remains current:

Run: `button-1792137735740-681ddafc-2e1e-4e38-b1ff-19c85da36455`

Stage: `d8519b69-10e0-4558-b666-59d5d09d2731`

Stage hash: `c3d9cc2435f7d1be6bc385ee14102e15c7884dcc4ab4b62a93edeca036d9e9d0`

Input fingerprint: `a5e7d7c661072c914bda0a2ae31ad31ba8bcec47c801c08abfd37fc618d67060`

All three adapters have identical proof totals:

| Proof per adapter | React | Vue | Svelte |
| --- | ---: | ---: | ---: |
| Visual passed | 139 | 139 | 139 |
| Visual failed | 20 | 20 | 20 |
| Pressed visually unsupported | 26 | 26 | 26 |
| Structural passed | 185 | 185 | 185 |
| Behavior passed | 189 | 189 | 189 |
| Integrity passed | 189 | 189 | 189 |

Seven selections recovered per adapter,21 in total, with zero regressions.
The comparison independently rehashes477 before/after reference artifact pairs
and verifies477 unchanged threshold projections. Every measured property retains
its prior value, expectation and tolerance. Required coverage remains231 items,
199 mapped,32 missing fixtures and58 enrollment gaps.

Full693-row post-fix export:
`.reflection/button-audit-0.5.1/button-1792137735740-681ddafc-2e1e-4e38-b1ff-19c85da36455/required-item-comparisons.csv`

Machine comparison: `.reflection/button-audit-0.5.1/comparison.json`.
The seven recovered selections use unchanged case-specific thresholds;
the following pixel counts show React examples:

| Selection | Light pixels before→after | Dark pixels before→after |
| --- | ---: | ---: |
| Verify | 121→43 | 149→67 |
| Edit | 124→27 | 144→40 |
| Upload | 107→26 | 131→46 |
| Sort | already passing→26 | 88→25 |

Verify/Edit/Upload already allow75pixels and0.001 ratio; Sort allows60pixels and
0.0008. The earlier investigative prose assumed60for Verify dark; its actual
comparison had already marked67passing. No threshold was changed to recover it.

## Remaining work queue

| Group | Evidence and next action |
| --- | --- |
| Success/default/error/hover, Confirm, success-icon-left light | Remaining differences are concentrated in labels; retain failed visual proof and inspect typography independently. |
| Neutral icon-left default/hover/error; Refresh; Filter dark | Label-localized residuals. Refresh has separate source-outline diagnostics; localization alone does not establish the same cause for every label. |
| Secondary loading | Exterior-border discrepancy is fixed. Native repeated captures still vary within the animated spinner; explicit stateless capture stabilization is missing. Label residuals alone exceed the current threshold. |
| Pressed |26 required selections remain visually unsupported by Reflection0.5.1; never substitute default screenshots. |
| Standard focus |12 declared rows lack enrolled fixtures/proof. Shared2px ring/4px clear-gap policy is already approved; source-rule composition and independent references remain to be enrolled. |
| Other missing fixtures | Loading variants, XS, generic icon-only/both-icons, full-width and toggle applicability/mapping remain visible in the inventory. |
| External interactive UI | Keep the existing inspector until the external UI integration gate passes. |

Focus source/batch preparation is documented in
[the focus enrollment note](button-focus-enrollment-2026-10-16.md). A concrete
compiler proposal is retained at
`.reflection/button-audit-0.5.1/focus-rule-proposal.md`.

The loading reproducibility issue is documented for the Reflection session in:
`/Users/niklaswestman/Documents/extras-projects/reflection/CODE/reflection/REFLECTION-STATELESS-CAPTURE-STABILIZATION-BRIEF.md`

Repeated loading captures still differ within the spinner and its antialiasing
fringe. Canonical light/dark pixel counts are122/147 React,113/145 Vue and117/146
Svelte, all above the unchanged75-pixel threshold. Independently isolated label
residuals also exceed that threshold; capture stabilization alone will not resolve
loading fidelity. Do not freeze motion by substituting a different interaction
state or redesign the spinner from an arbitrary animation phase.

A source-compatible official Instrument Sans variable-font probe did not recover
any tested failure. Confirm remained75/75; Filter44/63 became45/63; Refresh86/98
became86/89. Geometry remained unchanged. This experiment does not justify a
production font replacement or establish Figma authoring-font binary identity.
Artifacts: `.reflection/button-audit-0.5.1/variable-font/notes.md`.

## Inspector and checks

The existing comparison matrix now has a Proof filter plus explicit unsupported,
not-run and error results. Its caption shows both visible rows and the unchanged
family denominator. Behavior-only obligations retain their own proof scope;
normal integrity/coverage guard failures remain discoverable. Adapter boundaries
and exact-stage reruns have browser regression coverage. Images use declared
artifact roles instead of filename guesses. Pressed structural screenshots are
explicitly labeled as structural captures with unsupported visual proof; they
cannot supply a passing visual comparison.

A fresh inspector instance is available at `http://127.0.0.1:6175/`. Select Button,
Proof=Visual, Result=failed/unsupported, then inspect exact Figma/adapter images
and diff links. The current run is already selected. The inspector has no
acceptance or promotion action.

Live Chromium verification confirms Visual/failed shows22 required rows (20 unique
failed selections plus mapped obligations), Visual/unsupported shows26 rows, and
All retains231 rows. The family coverage panel remains231/199/32/58 throughout.
The first failed row loads the exact-run reference and all three adapter images;
the first Pressed row loads all three structural captures with explicit unsupported
visual labels. Lazy loading of offscreen images is retained.

Checks already completed after the correction:

- Governance unit suite:255tests pass; package typecheck passes.
- Full governance browser suite:79tests pass before the final artifact-role test;
  the final inspector suite independently passes20tests, including that addition.
- Focused frame-position suite:6tests pass across synthetic/real adapter cases.
- Inspector suite:20tests pass, including artifact roles, denominator/filter/rerun controls;
  independent review reran the two targeted role/filter regressions.
- UI build and JavaScript syntax pass.
- Reflection doctor passes for all three adapters; fixture checks and20guard tests pass.
- Focused Button static/runtime validation passes; package typecheck passes.
- Governance review and all three native Reflection reviews complete successfully
  as reporting commands; the failed proof remains blocking. Native reviews each
  retain20 blocking visual failures.
- The all-adapter governance verification exits1 because required proof fails.
- `pnpm design:check` exits1 on existing cross-family Figma reference/token and
  Badge runtime-token gaps. `pnpm governance:ci` exits1 on active compact-source
  identity and incomplete project enrollment. Neither gate is waived.

Logs and generated evidence remain under `.reflection/button-audit-0.5.1/`.
The next independent implementation batch is primary keyboard focus in light/dark,
using pinned focus-rule composition and real Tab activation before extending to
remaining variants. Loading capture-policy work belongs to the Reflection session.

No family completion, owner acceptance or reference promotion is claimed.
