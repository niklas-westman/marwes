# Button compliance checkpoint — 2026-10-15

This checkpoint implements the first delivery phase of the
[32-family rollout](../guides/design-compliance-rollout.md). It does **not**
certify Button, approve a validation run, or authorize reference promotion.

**Subsequent focus change:** Niklas approved the shared captured 4px gap on
2026-10-15. The preset now uses a 2px keyboard-focus ring with a 4px clear gap,
and the shared Dark focus token follows the pinned `#ABABFD` alias. Those input
changes make the stage and run below historical/stale. Their recorded results
remain unchanged; they are not current proof for the focus update. New focus
coverage and fresh staged verification remain required before acceptance.

Focused follow-up validation passed 150 real Chromium keyboard-focus checks:
50 selections per adapter (six default variants, 18 purpose wrappers and
IconButton, each in Light and Dark). Every selection had a 2px solid outline,
4px offset, the source-selected ring color, and unchanged control bounds.
Local results: `.reflection/upgrade-0.4.0/button-focus-results.json`; focused
screenshots: `focus-{react,vue,svelte}-{light,dark}.png` in the same directory.
Core tests (757), preset tests (130), and focused Button static/runtime governance
also passed after the change. Browser inspection confirms the inspector marks the
previous staged run stale. These focused checks do not replace enrolled Figma
visual comparison or prove increased-contrast focus.

## Delivered scope

- Exactly pinned published `reflection-check@0.4.0`, native lossless WebP
  integration, receipt integrity, staged conversion and rollback checks.
- Public inventory of 32 families and 36 validation groups, retaining 18 existing
  visual groups. Input owns five distinct validation groups. Unknown inventories
  remain unknown rather than becoming zero required selections.
- Exact-run structural, visual and executable behavior evidence, including real
  adapter callbacks, keyboard/disabled behavior and four submit/reset form
  fixtures. Required-item definitions, fixtures, adapters, themes and input hashes
  bind evidence; missing latest results cannot revive an older pass.
- Proposed versioned Marwes UI provider and the retained `figma-governance-one`
  inspector. Behavior-only obligations have no invented reference image or visual
  measurements. Niklas confirmed the external Reflection UI is unavailable;
  its acceptance gate remains required before rollout beyond Button.
- Button enrollment expanded from 19 to 185 visual selections, plus four
  behavior-only fixtures: 189 cases per adapter, 567 case/adapter results.
  The current required inventory contains 231 item/mode obligations; enrolled
  cases and required obligations are different denominators.
- Source-backed fixes to size geometry, state paint, Ghost/neutral mapping,
  purpose defaults, icon and Spinner geometry, alpha tokens and label sizing.
  Public API signatures remain compatible. No comparison threshold was relaxed.

Research drafts cover the other 31 families:
[foundations](required-inventory-foundations.md),
[inputs](required-inventory-inputs.md),
[content/navigation](required-inventory-content-navigation.md), and
[overlays](required-inventory-overlays.md). These are source/applicability drafts,
not enrolled or certified family results.

## Immutable staged inputs

| Identity | Value |
| --- | --- |
| Figma file | `nybMu3iJUnnOvWtuxjMG8b` |
| Pinned version | `2410234809276115335` |
| Source last modified | `2026-10-14T15:02:45Z` |
| Stage | `2e2abb5c-68b2-4447-b8a2-c3dea45345d6` |
| Stage SHA-256 | `07ece2a490d92a7f3d92f59e26d1eaa8fbff8f788c99748bd4988fc7ce935bf7` |
| Input fingerprint | `4e39b169ed2fd22d293bc68014c96204496734046a07cc447e8347271c24d826` |
| Verification run | `button-1792083223493-699a4fbf-bdde-451a-a70b-ee900c670cbd` |
| Report SHA-256 | `55b54d06ecff5a1c20f9cf6fdabc037e1b6aed942f40f5c95f95fdba530edbd1` |

The stage contains 373 artifacts: 185 WebP references, 185 receipts, the converted
reflection contract, a compact source snapshot and its manifest. Destinations are
within `packages/design-governance/reflection-families/button/`. The capture
exports additional selections from the pinned copy; it does not refresh the raw
REST source. Nothing has been promoted or deleted.

Lossless conversion changes 331,178 PNG bytes into 74,204 WebP bytes: **77.59%
less reference-image storage**, with identical decoded RGBA through Reflection's
production decoder. Conversion records preserve original, converted and decoded
hashes and Figma provenance. Old active PNGs remain; actual committed storage
savings require separately approved cleanup after active WebP verification.

Local evidence is intentionally ignored and is not a clean-checkout input:

- `.reflection/upgrade-0.4.0/comparison.json`: frozen unchanged-PNG upgrade
  compatibility, 63 cases per adapter; 44 passed and 19 failed both before and
  after the upgrade, with no changed outcomes.
- `.reflection/upgrade-0.4.0/webp-stage185.json`: exact staged destinations and
  old/new hashes.
- `.reflection/upgrade-0.4.0/webp-conversion185-final.log`: conversion manifest.
- `.reflection/governance/button-1792083223493-699a4fbf-bdde-451a-a70b-ee900c670cbd/`:
  exact-run measurements, behavior evidence, native captures and visual artifacts.

## Validation

When completed, the run was **current, staged, failed and unreviewed**. The later
focus change described above stales it. All three adapters produced identical totals:

| Proof | React | Vue | Svelte |
| --- | --- | --- | --- |
| Integrity | 189 passed | 189 passed | 189 passed |
| Structural | 185 passed | 185 passed | 185 passed |
| Behavior | 189 passed | 189 passed | 189 passed |
| Visual | 132 passed / 27 failed / 26 unsupported | 132 passed / 27 failed / 26 unsupported | 132 passed / 27 failed / 26 unsupported |

The four behavior-only form cases per adapter do not require structural or visual
proof and correctly record those paths as not run. Family coverage is incomplete:
231 required item/mode obligations, 199 fixture mapped, 173 without enrollment
gaps, 32 missing fixtures and 26 Pressed obligations with unsupported visual
capture. These enrollment figures do not count passing comparisons. Additional
source/API-axis gaps, including `Border=False` and generalized focus/loading,
remain explicit. Required coverage proof is therefore unsupported throughout;
passing individual structural/visual/behavior paths do not certify the family.

The 27 failing visual selections per adapter are Success default/hover/error
(both modes); Confirm, Verify, Edit, Upload and Refresh purpose buttons (both
modes); Secondary Loading (both modes); Ghost left-icon default/hover/error
(both modes); Filter Dark; Sort Dark; and Success left-icon default Light.
All original 19 enrolled default selections pass structural, visual and behavior
proof on all three adapters in this run, subject to the family coverage gap.

Browser inspection of `http://127.0.0.1:6174/` verified the exact staged identity,
231 retained rows, real reference/React/Vue/Svelte artifacts and zero broken
loaded images. The provider exposes all 32 public families. Its 12 behavior-only
required rows (which reuse appropriate executable cases) expose zero image
artifacts. While this run was incomplete, the inspector withheld older evidence
instead of reviving an earlier pass. The external Reflection UI gate is unchanged.

Focused checks completed:

| Check | Result |
| --- | --- |
| Governance unit tests | 207 passed across 29 files |
| Governance browser tests | Fresh final suite: 71 passed across 10 files |
| Governance typecheck | Passed |
| Inspector asset build | Passed |
| Core tests | 757 passed |
| Preset tests | 130 passed |
| React Button/Spinner tests | 111 passed |
| Vue Button/Spinner tests | 114 passed |
| Svelte Button/Spinner tests | 46 passed |
| Reflection fixture checks | 20 passed |
| Reflection doctor | Passed for React, Vue and Svelte |
| Focused Button static/runtime governance | Passed: 17 mappings, 50 resolved tokens |
| `pnpm design:check` | Failed: outstanding source/token issues outside Button |
| `pnpm governance:ci -- --skip-browser-install` | Failed at project enrollment and active pinned-source gate |
| Legacy Reflection visual gates | Failed against historical active references; new references remain staged |
| Reflection review | Collected for all three adapters; no owner acceptance |

Logs are under `.reflection/upgrade-0.4.0/`. Tests show geometry, paint,
interaction, callback, missing-fixture, wrong-identity, stale-input and tampering
defects are rejected. The staged run does not establish clean-checkout acceptance
against committed active inputs.

## Remaining work and boundaries

1. Resolve remaining exact-case visual differences without caption-specific
   shifts, masks or threshold changes. Refresh still uses a stroked approximation
   of Figma's filled Union; its source geometry needs further work that preserves
   the public Icon `strokeWidth` contract. Other residuals include glyph and
   compositing differences; matching structural geometry alone is insufficient.
2. Reflection 0.4.0 cannot capture a held pointer-down. All 26 Pressed selections
   remain required and visually unsupported; native pointer-down structural
   measurements do not replace their missing visual proof.
3. Resolve source applicability for XS, both icons, full width, generalized
   loading, icon-only matrices and focus. The exact focus geometry/caption
   conflict and proposed resolution are in the
   [decision queue](design-compliance-decisions.md).
4. Complete and independently inspect all required Button proof, obtain separate
   exact-stage owner approval and run acceptance, promote through the transaction
   path, then verify fresh active evidence. No agent-authored approval is valid.
5. Integrate the actual external Reflection UI and pass its Button and independent
   non-Marwes fixture gates before broader family implementation.
6. Enroll remaining family inventories and pinned compact sources, execute the
   waves, and pass full CI plus clean-checkout validation without credentials or
   ignored captures. No family is certified by this checkpoint.
