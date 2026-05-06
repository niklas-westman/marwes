# Docker CI Image Pipeline Findings

## Context

This branch tests a dependency-aware Docker CI pipeline for Marwes.

The first implementation builds a commit-specific CI image that contains:

- the current source code
- the pnpm workspace metadata
- `node_modules` materialized from `pnpm-lock.yaml`

The image is pushed to GitHub Container Registry and later CI validation runs inside that image.

## What Worked

- A Docker image can be built locally from `Dockerfile.ci`.
- The image can run package validation without running `pnpm install` during the verify step.
- The GitHub PR workflow can:
  - detect dependency-related inputs
  - run dependency review and `pnpm audit`
  - build and push a commit-specific image to GHCR
  - run verification commands inside that image
- The clean PR now only changes the Docker CI files.

## Important Correction

The root `prepare` script runs Lefthook:

```bash
lefthook install
```

That does not fit a Docker image build where `.git` is intentionally excluded from the build context.

The CI image therefore installs dependencies with:

```bash
pnpm install --offline --frozen-lockfile --ignore-scripts
```

This keeps dependency installation deterministic while avoiding local Git hook installation inside the image.

## Performance Result

The Docker path was slower than the existing normal CI path for this repo.

Observed shape:

```text
Normal CI:
  checkout
  setup pnpm/node
  restore pnpm cache
  pnpm install
  run checks

Docker CI:
  build image
  install dependencies inside image
  push image to GHCR
  pull image in verify job
  run checks inside container
```

The Docker verify job skipped `pnpm install`, but the full Docker workflow added image build, push, and pull overhead.

## Why This Happened

The current Docker image is a full commit-specific image:

```text
image = source code + node_modules
```

That makes validation reproducible for the exact commit, but it means each PR commit needs a new image because the source code is part of the image.

GHCR helps share the image between jobs, but it does not remove the first build when the image includes current source code.

## Current Value

This setup is useful for learning and reproducibility.

It proves that PR validation can run from an image where dependencies are already installed.

It does not yet prove that this approach is faster than the existing CI for Marwes.

## Better Next Experiment

The next optimization should test a dependency image instead of a full commit image.

Target shape:

```text
dependency image = node + pnpm + fetched pnpm store

PR job:
  pull dependency image
  checkout current source code
  run fast offline install/link step
  run checks
```

That image only needs to rebuild when dependency inputs change:

- `package.json`
- workspace package manifests
- `pnpm-lock.yaml`
- `pnpm-workspace.yaml`
- `.npmrc`
- `Dockerfile.ci`

This should avoid rebuilding a Docker image for source-only PRs.

## Parallelization Option

If we keep the full commit-specific image approach, the main optimization is to split verification into parallel jobs:

```text
build image once
  -> repo checks
  -> typecheck
  -> tests
  -> build
```

That may improve wall-clock time if the image build cost is outweighed by parallel verification.

## Bun Consideration

Bun may speed up dependency installation, but it is a separate experiment.

It is not a transparent drop-in for the current pnpm workflow because Bun can migrate `pnpm-lock.yaml` into `bun.lock` and can migrate workspace settings when `pnpm-workspace.yaml` is present.

Before using Bun in CI, we should benchmark it in a separate branch and verify:

- lockfile behavior
- workspace dependency behavior
- Storybook builds
- Vitest browser tests
- package builds
- GitHub dependency review behavior

## Current Recommendation

Keep the Docker workflow experimental for now.

Do not replace the existing required CI path until one of these is true:

- the full-image workflow is parallelized and beats normal CI wall-clock time
- a dependency-image workflow avoids image rebuilds for source-only PRs
- reproducibility is more important than CI speed for a particular branch or release path
