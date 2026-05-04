# Accessibility Audits

This folder contains component-family accessibility audits.

Use these docs as the tactical evidence layer beneath the accessibility support model. For compact current status, start with [Audit Status](./status.md).

The roadmap answers:
- what to prioritize
- which families to audit first
- which cross-cutting systems must change

These audit docs answer:
- which files belong to one family
- what order to review them in
- what needs to be verified at each layer
- what decisions and fixes should come out of the audit

## Audit workflow

Before executing family work, read:
- [Methodology](./METHODOLOGY.md)

Each family audit follows the repository workflow from `docs/guides/adding-components.md`:

```text
spec/decision → core → preset CSS → React adapter → React stories/tests → Vue adapter → Vue stories/tests → contracts/exports → verify
```

That means accessibility review should walk the same tree as implementation.

## Audit queue

This section describes the historical/prioritized audit queue. It is not the canonical compact current-status table.

For current blocker/manual-review status across all families, use [Audit Status](./status.md).

### Wave 1 — Highest-risk families

| Family | Priority | Status | Audit doc |
| --- | --- | --- | --- |
| Input | P1 | First pass complete | [input-family-accessibility.md](./input-family-accessibility.md) |
| Tab | P1 | First pass complete | [tab-family-accessibility.md](./tab-family-accessibility.md) |
| Switch | P1 | First pass complete | [switch-family-accessibility.md](./switch-family-accessibility.md) |
| Accordion | P2 | First pass complete | [accordion-family-accessibility.md](./accordion-family-accessibility.md) |
| Tooltip | P2 | First pass complete | [tooltip-family-accessibility.md](./tooltip-family-accessibility.md) |
| Slider | P2 | First pass complete | [slider-family-accessibility.md](./slider-family-accessibility.md) |
| Dialog | P2 | First pass complete | [dialog-family-accessibility.md](./dialog-family-accessibility.md) |
| Button | P3 | First pass complete | [button-family-accessibility.md](./button-family-accessibility.md) |

### Wave 2 — Medium-risk families

| Family | Priority | Status | Audit doc |
| --- | --- | --- | --- |
| Checkbox | Later | First pass complete | [checkbox-family-accessibility.md](./checkbox-family-accessibility.md) |
| Radio | Later | First pass complete | [radio-family-accessibility.md](./radio-family-accessibility.md) |
| Toast | Later | First pass complete | [toast-family-accessibility.md](./toast-family-accessibility.md) |
| Avatar | Later | First pass complete | [avatar-family-accessibility.md](./avatar-family-accessibility.md) |
| Badge | Later | First pass complete | [badge-family-accessibility.md](./badge-family-accessibility.md) |
| Spinner | Later | First pass complete | [spinner-family-accessibility.md](./spinner-family-accessibility.md) |
| Card | Later | First pass complete | [card-family-accessibility.md](./card-family-accessibility.md) |

### Wave 3 — Lower-risk baseline families

| Family | Priority | Status | Audit doc |
| --- | --- | --- | --- |
| Divider | Later | First pass complete | [divider-family-accessibility.md](./divider-family-accessibility.md) |
| Heading | Later | First pass complete | [heading-family-accessibility.md](./heading-family-accessibility.md) |
| Paragraph | Later | First pass complete | [paragraph-family-accessibility.md](./paragraph-family-accessibility.md) |
| Icon | Later | First pass complete | [icon-family-accessibility.md](./icon-family-accessibility.md) |
| Spacing | Later | First pass complete | [spacing-family-accessibility.md](./spacing-family-accessibility.md) |

## How to use these audits

1. Start with the active family doc
2. Walk the file tree in order
3. Record any spec decisions before changing code
4. Fix one family completely across all layers
5. Update the family docs/status docs when the pass is complete
6. Run verification commands before moving to the next family

Status docs to update when relevant:
- [Audit Status](./status.md) for compact current family status
- the active family audit doc for evidence/history
- this `docs/audits/README.md` file only when queue/process changes
- `docs/reference/accessibility.md` when cross-family support policy changes
- Storybook introductions and spec text when public guidance changed

## Related docs

- [Accessibility Support Model](../reference/accessibility.md)
- [Audit Status](./status.md)
- [Methodology](./METHODOLOGY.md)
- [Adding Components](../guides/adding-components.md)
- [Architecture](../reference/architecture.md)
- [Specification](../reference/spec.md)
- [Testing](../reference/testing.md)
- [Governance](../reference/governance.md)


Status ownership note: compact cross-family status is owned by `docs/audits/status.md`.
