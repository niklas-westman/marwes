# CI Sharding Experiment Findings

## Goal

Test whether normal GitHub runner CI with pnpm cache and parallel validation jobs improves Marwes PR feedback time compared to the current serial CI job.

## First PR Run

Observed PR check times:

```text
Current CI:
  changed-scope: 16s
  changeset-check: 9s
  lint-typecheck-test-build: 3m

CI Sharded Experiment:
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

CI Sharded Experiment:
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

## Coverage Correction

The original sharded workflow did not include the Storybook a11y smoke check from the existing local/pre-push validation path.

Add `test:storybook:a11y` as its own shard before considering this workflow as a replacement candidate.

## Next Benchmark

Push a commit with the a11y shard included and compare the third PR run.

Why:

- The sharded workflow should cover the same practical validation surface.
- The extra a11y shard may become the new slowest shard.
- The workflow should still beat current CI after adding this coverage.

If the sharded workflow still completes around 1 minute after adding a11y smoke, it is a strong candidate to replace the serial reusable CI job.

If `app build` or `storybook a11y smoke` becomes slow again, split app-specific work further, for example:

```text
playground build
storybook react build
storybook vue build
storybook react a11y smoke
storybook vue a11y smoke
```
