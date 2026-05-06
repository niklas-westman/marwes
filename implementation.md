# Dependency Image CI Implementation Plan

## Goal

Build a CI pipeline that scales better for large pnpm workspaces, many pull requests, and merge queue validation.

The target design is:

```text
dependency inputs change
  -> build/reuse dependency image keyed by lockfile hash

source changes
  -> reuse existing dependency image
  -> checkout current source
  -> run fast offline pnpm install/link
  -> run checks in parallel
```

This avoids rebuilding a full source image for every PR commit while still removing network dependency installation from the critical validation path.

## Phase 1: Baseline And Current Measurement

- [ ] Record current normal CI timings.

  Why: We need a baseline before optimizing. Capture total workflow time and the timing of install, typecheck, tests, and build.

- [ ] Record current full-image Docker CI timings.

  Why: The current Docker experiment proves reproducibility, but it also shows image build/push/pull overhead. We need this as the comparison point.

- [ ] Identify the slowest checks in the existing pipeline.

  Why: Parallelizing or caching the wrong work will not help. The bottleneck should decide the job split.

## Phase 2: Define Dependency Inputs

- [ ] List every file that should invalidate the dependency image.

  Suggested inputs:

  ```text
  package.json
  pnpm-lock.yaml
  pnpm-workspace.yaml
  packages/*/package.json
  apps/*/package.json
  .npmrc
  Dockerfile.ci-deps
  ```

  Why: The dependency image should rebuild only when files that can change installed dependencies or package-manager behavior change.

- [ ] Create a deterministic dependency key from those files.

  Suggested key:

  ```text
  deps-<hash>
  ```

  Why: A stable key lets many source-only PRs reuse the same dependency image.

- [ ] Decide whether the dependency key should include OS/Node/pnpm versions.

  Recommended:

  ```text
  deps-node20-pnpm9-<hash>
  ```

  Why: Dependency installs can differ across Node, pnpm, and base image versions. The key should change when those foundations change.

## Phase 3: Build The Dependency Image

- [ ] Add `Dockerfile.ci-deps`.

  It should include:

  ```text
  node
  pnpm
  pnpm store populated from pnpm-lock.yaml
  workspace manifests needed for pnpm fetch
  no source code
  ```

  Why: This image should represent dependency state, not source state. Source should be checked out fresh in each validation job.

- [ ] Use `pnpm fetch --frozen-lockfile` in the dependency image.

  Why: `pnpm fetch` populates the pnpm store from the lockfile without needing the full source tree.

- [ ] Avoid running project lifecycle scripts in the dependency image.

  Suggested install/fetch behavior:

  ```bash
  pnpm fetch --frozen-lockfile
  ```

  Why: CI dependency images should not install local Git hooks or run project prepare scripts.

- [ ] Keep `.git`, local env files, and local build outputs out of the Docker context.

  Why: The image must not contain local secrets or machine-specific state.

## Phase 4: Ensure-Or-Build Workflow Job

- [ ] Add an `ensure_deps_image` job.

  It should:

  ```text
  compute dependency key
  check if ghcr.io/.../marwes-ci-deps:<key> exists
  build and push it only when missing
  expose image ref as a job output
  ```

  Why: This is the core optimization. Source-only PRs should pull an existing dependency image instead of building one.

- [ ] Use GHCR as the shared image store.

  Why: Later jobs and later workflow runs need a shared place to find the dependency image.

- [ ] Make the job safe for fork PRs.

  Why: Fork PRs should not get write access to GHCR using repository credentials. For forks, either build locally without pushing or fall back to normal pnpm cache.

- [ ] Add `merge_group` to workflow triggers.

  ```yaml
  on:
    pull_request:
    merge_group:
  ```

  Why: Merge queue creates synthetic merge commits. Required checks must validate that exact merged result.

## Phase 5: Validation Jobs Using The Dependency Image

- [ ] Split validation into parallel jobs.

  Suggested jobs:

  ```text
  repo checks
  typecheck
  tests
  build
  ```

  Why: Large CI pipelines scale by reducing wall-clock time, not only by reducing total work.

- [ ] In each validation job, checkout current source.

  Why: The dependency image does not contain source code. Each job must validate the exact PR or merge queue checkout.

- [ ] Run offline pnpm install/link in each validation job.

  Suggested command:

  ```bash
  pnpm install --offline --frozen-lockfile --ignore-scripts
  ```

  Why: The dependency image provides the package store. The install step should only materialize workspace links and `node_modules` structure for the current checkout.

- [ ] Run each check inside the dependency image.

  Example shape:

  ```bash
  docker run --rm \
    -v "$PWD:/workspace" \
    -w /workspace \
    ghcr.io/.../marwes-ci-deps:<key> \
    sh -lc "pnpm install --offline --frozen-lockfile --ignore-scripts && pnpm test:packages"
  ```

  Why: This validates current source while reusing the dependency environment from the image.

- [ ] Keep lifecycle scripts disabled unless a check explicitly requires them.

  Why: The repo has a `prepare` script for Lefthook. CI validation should not need to install local Git hooks.

## Phase 6: Branch Protection And Merge Queue

- [ ] Keep existing normal CI required while the dependency-image workflow is experimental.

  Why: The current CI is already trusted and fast. The new workflow should prove itself before replacing it.

- [ ] Add dependency-image checks as non-required initially.

  Why: This lets us observe real timings and failure modes without blocking work.

- [ ] After stable benchmarks, decide required checks.

  Options:

  ```text
  keep normal CI required
  require dependency-image parallel checks
  require both temporarily
  ```

  Why: Required checks should reflect reliability, speed, and confidence, not just architecture preference.

- [ ] Ensure required checks apply to merge queue.

  Why: Merge queue only protects main if the required checks run for `merge_group`.

## Phase 7: Cleanup And Retention

- [ ] Define GHCR retention rules for dependency images.

  Suggested retention:

  ```text
  keep images referenced by active lockfile hashes
  delete old dependency images after N days or N versions
  ```

  Why: Dependency images are reusable but should not accumulate forever.

- [ ] Keep commit-specific full CI images short-lived if that workflow remains.

  Why: Full source images are less reusable and can grow registry storage quickly.

- [ ] Document how to manually rebuild a dependency image.

  Why: A manual recovery path helps if a registry image is corrupted, deleted, or built with a bad base image.

## Phase 8: Benchmark And Decide

- [ ] Compare normal CI, full-image Docker CI, and dependency-image CI.

  Track:

  ```text
  total wall-clock time
  dependency setup time
  queue time
  image build time
  image pull time
  validation job time
  failure clarity
  ```

  Why: The best architecture is the one that improves the actual developer feedback loop.

- [ ] Test source-only PR behavior.

  Why: This should be the best case for dependency-image reuse.

- [ ] Test dependency-change PR behavior.

  Why: This should prove the rebuild path works and remains secure.

- [ ] Test merge queue behavior.

  Why: Large-scale team workflows depend on merge queue correctness.

- [ ] Decide whether to replace, supplement, or discard the Docker path.

  Why: The outcome should be based on measured CI performance and operational complexity.

## Bun Benchmark Track

- [ ] Create a separate branch for Bun benchmarking.

  Why: Bun changes package-manager behavior and should not be mixed with the Docker architecture experiment.

- [ ] Measure Bun install behavior with the current pnpm workspace.

  Why: Bun may migrate lockfile/workspace settings, which affects reproducibility and GitHub dependency review.

- [ ] Validate all current checks under Bun before considering adoption.

  Required checks:

  ```text
  biome
  check:repo-map
  typecheck
  test:typecheck:contracts
  test:packages
  build
  Storybook smoke tests
  ```

  Why: Speed is only useful if the toolchain remains correct.

- [ ] Compare Bun against pnpm dependency-image CI.

  Why: The architecture improvement may matter more than the package manager swap.

## Success Criteria

- [ ] Source-only PRs do not rebuild dependency images.
- [ ] Dependency-change PRs rebuild or create the correct dependency image.
- [ ] Validation jobs run without network dependency downloads.
- [ ] Merge queue runs the same required checks.
- [ ] Wall-clock time is equal to or faster than normal CI at realistic repo scale.
- [ ] The workflow remains understandable and debuggable.
