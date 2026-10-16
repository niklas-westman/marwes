# Portable governance HTML report — 2026-10-16

The existing inspector now opens and downloads a self-contained comparison report
for an explicitly selected canonical run. This is presentation/export work;
component implementations, Figma references, thresholds and approvals are unchanged.
The external Reflection UI integration gate remains separate.

## Delivered behavior

- Full required item/mode inventory, missing fixtures and unmatched definitions.
- Figma reference beside React, Vue and Svelte, using explicit artifact roles.
- Separate structural, visual and behavior outcomes; applicable-proof case tallies
  remain distinct from required-row coverage and alias counts.
- Supplementary pixel differences and exact-run thresholds, calculated through
  Reflection's production comparator from verified images without changing outcomes.
- Theme/proof/outcome/implementation/search filters with a fixed denominator.
- Synchronized zoom, reference/actual/diff dialog, measurements and provenance.
- Frozen freshness/review, exact run/input identity, stage scope, hashes and manifest.
- Offline opening without requests, credentials, rerun, approval or promotion actions.

CLI: `pnpm governance:report -- --family button --run <exact-run-id>`.
Next full verification can add `--html`; failed checks still return a failed exit.
Files are atomically created without overwriting prior exports. Local default:
`.reflection/reports/`; CI default: `artifacts/reflection/reports/`.
See [operation](../guides/figma-governance-one.md#portable-exact-run-html-report).

## Actual Button snapshot

Run: `button-1792137735740-681ddafc-2e1e-4e38-b1ff-19c85da36455`.

Output: `.reflection/reports/button-comparison-report.html`.

The file contains231 required rows,693 adapter comparisons and2553 embedded
artifacts, approximately22MiB. Of722 displayed table images, all decoded
successfully. Inventory:199 mapped,32 missing fixtures,58 rows with gaps.

This historical0.5.1 run is explicitly **stale, staged and unreviewed**. It is not a
current0.6.0 family run. New Pressed diagnostic results are not spliced into it;
future canonical evidence must arrive through ordinary enrollment/verification.
The export remains useful for inspecting existing failures while preserving that
boundary. No final compliance claim is made.

## Validation and independent review

- Governance unit suite:277 tests pass across35 files.
- Full governance browser suite:86 tests pass across12 files.
- Nine final standalone report browser tests pass, including missing rows, roles,
  wrong runs, malicious labels, proof applicability, reference-hash differences
  and aligned image/frame tops at1920px and1280px. The full86-test suite ran
  before the final three alignment/nonvisual-wording controls were added.
- Final CLI writer/verification tests:9 pass after CI destination adjustment.
- Typecheck, JavaScript syntax, UI build and whitespace checks pass.
- Reflection doctor passes for all three adapters.
- Independent reviewer reran41 focused exporter/catalog/writer/server tests.
- Actual full HTML opened through `file://` with production CSP: zero external
  requests or console errors, all722 table images load, zoom390→780px at200%,
  three-image inspection works, failed filter22/231 and missing filter32/231.
- Live inspector links bind the exact selected family/run; inline report viewing
  also works in the browser with the generated document's restrictive CSP.

Evidence: `.reflection/portable-report-validation/`, including
`offline-smoke.json`, `browser.log`, `final-export.log` and `preview.png`.
Independent review found no blocking issue in this feature.

Project-wide gates remain blocked: `pnpm design:check` exits1 on cross-family
source/token/runtime gaps; `pnpm governance:ci` exits1 on compact-source binding
and incomplete enrollment. A new full component verification was not performed
for this report feature. Existing failed proof remains visible.

## Integrity and practical limits

Explicit run selection happens before catalog source/coverage matching. Missing or
corrupt exact runs never fall back to older passing evidence. Artifacts are checked
for run containment, hashes, MIME and decoder compatibility; image-role artifacts
with unusable types fail closed. Historical active runs without archived policy
omit thresholds instead of using today's policy. Export revalidates inputs and
report/review state after asynchronous work.

The self-contained file is larger than the binary assets due to base64 and full
measurement data. Keep generated reports in ignored local output or CI artifacts;
do not commit these22MiB snapshots. Freshness is evaluated at export time; the
file is not signed and cannot detect later edits or repository changes.
