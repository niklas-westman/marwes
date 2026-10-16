# Required inventory research: inputs and selection

Research date: 2026-10-15. Audience: the engineer enrolling required inventories after the Button and external Reflection UI gates pass. This is a candidate inventory and authority audit, not an executable coverage contract or compliance approval. No fixtures, machine inventories, references or runtime code were changed for this audit.

## Evidence and enrollment rules

Public axes below come from `packages/core/src/components/atoms/<family>/*-types.ts`, adapter barrel exports and field props, plus `docs/registry/families/<family>/registry.meta.json`. Source master IDs come from the local curated `.figma/marwes/components/*.json`; current retained selection IDs come from each governance group's `reflection-contract.json`.

**Blocking provenance distinction:** all ten inspected active compact snapshots still identify file `cvsN0jPGDAIKD3cDgfKAwH`, version `2364166174019930436`, modified 2026-06-12, with provenance `inherited-pinned-offline-capture; not a new Figma capture or approval`. They cannot certify the target October 14 copy `nybMu3iJUnnOvWtuxjMG8b`. Re-extract the selected nodes and dependencies from the already downloaded pinned October capture through staging; matching IDs alone do not prove unchanged facts. The curated component files expose variant names but omit resolved variable modes; use captured variables and node inheritance during extraction, not colors guessed from those names.

- Keep one owning public family, with explicit subgroups for Input. Individual atoms are often intentionally deep-import-only; an atom pass does not cover its public field wrapper.
- Enroll every explicit source master variant and supported public closed axis, but combine axes only when source and API independently support the combination. Do not blindly multiply all states, field options and purposes.
- For each independently selected visual, light/dark remain separate requirements. Default, hover, disabled, focus and error need their actual state authority. Pressed remains required where designed but held-pointer screenshot capture is unsupported by Reflection 0.4.0; do not reuse Default as proof.
- Controlled/uncontrolled state, naming precedence, form submission, reset and disabled interaction are behavior selections; not every behavior needs a duplicate screenshot.
- Missing authority, unmapped API variants and required manual review remain blocking. This research does not authorize baseline promotion or design exceptions.

## Shared mode identity

The downloaded variables identify Semantic light `1358:1` / dark `1358:2` in `VariableCollectionId:1358:5072`, and Component Base `2276:32` in `VariableCollectionId:2276:28208`. Component States collection `2276:28206` has Default `2276:15`, Hover `2276:16`, Pressed `2276:17`, Disabled `2276:18`, Error `2276:20`; it has no generic Focus mode. Explicit descendants can override inherited modes. Do not substitute this state collection for Radio's separate collection.

Checkbox size collection `2541:33122`: sm `2541:4`, md `2541:5`, lg `2541:6`. Switch collection `881:2412`: Compact `881:0`, Wide `1118:0`, Rich `881:1`. Exact source selections must preserve these IDs and their variable aliases. Retained Radio snapshot additionally records Radio states `1364:2574`: Default `1364:8`, Hover `:9`, Pressed `:10`, Disabled `:11`, Focus `:12`, Error `:13`; re-confirm this collection from the pinned capture before enrollment. Do not infer Segmented selected/inverse modes from unrelated state collections.

## Checkbox

**Public surface:** CheckboxField and CheckboxGroupField. Internal Checkbox axes: size sm/md/lg; checked/unchecked/mixed (`indeterminate`); disabled/required/invalid; controlled `checked` or uncontrolled `defaultChecked`. Group options can independently be disabled or indeterminate; group value/defaultValue, description/error and required state need separate wrapper proof.

**Source:** atom set `2541:33250`: sm unchecked/checked/mixed `2541:33220/33222/33226`; md `2541:33230/33232/33236`; lg `2541:33240/33242/33246`. Field set `1369:4628`: sm `1369:4605/4612/4620`; md `2542:27900/27906/27914`; lg unchecked/checked/mixed `2542:27938/27930/27922`. Group set `2541:34603`, sm/md/lg masters `1369:4673`, `2541:34604`, `2541:34634`.

Retained default selection: light row `1369:4706`, children `2542:2249/2256/2263`; dark row `2542:28183`, children `2542:28187/28188/28189`. A row pass cannot count all nine atom and nine field source variants as independently tested.

**Candidate batches:** all nine source atom variants plus matching field variants in both themes; state transitions on representative checked/unchecked/mixed md fields; remaining size/state combinations only when capture confirms sizing/state composition; groups sm/md/lg with one selected, one disabled and one mixed option; required/error/helper wiring as explicit selections.

**Behavior/a11y:** Space and label-click activation, controlled callback versus uncontrolled update, DOM `indeterminate` and `aria-checked=mixed`, disabled nonactivation, checked-only form values, required validity, group naming and error descriptions, external description preservation, no duplicate IDs. Verify Svelte independently; registry's historical shared-contract claims chiefly describe React/Vue.

**Blocking questions:** exact pinned hover/focus/error/disabled selections and mode bindings are not established by retained Default rows. Group mixed-option and required semantics must be measured against public contract, not assumed from the visual group master.

## Radio

**Public surface:** RadioGroupField, YesNoRadioGroup, RatingRadioGroup, OptionRadioGroup. Internal Radio has checked/defaultChecked, disabled/required/invalid, name/value; no public size enum. Field label and option descriptions/errors are meaningful wrapper selections.

**Source:** atom set `2977:7686`, selected `2977:7687`, unselected `2977:7694`; field set `1368:6733`, selected/unselected right-label `1368:6573/6659`, selected/unselected left-label `1368:6616/6696`; group component `1368:6450` has an Items slot.

Retained default rows light/dark `1368:6740` / `2276:51793` with children `1368:6744/6751` / `2276:51797/51798`; retained group instances `2969:11352` / `2969:11567` under frames `2969:10998` / `2969:11557`.

**Candidate batches:** selected/unselected atoms; four field masters; labelled group with one selected option and one disabled option; separate radio-specific Hover/Pressed/Disabled/Focus/Error selections; purpose wrappers as semantic/behavior cases with representative visual reuse only through explicit evidence identity.

**Behavior/a11y:** same-name exclusivity, keyboard arrows and Space, focus entry/exit, disabled skipping, controlled/uncontrolled changes, required group validity, selected-only submitted value, label/description/error association, wrapper defaults and rating limits.

**Blocking questions:** left-label Figma masters have no established public RadioGroupField placement option. Record this as source/API applicability needing selection or explicit policy; do not silently drop masters or invent a new public prop. Purpose wrappers have no separately established Figma master authority in this research.

## Switch

**Public surface:** SwitchField, FeatureToggle, PreferenceSwitch, PermissionSwitch. Core size compact/wide/rich; checked, disabled, invalid; controlled boolean input; visible and external naming. Do not add unchecked/defaultChecked as a core public axis: the inspected core type does not declare it.

**Source:** atom set `2977:12631`, On=True `2977:12116`, On=False `2977:12632`; field set `1371:12723`, On=True `1371:12715`, On=False `1371:12719`. Sizes are variable collection modes, not separate masters. Retained default rows light/dark `1364:11446` / `1369:4005`, children `1371:12724/12728` / `1371:12788/12792`.

**Candidate batches:** on/off in each explicit compact/wide/rich mode for atom and public field; actual source-backed hover/disabled/focus/error selections on representative modes, expanding only where combinations are applicable; named purpose wrappers and field description/error placements.

**Behavior/a11y:** native button keyboard activation without accidental form submit, one toggle callback per action, controlled state reflection, `role=switch`/`aria-checked`, disabled suppression, visible/external accessible name, helper/error association, purpose metadata.

**Blocking questions:** retained rows do not prove all three size modes or invalid appearance. Confirm actual pinned state applications and group wrapper source before all-mode enrollment. AT announcement review remains manual evidence.

## Segmented Control

**Public surface:** SegmentedControlField; internal control types declare default/inverse/pill, sm/md, fullWidth, group disabled/invalid and item disabled/iconOnly. Items accept arbitrary values; counts are not a closed public enum.

**Source:** set `1571:19333`: 2/3/4 text segments `1571:19276/19290/19309`; 2/3/4 icon+label `1571:19282/19298/19319`; inverse text `2696:28121/28150/28196`; inverse icon+label `2696:28134/28173/28226`. Item set `1791:866`: active/inactive normal `1791:864/865`, active/inactive inverse `2696:28113/28117`. Retained three-text-segment instances light/dark `1571:19440` / `2702:10358`.

**Candidate batches:** each of the twelve concrete master layouts with selected/inactive items represented; source-backed sm/md and disabled/focus/hover states; one full-width container and one disabled item case; field label/helper/error composition; icon-only is separate from icon+label.

**Behavior/a11y:** radiogroup rather than tabs; exactly one selected radio, roving tabindex, ArrowLeft/Right/Home/End, disabled skipping, boundary behavior from the documented contract, controlled callback/state, group/item accessible names, no tab-panel claims.

**Blocking questions:** this curated inventory establishes no pill master, icon-only master, size mapping or full-width layout authority. These remain required source/policy gaps, not equivalent to default text segments. Public field wrapper source must be selected independently of raw control.

## Input: five visual groups, one owning public family

Public field exports are InputField, InputOtpField, SelectField, TextareaField, RichTextField and DropdownField/SearchField/PasswordField/EmailField/DateOfBirthField/ZipCodeField/PhoneField/URLField/CurrencyField. Input, Select, Textarea, InputOtp and RichText atoms are intentionally omitted from the React barrel. An internal atom screenshot does not certify the exported wrapper. Keep RichText visible even though it has no dedicated existing visual group.

Closed axes: Input type text/email/password/search/tel/url/date; inputMode text/email/numeric/tel/url/search/decimal; tone default/danger/success. Disabled, readOnly, required, invalid and value/defaultValue apply where declared. These semantic browser axes do not automatically multiply every visual case.

| Visual group | Existing source authority | Required candidate selections |
| --- | --- | --- |
| input-fields | Text master `1364:7662`; retained field light/dark `1364:11382` / `1368:5954` | Label/helper present; label/helper visibility toggles supported by source; empty, filled, focus, error, disabled, readOnly; actual field wrapping |
| input-types-overview | Text overview `1364:11822` / `1368:6019`; Password master `1364:7673`, Search `1364:7667`, Phone `1364:7685`, ZIP `1364:7691`, Currency `2010:6304`, DOB `1364:7679` | One exact selection per concrete purpose design, then purpose-specific interaction and validation; Email/URL source applicability remains explicit |
| input-otp | Master `1803:14929` with Cells slot; OTP cell `1803:14920`; retained light/dark `1803:15034` / `1803:15165` under frames `1803:15024` / `1803:15155` | Empty, partial, complete, focused, invalid, disabled, readOnly; source-backed cell count before custom length generalization |
| select | Master `1364:7707`; retained closed light/dark `1364:11867` / `1368:6027`; Dropdown set `1384:13225`, closed/open `1364:7701` / `1384:13125` | Marwes closed/open, placeholder/selected, disabled option, error/disabled/focus; public appearance marwes/native; SelectField variant default/date |
| textarea | Master `1364:7696` with Label/Hint/Characters toggles; retained light/dark `1364:11827` / `1368:6020` | Empty/filled, helper/error/counter, focus/disabled/readOnly; rows/cols and resize none/both/horizontal/vertical need representative applicable rules |

**Behavior/a11y:** native input typing and form metadata; controlled/uncontrolled/reset behavior; required/invalid naming and description precedence; password visibility toggle preserves value/focus and changes action name; search clear acts once and preserves focus; OTP numeric filtering/paste/truncation/length and one-time-code metadata; custom Select arrows/Home/End/typeahead/Enter/Escape, selected/disabled options and focus return; native Select proves native semantics separately; Textarea multiline/newline and resize behavior; purpose-specific parsing/formatting must follow public documented behavior, not assumptions about locale.

**Blocking source/applicability decisions:**

- Focus cannot be obtained merely by choosing generic Component States: no Focus mode exists there. Locate exact pinned focus nodes or adopt an explicitly approved focus token/layout rule.
- `tone=success`, readOnly and every purpose's state composition are not proved by current Default field selections.
- Native Select browser popup rendering is not a Figma-designed custom popup; agree its applicable visual expectations without excusing functional/a11y proof. `variant=date` needs exact date-field selection authority.
- Dropdown open/closed masters are not automatically interchangeable with the custom SelectField DOM; map the intended visual and semantic composition explicitly.
- Arbitrary OTP length and Textarea resize/rows require documented layout rules; do not fabricate designs for each integer.
- RichTextField remains a public required surface. Core allowedFormats are bold/italic/underline, with disabled/readOnly/required, tone and invalid. Registry explicitly records absence of dedicated RichText Figma authority and manual editing/AT review. Preserve this blocking design question and independently test toolbar naming/pressed state, formatting, focus, value changes and disabled/readOnly semantics.

## Slider

**Public surface:** SliderField, VolumeSlider, BrightnessSlider, RadiusSlider. Core orientation horizontal/vertical; showTooltip/showTouchArea; min/max/step/value/defaultValue; disabled/required/invalid; ariaValueText. Field labelPosition top/inline and edge-value presentation are explicit composition axes. There is no public dual-thumb value API in the inspected core type.

**Source:** Slider component `2462:777` declares Dual thumbs, Tooltip right/left, Touch Area right/left booleans. SliderField set `2977:11176`, top master `2977:11177`, inline `2977:11190`. Retained raw slider default light/dark `2462:12273` / `2464:13689` (260×32).

**Candidate batches:** single-thumb source-backed default at fixed representative min/mid/max values; track-hover versus thumb-hover; focus/disabled/error/pressed where source-backed; tooltip and touch-area selections including omitted variants; top/inline field wrappers; explicit vertical source selection before claiming orientation parity; purpose wrappers prove semantic defaults and ranges independently.

**Behavior/a11y:** pointer drag, keyboard arrows/Home/End and documented step behavior, clamp and fractional step rounding, controlled/uncontrolled callback, disabled noninteraction, native form value/name, required/invalid metadata, readable min/max/current/ariaValueText, field label and helper/error connections. Tooltip visibility is not proof of a valid accessible value announcement.

**Blocking questions:** source dual-thumb capability has no matching current public API; retain it as applicability decision rather than implement a new API during parity work. Vertical source authority, invalid paint and purpose-specific designs were not established by the curated default selection. Pressed screenshot support and manual native-range/AT review remain explicit limitations.

## Next enrollment handoff

1. Re-extract candidate masters and exact state examples from the pinned October capture; stage compact source dependencies without promoting them.
2. Resolve the listed applicability questions into exact source selections, approved rules or explicitly blocking owner decisions.
3. Author each required contract with independently traceable source facts, public wrapper identity and required proof kinds; only then assign case IDs and capture references.
4. Run structural, visual and executable behavior proof for React, Vue and Svelte. Prior React/Vue contract existence does not establish Svelte parity.
5. Review exact staged artifacts in the accepted external UI and request owner approval only for a concrete unchanged stage. No family becomes complete while required authority, proof, active-reference verification or owner review is missing.
