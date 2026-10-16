# Marwes design compliance rollout

Implementation tracker for the approved 32-family rollout. Updated 2026-10-16.
This is the current delivery plan; older research, specifications and audit
reports remain historical evidence. Checkboxes mean verified acceptance, not
that a file or implementation exists.

## Target and authority

- Design source: the pinned 2026-10-14 capture of Figma file
  `nybMu3iJUnnOvWtuxjMG8b` (Marwes governance — 2026-10-14).
- Runtime scope: React, Vue and Svelte in Chromium, with compatible public APIs.
- Reflection dependency: published `reflection-check@0.6.0`, pinned exactly.
- Reference storage: lossless WebP, through native Reflection support and staged
  receipt-preserving conversion. Comparison thresholds remain unchanged.
- The [project inventory](../../packages/design-governance/src/contracts/project-inventory.json)
  maps 32 public families to validation groups. Input owns `input-fields`,
  `input-otp`, `input-types-overview`, `select` and `textarea`; these remain distinct
  groups. There are 36 required validation groups and 18 visually enrolled groups
  at inventory creation. Required groups include families not yet visually enrolled.
- Required item inventories come from public API, registry and pinned Figma
  selections. Missing selections stay in the denominator. Runtime output never
  supplies its own expected design.

A family is complete only when every applicable required selection has
authoritative expectations, all required structural, visual, behavior and
accessibility proof passes across all three adapters, the exact references are
owner-approved and promoted, and fresh verification against active references
passes. Noninteractive selections need an explicit behavior applicability record.
Primitives without component frames need approved Figma token/layout rules and
independent assertions. Unresolved authority or proof remains blocking.

## Starting evidence and live status

The prior Button milestone enrolled 19 selections and recorded 57 passing staged
comparisons, while its expanded inventory exposed 198 additional missing fixtures.
These are historical counts, not current certification: shared changes stale runs,
and enrollment is growing. Inspect the newest exact run before making a claim.
Existing Checkbox, Dialog and Badge work must also be reverified.

The current Button enrollment has 185 visual selections plus four behavior-only
form fixtures, producing 567 case/adapter comparisons in a full three-adapter
run. The final staged run passes all 185 structural and 189 behavior checks per
adapter; visual results per adapter are 132 passed, 27 failed and 26 unsupported
Pressed captures. Coverage retains 231 required obligations, including 32 missing
fixtures. A subsequent owner-approved shared focus update stales that run; its
recorded results are historical. See the [checkpoint](../audits/button-compliance-2026-10-15.md)
for exact run/stage hashes and failed gates. The 185 Figma PNG exports are bound to the pinned October 14 capture;
the export did not refresh the raw REST source. Default purpose icons and Svelte
purpose markers were corrected to exercise actual wrapper defaults. Niklas
approved mapping Neutral and six wrappers to Ghost; that decision grants neither
reference promotion nor run acceptance.

The historical [October16 audit](../audits/button-audit-2026-10-16.md) supersedes those
historical totals. The staged0.5.1 all-adapter run recorded139 visual passes,
20 failures and26 Pressed unsupported per adapter, with185 structural and189
behavior passes each. A Button fixture-origin correction recovered seven
selections per adapter without changing references, thresholds or measured
geometry. All231 required items remain visible, including32 missing fixtures.
The inspector now filters by proof/result and labels structural-only captures
explicitly. Exact stage/run identities and the next focus-enrollment batch are
in the audit. No references have been promoted and no family is complete.

The machine inventory distinguishes missing, unverified, passed and failed proof.
Unknown required-selection counts are `null`, not zero, until inventories exist.
File presence establishes enrollment only. Track each group's source, inventory,
fixture, structural, visual, behavior, review and promotion status independently.
No family is marked complete by this document. Open design and integration
questions live in the [decision queue](../audits/design-compliance-decisions.md).

Required-selection research now covers the remaining 31 families:
[foundations](../audits/required-inventory-foundations.md),
[inputs and selection](../audits/required-inventory-inputs.md),
[content and navigation](../audits/required-inventory-content-navigation.md), and
[overlays](../audits/required-inventory-overlays.md). These drafts distinguish
public API axes, available Figma selections and unresolved applicability. They
do not enroll fixtures, approve exclusions or turn unknown required counts into
zero. Several active compact snapshots still identify the historical June
capture and require staged October source replacement before certification.

Read-only project status and proposed UI provider export:

```bash
pnpm governance:inventory
pnpm governance:provider
```

The provider is available at `GET /api/provider/v1` on the existing inspector server.
It is a versioned artifact manifest, not a self-contained bundle or an accepted
external UI integration.

`governance:inventory` assesses validated current evidence, including an invalid
latest run; it must not fall back to an older pass. CI fails closed for missing
required enrollment. Neither enrollment nor provider availability completes the
external UI gate.

The subsequent 0.5.0 upgrade adds optional text diagnostics without changing
acceptance. See [integration evidence](../audits/reflection-0.5.0-integration-2026-10-16.md)
and [operation](reflection-text-diagnostics.md). The external interactive UI
and canonical Pressed enrollment remain separate gates.

Historical Reflection 0.5.1 adoption corrected the style-qualified
font-family classification; fresh six-case verification is recorded in the
[0.5.1 integration audit](../audits/reflection-0.5.1-integration-2026-10-16.md).
The converter retains source family/style and unknown authoring-font identity.
Historical 0.5.0 diagnostic inferences are not current evidence. This correction
does not change native visual acceptance, reference promotion or required coverage.

Published0.6.0 is now pinned exactly. The [integration checkpoint](../audits/reflection-0.6.0-integration-2026-10-16.md)
verifies real Pressed capture and independent loading stabilization on all three
adapters, with repeated decoded-pixel equality. Previous canonical family runs
are stale after the upgrade. Canonical Pressed guards remain pending until explicit
policy enrollment and a fresh full-family run; diagnostics do not update coverage.
All26 Pressed selections are now capturable in each adapter:23 pass and three
fail visually in the diagnostic batch, with zero capture errors. Loading label
failures remain visible under unchanged thresholds.

Historical compatibility evidence: `.reflection/upgrade-0.4.0/comparison.json` records
63 frozen PNG cases per adapter: 44 passed and 19 failed before and after the
upgrade, with no changed outcomes. Those retained failures remain blockers.

WebP conversion stages retain old PNG files. Actual committed-size savings
require a separately approved cleanup after active WebP verification succeeds;
no old canonical images have been deleted.

The subsequent [Refresh checkpoint](../audits/button-refresh-2026-10-15.md)
records the canonical icon correction, preserved public color/stroke behavior,
affected-adapter diagnostics and remaining independent font-source gap. It is
selected-case diagnostic evidence, not a new passing family run.

The [Refresh typography investigation](../audits/button-typography-2026-10-15.md)
isolates a dominant native-text versus outlined-vector rendering discrepancy.
It provides no justified font/CSS correction or waiver of the failed visual gate.

A [portable HTML report](../audits/portable-html-report-2026-10-16.md) is available
from the existing inspector and `governance:report`. Add `--html` to the next full
verification to retain its exact-run comparison table, missing rows, measurements,
images and review state as an offline artifact. The current exported example is
historical/stale; export does not refresh proof, promote references or satisfy the
external Reflection UI gate.

## Delivery gates

### 1. Inventory and evidence rules

- [x] Reconcile every public registry family and enrolled visual group with the
  project inventory; preserve newly discovered required families.
- [ ] Declare applicable selections from public API and source, including missing
  design selections; avoid meaningless combinations.
- [x] Bind current exact-run proof to project status; never infer passing proof
  from contract existence or an older successful run.
- [ ] Record unresolved source/design questions with affected selections and
  proposed resolutions; continue independent work.

### 2. Reflection, WebP and the external UI

- [x] Pin 0.4.0 in workspace declarations and lockfile; establish compatibility
  against unchanged PNG references before conversion.
- [x] Support WebP receipts, staging, artifact MIME types and integrity checks.
- [x] Through the production decoder, prove lossless RGBA equality including
  transparency and hidden RGB values, and equivalent comparison results.
- [ ] Stage converted references with old/new hashes and preserved Figma
  provenance. Apply only after approval of that exact stage.
- [ ] Agree and test the versioned Marwes provider interface with
  `reflection-check-ui`, developed in the separate Reflection session.
- [ ] Demonstrate the real Button inventory, exact-run reference/adapter images,
  missing rows, stable denominators, synchronized zoom, side-by-side/diff views,
  artifact rejection and staged reruns in the new UI.
- [ ] Prove the UI works with a second, non-Marwes fixture.

Keep `figma-governance-one` available until UI acceptance passes. Marwes retains
source selection, policy and approvals; the external UI presents evidence. The
provider carries family/item dimensions, run/adapter identity, proof outcomes,
measurements, artifact hashes/MIME/provenance, freshness and active/staged scope.
If the UI is unavailable, continue inventory and Button; expansion beyond Button
waits for the UI acceptance gate. Keep generated runtime/report images in their
native formats; canonical references and compact contracts belong in Git, while
runtime captures and historical reports belong in retained CI artifacts.

### 3. Complete Button

- [ ] Revalidate the 19 default selections.
- [ ] Enroll Hover, Pressed and Disabled across mapped variants, icons and themes.
- [ ] Enroll small and large sizes; resolve the small-size source discrepancy.
- [ ] Cover remaining variants, sizes, icon arrangements, full width and
  loading/error/focus selections using authoritative expectations.
- [ ] Cover purpose wrappers and semantic actions without public API breakage.
- [ ] Prove keyboard/focus, disabled activation, submit/reset, navigation, loading
  and accessible names where applicable through executable, hash-bound evidence.
- [ ] Complete required coverage, owner review, promotion and fresh active proof.

Historical0.5.1 evidence marks Pressed visually unsupported. Reflection0.6.0
now supports native pointer-down capture; canonical policy enrollment and fresh
full-family proof are still required. XS, both icons, full-width and loading
policy questions remain visible in coverage. Niklas approved the captured standard
2px focus ring / 4px clear gap across Button variants, purpose wrappers and
IconButton; focus fixture enrollment and fresh proof are still missing. Increased
contrast remains separate. Existing loading examples do not authorize every public
combination.

Each batch selects exact Figma nodes/modes, adds independent mappings and actual
adapter fixtures, stages matching references/receipts, fixes the responsible
layer, verifies all adapters, and presents the exact stage for owner approval.
After approval, promote through the package and verify active inputs again.
An implementation approval does not authorize reference promotion or owner review.

### 4. Remaining family waves

Begin only after Button and external UI acceptance. Apply the same batch workflow
and independent review to each family. These checkboxes represent full completion.

| Wave | Required families |
| --- | --- |
| Foundations | [ ] Text; [ ] Paragraph; [ ] Heading; [ ] Icon; [ ] Spacing; [ ] Stack; [ ] Divider; [ ] Skeleton; [ ] Spinner; [ ] Progress Bar |
| Inputs and selection | [ ] Checkbox; [ ] Radio; [ ] Switch; [ ] Segmented Control; [ ] Input (all five groups); [ ] Slider |
| Content and navigation | [ ] Badge; [ ] Avatar; [ ] Card; [ ] Stat Tile; [ ] Banner; [ ] Breadcrumb; [ ] Pagination; [ ] Tab |
| Overlays and composite interactions | [ ] Accordion; [ ] Tooltip; [ ] Context Menu; [ ] Dialog; [ ] Drawer; [ ] Toast; [ ] Date Picker |

Stabilize shared core/token changes before final evidence for affected families.
Require documented keyboard, selection, expansion, dismissal, focus restoration
and validation behavior where applicable. Design questions block the affected
selections; they do not disappear from the tracker.

## Commands and verification

Run from the repository root with Node >=22.12.0 and the workspace pnpm version.
Use the [inspector guide](figma-governance-one.md) for setup, staging schemas and
recovery. For one family:

```bash
pnpm governance:status -- --family button --json
pnpm --filter @marwes-ui/design-governance validate -- --family button
pnpm --filter @marwes-ui/design-governance validate-runtime -- --family button
pnpm governance:verify -- --family button --adapter all
pnpm governance:review -- --family button
```

For proposed references, replace the verification command with
`pnpm governance:verify -- --family button --stage <stage-id> --adapter all`.
Staged passes do not establish active compliance. A completed job may contain
failed or blocked proof and exit nonzero. Collect independent review evidence
even when another gate fails:

```bash
pnpm reflection:doctor
pnpm reflection:visual
pnpm reflection:review
pnpm governance:ci
pnpm design:check
```

Engine changes also require package tests/typecheck; browser, fixture and inspector
changes require browser tests, `pnpm reflection:fixtures:check` and UI build as
applicable. See [testing](../reference/testing.md).

## Final acceptance and failure recovery

- [ ] All 32 families satisfy the completion rule; no required authority, fixture
  or proof is missing.
- [ ] Approved active WebP references pass on all three adapters.
- [ ] Governance CI, Reflection gates and `pnpm design:check` pass after shared
  changes settle; UI totals, provenance and review state match exact evidence.
- [ ] A clean checkout validates from committed compact inputs without credentials
  or ignored raw captures.
- [ ] Regression controls detect geometry, paint and behavior defects, missing
  fixtures, mismatched run/theme/adapter evidence, tampering and stale inputs.
- [ ] Refresh docs, governance skill, retention policy and this tracker match the
  implemented system.

For missing source, queue selection/authority work; do not derive expectations
from CSS. For stale evidence, rerun after edits settle; never edit old reports.
For invalid artifacts or receipts, repair inputs and create a new stage/run.
For visual failures, inspect exact expected/actual/diff images and fix the owning
layer rather than changing thresholds. Interrupted promotion requires transaction
recovery before retrying, as documented in the inspector guide.

Chromium is the certification target. Later Figma refreshes, additional browsers,
public API changes, publishing and deployment are separate decisions.
