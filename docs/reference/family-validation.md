# Family Validation

Use this as the working model for changing one Marwes component family without losing release confidence.

## Core idea

Every family should be validated through the same architecture layers:

1. Core recipe and accessibility contract
2. Preset CSS hooks and shipped styling surface
3. React adapter behavior
4. Vue adapter behavior
5. Storybook docs, taxonomy, and parity
6. Registry and docs links

The goal is not to run every repo check after every small edit. The goal is to run the smallest family gate while working, then run the broader release gates before merging or publishing.

## Family loop

For a focused family pass:

```bash
pnpm validate:family button
```

This runs the available checks for the requested family:

- Biome check over the family paths
- core recipe tests when they exist
- preset CSS/export tests relevant to the family
- React family tests
- Vue family tests
- React/Vue Storybook docs tests for the family
- Storybook consistency for that family only
- registry generated artifact check
- docs link check

For browser-backed Storybook story and accessibility checks on that family:

```bash
pnpm validate:family button --storybook
```

Use `--storybook` when the change touches visual states, keyboard behavior, interactive stories, or accessibility-sensitive wiring. Some local sandboxes need browser/port permissions for this mode.

## Master gates

Use these commands by risk level.

```bash
pnpm validate:packages
```

Runs package typechecks, package builds, and package tests.

```bash
pnpm validate:docs
```

Runs docs links, docs/API drift, semantic registry, trust artifacts, component registry, and Storybook consistency.

```bash
pnpm validate:security
```

Runs full and production dependency audits.

```bash
pnpm validate:release
```

Runs the release gate: security, packages, docs/artifacts/registry, repo Biome check, and Storybook accessibility smoke.

## When to run what

During a narrow family edit:

```bash
pnpm validate:family <family>
```

When the change touches visual or a11y story behavior:

```bash
pnpm validate:family <family> --storybook
```

Before considering a package-level change done:

```bash
pnpm validate:packages
```

Before release:

```bash
pnpm validate:release
```

## Family definition of done

A family is ready when:

- core output is framework-agnostic and tested
- React and Vue stay thin over core
- CSS selectors match the `[data-component]` and `mw-*` contract
- Storybook has aligned React/Vue coverage
- docs explain usage without requiring source-code reading
- registry generated files are current
- accessibility posture is explicit about automated and manual coverage
- `pnpm validate:family <family>` passes
- `pnpm validate:family <family> --storybook` passes when the change affects story/a11y behavior

## Related docs

- [Testing](./testing.md)
- [Accessibility support model](./accessibility.md)
- [Registry family rollout checklist](../registry/family-rollout-checklist.md)
- [Adding registry families](../registry/adding-families.md)
