# Required inventory research: content and navigation

Research date: 2026-10-15. Scope: Badge, Avatar, Card, Stat Tile, Banner,
Breadcrumb, Pagination and Tab. This is a candidate enrollment specification,
not an approved exhaustive inventory, new source capture or compliance result.
No fixtures, contracts, machine inventory or runtime code were changed.

## Authority and counting

The local [curated manifest](../../.figma/marwes/manifest.json) identifies file
`nybMu3iJUnnOvWtuxjMG8b`, version `2410234809276115335`, last modified
`2026-10-14T15:02:45Z`. Component JSON and page references below belong to that
curated capture. They identify candidate selections and geometry; simplified
literal paint values are insufficient to recover variable aliases or modes.
The ignored `.figma` files may be absent in clean clones. Enrollment must produce
committed compact sources with complete dependencies and provenance.

The active [Badge snapshot](../../packages/design-governance/reflection-families/badge/source/snapshot.json)
and [Card snapshot](../../packages/design-governance/reflection-families/card/source/snapshot.json)
still identify the older file `cvsN0jPGDAIKD3cDgfKAwH`, June 12 version
`2364166174019930436`. Their case identities are useful migration clues, not proof
against the October capture. Fresh compact-source staging and owner approval are
required. None of the other six families has an enrolled Reflection contract at
the time of this research.

All eight **complete required-selection counts remain unknown (`null`)**. Small
closed sets below are known API/source axes, not denominators. Each accepted
visual selection normally needs light and dark plus React/Vue/Svelte evidence,
but every cross-product must be justified. Source properties absent from the
public API remain visible design-only gaps rather than invented public variants.
Semantic wrapper identity does not automatically require duplicate screenshots
when an independently justified equivalence record can share visual authority.

### Common proof requirements

- Structural: independent source surface/part geometry, padding/gap, typography,
  icon geometry, paint/stroke/radius and relevant visibility. Trace aliases and
  inherited collection IDs/mode IDs; do not use CSS as the oracle.
- Visual: exact text/icons/assets, selected state, theme, viewport and composition;
  lossless reference images with receipts and exact-run actual/diff artifacts.
- Behavior: executable component contracts for interactions, controlled updates
  and DOM semantics. Noninteractive surfaces need explicit applicability records.
- Accessibility: automated names, roles, relationships, keyboard/focus and
  state assertions where applicable, plus registry-listed human review. Existing
  first-pass audit status is not current all-adapter governance evidence.

Reflection 0.4.0 does not support held-pointer Pressed visual capture. Retain
required Pressed gaps when the design/public interaction calls for them; native
structural pointer-down evidence alone cannot close the visual requirement.

## Badge

Sources: [core types](../../packages/core/src/components/atoms/badge/badge-types.ts),
[group types](../../packages/core/src/components/atoms/badge/badge-group-types.ts),
[registry](../registry/families/badge/registry.generated.json),
[metadata](../registry/families/badge/registry.meta.json),
[curated component](../../.figma/marwes/components/badge.json).

Closed API: five variants `neutral`, `info`, `success`, `warning`, `error`;
three purpose wrappers `status`, `priority`, `notification`. Labels/content and
accessible names are open strings. BadgeGroup is a labelled structural group,
not a selectable or dismissible chip.

Candidate groups:

- Each of the five variants with identical canonical label in both themes.
- Numeric notification with truthful accessible context; labelled status and
  priority examples; labelled group composition with mixed badges.
- Wrapper metadata and aria-label delivery as behavioral/semantic assertions;
  do not blindly multiply three purposes by every tone and content string.

Source: master `1364:7721`; light `1364:11603`, dark `2276:56582`.
Master geometry: 20px height, 2px vertical/8px horizontal padding, 4px gap/radius,
12px medium Instrument Sans with 16px line height. Old compact case names
`badge.primary` and `badge.destructive` need explicit reconciliation with public
`info` and `error`. The registry acknowledges an extra Figma-only `brand` row;
shipping it requires a product/API decision, not silent denominator deletion.

Historical compact modes: Semantic collection `VariableCollectionId:1358:5072`
light `1358:1`, dark `1358:2`; Status collection
`VariableCollectionId:2276:28207`, neutral/info/success/warning/error
`2276:23`–`2276:27`. Revalidate inheritance against October source before use.
Unknown: exact fresh instance selections, grouped source authority and complete
purpose applicability. Require passive semantics, group naming and no accidental
focus/interaction; human review covers numeric wording/context.

## Avatar

Sources: [core types](../../packages/core/src/components/atoms/avatar/avatar-types.ts),
[badge types](../../packages/core/src/components/atoms/avatar/avatar-badge-types.ts),
[group types](../../packages/core/src/components/atoms/avatar/avatar-group-types.ts),
[registry](../registry/families/avatar/registry.generated.json),
[curated set](../../.figma/marwes/components/avatar.json).

Closed API: sizes small/medium/large; content initials/icon/image. AvatarBadge
adds status text but exposes fixed `data-status=online`, not an enumerated visual
presence palette. Purposes: profile, presence, team. Group overflow is an open
count; name, src and icon selection are open inputs.

Source confirms nine size/content combinations: small initials `1574:27350`,
icon `1574:27352`, image `1574:27355`; medium initials `1574:27357`, icon
`1574:27359`, image `1574:27362`; large initials `1574:27364`, icon
`1574:27366`, image `1574:27369`. Set `1574:27371`. These nine are justified
source combinations, not an assumed Cartesian expansion.

Badge set `1574:27394` has size selections `1574:27382`, `1574:27386`,
`1574:27390`; group master `1574:27395` has -12px overlap and a 40px-high
example. Theme catalog frames: `1574:27460` / `1574:27570`.

Candidate groups: nine base selections; three source-selected badge examples;
group with and without overflow; decorative versus named semantics; purpose
default compositions. Do not multiply every badge size by every content type
until the source supports that authority. Require single accessible identity,
hidden redundant initials/status decoration, meaningful image alt, labelled group
and named overflow. Investigate failed-image fallback behavior before declaring
it supported. Unknown: exact modes, image assets, overflow variants and complete
purpose/group applicability. No visual proof currently enrolled.

## Card

Sources: [core types](../../packages/core/src/components/atoms/card/card-types.ts),
[wrappers](../../packages/react/src/components/card/variants.tsx),
[registry](../registry/families/card/registry.generated.json),
[curated component](../../.figma/marwes/components/card.json).

Core Card is a single-style `div` with no variant/state enum. ProductCard,
ProfileCard and StatCard supply purpose metadata; arbitrary content remains open.
Do not confuse StatCard with the separate StatTile family or infer clickability
from the registry's broad hover/pressed/focus labels.

Master `1364:7718`; frames light `1364:11556`, dark `1368:5891`; existing
instances `1364:11564` / `1368:5899` are migration candidates. Curated example
320×146, vertical gap 8px, padding 24px, radius 8px, inside stroke 1px; title
16px semibold/18px line height. Candidate groups: exact title/body composition
in both themes; body-only source-backed composition; semantic wrappers with
content-preserving metadata assertions. Variable width/wrapping needs approved
responsive authority rather than a fabricated fixed-height rule.

Historical compact modes include Semantic light/dark, States default `2276:15`,
Status neutral `2276:23`, and master collection `VariableCollectionId:1364:2623`
mode `1364:45`; trace current aliases before reusing them. Unknown: wrapper
visual equivalence, body-only instance and responsive bounds. Behavior is
noninteractive applicability unless a consuming product adds controls; accessibility
requires sensible heading/content order without inventing a card button role.

## Stat Tile

Sources: [core types](../../packages/core/src/components/atoms/stat-tile/stat-tile-types.ts),
[adapter slots](../../packages/react/src/components/stat-tile/stat-tile.tsx),
[registry](../registry/families/stat-tile/registry.generated.json),
[curated component](../../.figma/marwes/components/stat-tile.json),
[trend set](../../.figma/marwes/components/partsstat-tiletrend.json).

Closed API: tone neutral/brand/success/warning/danger; trend direction
positive/negative. Label/value are required content; subtitle/trend value optional.
Source master `1411:6857` is a 172×118 example with 24px padding, 8px gap,
12px radius. Trend set `2695:25437` has positive `2695:25436` and negative
`2695:25438`. Catalog page references are misleadingly named `-badge`
`3008:4750` and `-badge-dark` `3008:4890`; verify actual instances rather than
selecting by filename alone.

Candidate groups: base full composition for each source-supported tone; positive
and negative trend examples; no-trend and no-subtitle compositions. Do not treat
five tones × two directions × all slot booleans as confirmed design selections.
Require independent slot spacing, value/label typography, trend paint/icon and
readable trend direction/name without arrow-only meaning. No built-in interaction;
record applicability and assert article/content semantics. Unknown: exact tone
instances, modes, theme selections, supported slot compositions and full count.

## Banner

Sources: [core types](../../packages/core/src/components/atoms/banner/banner-types.ts),
[wrappers](../../packages/react/src/components/banner/variants.tsx),
[registry](../registry/families/banner/registry.generated.json),
[curated component](../../.figma/marwes/components/banner.json).

Closed API: neutral/info/success/warning/error; booleans showIcon, showAction,
dismissible. Purpose wrappers info/success/warning/error preset tone; no neutral
purpose wrapper is listed. Master `1593:5080`; theme frames `1593:5094` /
`2444:2179`. Source toggles Show icon, Show CTA and Show Close default true;
public showAction defaults false. Do not compare the runtime default to the
all-features source instance without declaring the selection.

Curated master is 904×48 with 8px vertical, 12px right and 20px left padding.
Candidate groups: canonical message per tone/theme; source-matched all-features
composition; public-default no-action composition; isolate icon/action/close
absence; constrained multiline message if source/layout authority is established.
Eight toggle combinations exist in API space, but source applicability and
layout equivalence must be justified before counting all eight per tone.

Require actual dismiss/CTA keyboard activation and callback/state ownership,
accessible close name and role/live-region policy appropriate to intent. Tone is
not sufficient evidence that every message should be assertive. Unknown: exact
instances/modes, all toggle combinations, multiline/viewport authority and callback
behavior across adapters. No current governance visual enrollment.

## Breadcrumb

Sources: [core types](../../packages/core/src/components/atoms/breadcrumb/breadcrumb-types.ts),
[registry](../registry/families/breadcrumb/registry.generated.json),
[curated component](../../.figma/marwes/components/breadcrumb.json).

API has showHome, per-item current and optional href; labels/items/URLs are open
data, not variants. Master `1574:26965`; item `1574:26960`; separator
`1574:26962`; frames light `1574:27193`, dark `1574:27268`. Master example
216×14; separator example 24×12 with 6px horizontal padding.

Candidate groups: source-matched home/link/current hierarchy; no-home hierarchy;
single current item; intermediate text without href; hover/focus on actual links.
Long labels and narrow wrapping need source policy. Require named nav, ordered
list, current-page semantics and hidden separators; actual href delivery and
keyboard navigation without adding a managed router behavior. Verify policy for
zero/multiple current flags and current item with href through contracts before
making it an accepted selection. Unknown: modes, exact state instances, responsive
authority and full count. Registry manual review includes hierarchy/URL truth.

## Pagination

Sources: [core types](../../packages/core/src/components/atoms/pagination/pagination-types.ts),
[registry](../registry/families/pagination/registry.generated.json),
[curated component](../../.figma/marwes/components/pagination.json).

Closed axes: controlDisplay auto/label/icon; showPrevNext/showFirstLast/disabled/
invalid booleans; direction first/previous/next/last. Page, pageCount,
siblingCount, boundaryCount and maxVisibleItems are bounded-domain scenarios,
not finite visual variants. PaginationField adds label/error wiring requiring
separate adapter-level assertions. Registry semantic coverage is currently none;
that is a governance gap, not permission to omit semantics.

Master `1727:3905`; page `1727:3897`, active page `1727:3899`, ellipsis
`1727:3903`; frames `1727:4104` / `1727:4253`. Source Show prev/next defaults
true. Master example 308×32 with 12px section spacing; page/active/ellipsis
parts are 32×32. These do not prove every adaptive width/control choice.

Candidate groups: first/middle/last page; one page; zero/invalid count under
documented input policy; both ellipses and one ellipsis; prev/next off; first/last
on; global disabled; explicit icon/label and auto transition at approved container
bounds. Use a minimal set isolating different algorithms/geometry, not all counts.
Require correct window bounds/order, no duplicate pages, disabled boundaries,
page-change callbacks, controlled updates, no disabled activation, accessible
nav/current page/names, hidden ellipses, field descriptions and invalid wiring.
Unknown: source authority for adaptive/icon/first-last/invalid selections,
exact modes and responsive thresholds. Test behavior independently while keeping
unsupported visual groups blocking.

## Tab

Sources: [core types](../../packages/core/src/components/atoms/tab/tab-types.ts),
[group types](../../packages/core/src/components/atoms/tab/tab-group-types.ts),
[adapter group API](../../packages/react/src/components/tab/tab-group.tsx),
[registry](../registry/families/tab/registry.generated.json),
[curated atom](../../.figma/marwes/components/tab.json),
[curated group](../../.figma/marwes/components/tab-group.json).

Closed atom axes: selected and disabled. Group state includes controlled/default
active value and disabled items. Wrappers: navigation-tabs/content-tabs/settings-tabs.
The supported model is horizontal automatic activation; vertical orientation,
lazy mounting and overflow are not current closed API axes.

Atom `1364:7729` has Active boolean, default true; example 56×34 with
8px top/16px horizontal padding and 8px content gap. Group set `2422:1945`
has Full line=False `1737:9904` and True `2422:1946`. A public full-line switch
is not established by the inspected group API; keep that source/API discrepancy
explicit. Frames light `1364:11703`, dark `1368:6067`; tab bar `1896:33125`.

Candidate groups: selected/unselected labelled atoms, disabled atom, named
icon-only atom if adapter API supports it, actual hover/focus/pressed selections;
group with enabled/disabled items and controlled/uncontrolled selection; purpose
metadata cases. Do not conflate disabled+selected policy with an approved design.
Require roving focus, automatic selection, disabled skipping, Home/End and arrow
policy from the shared contract, stable tab/panel IDs, hidden inactive panels and
correct names/aria-selected/aria-controls. No-enabled-tabs is an explicit registry
open question. Unknown: exact state/mode selections, icon authority, full-line
public applicability and all-disabled policy. Human keyboard/focus/reading-flow
review remains separate from automated assertions.

## Enrollment handoff

These families remain behind the Button and external UI gates in the
[rollout tracker](../guides/design-compliance-rollout.md). Research can proceed;
this audit authorizes no baseline replacement or rollout bypass.

For each candidate group, next record exact current node IDs, inherited modes,
aliases, text/assets and applicable proof in a required inventory. Extract a fresh
compact snapshot and matching references, stage receipts and validate all three
adapters. Preserve unknown counts until the selection inventory is complete.
Present unresolved design/API policy to Niklas and present exact reference stages
for separate promotion approval. Existing story/test coverage and source geometry
are research evidence; neither substitutes for current end-to-end proof.
