# Allure Test Reporting

This repo uses **Allure Report 3** as an optional reporting layer for the Vitest-based package tests.

It does **not** change how tests are written or where they live.

- React/Vue tests stay colocated in `__tests__`
- Shared contracts stay in `tests/contracts`
- Vitest remains the test runner

## What Allure Covers

Allure currently reports the package runtime test suite:

- `@marwes-ui/core`
- `@marwes-ui/presets`
- `@marwes-ui/react`
- `@marwes-ui/vue`

It does **not** report:

- `pnpm typecheck`
- `pnpm test:typecheck:*`
- builds (`pnpm build`, Storybook builds)

## Daily Workflow (Recommended)

Use normal test commands for day-to-day development:

- `pnpm test:react`
- `pnpm test:vue`
- `pnpm test:core`
- `pnpm test:presets`
- `pnpm test:packages`

Use Allure only when you want a richer HTML report (debugging, review, CI investigation).

## Allure Commands

### Full package suite with Allure

1. `pnpm allure:clean`
2. `pnpm test:packages:allure`
3. `pnpm allure:generate`
4. `pnpm allure:open`

Shortcut:

- `pnpm test:report`

### What these do

- `pnpm test:packages:allure`
  - Runs the package test suite with `MARWES_ALLURE=1`
  - This enables the Allure Vitest reporter in package Vitest configs
- `pnpm allure:generate`
  - Generates HTML report from `.allure/results` into `.allure/report`
- `pnpm allure:open`
  - Opens the generated local report
- `pnpm allure:clean`
  - Removes `.allure/` so old results do not mix with new runs

## Important Rule: Clean First

Always run `pnpm allure:clean` before a new Allure report run.

Allure reads from `.allure/results`; if old files are left behind, reports can contain stale test results.

## CI / PR Workflow

GitHub Actions already runs package tests with Allure and uploads artifacts:

- `allure-report` (generated HTML report)
- `allure-results` (raw results)

### When to use CI Allure artifacts

Use the CI report when:

- a PR test fails and terminal logs are noisy
- you want to inspect failures in a friendlier UI
- you want to share a report with someone reviewing the PR

In most cases, you do **not** need to run Allure locally unless you are actively debugging.

## Where Allure Output Lives Locally

Generated files are stored under:

- `.allure/results`
- `.allure/report`

The `.allure/` directory is ignored by git.

## Writing Tests (No Changes Needed)

Keep writing tests as usual:

- user-facing assertions (`getByRole`, `userEvent`)
- colocated adapter tests in `__tests__`
- shared behavior contracts in `tests/contracts`

Allure is configured at the Vitest config level and should not require test-specific imports.

## Troubleshooting

### Report looks wrong / old tests still appear

- Run `pnpm allure:clean`
- Re-run `pnpm test:packages:allure`
- Re-run `pnpm allure:generate`

### `allure` command fails after pulling changes

Run:

- `pnpm install`

The repo depends on `allure` and `allure-vitest` from root devDependencies.

### Normal tests fail with `expect is not defined`

Check package Vitest setup files and ensure they only use:

- `@testing-library/jest-dom/vitest`

Do **not** add plain `@testing-library/jest-dom` in `vitest.setup.ts`.

