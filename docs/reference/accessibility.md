# Accessibility Support Model

This document defines what Marwes currently supports, what automation can prove,
and where manual review is still required.

Use it as the canonical accessibility support reference for the repo.

It sits between:
- the **strategy layer** in the registry rollout and audit docs
- the **family blueprint layer** in `docs/registry/families/*/README.md`
- the **family execution layer** in `docs/audits/*-family-accessibility.md`

## Why this document exists

Marwes already has strong accessibility architecture:
- a11y logic is source-owned in `@marwes-ui/core`
- React, Vue, and Svelte adapters stay thin
- shared contracts already cover many shipped families
- the registry and audit docs describe family posture in much more detail than before

What was missing was one canonical statement of:
- supported browser and assistive-technology assumptions
- what automated checks can actually prove
- what still requires manual review
- how family risk tiers affect release expectations

## Current support status

Marwes should be described honestly as:
- **a11y-architected and test-backed** across many shipped families
- **partially hard-gated** for automated Storybook accessibility checks through a first smoke set, but not yet fully repo-wide
- **manual-review-aware**, especially for higher-risk families and custom-widget paths

That means Marwes can make strong claims about many component contracts,
but it should not imply that automated tests alone prove full accessibility across
all browser and assistive-technology combinations.

## Accessibility support assumptions

### Browser baseline
Marwes targets modern evergreen browsers, as recorded in `docs/reference/spec.md`.

### Assistive-technology review targets
When a family needs explicit manual review, use these baseline desktop pairings first:
- **VoiceOver + Safari**
- **NVDA + Firefox**
- **JAWS + Chrome**

These are the default pairings for validating higher-risk widget behavior such as:
- dialog modal lifecycle
- custom select / combobox behavior
- rich text editing behavior
- toast live-region timing and interruption feel

### Mobile support posture
Mobile accessibility matters, but it is **not yet documented as a hard release gate**
for all families.

Current honest posture:
- native controls should generally inherit reasonable mobile semantics from the platform
- custom or coordinated widgets may still need explicit mobile screen-reader review before stronger claims are made
- teams shipping accessibility-sensitive mobile experiences should run targeted VoiceOver iOS / TalkBack checks rather than assuming desktop validation is enough

## What automation covers today

Automation already gives Marwes meaningful confidence in several areas.

### 1. Source-owned semantic behavior
Core recipes and a11y helpers prove:
- semantic structure
- role and state mapping
- label and description wiring
- variant and state normalization
- canonical semantic metadata for governed families

### 2. Shared cross-adapter contracts
Shared contract files under `tests/contracts/` prove the same behavior across React, Vue, and Svelte for many shipped families.

What these contracts commonly cover:
- native semantics stay intact where Marwes is native-first
- keyboard basics for covered widgets
- label, description, and error wiring
- disabled, invalid, and controlled vs uncontrolled behavior
- canonical `data-*` metadata for governed semantic families

### 3. Adapter-level DOM behavior
React, Vue, and Svelte tests prove:
- adapter props reach the DOM honestly
- runtime state changes and callbacks behave as expected
- thin wrappers stay aligned with core contracts

### 4. Storybook documentation and taxonomy checks
Storybook tests prove:
- docs pages mention the intended public surface
- React, Vue, and Svelte story structure stays aligned
- taxonomy remains consistent across atom, molecule, and purpose layers

### 5. Registry-backed posture tracking
The registry and audit docs now make family-level posture explicit:
- risk tier
- audit status
- semantic coverage
- contract maturity
- manual-review boundary

## What automation does not prove

Automation is necessary, but not sufficient.

It does **not** fully prove:
- real screen-reader announcement quality
- interruption feel and timing quality for live regions
- modal behavior across every browser + AT combination
- rich text editing behavior across supported environments
- reduced-motion comfort or visual clarity in every real product composition
- wording quality in longer or denser real product layouts

## Current automation boundary by system

### Storybook accessibility checks
Storybook accessibility tooling now has an explicit repo policy, but it is **not yet a full repo-wide trust gate**.

Current honest posture:
- Storybook previews default automated accessibility checks to `off` until a story is intentionally promoted
- the first smoke set is configured with `a11y.test = "error"`
- `pnpm test:storybook:a11y` runs the current smoke set in all three Storybook apps
- `pnpm check` now includes that smoke-set command, so the first Storybook accessibility gate is part of normal trust validation
- current smoke-set families are Button, Checkbox, Radio, Toast, and Spinner in React, Vue, and Svelte Storybook apps
- broader repo-wide gating and exemption tracking still remain follow-up work
- this support document should not imply that every story is already hard-failing on accessibility regressions in CI

### Shared contracts
Shared contracts are one of Marwes' strongest current accessibility signals.

They are especially important for:
- coordinated widgets
- cross-adapter parity
- form-field wiring
- canonical semantic families

### Manual review
Manual review remains required whenever automation cannot judge the actual user experience.

## Component risk tiers

These tiers are grounded in the registry, not invented separately here.

### Low-risk native/passive families
Families:
- Avatar
- Badge
- Card
- Divider
- Heading
- Paragraph
- Icon
- Spacing

Typical expectation:
- native or passive semantics stay honest
- docs teach misuse boundaries
- automated coverage is proportional to the real risk

### Medium-risk native or wiring-sensitive families
Families:
- Checkbox
- Radio
- Spinner

Typical expectation:
- native semantics (Checkbox, Radio) or carefully sourced local semantics (Spinner) remain the source of truth
- field wiring, grouped behavior, and decorative-vs-status behavior are tested intentionally
- manual review focuses on wording clarity, focus visibility, motion expectations, and truthful product usage

### Medium-risk coordinated or delivery-sensitive families
Families:
- Accordion
- Tab
- Switch
- Tooltip
- Slider
- Toast
- Button

Typical expectation:
- cross-adapter contracts should be strong
- Storybook docs should teach correct scope and misuse boundaries
- manual review still matters for timing, navigation honesty, or composed interactions

### High-risk families or subfamily paths
Families or paths:
- Dialog modal
- custom Select / combobox path
- RichText

Typical expectation:
- dedicated audit posture
- strong shared contracts where automation is realistic
- explicit manual-review boundary
- no implied guarantee beyond the documented scope

## Current first-pass posture for resolved medium-risk families

These are the families whose first-pass posture should now be treated as part of the canonical support model rather than only living in family-local docs.

### Button
Current posture:
- first-pass complete
- canonical semantics
- strong contract maturity

What Marwes currently supports confidently:
- native button behavior for real button paths
- native link semantics for active anchor-backed navigation
- disabled/loading anchor fallback via removed `href`, `aria-disabled`, and focus suppression
- icon-only naming warnings in development

What still needs manual review:
- whether product code chooses buttons, navigation links, and plain inline links honestly

### Checkbox
Current posture:
- first-pass complete
- native semantics, not central semantic-registry metadata
- strong contract maturity

What Marwes currently supports confidently:
- raw checkbox checked, disabled, and indeterminate behavior
- `CheckboxField` label, description, error, and invalid wiring
- `CheckboxGroupField` grouped semantics, error live region behavior, and invalid propagation

What still needs manual review:
- truthfulness of select-all and indeterminate logic in real product flows
- focus visibility and readability in dense or long-form layouts

### Radio
Current posture:
- first-pass complete
- family-local semantic posture
- strong contract maturity

What Marwes currently supports confidently:
- raw radio checked and disabled behavior
- `RadioGroupField` label, description, error, required, disabled, and controlled/uncontrolled behavior
- thin purpose wrappers layered on top of grouped radio behavior

What still needs manual review:
- raw `Radio` usage outside `RadioGroupField`
- grouped wording clarity in longer or more complex product flows
- focus visibility with heavy custom styling

### Toast
Current posture:
- first-pass complete
- canonical semantics
- strong contract maturity

What Marwes currently supports confidently:
- raw `Toast` default `status` / `polite` behavior and assertive `alert` escalation
- purpose-toast semantics for success, error, warning, and info
- provider and container delivery behavior including max-visible trimming and dismiss forwarding
- default `4000ms` provider timing, `duration: null` persistence, and pause-on-hover/focus behavior

What still needs manual review:
- live-region timing and interruption feel in real AT/browser combinations
- whether timeout choices are sufficient for message length and action complexity
- whether product teams keep toast non-blocking instead of turning it into a mini-dialog

## Manual-review-heavy areas

These areas deserve elevated caution even when automated checks pass.

### Dialog modal
Manual review should confirm:
- focus lifecycle feels predictable in real AT/browser combinations
- background interaction is adequately suppressed for the intended flow
- dismissal behavior is not surprising in the surrounding product composition

### Custom select / combobox path
Manual review should confirm:
- opening and option announcement feel predictable
- active option feedback is understandable in real AT/browser combinations
- the product really needs the custom path rather than native select

### Rich text
Manual review should confirm:
- editing, selection, and formatting behavior in real browsers
- screen-reader announcement quality during editing
- toolbar affordances remain understandable during realistic authoring flows

### Toast
Manual review should confirm:
- repeated announcements do not become disruptive
- message duration is sufficient
- actions and dismissal affordances remain understandable and reachable

### Checkbox and radio group flows
Manual review should confirm:
- group labels, helper text, and errors still read clearly when the content gets longer
- product semantics remain truthful for select-all, required, or single-selection flows

## Release expectations by risk tier

### Low-risk native/passive families
Release expectation:
- honest docs
- stable native/passive semantics
- proportional automated coverage
- no inflated complexity claims

### Medium-risk families
Release expectation:
- first-pass audit posture should be explicit
- shared contract coverage should exist where the family meaningfully benefits from it
- Storybook docs should teach the supported boundary clearly
- manual-review boundaries should be documented, not implied

### High-risk families or paths
Release expectation:
- explicit audit posture
- strong contract coverage where practical
- manual review on the target browser + AT pairings above before stronger confidence claims are made
- no documentation should imply that automation alone proves the experience

## Manual review checklist

Use this checklist when a family is medium-risk or high-risk, or when product code uses it in an accessibility-sensitive flow.

### Naming and descriptions
- Is the control or surface named honestly?
- Are helper text and error text connected correctly?
- Does the wording stay clear when strings are longer than Storybook examples?

### Keyboard and focus
- Can keyboard users reach and operate the component predictably?
- Is focus visible in the actual themed surface?
- Do dismissal or exit paths behave predictably?

### State and announcements
- Are checked, selected, expanded, invalid, busy, or modal states announced correctly?
- Do live regions announce with the right urgency?
- Are repeated announcements disruptive?

### Timing and persistence
- Does the user have enough time to perceive the content?
- Should the surface remain visible until user dismissal?
- Does hover or focus pause timing when the component is actionable?

### Composition honesty
- Is the chosen component the right pattern?
- Would a native control, inline link, dialog, or another pattern be more honest?
- Is product code staying within the documented scope boundary?

## How to use this document with the rest of the repo

Use this order:
1. `docs/registry/families/<family>/README.md` to confirm shipped family posture
2. `docs/audits/<family>-family-accessibility.md` to see the tactical audit history
3. this file to understand the cross-family support model
4. `docs/registry/family-rollout-checklist.md` for remaining family rollout prioritization

## Related docs

- [Documentation index](../README.md)
- [Testing](./testing.md)
- [Governance](./governance.md)
- [Specification](./spec.md)
- [AI Metadata Protocol](./ai-metadata.md)
- [Component Registry](../registry/README.md)
- [Accessibility audits](../audits/README.md)
- [Registry family rollout checklist](../registry/family-rollout-checklist.md)
