# Reflection 0.5.0 integration — 2026-10-16

Historical checkpoint. The font-name classification below is superseded for the
six fresh Refresh cases by [the 0.5.1 verification](reflection-0.5.1-integration-2026-10-16.md).
Native visual failures remain unchanged.

Published `reflection-check@0.5.0` is pinned exactly in the root and private
governance package, with the workspace lockfile updated. The registry confirmed
publication during this work; the pasted handoff's unpublished status was stale.
No runtime component, visual threshold, active reference, inventory denominator,
owner acceptance or promotion changed as part of this integration.

## Delivered

- A reusable explicit-capture converter produces self-contained
  `reflection.text-source/v1` bundles using Reflection's production image decoder.
- `pnpm reflection:text:prepare -- --plan <plan.json>` creates fresh ignored
  source bundles and isolated React/Vue/Svelte configurations. It selects exact
  enrolled case/mode identities and retains their native framing/state/thresholds.
- Original source SVGs and captures, hashes and conversion receipts are preserved.
  Null reported keys remain null, caller attestations stay explicit, and live
  observations are never relabelled as a pinned authoring version.
- Source boxes and outline positions preserve fractions. Unknown baseline,
  authoring-font checksum, direction and PostScript name are not manufactured.
- WebP codec version guard, governance skill, operator guide and tracker now match
  the exact 0.5.0 dependency. The proposed provider does not yet project the new
  records; no claim of interactive UI acceptance is made.

See [operation and plan format](../guides/reflection-text-diagnostics.md).

## Compatibility evidence

`.reflection/upgrade-0.5.0/compatibility.json` records30 sampled checks:
24 staged WebP comparisons (default/Hover/Disabled/Refresh × two modes × three
adapters) and6 historical active PNG checks (default × two modes × three
adapters). Three dark PNG references are missing, and those missing-baseline
failures remain explicit. Before0.4.0 and after0.5.0 all30 outcomes agree; the27
actual image comparisons have identical expected/actual/diff SHA-256 hashes
(81 native artifacts). Missing baselines are not counted as image comparisons.

The samples retain their failures: staged Refresh fails in both modes, and the
historical active dark PNG default fails because its baseline is missing. This is scoped upgrade compatibility,
not an all-family before/after equivalence claim or source certification.

## Fresh Refresh diagnostics

Preparation:
`.reflection/text-diagnostics/1792133031799-06593532-c549-4887-8107-d61057153abe/`

Its `preparation.json` identifies all six case/config combinations;
`diagnostic-summary.json` identifies each exact run. All six doctor checks accept
the source bundles; all six diagnostic records are `available`. Native visual
runs exit1 and fail, as they must. All three adapters produce the same totals:

| Actual comparison / diagnostic experiment | Light pixels | Dark pixels |
| --- | ---: | ---: |
| Native HTML implementation | 86 | 98 |
| Full outlined frame | 15 | 20 |
| Independent text-outline overlay | 16 | 20 |

`.reflection/upgrade-0.5.0/diagnostic-compatibility.json` confirms six native
outcomes and all18 expected/actual/diff artifacts are unchanged when enabling
diagnostics. The experimental renders never replace native evidence.

The React HTML report was inspected in Chromium through Playwright: two separate
text-diagnostics panels, native failures visible, diagnostic-only warnings and
source/runtime observation tables present. All24 image elements decode after
lazy images are loaded. The only console/network error was a missing favicon.
This is report verification, not the external interactive UI gate.

## Font-name classification follow-up

Reflection currently returns `font-identity-mismatch-observed` for every case.
The only mismatching observed field is `font.identity`:

- Independent Figma family: `Instrument Sans`, styleMedium, weight500.
- Actual CDP painted font: familyName`Instrument Sans Medium`,
  PostScript`InstrumentSans-Medium`, customfonttrue, glyphCount7.
- The local font file itself names its family `Instrument Sans Medium` (name1)
  and its PostScript name `InstrumentSans-Medium` (name6). It is registered in
  CSS under `Instrument Sans` at weight500.

Reflection's family-only string comparison treats the static font's internal
style-qualified name as different from the CSS/source family. This is a likely
classification false positive; the naming difference alone does not establish
fallback or prove the authoring binary matches. No source PostScript name was
invented to obtain a preferred inference. Keep the raw record and its uncertainty.

A detailed reproduction and correction brief is saved for the separate Reflection
session at:
`/Users/niklaswestman/Documents/extras-projects/reflection/CODE/reflection/REFLECTION-0.5.0-MARWES-FONT-IDENTITY-FOLLOWUP.md`

That engine correction needs controls for genuine fallback, wrong weight/style,
explicit PostScript conflicts and mixed-script fonts while preserving native
outcomes. Marwes has not patched Reflection's engine locally or published anything.

## Verification and remaining gates

- Governance unit suite:255 tests in33 files pass, including converter/preparation
  integrity controls. Final focused tests are rerun after small CLI corrections.
- Governance typecheck passes.
- Governance browser suite:75 tests in11 files pass.
- Reflection fixture-import checks and20 fixture guard tests pass.
- Focused Button static/runtime validation passes (50 source tokens,17 mappings).
- `pnpm reflection:doctor`: all three adapter configs pass.
- Fresh normal active-reference visual runs: each adapter has44 passed and159
  failed checks. React's root visual command stops at its failure; Vue and Svelte
  were run independently afterward. These are actual gate failures, not certification.
- `pnpm design:check` fails on outstanding cross-family parity errors.
- `pnpm governance:ci` fails its active-source/incomplete-enrollment preflight.
- `pnpm reflection:review` collects remaining blocking failures; review output
  does not provide human approval.

Canonical WebP reference promotion, complete Button coverage, source-policy
questions, Pressed capture and external interactive UI acceptance remain open.
Do not expand beyond Button or claim full family compliance from this integration.
Generated reports/captures remain local/CI artifacts. A clean checkout does not
need these ignored live inputs for the converter's synthetic unit tests; no final
clean-checkout project certification is claimed.
