# Marwes 1.0.0 Release Hardening Plan

## Objective

Prepare `@marwes-ui/core`, `@marwes-ui/presets`, `@marwes-ui/react`, and `@marwes-ui/vue` for a safer 1.0.0 release by closing the release blockers found in the read-only review.

## Acceptance Criteria

- Preset CSS quickstart import works from a packed npm tarball.
- React and Vue top-level exports are intentionally aligned.
- RichText has explicit security regression coverage for unsafe HTML payloads.
- Package test, build, artifact, typecheck, and audit gates are either passing or have a documented release decision.
- Public docs keep the theme object install path simple and accurate for AI and human consumers.

## Work Items

- [x] Fix `@marwes-ui/presets` CSS publish shape.
- [x] Add package/export tests that would catch missing preset CSS imports.
- [x] Fix React `test:typecheck` failures under `exactOptionalPropertyTypes`.
- [x] Align React/Vue public export surface or document intentional differences.
- [x] Refresh React README public API section.
- [x] Add RichText security regression tests for stripped unsafe markup.
- [x] Address dependency audit findings.
- [x] Run release gates and record results.
- [x] Remove Allure reporting stack from package tests, CI, docs, and lockfile.
- [x] Pin all root/app/package `dependencies` and `devDependencies` to exact audited versions.
- [x] Reduce dependency overrides to the minimal audit-required set.
- [x] Harden package metadata for CSS side effects and adapter runtime dependencies.
- [x] Add master validation scripts and a focused per-family validation workflow.
- [x] Harden graphical theme propagation across React, Vue, preset CSS, docs, and token coverage tests.

## Validation Log

- `pnpm test:typecheck:react` passed after React harness fixes.
- `pnpm test:core -- --run test/recipes/rich-text-html.test.ts` passed.
- `pnpm --filter @marwes-ui/react test -- src/components/input/__tests__/rich-text.test.tsx` passed.
- `pnpm --filter @marwes-ui/vue test -- src/components/input/__tests__/rich-text.test.ts` passed.
- `pnpm audit` passed after dependency overrides.
- `pnpm audit --prod` passed after dependency overrides.
- `pnpm build:packages` passed.
- `pnpm test:packages` passed.
- `pnpm test:typecheck:packages` passed.
- `pnpm artifacts:check` passed.
- `pnpm check:compass` passed.
- `pnpm check:compass` passed after replacing stale `AXE_ROADMAP.md` markdown links with existing accessibility/registry docs.
- `pnpm semantics:check` passed.
- `pnpm exec biome check .` passed after formatting touched React contract harness files.
- `pnpm storybook:consistency` passed.
- `pnpm test:storybook:a11y` passed when rerun with local port permissions; the sandboxed first run failed with `listen EPERM` before tests executed.
- `pnpm pack --pack-destination /tmp` in `packages/presets` produced `/tmp/marwes-ui-presets-0.0.4.tgz`; `tar -tf` confirmed `package/src/firstEdition/styles.css` and imported sibling CSS files are included.
- Removed Allure scripts/dependencies, package Vitest reporter branches, CI report artifact steps, docs page, and `.allure/` ignore entry.
- `rg -n "allure|Allure|MARWES_ALLURE|\\.allure"` over package/docs/CI/source files returned no matches outside this plan note.
- Removed the local generated `.allure/` directory.
- `pnpm audit` passed after Allure removal.
- `pnpm audit --prod` passed after Allure removal.
- `pnpm test:packages` passed after Allure removal.
- `pnpm test:typecheck:packages` passed after Allure removal.
- `pnpm build:packages` passed after Allure removal.
- `pnpm exec biome check .` passed after Allure removal.
- Pinned all non-workspace `dependencies` and `devDependencies` to exact installed versions from `pnpm -r list --depth 0 --json`; left `peerDependencies` and `engines.node` as compatibility ranges.
- `rg -n '"[^\"]+": "[~^]' package.json apps packages -g 'package.json'` returned no matches after pinning.
- `CI=true pnpm install --lockfile-only` passed after pinning and updated `pnpm-lock.yaml` specifiers.
- `CI=true pnpm install` passed after pinning.
- `pnpm audit` passed after pinning.
- `pnpm audit --prod` passed after pinning.
- `pnpm exec biome check .` passed after pinning.
- `pnpm test:typecheck:packages` passed after pinning.
- `pnpm build:packages` passed after pinning.
- `pnpm test:packages` passed after pinning.
- `pnpm check:compass` passed after pinning.
- `pnpm storybook:consistency` passed after pinning.
- Removed all dependency overrides temporarily to test whether exact package pins made them unnecessary; `pnpm audit` still reported vulnerable `minimatch@9.0.1`, and `pnpm audit --prod` still reported vulnerable `postcss@8.4.49`.
- Reduced root `pnpm.overrides` from the broad security sweep to only `minimatch@>=9.0.0 <9.0.7` and `postcss@<8.5.10`.
- `CI=true pnpm install --lockfile-only` passed after minimal override restoration and updated `pnpm-lock.yaml`.
- `CI=true pnpm install` passed after restoring workspace dependencies.
- `pnpm audit` passed after reducing overrides.
- `pnpm audit --prod` passed after reducing overrides.
- `rg -n 'postcss@8\\.4\\.49|minimatch@9\\.0\\.1|postcss: 8\\.4\\.49|minimatch: 9\\.0\\.1' pnpm-lock.yaml` returned no matches after minimal overrides.
- Changed `@marwes-ui/presets` `sideEffects` from `false` to CSS-aware `["*.css", "**/*.css"]` so bundlers do not treat shipped preset CSS as droppable.
- Added a presets package export regression asserting CSS side effects stay declared.
- Kept `@marwes-ui/presets` as the React/Vue adapter styling dependency and load first edition CSS from the adapter entry, so app code does not need a manual preset CSS import for the default setup.
- `pnpm --filter @marwes-ui/presets test -- test/exports.test.ts` passed after package metadata hardening.
- `pnpm exec biome check package.json packages/react/package.json packages/vue/package.json packages/presets/package.json packages/presets/test/exports.test.ts` passed.
- `pnpm test:typecheck:packages` passed after adapter dependency cleanup.
- `pnpm build:packages` passed after adapter dependency cleanup.
- `pnpm test:packages` passed after adapter dependency cleanup.
- `pnpm pack --pack-destination /tmp` passed for `packages/core`, `packages/presets`, `packages/react`, and `packages/vue`.
- Packed React/Vue package manifests now contain only `@marwes-ui/core` as runtime dependency, plus framework peers.
- Packed presets tarball still includes `package/src/firstEdition/styles.css` and all imported sibling CSS files.
- Added `validate:security`, `validate:packages`, `check:repo-map`, `validate:family`, and `validate:release` root scripts.
- Added `scripts/validate-family.mjs` for focused family validation across core, presets, React, Vue, Storybook docs, Storybook consistency, registry, and docs links.
- Added `--family` support to `scripts/storybook-consistency.mjs`.
- Added `docs/reference/family-validation.md` and linked it from testing, governance, docs index, and registry docs.
- `pnpm validate:family button` passed end-to-end when rerun with local `tsx` IPC permissions; the sandboxed first run failed only at `registry:check` with `listen EPERM`.
- `pnpm check:repo-map` passed with local `tsx` IPC permissions.
- `pnpm validate:packages` passed.
- `pnpm validate:security` passed with npm registry network access; the sandboxed first run failed with `ENOTFOUND registry.npmjs.org`.
- `pnpm exec biome check package.json scripts/validate-family.mjs scripts/storybook-consistency.mjs docs/README.md docs/reference/family-validation.md docs/reference/testing.md docs/reference/governance.md docs/registry/README.md docs/registry/family-rollout-checklist.md` passed.
- Added `mode` to `ResolvedTheme`, applied provider root theme styles on first render in React and Vue, and switched provider classes to use resolved mode.
- Converted firstEdition component-scoped base color variables to semantic theme variables across switch, accordion, tab, radio, avatar, slider, badge, toast, button, checkbox, and tooltip.
- Replaced adapter-local spinner loading colors with `currentColor` so button loading visuals inherit the themed button text color.
- Added preset theme-token coverage plus React/Vue adapter source integrity tests to prevent fixed design colors from leaking back into runtime adapter source or component-scoped preset variables.
- `pnpm validate:packages` passed after graphical theme hardening.
- `pnpm check:repo-map` passed after rerun with local `tsx` IPC permissions; the sandboxed first run failed only at `artifacts:check` with `listen EPERM`.
- `pnpm validate:family button` passed after rerun with local `tsx` IPC permissions; the sandboxed first run failed only at `registry:check` with `listen EPERM`.
- `pnpm validate:security` passed with npm registry network access; the sandboxed first run failed with `ENOTFOUND registry.npmjs.org`.
- `pnpm exec biome check .` passed after graphical theme hardening.
- `pnpm test:storybook:a11y` passed after rerun with local server permissions; the sandboxed first run failed before tests executed with `listen EPERM`.
