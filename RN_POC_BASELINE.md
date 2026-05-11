# React Native POC Baseline

## Branch

- Baseline branch: `rn-poc/baseline`
- Source branch: `react-native-evaluation`
- Source commit: `893c77acbfaaa57c69cfc1b269600c2f0fbe3b83`
- Created: 2026-05-11

## Purpose

This branch is the shared starting point for React Native architecture POCs. It should make the
current RN POC reproducible, measurable, and fair to compare across future branches.

## Current POC Scope

Included current RN POC areas:

- `packages/react-native`
- `apps/playground-react-native`
- `scripts/generate-react-native-styles.ts`
- root RN scripts in `package.json`
- RN workspace/dependency updates in `pnpm-lock.yaml`
- RN path alias in `tsconfig.base.json`
- planning and findings docs:
  - `new-implementation-rn.md`
  - `REACT_NATIVE_PLAN.md`
  - `PART2_RN.md`
  - `research.md`
  - `spec.md`
  - `todo.md`

Current supported POC families:

- Button
- Badge
- Divider

## Known Baseline Issues

- `pnpm native-styles:check` requires running outside the sandbox in this environment because `tsx`
  creates an IPC pipe under `/var/folders`.
- Expo playground validation is still manual and pending.

## Baseline Cleanup Applied

- Removed the RN package `rootDir: "./src"` constraint so the workspace `@marwes-ui/core` source alias
  can typecheck during local POC work.
- Updated the generated native style output to use a stable `StyleRule` type instead of over-narrow
  per-literal rule inference.
- Updated RN `Button` and `Badge` children props to use `TextProps["children"]`, matching React
  Native `Text` expectations in this workspace.

## Worktree Layout

Planned sibling worktrees:

```text
../marwes-rn-baseline
../marwes-rn-a-hybrid
../marwes-rn-c-handwritten
../marwes-rn-d-token
../marwes-rn-e-dsl
../marwes-rn-f-runtime
../marwes-rn-g-native-first
```

Worktrees are not created yet. They should be created after this baseline branch has a clean baseline
commit.

## Baseline Validation

| Command | Status | Notes |
|---|---|---|
| `pnpm native-styles:check` | Pass | Required sandbox escalation here because `tsx` IPC is blocked by default. |
| `pnpm --filter @marwes-ui/react-native typecheck` | Pass | Typecheck boundary cleanup applied. |
| Expo playground | Pending | Manual validation not run yet. |
