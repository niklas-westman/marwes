# Accessibility Audit Status

This is the compact current-status surface for family audits.

Detailed audit files remain evidence/history. Use this file to quickly see whether a family has an active blocker, a non-blocking manual-review boundary, or a follow-up that should be queued later.

## Status vocabulary

- **Complete / no blocker** — first-pass automated and documentation work is complete enough for normal development.
- **Complete / manual-review boundary** — no known release blocker, but real assistive-technology or browser behavior still needs human review.
- **Follow-up queued** — a known improvement exists, but it is not currently blocking the family contract.
- **Blocked** — do not treat the family as stable until the blocker is resolved.

## Family matrix

| Family | Current status | Blocking? | Manual-review boundary | Evidence |
|---|---|---:|---|---|
| Accordion | Complete / manual-review boundary | No | keyboard/AT review for composed disclosure flows | [audit](./accordion-family-accessibility.md) |
| Avatar | Complete / manual-review boundary | No | image fallback and group announcement quality | [audit](./avatar-family-accessibility.md) |
| Badge | Complete / follow-up queued | No | rich group labels differ by framework capability | [audit](./badge-family-accessibility.md) |
| Button | Complete / follow-up queued | No | loading/disabled feedback in real AT | [audit](./button-family-accessibility.md) |
| Card | Complete / follow-up queued | No | purpose variants should keep React/Vue parity explicit | [audit](./card-family-accessibility.md) |
| Checkbox | Complete / manual-review boundary | No | grouped field announcement and error timing | [audit](./checkbox-family-accessibility.md) |
| Dialog | Complete / follow-up queued | No | modal background isolation and focus behavior in real browsers | [audit](./dialog-family-accessibility.md) |
| Divider | Complete / manual-review boundary | No | decorative vs semantic divider usage in context | [audit](./divider-family-accessibility.md) |
| Heading | Complete / manual-review boundary | No | page-level hierarchy quality remains app-owned | [audit](./heading-family-accessibility.md) |
| Icon | Complete / manual-review boundary | No | product naming quality for meaningful icons | [audit](./icon-family-accessibility.md) |
| Input | Complete / manual-review boundary | No | rich text, combobox, and browser editing behavior | [audit](./input-family-accessibility.md) |
| Paragraph | Complete / manual-review boundary | No | content readability remains product-owned | [audit](./paragraph-family-accessibility.md) |
| Radio | Complete / manual-review boundary | No | group announcement and validation timing | [audit](./radio-family-accessibility.md) |
| Slider | Complete / follow-up queued | No | pointer/keyboard behavior across devices | [audit](./slider-family-accessibility.md) |
| Spacing | Complete / manual-review boundary | No | purely layout-oriented; app composition still matters | [audit](./spacing-family-accessibility.md) |
| Spinner | Complete / manual-review boundary | No | loading announcement timing and interruption quality | [audit](./spinner-family-accessibility.md) |
| Switch | Complete / follow-up queued | No | exact Vue dual-support callback semantics | [audit](./switch-family-accessibility.md) |
| Tab | Complete / follow-up queued | No | cross-framework keyboard parity and contract coverage | [audit](./tab-family-accessibility.md) |
| Toast | Complete / manual-review boundary | No | live-region timing and interruption feel | [audit](./toast-family-accessibility.md) |
| Tooltip | Complete / follow-up queued | No | delayed disclosure and hover/focus behavior in real AT | [audit](./tooltip-family-accessibility.md) |

## How to update this file

Update this status file whenever an audit finding changes from:

- open blocker to resolved
- non-blocking follow-up to implemented
- manual-review boundary to stronger support claim
- family-local finding to cross-family policy

If a finding changes public accessibility guarantees, update [Accessibility support model](../reference/accessibility.md) too.
