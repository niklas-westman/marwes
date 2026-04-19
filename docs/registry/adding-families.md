# Adding Registry Families

This guide explains how to add a new family to the component registry.

Use it after the family already exists in the repo, or when the family is far enough along that the linked files, stories, and contracts are real.

## Goal

A good registry family entry should give both:
- a human-readable understanding of the family
- a machine-readable structural map of the family

That means every registry family should have:
- `families/<family>/README.md`
- `families/<family>/registry.meta.json`
- generated `families/<family>/registry.generated.json`
- `visuals/*.mmd`
- merged inclusion in `artifacts/component-registry.json`

Preview assets are optional, not required.

## Ownership model

Keep this boundary strict:

### Human-authored
- `README.md`
- `registry.meta.json`
- `visuals/*.mmd`
- optional `previews/*`

### Generator-owned
- `registry.generated.json`
- `artifacts/component-registry.json`

Do not hand-edit generated files once the generator owns them.

## Read before starting

- [`./README.md`](./README.md)
- [`../reference/architecture.md`](../reference/architecture.md)
- [`../reference/ai-metadata.md`](../reference/ai-metadata.md)
- [`../guides/adding-components.md`](../guides/adding-components.md)
- [`../audits/README.md`](../audits/README.md)
- [`../../AXE_ROADMAP.md`](../../AXE_ROADMAP.md)

If the family is design-driven, also read the current local Figma refs first:
- `.figma/INDEX.md`
- `.figma/marwes/components/<family>.json`
- `.figma/NODE_REFERENCE.md`
- `.figma/nodes.json`

## Folder shape

Create:

```text
docs/registry/families/<family>/
├── README.md
├── registry.meta.json
├── registry.generated.json      # generated
├── visuals/
│   ├── layer-map.mmd
│   ├── file-map.mmd
│   └── interaction-map.mmd
└── previews/                    # optional
    ├── canonical-light.svg      # prefer SVG if committed
    ├── canonical-dark.svg
    └── states.svg
```

## Recommended workflow

### 1. Create the family folder
Copy the templates from:
- `docs/registry/templates/family.README.template.md`
- `docs/registry/templates/family.meta.template.json`

### 2. Write the human page
Fill in `README.md` with:
- summary
- visual understanding
- Figma refs
- philosophy
- AXE posture
- semantics snapshot
- linked files
- verification
- open questions

### 3. Fill in `registry.meta.json`
This is the authored structured summary.

Only put information here that should be maintained by humans, such as:
- philosophy
- use/avoid guidance
- AXE risk tier
- manual review boundaries
- canonical Storybook story choices
- open questions

### 4. Add the family source config to the generator
Update:
- `scripts/component-registry-sources.ts`

Add the new family to the registry source map so the generator can discover:
- core files
- preset CSS
- React/Vue directories
- Storybook directories
- contracts
- audit doc path
- Figma references

The generator entrypoint itself lives in:
- `scripts/generate-component-registry.ts`

### 5. Add visuals
Required visuals:
- `visuals/layer-map.mmd`
- `visuals/file-map.mmd`
- `visuals/interaction-map.mmd`

These should help a reader understand:
- where the family sits in the repo
- how the files connect
- where semantics and a11y flow through the family

### 6. Decide whether the family needs preview assets
Default to no committed preview files.

First ask whether the family is already clear enough through:
- canonical Storybook story references
- Figma refs
- Mermaid diagrams
- variant and state tables in the README

Only add preview assets when they materially improve understanding.

If preview assets are needed:
- prefer SVG over PNG for committed files
- keep the count small
- avoid large screenshot sets
- treat them as orientation aids, not the source of truth

### 7. Generate the structural files
Run:

```bash
pnpm registry:generate
```

This should update:
- `docs/registry/families/<family>/registry.generated.json`
- `artifacts/component-registry.json`

### 8. Validate
Run:

```bash
pnpm registry:check
pnpm docs:links
```

For broader confidence, also run:

```bash
pnpm storybook:consistency
pnpm check
```

## Family checklist

Use this when adding a family:

- [ ] family folder created under `docs/registry/families/<family>/`
- [ ] `README.md` created from the template
- [ ] `registry.meta.json` created from the template
- [ ] local Figma refs reviewed
- [ ] snapshot section filled in
- [ ] philosophy section filled in
- [ ] AXE posture section filled in
- [ ] semantics snapshot filled in
- [ ] linked files table filled in
- [ ] `visuals/layer-map.mmd` added
- [ ] `visuals/file-map.mmd` added
- [ ] `visuals/interaction-map.mmd` added
- [ ] optional preview assets considered and either intentionally omitted or added sparingly
- [ ] family source config added to `scripts/component-registry-sources.ts`
- [ ] `pnpm registry:generate` run
- [ ] `pnpm registry:check` passes
- [ ] `pnpm docs:links` passes

## Quality bar

A registry family entry is in good shape when:
- the README is readable without opening code first
- the structural links are generator-backed
- the visuals help orientation instead of duplicating prose
- the page does not depend on a pile of committed binary screenshots
- the Figma refs are explicit and local
- the AXE posture is honest about automation vs manual review
- the page clearly points back to the real sources of truth

## Common mistakes to avoid

- putting implementation truth only in the README and not in source files
- hand-editing `registry.generated.json`
- using remote or ad hoc Figma refs instead of the local synced files
- listing every file manually in prose when the generator should own the structural list
- treating previews as the source of truth instead of orientation aids
- committing large PNG screenshot sets by default
- using the registry as a replacement for spec, architecture, or audit docs
