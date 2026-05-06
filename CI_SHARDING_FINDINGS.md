# CI Sharding Findings

## Goal

Test whether normal GitHub runner CI with pnpm cache and parallel validation jobs improves Marwes PR feedback time compared to the current serial required CI job.

## First PR Run

Observed PR check times:

```text
Current CI:
  changed-scope: 16s
  changeset-check: 9s
  lint-typecheck-test-build: 3m

CI Sharded:
  changed-scope: 12s
  changeset-check: 8s
  workflow syntax: 7s
  repo checks: 19s
  typecheck: 38s
  package tests: 1m
  package build: 29s
  app build: 4m
```

## First Verdict

The first sharded run was not faster overall.

The split worked for most shards, but `app build` became the limiting job and took longer than the current full serial CI job.

```text
Current required CI: 3m
Sharded experiment slowest shard: 4m
```

## What This Means

Parallel sharding is only useful if the slowest shard is shorter than the serial job it replaces.

In this run, package checks improved visibility and isolated work well, but app and Storybook build time dominated the sharded workflow.

## Second PR Run

The second run was triggered by a docs-only commit after the initial workflow run warmed caches.

Observed PR check times:

```text
Current CI:
  changed-scope: 12s
  changeset-check: 4s
  lint-typecheck-test-build: 3m

CI Sharded:
  changed-scope: 14s
  changeset-check: 9s
  workflow syntax: 6s
  repo checks: 20s
  typecheck: 45s
  package tests: 1m
  package build: 30s
  app build: 55s
```

## Second Verdict

The second sharded run was faster for main validation work.

```text
Current required CI: 3m
Sharded experiment slowest shard: 1m
```

The first run's `app build` result appears to have been cold-cache behavior. With warmer cache, the slowest shard became `package tests` at about 1 minute.

This makes normal GitHub runner sharding the best current Marwes CI optimization candidate from these experiments.

## A11y Shard Decision

The experiment briefly added `test:storybook:a11y` as a separate shard because it exists in the local/pre-push validation path.

That was not a clean PR CI comparison. The current required PR CI does not run Storybook a11y smoke tests, and the command depends on Playwright browser binaries that are not installed by a normal `pnpm install`.

Keep Storybook a11y out of this sharded PR benchmark for now. If Marwes later decides to make browser-backed a11y smoke tests required on PRs, add them as a separate dedicated workflow or shard with explicit Playwright setup.

## Final PR Run

Observed PR check times after removing the extra a11y shard:

```text
Current CI:
  changed-scope: 14s
  changeset-check: 6s
  lint-typecheck-test-build: 3m

CI Sharded:
  changed-scope: 12s
  changeset-check: 5s
  workflow syntax: 6s
  repo checks: 19s
  typecheck: 50s
  package tests: 1m
  package build: 31s
  app build: 57s
```

## Final Verdict

For the current required PR CI surface, sharding is faster in wall-clock feedback time.

```text
Current required CI: 3m
Sharded slowest shard: 1m
```

The tradeoff is that sharding uses more runner concurrency and repeats checkout/setup/install across jobs. That is acceptable if the goal is shorter PR feedback time.

## Merge Readiness

The workflow names were cleaned up before merge:

```text
CI Sharded / changed-scope
CI Sharded / changeset-check
CI Sharded / workflow syntax
CI Sharded / validate / repo checks
CI Sharded / validate / typecheck
CI Sharded / validate / package tests
CI Sharded / validate / package build
CI Sharded / validate / app build
```

If this becomes the default CI path, replace the current serial reusable CI job instead of running both workflows permanently.

If `app build` becomes slow again, split app-specific work further, for example:

```text
playground build
storybook react build
storybook vue build
```
