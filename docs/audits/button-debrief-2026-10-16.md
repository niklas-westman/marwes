# Button governance debrief — 2026-10-16

## Status first

**Button is not fully compliant or release-ready.** The latest integrated run is
fresh and complete across React, Vue and Svelte in Chromium. Additional proposals
are deliberately unapplied. No further implementation or test runs are underway.

| Proof | React | Vue | Svelte |
| --- | ---: | ---: | ---: |
| Visual selections | 172 pass /15 fail | 172 pass /15 fail | 172 pass /15 fail |
| Structural selections | 187/187 pass | 187/187 pass | 187/187 pass |
| Behavior scenarios | 191/191 pass | 191/191 pass | 191/191 pass |
| Integrity | 191/191 pass | 191/191 pass | 191/191 pass |

Four scenarios per adapter are behavior-only; their visual/structural `not-run`
status is intentional. These results cover enrolled selections, not the entire
public family. The inventory is **273 required,203 mapped,70 missing fixtures**.

Exact run: `button-1792170000033-043e9c38-b43a-4a7a-91c9-b31e19be4eeb`.
It ran16:59:59–17:20:53 UTC, about21 minutes. Freshness is `current`, overall
outcome `failed`, human review `unreviewed`.

Runtime: published `reflection-check@0.6.0`, Chromium148.0.7778.96, Darwinarm64.
Legacy `chromium-linux` reference filenames do not establish Linux certification.
Design authority remains the pinned October14 capture of file
`nybMu3iJUnnOvWtuxjMG8b`, version2410234809276115335.

## What changed in the integrated implementation

- All26 Pressed selections now use real held-pointer capture and explicit
  stabilization. There are no remaining Pressed capture-unsupported outcomes.
- Loading captures use stable animation handling. Remaining loading failures
  are label differences, not moving spinners.
- Explicit standard ligatures correct Confirm/Success shaping with negative
  tracking. The diagnostic comparison recovered eight selections per adapter
  without creating newly failed selections or weakening thresholds.
- Primary keyboard focus is enrolled in both themes. Source-derived border
  painting removes49 ring-corner differences from native CSS outlines. Both
  cases pass visually and have independent source assertions, real Tab behavior,
  layout/pointer controls and a forced-colors fallback.
- Coverage/reporting distinguishes missing design, missing mapping, approved
  rules awaiting enrollment, recorded failures and staged review scope.
- Release preparation repaired dependency advisories, fixed a stale local Vue
  runtime link, corrected documentation checks scanning ignored capture copies,
  regenerated stale registry/publication artifacts and fixed color-showcase
  contrast. Those were release maintenance, not fixes for the15 text failures.

Previous branch changes also include Secondary/Ghost styling, sizes, purpose
icons, state/disabled/error paints and shared tokens. The checkout includes
Checkbox/Radio/Dialog changes and must not be described as a Button-only release.

## Why the15 visual failures remain

The same15 selections fail per adapter:

| Selection group | Modes | Failures |
| --- | --- | ---: |
| Success Hover | dark | 1 |
| Secondary Loading | light,dark | 2 |
| Neutral icon-left: default,Hover,Pressed,Error | light,dark | 8 |
| Purpose Refresh | light,dark | 2 |
| Purpose Filter | dark | 1 |
| Success icon-left default | light | 1 |

The residual differences are concentrated in text rendering. Exact source-label
bounds and typography agree for the representative strings inspected; whole-string
source-outline controls greatly reduce several differences. This does not prove
all raster differences harmless or permit replacing HTML text with SVG.

Niklas confirmed Google Fonts as the provider. A targeted19-case experiment
actually loaded its current official500 font. All19 actual PNG hashes were
identical to the bundled-font results on Darwin, and the same was true in a
separate19-case Linuxarm64 control. The current official variable font was also
identical to a previously tested binary. **A font download/replacement has no
shown benefit.** Exact historical Figma authoring bytes/rendering are not fully
identified; current evidence does not justify another speculative CSS adjustment.

Next work on these failures should be one bounded rendering/source experiment
with a stated hypothesis and stopping condition. Reuse the existing source and
font evidence. Do not rerun broad release builds for each text experiment, repeat
identical font substitutions, relax thresholds or turn diagnostic outlines into
approved baselines. Any alternative text-acceptance policy needs an explicit
separate decision; the present native failures remain failed.


## Coverage left:70 required selections

| Work | Count | Actual status /why it remains |
| --- | ---: | --- |
| Approved focus rules | 50 | Compiler,fixture and Figma-composition proposals exist; no new Figma reference captures or canonical enrollment. Isolated source/keyboard checks pass150 adapter/selection combinations. A native capture paint/provenance guard found by independent review must be fixed before using the plugin proposal as evidence. |
| Design needed | 14 | XS2,both-icons2,persistent-toggle2,and Neutral/Text/Success/Danger loading8 lack applicable approved design authority. Owner-authorized visual-review skips are flagged at report top; rows remain in the denominator and are not certified. |
| FullWidth and borderless IconButton | 4 | Exact source selections found, bounded CSS/fixture corrections tested in isolation. Reference capture, integration and fresh visual proof remain. Proposals are not applied. |
| Primary loading | 2 | Source frames exist, but spinner variable1789:185 aliases missing variable1362:7421. Need an authoritative variable/collection/alias capture or source repair. Never invent the binding or classify existing-but-incomplete source as a missing-design waiver. |

Unapplied proposal locations:

- `.reflection/focus-fifty-enrollment-proposal/`
- `.reflection/focus-composition-proposal/compiler/`
- `.reflection/focus-composition-plugin-proposal/`
- `.reflection/button-last-mile-0.6.0/mapping-six-proposal/proposed-four/`
- `.reflection/button-last-mile-0.6.0/imported-variable-reader-proposal/`

The imported-variable reader proposal is incomplete. The focus plugin proposal
has a known review finding: live fills/blends/alpha and resolved mode paints must
be guarded and independently bound in receipts. Do not apply these proposals as
finished work. Contract/fixture proposals overlap; merge guarded fragments rather
than overwriting entire files.

## How to work with Figma MCP and the local bridges

These are separate transports, not interchangeable names for one connection:

| Connection | Purpose | Configured ports |
| --- | --- | --- |
| Marwes Figma Bridge | Source/file/variable inspection and outlined-source diagnostics | scans9223–9232;9231 may belong to figma-console-mcp |
| Marwes Reflection Frame Prep | Prepare and export independent Figma reference frames | scans9243–9252 |
| Native Figma Dev Mode MCP | Separate native MCP service |3845 |

A connection on9231 alone does not establish that Frame Prep is connected.
Check the plugin and transport required by the command. The current Frame Prep
plugin was observed in the correct pinned document, saying “Waiting for prepare
command...”. Figma also showed pending unsynced changes; no server freshness claim
follows from that UI state.

Workflow:

1. Open the pinned file and launch the appropriate repo development plugin.
   Frame Prep manifest: `packages/design-governance/figma-reflection-plugin/manifest.json`.
   General bridge manifest: `packages/design-governance/figma-plugin/manifest.json`.
2. Verify exact document URL/name, connected client, selected nodes and explicit
   variable collection/mode IDs. The Frame Prep client reported a null file key.
   Earlier captures used separately verified desktop identity; preserve that
   limitation instead of claiming the plugin independently reported the key.
3. Dry-run the exact prepared selection manifest. For existing supported cases:

   ```bash
   pnpm reflection:figma:prepare-frames -- --family button --dry-run
   ```

4. Export references through a reviewed explicit manifest using
   `--manifest <manifest.json> --write --capture-references --json` and the correct
   destination/page options. This creates an immutable ignored capture under
   `.reflection/governance/captures/<id>/`, including `references.json` and PNGs.
   Never use an active-baseline-writing option as a substitute for staging.
5. Only use `--accept-any-file` after independently verifying the exact pinned
   desktop document and unambiguous client; it is an identity bypass, not
   verification. Keep null reported identity and separate attestation in provenance.
6. Convert references with Reflection's native lossless WebP implementation,
   verify production-decoded RGBA equality, and create hash/mode/source-bound
   receipts. Build a coherent compact source/reference/receipt bundle and stage it.
7. Verify the exact stage, inspect evidence, obtain exact-stage owner approval,
   then promote and rerun active inputs. Capture, verification and inspection do
   not grant approval.

Current Frame Prep cannot execute the proposed50 `focusComposition` selectors
until the reviewed implementation is integrated and reloaded. Its current
supported strategies are directNode,rowChild,rowContent. Pilot representative
ordinary,Text/navigation,Destructive and IconButton compositions before a full batch.

Current Frame Prep also has no variable-reader command. The general bridge's
existing REFRESH_VARIABLES reader misses transitive aliases; a complete bounded
read-only reader is needed for1362:7421. A9226 attempt found no compatible client
and was stopped. No pinned variable export was overwritten.

## How figma-governance-one gets its HTML evidence

This is a repo-local TypeScript/HTML inspector and portable report, using the
private design-governance package. It is not the separate reflection-check-ui
product, which remains unavailable for integration.

```text
Pinned Figma nodes +variables +approved rules
    → visual/structural/behavior/coverage contracts
    → independent source compiler +real React/Vue/Svelte fixtures
    → Reflection native screenshots +behavior/source measurements
    → immutable hash-bound governance report.json
    → versioned UI provider
    → live inspector /portable comparison HTML
```

Core paths:

- `packages/design-governance/reflection-families/button/`:required inventory,
  contracts,compact source and references.
- `packages/design-governance/src/runtime/`:real browser evidence collection.
- `packages/design-governance/src/evidence/ui-provider.ts`:versioned
  `marwes.reflection-ui-provider/v1` projection.
- `packages/design-governance/figma-governance-one/ui/` and `server/`:live inspector.
- `packages/design-governance/src/evidence/html-report.ts`:exact-run artifact
  verification,comparison metrics and portable data assembly.
- `packages/design-governance/figma-governance-one/report/`:portable HTML shell,
  table,attention summary,filters,zoom and comparison/diff presentation.

The report keeps all273 required rows and819 adapter comparisons. Top attention
sections distinguish visual failures,design-needed skips,mapping gaps,approved
rules awaiting enrollment and review/freshness problems. Filtering does not change
the family denominator. Images are selected by exact run,item,adapter and artifact
role; structural captures cannot substitute for visual actuals. Export verifies
artifact hashes/MIME and binds the report to source/input/stage identities.
Staged evidence is labeled and never silently becomes active approval.

The finished portable report is about43.5MB because it embeds runtime images and
other evidence. Canonical staged references use WebP; Reflection-generated runtime
images retain their formats. Reports/captures stay ignored local/CI artifacts,
not committed product assets.

Live inspector remains available at `http://127.0.0.1:6176/`:

```bash
pnpm governance:ui -- --port 6176
```

Read or export existing evidence without rerunning browsers:

```bash
pnpm governance:status -- --family button --json
pnpm governance:report -- --family button --run button-1792170000033-043e9c38-b43a-4a7a-91c9-b31e19be4eeb --output .reflection/reports/button-debrief.html
```

The export refuses to overwrite an existing output; choose a fresh filename.
The already generated report is:

```text
.reflection/reports/button-1792170000033-043e9c38-b43a-4a7a-91c9-b31e19be4eeb-2e745249-c0b4-4d14-bc6b-113e392778e0.html
```

The run used stage55f3fd80-b964-4359-8abd-10ddd4a819a3 with hash
7b63f7fa3803ba736b26d00e934c2b06ab469cc0a97e0af8dc25766d2934ae89.
Input fingerprint:93085ff1683b61e80d24eee58ccc90abfb30cbddd279529b3026a7ffc1a2c210.
Source/reference promotion and human run acceptance have not occurred.

## Validation and release boundary

Passed:5,109 public package tests,public builds/typechecks,SSR,clean packed-package
consumer smoke in all three adapters,Button static/runtime-token checks,Reflection
doctor,repository-map checks,lint and security validation. Button+Color story
accessibility checks pass44React/44Vue/50Svelte cases. Full Storybook accessibility
has one AccordionField/Disabled contrast failure per adapter;1,421 other stories
pass. `pnpm design:check` still fails in other families. Root Reflection review
also reports historical/global failures; it is not a substitute for this fresh run.

Some broad gates were repeated after an outdated CSS test,Vue dependency/runtime
identity issue,and stale generated artifacts. These were release checks,not
successive fixes for the15 screenshots. The targeted font experiments used19 cases
per profile. Future debugging should use focused proof first and run broad release
gates only after relevant shared/dependency changes have settled.

Changesets proposes1.11.0 for the five public packages because of the additive
`resolveButtonIcons` API. No version was applied,no commit/push/release was made,
and nothing was published. This is release preparation with blockers,not a release
candidate approval.

Recommended next bounded batch: finish and independently review the source-capture
paint guards,then pilot a few compositions and the four complete mappings. Keep
text-rendering diagnosis as a separate capped investigation. Resolve the missing
variable from Figma and queue the14 real design requirements with the owner.
Do not describe full Button certification as a quick remaining cleanup.

## Addendum — 15 failures: measured overage and recommendation

Measured on the fresh run's React expected/actual PNGs (pixelmatch, 0.1 color
threshold; counts reproduce the known 86/98 on Neutral icon-left default). Every
diff is confined to the label. Vue/Svelte are identical per the run.

| Selection | Mode | Diff px | Limit | Over |
| --- | --- | ---: | ---: | ---: |
| Success Hover | dark | 110 | 60 | 50 |
| Secondary Loading | light / dark | 95 / 128 | 75 | 20 / 53 |
| Neutral icon-left default | light / dark | 86 / 98 | 60 | 26 / 38 |
| Neutral icon-left Hover | light / dark | 77 / 84 | 60 | 17 / 24 |
| Neutral icon-left Pressed | light / dark | 73 / 74 | 60 | 13 / 14 |
| Neutral icon-left Error | light / dark | 82 / 67 | 60 | 22 / 7 |
| Purpose Refresh | light / dark | 86 / 98 | 60 | 26 / 38 |
| Purpose Filter | dark | 63 | 60 | 3 |
| Success icon-left default | light | 63 | 60 | 3 |

Worst case is 128 px on a 390×220 canvas (0.15%); passing Primary icon-left is 34.

**Bounded experiment, closed:** hypothesis that Chromium glyph hinting/subpixel
mode explains the residual. Launched Chromium directly with
`--font-render-hinting=none`, `--disable-font-subpixel-positioning`, both, and
`--disable-lcd-text` against 6 failing default-state selections plus a passing
control. Actual pixel counts were identical to the default launch in every
variant. Rejected; these flags are no-ops on Darwin. Do not repeat.

**Conclusion:** no source/CSS/font/launch-flag change is left to try. `text-rendering:
geometricPrecision` and ligatures are already in `button.css`. The 15 clear only
by an explicit acceptance-policy decision (owner), e.g. per-selection
`maxDiffPixels` set to measured +10 px, each with a recorded reason, applied only
to these 15 rows and reported as "accepted text-raster deviation" rather than a
silent pass. Without that decision they stay failed.

### Decision applied (owner, 2026-10-16)

Niklas accepted the 15. In `reflection-families/button/reflection-contract.json`
each of the 15 rows has `maxDiffPixels` = measured + 10 px (rounded up to 5),
`maxDiffPixelRatio` raised to match where needed, and a `toleranceReason`
starting `ACCEPTED TEXT-RASTER DEVIATION`. Search that string to list them.
Nothing else changed; references are not approved. The 2026-10-16 run predates
this edit, so a fresh `governance verify` is needed before any report shows them
passing. Never copy these limits to other selections.
