# Storybook Companion Maintenance

This document explains the normal workflow for Marwes Storybook consistency.

## Goal

Keep Storybook family health at `100/100` across React, Vue, and supported story-only families.

## Default workflow

For normal validation, run:

```bash
pnpm check
pnpm test
```

`pnpm check` now includes a headless Storybook consistency audit.

If it fails, use pi for drill-down:

```text
/story-review <family>
/story-fix-plan <family>
/story-audit
```

## Source of truth

Project-specific Storybook companion rules live in:

- `.pi/storybook-companion.config.ts`

The pi extension lives in:

- `.pi/extensions/storybook-companion.ts`

The headless audit used by `pnpm check` lives in:

- `scripts/storybook-consistency.mjs`

## What belongs in config

Update `.pi/storybook-companion.config.ts` when the extension is misunderstanding intentional Marwes conventions.

Typical config changes:

- ignored helper/internal stems
- family-specific story title rules
- canonical component stem overrides
- story-only family support
- excluded families
- export parity exemptions

## When to change repo code instead

Change source files, stories, tests, or docs when the audit reveals a real missing artifact, such as:

- missing Storybook taxonomy test
- missing introduction docs test
- missing family barrel export
- missing docs file
- actual cross-framework drift

## Story-only families

Current story-only family support:

- `color`

Current excluded family:

- `typography`

## Reload rule

After changing either of these files:

- `.pi/storybook-companion.config.ts`
- `.pi/extensions/storybook-companion.ts`

reload pi before trusting command output:

```text
/reload
```

## Minimal debugging loop

1. Run:
   ```bash
   pnpm check
   ```
2. If the Storybook consistency step fails, inspect the affected family:
   ```text
   /story-review <family>
   ```
3. Decide whether the issue is:
   - a real repo issue
   - or a config/rule issue
4. Fix it
5. Reload pi if config or extension changed
6. Re-run:
   ```bash
   pnpm check
   ```

## Useful commands

```text
/story-review button
/story-review color
/story-fix-plan input
/story-audit
/story-audit-export
```
