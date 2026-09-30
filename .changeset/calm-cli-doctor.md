---
"@marwes-ui/cli": minor
"create-marwes": minor
---

Make setup outcomes explicit, run static `doctor` checks after init, and recognize imported and rendered providers across framework aliases, Vue template/render-function forms, React namespace/render-function forms, and Svelte layouts. Report manual provider wiring with exit code 2 while preserving underlying installation and verification failure codes.

Require an app build script for `doctor --run-build`, run an optional typecheck before the production build, and stop on the first failed script while preserving its exit code. Normal init remains a static setup check rather than build verification.

Print theme setup guidance after successful init, complete typed framework provider examples for agentic and manual setup, and adapter-only import, automatic CSS, provider-scoped variable, and resolved-theme guidance. Add complete subcommand help and framework setup links.
