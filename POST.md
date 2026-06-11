# Post-work: out-of-scope follow-ups

These were identified during the svelte adapter parity sweep but intentionally
left out of the parity-tooling fixes. They are real items worth handling, but
each is a different kind of change (product work or a separate asymmetry) and
should not be bundled with the validator/test-config alignment.

## 1. Backfill missing svelte components and stories

Some families may be missing svelte components or storybook stories entirely.
Aligning the parity tooling (Fixes 1–5) will surface these as new failures, but
adding the missing implementations is product/adapter work — not tooling work.

- Audit which families fail the now-symmetric `Framework surfaces` check after
  Fix 1 lands.
- Audit which families fail `buildCrossFrameworkExportWarnings` after Fix 2
  lands.
- For each gap, decide: implement the missing svelte surface, or mark the
  family `exportParityExempt` with a documented reason.

## 2. Add `radio` to react input-test config

`tests/vitest.storybook-input.config.ts` currently includes `radio` for vue but
not for react. This is the opposite-direction asymmetry from the svelte sweep
(react is the one missing here). Worth fixing for the same "all adapters use
the same method" principle, but in a separate change.

- Confirm whether `apps/storybook-react/src/stories/radio/__tests__/` exists.
- If yes, add `apps/storybook-react/src/stories/radio/__tests__/*.test.ts` to
  the config.
- If no, write the missing react radio storybook tests first.

## 3. `scripts/component-registry-sources.ts`

Not a follow-up — verified during the sweep that this script already treats
all three frameworks symmetrically. Noted here only so future audits don't
re-investigate it.
