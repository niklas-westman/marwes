# create-marwes

## 0.2.0

### Minor Changes

- [#44](https://github.com/niklas-westman/marwes/pull/44) [`6dbb453`](https://github.com/niklas-westman/marwes/commit/6dbb45356374cc50cb40204fd1dac5effc243b53) Thanks [@niklas-westman](https://github.com/niklas-westman)! - Make setup outcomes explicit, run static `doctor` checks after init, and recognize imported and rendered providers across framework aliases, Vue template/render-function forms, React namespace/render-function forms, and Svelte layouts. Report manual provider wiring with exit code 2 while preserving underlying installation and verification failure codes.

  Require an app build script for `doctor --run-build`, run an optional typecheck before the production build, and stop on the first failed script while preserving its exit code. Normal init remains a static setup check rather than build verification.

  Print theme setup guidance after successful init, complete typed framework provider examples for agentic and manual setup, and adapter-only import, automatic CSS, provider-scoped variable, and resolved-theme guidance. Add complete subcommand help and framework setup links.

### Patch Changes

- Updated dependencies [[`6dbb453`](https://github.com/niklas-westman/marwes/commit/6dbb45356374cc50cb40204fd1dac5effc243b53)]:
  - @marwes-ui/cli@0.2.0

## 0.1.0

### Minor Changes

- [#39](https://github.com/niklas-westman/marwes/pull/39) [`965a3af`](https://github.com/niklas-westman/marwes/commit/965a3af4fd05bf5342a687c55d52188c7c22ae62) Thanks [@niklas-westman](https://github.com/niklas-westman)! - Add public Marwes installation tooling for existing apps and Vite-style starter creation.

  Adds an agentic install mode that runs the normal init flow, follows with `doctor`,
  and prints AI-oriented setup boundaries for framework adapter usage.

### Patch Changes

- Updated dependencies [[`965a3af`](https://github.com/niklas-westman/marwes/commit/965a3af4fd05bf5342a687c55d52188c7c22ae62)]:
  - @marwes-ui/cli@0.1.0

## 0.0.0

Initial unpublished workspace version.
