# Accessibility Audits

This folder contains component-family accessibility audits.

Use these docs as the tactical layer beneath `AXE_ROADMAP.md`.

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

## Audit status

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
| Button | P3 | Queued | Not started |

### Wave 2 — Medium-risk families

| Family | Priority | Status |
| --- | --- | --- |
| Checkbox | Later | Queued |
| Radio | Later | Queued |
| Toast | Later | Queued |
| Avatar | Later | Queued |
| Badge | Later | Queued |
| Spinner | Later | Queued |
| Card | Later | Queued |

### Wave 3 — Lower-risk baseline families

| Family | Priority | Status |
| --- | --- | --- |
| Divider | Later | Queued |
| Heading | Later | Queued |
| Paragraph | Later | Queued |
| Icon | Later | Queued |
| Spacing | Later | Queued |

## How to use these audits

1. Start with the active family doc
2. Walk the file tree in order
3. Record any spec decisions before changing code
4. Fix one family completely across all layers
5. Update the family docs/status docs when the pass is complete
6. Run verification commands before moving to the next family

Status docs to update when relevant:
- the active family audit doc
- this `docs/audits/README.md` file
- `AXE_ROADMAP.md`
- Storybook introductions and spec text when public guidance changed

## Related docs

- [AXE roadmap](../../AXE_ROADMAP.md)
- [Methodology](./METHODOLOGY.md)
- [Adding Components](../guides/adding-components.md)
- [Architecture](../reference/architecture.md)
- [Specification](../reference/spec.md)
- [Testing](../reference/testing.md)
- [Governance](../reference/governance.md)
