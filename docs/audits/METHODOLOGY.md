# Accessibility Audit Methodology

This document explains how the accessibility initiative should be executed.

Use it together with:
- `AXE_ROADMAP.md` for strategic priorities
- `docs/audits/README.md` for the family audit queue
- `docs/audits/<family>-accessibility.md` for family-specific execution

## Why this methodology exists

This initiative is not just a list of accessibility fixes.
It is a process for making accessibility:
- architectural
- provable
- repeatable
- scalable across all component families

The goal is to avoid one-off fixes that drift from:
- the spec
- core behavior
- React behavior
- Vue behavior
- Storybook docs
- tests and contracts

## Core principle

Audit and harden one family at a time, using the same tree order the repo uses to build components.

That order comes from `docs/guides/adding-components.md`.

```text
spec/decision → core → preset CSS → React adapter → React stories/tests → Vue adapter → Vue stories/tests → contracts/exports → verify
```

Accessibility work should follow this order too.

## What success looks like

A family is in good shape when all of these are aligned:
- intended behavior in the spec
- actual behavior in core
- actual behavior in React
- actual behavior in Vue
- public guidance in Storybook/docs
- proof in contracts and tests

If one of these disagrees, the work is not done.

---

## The execution loop

Use this loop for every family audit.

### 1. Audit
Read before changing code:
- relevant sections in `docs/reference/spec.md`
- `docs/reference/architecture.md`
- `docs/reference/testing.md`
- `docs/guides/adding-components.md`
- the family audit doc in `docs/audits/`
- the family file tree across core, presets, React, Vue, Storybook, and contracts

Goal:
- understand the intended contract
- identify mismatches and risks
- identify open decisions

### 2. Decide
If the intended behavior is unclear, resolve the decision first.

Examples:
- native-first vs custom-first
- whether a custom widget remains shipped
- whether a component is safe to treat as fully automated vs manual-review-heavy

Rule:
- do not patch implementation first when the intended contract is still undecided

### 3. Fix the source of truth in order
Prefer this order:

1. spec / decision
2. core contract
3. adapter behavior
4. stories and docs
5. shared contracts and tests

Why:
- core should remain the source of truth
- docs should teach what is actually shipped
- tests should prove the intended behavior, not a fallback or accidental path

### 4. Verify
Prefer targeted verification first.

Typical commands:

```bash
pnpm typecheck
pnpm test:typecheck:contracts
pnpm docs:links
```

Then family-focused tests, for example:

```bash
pnpm --filter @marwes-ui/react exec vitest run <family tests>
pnpm --filter @marwes-ui/vue exec vitest run <family tests>
```

Then broader checks when the family step is stable:

```bash
pnpm test:packages
pnpm storybook:consistency
pnpm check
```

### 5. Record findings and update docs
Update the family audit doc with:
- what was already good
- what was risky
- what decisions were made
- what was fixed
- what remains next

Then update the docs that track family status and public guidance:
- the affected Storybook docs and introductions
- `docs/reference/spec.md` when the contract changed or became explicit
- `docs/audits/README.md` when the family status changes
- `AXE_ROADMAP.md` when roadmap checklist/status changes

Do this in the same pass as the implementation and test updates.
This keeps the initiative resumable without chat context and prevents code/docs drift.

---

## Shared contract philosophy

A shared contract lives in:
- `tests/contracts/*.contract.ts`

A shared contract defines framework-agnostic behavior.

Examples:
- a custom combobox opens on ArrowDown
- disabled options are skipped during keyboard navigation
- a field wrapper wires helper text into `aria-describedby`

Each adapter then implements the same contract through a harness.

### Why shared contracts matter

They help prove:
- React and Vue parity
- intended accessibility behavior
- regressions at the behavior level instead of only the implementation level

Prefer shared contracts when:
- a component exists in both React and Vue
- the behavior is semantically important
- the behavior is likely to drift between frameworks

Examples of strong shared-contract candidates:
- tabs
- switches
- custom select/combobox
- accordion groups
- slider
- tooltip interactions
- modal behavior where practical

---

## Harness philosophy

A harness is the adapter-specific code that renders a component for a shared contract.

### Good harness
A good harness:
- renders the component close to real usage
- does not inject fallback accessibility props unless the contract intends that path
- helps prove the intended labeling, keyboard, and state path

### Bad harness
A bad harness:
- makes the test pass by adding props that hide regressions
- proves only that the component can be accessible, not that the intended wrapper contract works

Example:
- passing `ariaLabel` directly into a field wrapper test can hide a broken visible-label path

### Rule
If a harness can mask the real behavior, tighten the harness before trusting the test result.

---

## Documentation philosophy for this initiative

Docs are part of the product contract.

That means:
- Storybook docs are not just examples
- README wording is not just marketing
- if docs teach the wrong default, that is a real bug

When behavior changes, update docs in the same step whenever possible.

Especially important for:
- default behavior
- native vs custom guidance
- accessibility caveats
- manual review expectations

---

## Manual review vs automated proof

Not all accessibility behavior can be proven equally well.

### Good automation candidates
- label and description wiring
- invalid and disabled state semantics
- keyboard navigation for covered widgets
- DOM role and ARIA relationships
- React/Vue parity

### Manual-review-heavy candidates
- rich text editing
- modal behavior across real AT/browser combinations
- custom widgets in mobile/assistive-tech edge cases
- tooltip/popover misuse boundaries

Rule:
- do not let tests overclaim certainty where manual review is still necessary

Instead:
- keep the automation
- document the manual-review boundary clearly

---

## Step completion rule

A step is complete when all of the following are true:
- the decision is explicit if one was needed
- code matches the decision
- docs match the code
- status docs (`docs/audits/README.md`, family audit doc, and `AXE_ROADMAP.md` when relevant) are updated
- tests/contracts prove the intended path
- targeted verification passes

A family is not complete just because one implementation file changed.

---

## Recommended working order for this initiative

### Cross-cutting first
- accessibility enforcement foundation
- major open decisions that affect family defaults
- shared methodology and audit docs

### Then family-by-family
Recommended early family order:
1. Input
2. Tab
3. Switch
4. Accordion
5. Tooltip
6. Slider
7. Dialog
8. Button

### Then broader hardening
- theme accessibility validation
- dev-time accessibility warnings
- governance upgrades
- support-model documentation

---

## What to do when resuming work later

If context is lost, resume in this order:

1. read `AXE_ROADMAP.md`
2. read `docs/audits/README.md`
3. read this file
4. open the active family audit doc
5. continue from the next unchecked or unresolved item

That should be enough to continue without rediscovery.
