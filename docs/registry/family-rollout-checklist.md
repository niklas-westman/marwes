# Registry Family Rollout Checklist

Use this file as the cross-session working reference for building out the component registry family by family.

If chat context is lost, start here.

## What this file is for

This checklist is the practical working layer for the registry rollout.

It is meant to help with:
- deciding the next family to build
- keeping the registry page shape consistent
- preserving the authored vs generated boundary
- resuming work across separate context sessions
- tracking what is already complete vs what is next

## Frozen conventions

These conventions should stay stable unless we intentionally revise the registry system.

### Registry home
- `docs/registry/`

### Per-family required files
- `docs/registry/families/<family>/README.md`
- `docs/registry/families/<family>/registry.meta.json`
- `docs/registry/families/<family>/registry.generated.json` — generated
- `docs/registry/families/<family>/visuals/layer-map.mmd`
- `docs/registry/families/<family>/visuals/file-map.mmd`
- `docs/registry/families/<family>/visuals/interaction-map.mmd`

### Repo-wide generated artifact
- `artifacts/component-registry.json`

### Human-authored vs generated boundary
#### Human-authored
- `README.md`
- `registry.meta.json`
- `visuals/*.mmd`
- optional preview assets only when intentionally justified

#### Generator-owned
- `registry.generated.json`
- `artifacts/component-registry.json`

Do not hand-edit generated files.

### Visual policy
Use this order by default:
1. Storybook story references
2. Mermaid diagrams
3. optional preview assets only when materially useful

If preview assets are ever committed:
- prefer SVG over PNG
- keep the count small
- treat them as orientation aids, not source of truth

### Registry page section order
Each family page should aim to include these sections in this order:

1. `Registry files`
2. `Registry snapshot`
3. `Registry ownership`
4. `Summary`
5. `Family surface map`
6. `Canonical visual understanding`
7. `Primary visual sources`
8. `Figma references`
9. `Figma variant summary`
10. `Visual model`
11. `Philosophy`
12. `AXE / accessibility posture`
13. `Semantics snapshot`
14. `Linked files`
15. `Verification`
16. `Registry notes`
17. `Open questions`

### Snapshot rows to keep consistent
Every family snapshot should try to include:
- Family status
- Audit status
- Semantic coverage
- Generated structural truth
- Primary Figma nodes
- Main AXE watch item

## Current registry status

| Family | Registry page | Semantic coverage | Audit status | Notes |
| --- | --- | --- | --- | --- |
| Button | Done | Canonical | Queued | good baseline simple family |
| Input | Done | Family-local | First pass complete | best complex family example |
| Dialog | Done | Canonical | First pass complete | best shell-vs-modal example |
| Tab | Done | Family-local | First pass complete | strong coordinated-widget baseline with shared contract coverage |
| Switch | Done | Family-local | First pass complete | clear field-wiring baseline with shared contract coverage |
| Accordion | Done | Family-local | First pass complete | strong grouped-disclosure baseline with shared contract coverage |
| Tooltip | Done | Family-local | First pass complete | clear contextual-help baseline with shared contract coverage |
| Slider | Done | Family-local | First pass complete | strong native-range baseline with shared contract and field-wiring coverage |
| Avatar | Done | Canonical | Queued | strong canonical identity baseline with atom, molecule, and purpose contract coverage |
| Toast | Done | Canonical | Queued | strong canonical live-region baseline with provider/container delivery coverage |
| Badge | Done | Canonical | Queued | strong canonical compact-status baseline with atom, grouping, and purpose contract coverage |
| Spinner | Done | Family-local | Queued | strong indeterminate-loading baseline with atom, context-wrapper, and button-integration coverage |
| Card | Done | Family-local | Queued | clear passive-surface baseline with local purpose wrappers and strong visual-state teaching coverage |
| Divider | Done | Family-local | Queued | strong semantic-separator baseline with shared contract coverage and clear horizontal-vs-vertical guidance |
| Heading | Done | None | Queued | strong native-heading baseline with shared contract coverage, shared typography preset usage, and an explicit Figma typography-vs-scaffold clarification |
| Checkbox | Done | None | First pass complete | strong native-checkbox baseline with atom, single-field, and grouped shared contract coverage, field-helper-backed molecules, and explicit Figma atom-vs-field distinction |
| Radio | Done | Family-local | First pass complete | strong native single-selection baseline with grouped field-helper wiring, thin purpose wrappers, and shared raw-atom plus grouped-field contract coverage |
| Paragraph | Done | None | Queued | strong native body-copy baseline with shared typography preset usage, shared contract coverage, and an explicit Figma typography-vs-runtime-size clarification |
| Icon | Done | None | Queued | strong named-SVG baseline with shared decorative-vs-labelled contract coverage, gallery-led discovery, and an explicit Figma-vs-runtime inventory clarification |
| Spacing | Done | Family-local | Queued | strong decorative layout-baseline family with explicit token vocabulary, local metadata, and an honest no-Figma-family clarification |

## Suggested next family queue

No immediate next family is queued in the current shipped package set.

Why this status is useful:
- spacing completes the remaining foundational atom family in the current rollout queue
- the registry now covers every currently shipped family under `packages/react/src/components/` and `packages/vue/src/components/`
- the next session should either reassess backlog priorities for future shipped families or tighten shared registry governance and verification work

## Session start checklist

When starting a new registry-family session, do this first:

- [ ] read `docs/registry/README.md`
- [ ] read this file
- [ ] read `docs/registry/adding-families.md`
- [ ] read the target family’s audit doc if it exists
- [ ] read the target family’s Figma refs from `.figma/`
- [ ] inspect the current family file tree across core, presets, React, Vue, Storybook, and contracts
- [ ] decide whether the family semantic coverage is `canonical`, `family-local`, or `none`

## Per-family build workflow

Use this sequence for every new registry family.

### 1. Discovery
- [ ] identify all relevant family source paths
- [ ] identify all relevant contracts
- [ ] identify audit doc status
- [ ] identify Figma component/page refs
- [ ] identify semantic maturity level

### 2. Family source config
- [ ] add the family to `scripts/component-registry-sources.ts`
- [ ] include core, preset, React, Vue, Storybook, contract, audit, and Figma refs
- [ ] include semantic source config when the family is not in the central semantic registry

### 3. Human page
- [ ] create `docs/registry/families/<family>/README.md`
- [ ] fill snapshot
- [ ] fill family surface map
- [ ] add primary visual sources
- [ ] add Figma refs and variant summary
- [ ] add AXE posture
- [ ] add semantics snapshot
- [ ] add linked files and verification

### 4. Meta file
- [ ] create `docs/registry/families/<family>/registry.meta.json`
- [ ] set status, risk tier, audit status, canonical stories, and open questions
- [ ] capture use/avoid guidance and philosophy

### 5. Visual diagrams
- [ ] add `visuals/layer-map.mmd`
- [ ] add `visuals/file-map.mmd`
- [ ] add `visuals/interaction-map.mmd`

### 6. Generation
- [ ] run `pnpm registry:generate`
- [ ] inspect `registry.generated.json`
- [ ] inspect `artifacts/component-registry.json`

### 7. Validation
- [ ] run `pnpm registry:check`
- [ ] run `pnpm docs:links`
- [ ] optionally run `pnpm storybook:consistency`

## Per-family definition of done

A registry family is in good shape when:
- [ ] the README is readable without opening code first
- [ ] the family page follows the agreed section order
- [ ] structural links are generator-backed
- [ ] semantic maturity is described honestly
- [ ] Storybook is the primary visual source
- [ ] Figma refs are explicit and local
- [ ] AXE posture is explicit about automation vs manual review
- [ ] open questions are real and specific
- [ ] `pnpm registry:check` passes
- [ ] `pnpm docs:links` passes
- [ ] `pnpm validate:family <family>` passes
- [ ] `pnpm validate:family <family> --storybook` passes when the change affects stories, interactions, visual states, or accessibility-sensitive behavior

## Session handoff template

Use this at the end of a session so the next session can continue without rediscovery.

```md
## Registry session handoff

### Family
- `<family>`

### Status
- `<not started | in progress | ready for review | done>`

### Completed this session
- ...
- ...

### Remaining work
- ...
- ...

### Files touched
- `...`
- `...`

### Validation run
- [ ] `pnpm registry:generate`
- [ ] `pnpm registry:check`
- [ ] `pnpm docs:links`
- [ ] other: `...`

### Open questions
- ...
- ...
```

## Quick commands

```bash
pnpm validate:family <family>
pnpm validate:family <family> --storybook
pnpm validate:packages
pnpm validate:docs
pnpm validate:release
pnpm registry:generate
pnpm registry:check
pnpm docs:links
pnpm storybook:consistency
```

## Resume rule

If context is lost, resume in this order:
1. read this file
2. read `docs/registry/README.md`
3. read `docs/registry/adding-families.md`
4. read the target family audit doc
5. read the target family Figma refs
6. continue from the next unchecked item above
