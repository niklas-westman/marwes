# Required inventory research: overlays and composite interactions

Research dated 2026-10-15 for the pinned October 14 Marwes Figma capture,
`nybMu3iJUnnOvWtuxjMG8b`. This document proposes enrollment groups; it neither
changes machine inventories nor certifies a family. Button execution remains the
active implementation wave. Broader rollout still requires the Reflection UI gate.

Public requirements below come from the actual core types, adapter interfaces and
family registries. Curated `.figma` JSON supplies discovery evidence, not approved
references. Those ignored files are unavailable in clean checkouts. Existing
Accordion, Tooltip, Context Menu and Dialog compact snapshots identify the retained
June 12 capture, so they cannot establish October 14 authority without approved
refresh. Drawer, Toast and Date Picker have no enrolled family Reflection contract.

## Public axes and candidate selection groups

Counts are **proposed visual selections before adapter multiplication**, including
light/dark where stated. They are bounded starting groups, not exhaustive family
denominators. Exact required totals remain **unknown**, rather than zero, until
source selection, applicability and adapter exports are reconciled. Arbitrary
content, IDs, callbacks and CSS overrides are not separate Cartesian axes.

| Family | Closed public axes and meaningful compositions | Candidate visual groups | Remaining authority/applicability decisions |
| --- | --- | --- | --- |
| Accordion | Atom `open`/`disabled`; grouped field `multiple`, controlled/uncontrolled open items, group/item disabled, description/error; FAQ/Settings/Sections wrappers | Atom collapsed/expanded × themes: 4. Separate group exemplars for single-open, multi-open, invalid, disabled item and disabled group; purpose wrappers in each theme | Group and wrapper source selections not mapped. Focus/Hover/Pressed are interaction requirements, not independent Figma variants merely because registry lists them. Decide which field/purpose anatomies need distinct visual rows. |
| Tooltip | Visible Tooltip atom; TooltipGroup open/closed and controlled/uncontrolled; content/icon/name; no public direction or arrow toggle in inspected core/React API | Visible atom and canonical open group × themes: 4. Closed and exit states require behavioral visibility assertions rather than an empty screenshot baseline | Figma provides four directions plus arrow/no-arrow configuration; public direction mapping is unresolved. Rich-tooltip source exists but interactive content is explicitly outside Tooltip's public scope. Do not enroll it as an approved Tooltip variant automatically. |
| Context Menu | Entry kind item/divider; item icon optional, disabled and destructive; parent owns open state/positioning | Default action list, grouped divider list, disabled item and destructive item × themes: 8 candidate compositions; use representative combined lists rather than all item-array permutations | Exact item-state sources and destructive paint selections are unmapped. Managed trigger, roving focus, Escape dismissal and focus return belong to a future/composed surface; record that boundary, not a fabricated atom guarantee. |
| Dialog | Sizes small/medium/large; shell/modal; footer/close affordance; modal flag; Confirm/Destructive/Info wrappers; managed modal open/control, dismissal switches, restoreFocus, tone default/calm, divider visible/hidden | Size exemplars × themes: 6 shell rows. Add independently selected minimal anatomy, canonical modal framing and purpose rows after mapping. Do not multiply every lifecycle switch into screenshots | Figma Default/Minimal mapping to footer/header/close props needs explicit selection. Tone/divider/sourceWidth customizations lack independent selections. Raw shell does not own lifecycle. Background isolation is documented unfinished hardening. |
| Drawer | Sizes small/medium/large; placement left/right; footer, dismissible, modal and scrim flags | Default right size exemplars × themes: 6; medium-left × themes: 2; independently selected minimal medium exemplar × themes: 2. Proposed starting group: 10 | Figma Default/Minimal is not automatically equivalent to a particular boolean bundle. Left placement and modal/no-scrim compositions need authority. Atom does not own focus trap/Escape/restoration: test composition separately or record unsupported ownership. |
| Toast | Variants subtle/outline/rich; primitive intent neutral/info/success/warning/error/brand; live urgency polite/assertive; four container placements; four purpose wrappers; optional icon/action/dismissal; provider timing and max-visible | Four source status variants × three emphasis variants × themes: 24. Neutral/brand × three variants × themes: 12 additional public candidates without source mapping. Container placement gets four representative stacks per theme after independent layout authority | Source statuses cover Information/Success/Warning/Error, not a proved neutral/brand palette. Map `Information` to public `info` explicitly. Purpose wrappers require metadata/default assertions even where approved visual anatomy can be reused. Timing/queue limits are behavioral dimensions, not screenshot products. |
| Date Picker | Devices desktop/mobile; day states default/hover/selected/range/range-hover/disabled/null; isToday; invalid/describedBy; DatePickerField label/helper/error; public navigation/day/cancel/apply callbacks | Desktop/mobile calendar compositions × themes: 4. Five independently sourced day states × themes: 10 diagnostic part selections. Disabled/null/today and field invalid anatomy remain separate required source questions | Curated calendar/part IDs differ from registry's older V2 references. Resolve authority before enrolling. Double-calendar Figma property has no corresponding inspected public axis. Base component owns neither date math, parsing, locale formatting, popover nor range state transitions. |

Public sources: [Accordion types](../../packages/core/src/components/atoms/accordion/accordion-types.ts),
[Tooltip types](../../packages/core/src/components/atoms/tooltip/tooltip-types.ts),
[Context Menu types](../../packages/core/src/components/atoms/context-menu/context-menu-types.ts),
[Dialog types](../../packages/core/src/components/atoms/dialog/dialog-types.ts),
[Drawer types](../../packages/core/src/components/atoms/drawer/drawer-types.ts),
[Toast types](../../packages/core/src/components/atoms/toast/toast-types.ts),
[Toast delivery types](../../packages/core/src/components/atoms/toast/toast-container-types.ts),
[Date Picker types](../../packages/core/src/components/atoms/date-picker/date-picker-types.ts).
Composition axes additionally use React's AccordionField, TooltipGroup, DialogModal,
Toast manager and DatePickerField interfaces; verify their Vue/Svelte equivalents
before claiming cross-adapter enrollment.

## Source candidates and identity corrections

| Family | Exact source candidates from curated JSON | Light/dark discovery frames; existing enrolled selections |
| --- | --- | --- |
| Accordion | Set `1369:6218`; expanded `1369:6208`; collapsed `1369:6214` | Registry frames `1364:11755` / `2276:47132`. Existing expanded selections `3872:40080` / `3872:42152`; only two registered visual rows. |
| Tooltip | Bubble `1364:7739`; actual group set `3017:36298`: Top `1574:21100`, Bottom `3017:36299`, Left `3017:36308`, Right `3017:36326` | Group frames `1574:21179` / `1574:21235`; existing selected instances `1574:21185` / `1574:21245`. Registry's `tooltipGroupComponent` is the Top variant, not the whole set. |
| Context Menu | Shell `1574:23952`, item `1574:23946`; shell has a Content slot, not a closed item-count axis | Frames `1574:24029` / `1574:24160`; selected full menus `1574:26876` / `1574:26906`. |
| Dialog | Actual set `3017:36399`; Default `1609:15459`; Minimal `3017:36471` | Frames `1609:15527` / `3017:37102`; current medium instances `1609:15569` / `3017:37117`. Registry's `dialogComponent` names Default rather than the set. |
| Drawer | Set `3017:37258`; Default `1609:15481`; Minimal `3017:37259` | Frames `1609:15651` / `3017:37492`; instance selection pending. |
| Toast | Set `1365:11937`; Information Subtle/Outline/Rich `1365:11938` / `1365:11954` / `1365:11958`; Success `1365:11942` / `1365:11962` / `1365:11966`; Warning `1365:11946` / `1365:11970` / `1365:11974`; Error `1365:11950` / `1365:11978` / `1365:11982` | Frames `1365:12526` / `2970:9564`; exact instances/modes pending. |
| Date Picker | Curated calendar `1813:22683` with Double calendar boolean; field `1807:17191` with Label boolean; curated part set `1807:16918`: Default `1807:16917`, Hover `1807:16916`, Selected `1807:16915`, Range `1807:17837`, Range hover `1879:23865` | Registry frames `1807:17542` / `1807:17615` and page reference `1918:16141` require reconciliation. Registry part-set ID `1814:1221` differs from curated `1807:16918`; do not substitute silently. |

Discovery files: [Accordion](../../.figma/marwes/components/accordion.json),
[Tooltip](../../.figma/marwes/components/tooltip.json),
[Tooltip group](../../.figma/marwes/components/tooltip-group.json),
[Context Menu](../../.figma/marwes/components/context-menu.json),
[Dialog](../../.figma/marwes/components/dialog.json),
[Drawer](../../.figma/marwes/components/drawer.json),
[Toast](../../.figma/marwes/components/toast.json),
[Date Picker](../../.figma/marwes/components/date-picker.json),
[day parts](../../.figma/marwes/components/partsdate-picker-item.json).
Registry metadata is in `docs/registry/families/<family>/registry.{meta,generated}.json`.

## Modes to preserve during independent extraction

The [captured variables](../../.figma/marwes/tokens/variables.json) identify these
collections. IDs identify candidate selections; each selected node still needs its
effective inherited/explicit modes and complete alias chain. A theme label alone
does not resolve imported variables.

| Collection | Modes |
| --- | --- |
| Semantic `VariableCollectionId:1358:5072` | Light `1358:1`; Dark `1358:2` |
| Component states `VariableCollectionId:2276:28206` | Default `2276:15`; Hover `2276:16`; Pressed `2276:17`; Disabled `2276:18`; Error `2276:20` |
| Dialog size `VariableCollectionId:1609:15451` | sm `1609:14`; md `1609:13`; lg `1609:15` |
| Drawer size `VariableCollectionId:1609:15453` | sm `1609:17`; md `1609:16`; lg `1609:18` |
| Tooltip `VariableCollectionId:3017:36122` | No arrow `3017:8`; Top `3017:4`; Bottom `3017:5`; Left `3017:6`; Right `3017:7` |
| Component status `VariableCollectionId:2276:28207` | Neutral `2276:23`; Info `2276:24`; Success `2276:25`; Warning `2276:26`; Error `2276:27` |
| Date picker states `VariableCollectionId:1803:16280` | Default `1803:5`; Hover `1803:6`; Focus `1803:7`; Filled `1803:8`; Error `1803:9`; Disabled `1803:10` |

Do not conflate the last collection with day-cell variants: the capture also has
another collection named Date picker states, `VariableCollectionId:1803:15786`,
whose sole mode is `1803:4`. Imported Themes and archived token collections exist;
resolve actual bindings rather than assigning Semantic modes universally.

## Required interaction and accessibility evidence

Run each applicable scenario through real React/Vue/Svelte public callbacks. Native
DOM event counters alone do not prove adapter forwarding. Behavior-only scenarios
must remain separate from visual authority. Existing shared contracts provide the
starting behavior specification, not proof of Figma parity.

| Family | Required proof groups and explicit boundary |
| --- | --- |
| Accordion | Enter/Space toggles; public change callbacks; disabled group/item rejects activation; trigger `aria-expanded`/`aria-controls` and named region; single-open and multi-open updates; controlled rerender; field description/error wiring; stable IDs across updates. No invented arrow-key/roving-focus guarantee. |
| Tooltip | Hover and focus reveal; blur/leave dismissal; Escape dismissal; controlled callback path; named trigger and describedBy only while open; exit content hidden from assistive technology. Test real timing separately from frozen visual capture. Keep content noninteractive. |
| Context Menu | menu/menuitem/separator semantics; accessible label and icon decoration; native keyboard activation invokes public selection exactly once; disabled selection blocked; destructive metadata. Opening, focus return, managed arrow keys and Escape require a separately named parent composition. |
| Dialog | Shell name/description and close callback; modal initial focus, Tab/Shift+Tab trap and no-focusable fallback; Escape/scrim close permitted versus locked; focus restore enabled/disabled; controlled open changes and cleanup. Test body-scroll cleanup. Background isolation remains an explicit unresolved release risk. |
| Drawer | Panel name/description, modal metadata, scrim visibility, dismissible close and public callbacks; footer/size/placement metadata. Focus trap, Escape and focus restoration are composition requirements, not behavior the current atom promises. |
| Toast | status/polite versus alert/assertive and atomic semantics; purpose/intent defaults; real dismiss/action callbacks; max-visible trimming and four placement identities; queue cleanup, timeout and persistent duration=null; repeated announcement timing requires human assistive-technology review. Do not invent pause-on-hover guarantees. |
| Date Picker | Named calendar/table, day labels/selected/disabled/null semantics; public day and four navigation callbacks; cancel/apply forwarding; field label/helper/error/invalid wiring and controlled update. Date parsing, min/max rules, leap-year/range validity and localized formatting belong to the owning composition: record the missing contract instead of asserting that the atom validates dates. Keyboard range/roving behavior needs an explicit product contract. |

Starting executable specifications: [Accordion](../../tests/contracts/accordion.contract.ts),
[Tooltip](../../tests/contracts/tooltip.contract.ts),
[Context Menu](../../tests/contracts/context-menu.contract.ts),
[Dialog](../../tests/contracts/dialog.contract.ts),
[managed Dialog](../../tests/contracts/dialog-modal.contract.ts),
[Drawer](../../tests/contracts/drawer.contract.ts),
[Toast](../../tests/contracts/toast.contract.ts),
[Date Picker](../../tests/contracts/date-picker.contract.ts).

Next implementation step after the rollout gate: reconcile these source candidates
with the pinned capture, resolve listed authority questions, then enroll exact
requirements, compact dependencies, adapter fixtures and staged references. Preserve
unknown selections and unsupported behavior as blocking gaps until independently
resolved; this research grants neither promotion nor visual approval.
