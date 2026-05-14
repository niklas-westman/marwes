# Storybook Alignment

Keep story coverage consistent across framework storybooks (React, Svelte, Vue).

## The problem

Each framework storybook can drift independently — a story added to React may
never make it to Svelte or Vue. This script catches those gaps early.

## Usage

```bash
python3 docs/guides/storybook-alignment/audit-storybook-alignment.py <truth> <target>
```

| Param | Description |
|---|---|
| `<truth>` | Root of the **source-of-truth** storybook (e.g. `apps/storybook-react`) |
| `<target>` | Root of the storybook to **check for missing stories** (e.g. `apps/storybook-svelte`) |

### Examples

Check Svelte against React:

```bash
python3 docs/guides/storybook-alignment/audit-storybook-alignment.py \
  apps/storybook-react \
  apps/storybook-svelte
```

Check Vue against React:

```bash
python3 docs/guides/storybook-alignment/audit-storybook-alignment.py \
  apps/storybook-react \
  apps/storybook-vue
```

## What it does

1. Scans `<truth>/src/stories/` for all `*.stories.tsx` / `*.stories.ts` files.
2. Scans `<target>/src/stories/` for the same set of files (matched by relative path, extension-agnostic).
3. Extracts every `export const <StoryName>` from each file.
4. Reports stories present in truth but absent in target.

## Output

Clean run:

```
Storybook Alignment Audit
============================================================
  Truth:  apps/storybook-react (.stories.tsx)
  Target: apps/storybook-svelte (.stories.ts)
============================================================

  ✅ All stories in storybook-react exist in storybook-svelte.

  Files compared: 87
```

With gaps:

```
Storybook Alignment Audit
============================================================
  Truth:  apps/storybook-react (.stories.tsx)
  Target: apps/storybook-svelte (.stories.ts)
============================================================

  ❌ Missing stories in storybook-svelte:

  card/card:
    - RichContent
    - StateMatrix

  toast/toast:
    - AllVariants
    - DarkVariants

──────────────────────────────────────────────────────────
  Total missing stories: 4
  Files compared:        87
```

## Exit codes

| Code | Meaning |
|---|---|
| `0` | All stories aligned |
| `1` | Missing stories found (or bad arguments) |

## Adding more truth storybooks

The script works with any pair of storybook roots. As new framework storybooks
are added, run the same script with whichever storybook is currently the most
complete as truth. React is the current default.

## CI integration

Add to your CI pipeline to prevent drift:

```yaml
- name: Audit storybook alignment (Svelte)
  run: |
    python3 docs/guides/storybook-alignment/audit-storybook-alignment.py \
      apps/storybook-react \
      apps/storybook-svelte

- name: Audit storybook alignment (Vue)
  run: |
    python3 docs/guides/storybook-alignment/audit-storybook-alignment.py \
      apps/storybook-react \
      apps/storybook-vue
```
