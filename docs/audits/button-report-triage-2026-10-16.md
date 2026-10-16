# Button report triage — 2026-10-16

Niklas requested a top-level distinction between engineering work and absent
designs, with confirmed design gaps allowed to defer visual review. This update
changes triage and presentation, not component pixels or reference approval.

## Action-first report

The first screen now shows frozen freshness, automated result, recorded engine,
review/scope, recommended next action and six attention queues. Nonvisual required
proof failures get a prominent additional queue when present. Category buttons
filter and scroll directly to affected comparisons; concrete affected-item lists
are expandable at the top. Detailed metadata and proof tallies are collapsed.
The default overview fits1280×720; the status strip remains visible on scroll.

Counts are required item/mode rows. Unique mapped cases and recorded adapter
results are shown separately. Categories overlap; they must not be summed.
The selected historical run still has22 failing required rows (20 unique visual
selections),26 recorded capture gaps and32 missing fixtures. Its old unsupported
Pressed results are not current0.6.0 engine limitations; the top strip identifies
Reflection0.5.1 and stale evidence. Fresh canonical enrollment/verification is next.

## Design disposition

Coverage source metadata accepts an explicit `availability`:

- `needs-design`: confirmed missing treatment, with a concrete reason and no
  selected source node. Visual review reads **Skipped — design needed**.
- `needs-mapping`: unresolved source selection; absence has not been established.
- `rule-defined`: approved rules exist and need independent mapping/fixture/proof
  enrollment; a new dedicated component frame is not automatically required.

No recorded proof outcome is rewritten. Requirements stay in the denominator;
behavior, accessibility and structural obligations are not skipped by a visual
review disposition. Design-deferred captures are excluded from the tool-gap
queue, while other failed required proofs remain prominent. Missing screenshots
or fixtures alone never imply missing design.

The12 public Button focus rows now identify the already approved DC-009 rule:
Figma Standard1364:11348,2px ring and4px gap. This is source triage metadata,
not newly enrolled assertions. The remaining20 source selections are unresolved,
not confirmed absent designs. The report therefore shows0 confirmed design skips,
20 source mappings,12 approved-rule enrollments and32 missing fixtures.
Availability/reason participates in exact requirement matching so changed triage
cannot reuse an older requirement's evidence.

## Validation

- Full governance unit suite:279 tests pass across35 files.
- Focused source/coverage/store/provider checks:41 tests pass.
- Final standalone report browser suite:16 tests pass, including compact viewport,
  nonvisual failures, explicit design skip vs unknown mapping, rule enrollment,
  missing capture and unchanged outcomes/denominator.
- Typecheck, JS syntax, UI build and whitespace checks pass.
- Focused Button static/runtime validation passes.
- Independent review found the omitted nonvisual failure queue; it was corrected
  and independently reverified. No outstanding blocking review finding remains.
- Project governance CI still exits1 on existing compact-source/enrollment gaps.

Actual snapshot: `.reflection/reports/button-overview.html`.
Runtime validation evidence: `.reflection/portable-report-validation/`.
The snapshot remains stale, staged and unreviewed. No component fix, threshold
change, reference promotion or owner acceptance is claimed by this UI update.
