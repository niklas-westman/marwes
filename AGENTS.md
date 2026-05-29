# Codex Global Routing

Purpose: keep the always-loaded instructions small. Read linked files only when
the current task matches.

## Initialization Required

Before doing any task in a new session, read `~/.codex/USER.md` and
`~/.codex/SOUL.md`. Treat them as persistent user/context identity files, not
optional references. These files live in the Codex root, not in this repository.

## Always On

- Be concise, direct, and value-first.
- Discover the smallest relevant context before editing.
- Prefer safe, incremental changes and existing project patterns.
- Ask before risky, destructive, broad, or unclear changes.
- Verify changed behavior before claiming done; say when full checks were not run.
- Use fast search (`rg`, `rg --files`) and repo scripts. Prefer `pnpm`.

## Design Governance

Figma is the source of truth for Marwes design decisions.

For Figma, registry, theme-token, preset-CSS, or component-family parity work,
use the private workspace package:

```bash
pnpm --filter @marwes-ui/design-governance validate -- --family <family>
pnpm --filter @marwes-ui/design-governance validate-runtime -- --family <family>
```

The design-governance loop is:

```text
Figma truth -> registry contract -> runtime result
```

Do not silence design-governance failures by weakening checks. Decide whether
Figma, registry metadata, or runtime implementation is wrong, then fix that
layer. Before finishing design-token or component-family work, run the focused
family validation. Before pushing, `pnpm design:check` is the required gate.

## Conditional Instruction Files

- Planning, research, implementation phases, or Pi-style personas: read `instructions/workflow-routing.md` when present.
- Permission boundaries and dirty repo behavior: read `instructions/ask-and-safety.md` when present.
- Skill routing and Pi-to-Codex skill mapping: read `instructions/skills-routing.md` when present.
- Code style and maintainability preferences: read `instructions/code-style.md` when present.
- Handoff blocks and utility commands: read `instructions/handoff-and-utilities.md` when present.
