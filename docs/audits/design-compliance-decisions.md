# Design compliance decision queue

Updated 2026-10-15. This queue supports the
[32-family rollout](../guides/design-compliance-rollout.md). Entries are unresolved
until linked source evidence, implementation verification or an explicit owner
decision resolves them. This document grants no visual approval or promotion.

| ID | Affected scope | Question / evidence | Proposed resolution | Resolution required |
| --- | --- | --- | --- | --- |
| DC-001 | Button sizes — source resolved | Small primary `1606:14342` and secondary `1606:14396` use size mode `1593:6`: 32px height, 8px vertical / 12px horizontal padding. Large selections `1606:14730` / `1606:14797` use mode `1593:7`: 48px height, 16px / 24px padding. Both use 14px labels with 16px line height. Bound aliases confirm these values. Destructive master `1364:11356` independently uses 36px height and literal 10px / 16px padding. | Correct generic small/large geometry; preserve the destructive purpose override. No contradictory design choice remains. | Source resolved and runtime corrected; staged visual verification and owner promotion still required. |
| DC-002 | Button Pressed | Genuine held-pointer Pressed must match structural and visual evidence. Runtime support alone is insufficient. | Exercise a real pointer-down for capture, measure and screenshot the same state, release/cleanup safely, and add a defect control. Do not fake expected colors or inject a replacement style. | Blocked: published Reflection 0.4.0 supports Hover/Focus only. Pressed visual selections remain required and explicitly unsupported in governance; native pointer-down structural measurement is available. |
| DC-003 | Button remaining public selections | XS, both-icons, generalized focus, full-width and loading applicability lack complete source policy. Existing focus/loading examples do not cover all combinations; purpose catalog selections are available. | Preserve required gaps, enroll available source selections, and distinguish missing authority from missing fixtures. Verify actual wrapper defaults rather than fixture overrides. | XS/both-icons/focus/full-width/loading policy remains unresolved; default purpose icon and Svelte marker corrections await fresh final evidence. |
| DC-004 | Layout and noninteractive primitives | Some public families lack dedicated component frames or meaningful interactive behavior. | Use approved Figma token/layout rules with independent assertions; record behavior applicability explicitly. Never manufacture a Figma oracle from runtime output. | Approved authority/applicability per selection; passing automated proof does not supply approval. |
| DC-005 | All families / external inspector | `reflection-check-ui` is developed in another session. Availability, provider compatibility and acceptance must be demonstrated rather than inferred from the brief. | Deliver the versioned Marwes provider, retain the current inspector, and accept real Button plus independent non-Marwes fixtures before expanding beyond Button. | External UI integration tests and actual inspection; continue Button/inventory if unavailable. |
| DC-006 | Reference conversion | Reflection 0.4.0 is published with native WebP support; Marwes must independently verify integration, receipts and decoded pixels. | Pin exactly 0.4.0, establish unchanged-PNG compatibility, then stage lossless WebP conversion with original/new hashes and full RGBA equality checks. | Codec/receipt/staging support verified. Exact-stage approval remains required. Old PNG cleanup must be separately approved after active WebP verification; conversion alone does not reduce committed storage. |
| DC-007 | Existing and future stages | Earlier staged Button passes do not approve active source/reference replacement. Shared input changes can stale stages and run acceptance. | Present exact stage ID/hash, fingerprint, destinations and reviewed differences after implementation settles; obtain owner-authored approval and verify active inputs after apply. | Approval bound to the unchanged stage and separate current run review. |
| DC-008 | Button residual visual differences | After source-backed text-box, paint, icon and Spinner fixes, the 185-selection React diagnostic has 132 passing and 27 failing supported captures; 26 Pressed selections remain unsupported. All 185 independent React structural checks pass. Static Instrument Sans and current Google fonts produce the same tested pixels; smoothing and baseline probes did not supply a justified fix. | Preserve each case's established thresholds. Inspect remaining glyph, stroke and compositing differences from exact-run artifacts; obtain additional independent font-outline/source evidence where needed. Do not shift individual captions, mask differences or infer pixel equality from matching geometry. | Visual proof remains failed until resolved. This is not a threshold or exception approval. |
| DC-009 | Button standard focus policy — owner resolved | Actual Standard master `1364:11348` / example `3977:38660` surrounds a 66×40 Primary control with a 78×52, radius6 frame: a 2px ring and 4px clear gap. Its caption says “2px offset”. | Niklas selected “Use captured 4px gap across Button” on 2026-10-15, explicitly covering variants, purpose wrappers and IconButton. Implement the shared `:focus-visible` rule and exact Semantic/Brand ring colors. Keep Increased contrast separate. | Geometry and shared applicability approved; implementation uses a 2px ring / 4px gap. Focus fixtures, independent structural enrollment and staged visual proof remain required. This does not approve references or accept a run. |
| DC-010 | Button Refresh and related Ghost icon captures | Purpose instances `3978:38909` / `3978:39216` resolve to 12px master `1382:9310`, filled Union `1382:9311`. The current stroked `refreshCw` approximates that shape; independent native-size comparison identifies 38 pixels with alpha difference above 25/255. Upload's analogous comparison has only two such pixels, so its larger Button failure cannot be attributed primarily to the icon path. | Derive canonical Refresh geometry from the pinned Union and preserve public Icon `strokeWidth` behavior; verify the glyph independently before regenerating affected adapter evidence. Do not classify all remaining failures as unavoidable font rasterization. | Implementation and fresh proof; public API behavior must remain compatible. No threshold exception is proposed. |
| DC-011 | Button text-raster residuals (supersedes DC-008's "no exception" stance for these rows only) | 15 required visual rows (per adapter) fail by 3–53 px over limit; all diffs are label-only. Hinting/subpixel launch flags, fonts and CSS changed nothing. See the [debrief addendum](button-debrief-2026-10-16.md). | Per-selection limits set to measured + 10 px, each marked `ACCEPTED TEXT-RASTER DEVIATION` in the contract. | Owner decision by Niklas, 2026-10-16. Not a reference approval or run acceptance; a fresh run is required. Do not extend to other selections. |

## Maintaining this queue

Refresh typography investigation completed: source glyphs closely match after
alignment, inferred baseline and measured runtime baseline agree, and the exact
Figma reference-frame SVG renders within the existing pixel thresholds. Actual
HTML labels still fail (86/98 pixels); tested CSS and font-asset alternatives do
not improve them. See [the typography diagnosis](button-typography-2026-10-15.md).
No runtime correction or acceptance exception is justified by this investigation.
Future Reflection text-proof policy must remain separate from the current failed
PNG gate and needs an explicit change to the approved completion rules.

DC-010 implementation update: the canonical Refresh outline and public
color/stroke compatibility are corrected and independently reviewed. See the
[Refresh checkpoint](button-refresh-2026-10-15.md). The remaining whole-button
failures are dominated by label pixels; source font names match but Figma's binary
identity is unavailable. Obtain independent outlined glyphs or font bytes before
choosing another rendering correction. No threshold exception or promotion is
approved by this finding.

Add a selection-level entry when source inspection leaves a real design question.
Include source file/node/mode identity, public API trigger, observed/expected facts,
affected adapters and a proposed resolution. Link immutable evidence, not only a
mutable screenshot or historical narrative. Do not broaden a family-wide blocker
when independent selections can continue.

Resolve an entry with the decision or verified evidence, date and resulting
stage/run identities. Agent-authored recommendations are not owner decisions.
Retain resolved entries as history; changed inputs may require renewed review.

## Owner mapping decision — 2026-10-15

Niklas explicitly selected **“Map neutral to Figma Ghost (recommended)”** for the
neutral visual role and Cancel, Copy, Filter, Sort, Close and Refresh wrappers.
Apply the existing Ghost source bindings, including button/text label/icon tokens,
rather than similarly named neutral variables. This resolves component mapping;
it does not approve reference promotion or accept a validation run.

The [Button source audit](button-source-authority-2026-10-15.md) records available
state, purpose and loading selections. Those are enrollment opportunities, not
missing-design claims. XS, both-icons, persistent toggle appearance and general
focus/loading/full-width applicability still require explicit source policy.

Current enrollment is 185 visual selections and four behavior-only form fixtures
(567 case/adapter comparisons). The 185 Figma PNG exports use the pinned October
14 capture; no raw REST refresh was performed. Final staged verification passes
185 structural and 189 behavior checks per adapter; visuals have 132 passes,
27 failures and 26 unsupported Pressed captures per adapter. The
[checkpoint](button-compliance-2026-10-15.md) records exact identities and remaining
coverage gaps. These results do not resolve any promotion decision.

Niklas confirmed on 2026-10-15 that the external Reflection UI is not yet
available and selected “keep the existing inspector.” Continue Button and
inventory work; this does not waive the external UI gate for broader rollout.

Niklas subsequently approved the captured standard 4px focus gap across Button
variants, purpose wrappers and IconButton. This resolves generalized standard-focus
applicability in DC-003/DC-009; the remaining missing focus fixtures and proof are
implementation gaps. The shared dark ring token now follows `focus/ring`
`3973:38643` → Brand `Primary/Light` `1358:7244` → `Blue/200` (`#ABABFD`),
with Semantic Dark `1358:2` and Brand Marwes `1358:13`. Light remains `#2F31FC`.
This source-backed token correction affects other focus consumers and stales
their older evidence too.


## Report triage decision — 2026-10-16

Niklas requested that selections without design references may be skipped for
visual review while prominently flagged for design work, with important issues
at the top of the report. This is recorded as a review disposition, separate from
canonical proof outcomes and full design coverage. It authorizes no fabricated
source absence, baseline promotion or relaxation of comparison thresholds.

Confirmed source absence uses `source.availability: "needs-design"` and a concrete
reason. Unknown source mappings use `needs-mapping`; approved token/layout rules
use `rule-defined`. Missing captures/fixtures remain engineering or capture gaps.
Structural, behavior and accessibility obligations remain independently visible.

The12 missing public Button focus obligations now identify the existing approved
DC-009 rule (Figma Standard1364:11348,2px ring/4px clear gap). This changes triage
metadata only; independent assertions and fixtures are still missing. The other20
unmapped requirements are not yet confirmed absent designs. The total231 required
rows and32 missing fixtures are unchanged. The current report remains historical,
staged and unreviewed until fresh canonical verification.
