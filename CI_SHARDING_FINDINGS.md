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

## Next Benchmark

Push a docs-only commit and compare the second PR run.

Why:

- GitHub/pnpm caches may be warmer.
- The workflow code is unchanged.
- The new run can show whether the first `app build` result was stable or an outlier.

If the second run still has `app build` slower than current CI, this experiment should not replace normal CI as-is.

The next optimization would be splitting app build further, for example:

```text
playground build
storybook react build
storybook vue build
```
