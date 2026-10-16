# Reflection 0.5.1 integration — 2026-10-16

Published `reflection-check@0.5.1` is pinned exactly in the root and private
Marwes governance package, with the lockfile and WebP codec version guard updated.
The six Refresh cases were prepared and run afresh, using the existing independent
source captures and staged lossless-WebP references. No new Figma capture was
needed. Historical 0.5.0 diagnostics were retained for comparison, not reused as
current evidence.

## Result

All six combinations (React, Vue, Svelte × light/dark) now report:

- Diagnostic state: `available`.
- `font.identity`: `match`, classification `style-qualified-family-alias`.
- Source family/style: `Instrument Sans` / `Medium`.
- All four runtime registration/painted-font evidence checks pass.
- No other source/runtime observation mismatches.
- Inference: `native-text-vector-rendering-discrepancy-suspected`, confidence `low`.

The source PostScript name and authoring-font checksum remain unknown. The source
is still live, unversioned and caller-attested, with a null reported file key.
A name-level match does not prove authoring-font binary identity or full-string
shaping. The 0.5.0 false mismatch classification is superseded for these six cases.

| Native comparison / diagnostic experiment | Light pixels | Dark pixels |
| --- | ---: | ---: |
| Actual HTML screenshot | 86 | 98 |
| Full outlined frame | 15 | 20 |
| Independent label overlay | 16 | 20 |

These totals are identical across all three adapters and unchanged from 0.5.0.
Every native Refresh comparison still fails and each adapter's visual run exits1.
The patch fixes the diagnostic classification; it does not establish compliance.

## Integrity and compatibility

`.reflection/upgrade-0.5.1/verification.json` checks the exact reports and actual
artifact bytes, not just filenames or declared hashes:

- Six native outcomes, thresholds and all18 expected/actual/diff artifacts match
  their 0.5.0 equivalents.
- All six diagnostic experiment measurements remain unchanged.
- Each new diagnostic binding key differs from its old key, and every report
  identifies Reflection0.5.1.
- The source's missing PostScript name and checksum remain in evidence gaps.
- Three additional historical active PNG image comparisons retain identical
  outcomes and all9 native artifacts. Three missing dark PNG baselines remain
  explicit failures and are not counted as image comparisons.

Fresh preparation:
`.reflection/text-diagnostics/1792134756621-a99b7997-de2b-4864-a063-35d52ee0cc62/`

Its `preparation.json` identifies exact case/config selections;
`diagnostic-summary.json` identifies all three exact run directories. Each run
contains `report.json`, `report.html` and
`visual/<case>/text-diagnostics/record.json`. The new HTML reports include the
alias classification and diagnostic-only boundary; no interactive UI acceptance
is claimed.

## Verification

- Governance unit suite:255 tests in33 files pass, including native WebP codec
  preservation, converter and preparation controls.
- Governance typecheck passes.
- Root `reflection:doctor`: all three adapters pass.
- Generated Refresh configs: all three doctors pass; six bundles validate.
- Fresh scoped visual runs: six retained native failures, six available corrected
  diagnostics. Scoped reviews were collected for all three adapters.
- Fixture-import checks and20 fixture guard tests pass.
- Focused Button static/runtime validation passes.
- `git diff --check` passes.

The full browser unit suite and all-family active-reference visual/design/CI gates
were not repeated for this classification-only patch. Their earlier outcomes are
historical, including the unresolved failures in the
[0.5.0 integration audit](reflection-0.5.0-integration-2026-10-16.md).

No runtime component, threshold, inventory denominator, active reference, owner
acceptance or promotion changed. Complete Button coverage, Pressed capture,
reference approval/promotion and external interactive UI acceptance remain open.
Continue with [the rollout tracker](../guides/design-compliance-rollout.md).
