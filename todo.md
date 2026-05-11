# Todo: React Native POC Branch Matrix

## Tickets

### [ ] 1. Create Baseline Branch And Worktree Layout

**Test first**
- `git status --short` is reviewed before branching.
- Existing uncommitted work is preserved and not reverted.
- Baseline branch starts from the intended current RN POC state.

**Implementation**
- Create `rn-poc/baseline`.
- Optionally create a sibling worktree for the baseline:
  - `../marwes-rn-baseline`
- Record the baseline commit SHA in `RN_POC_BASELINE.md`.
- Document which uncommitted files were included or intentionally left out.

**Done when**
- [ ] `rn-poc/baseline` exists.
- [ ] Baseline worktree exists or the reason for not using worktrees is documented.
- [ ] `RN_POC_BASELINE.md` exists with branch, commit, current POC scope, and known issues.
- [ ] No unrelated user changes were reverted.

### [ ] 2. Fix RN Baseline Typecheck Boundary

**Test first**
- Run `pnpm --filter @marwes-ui/react-native typecheck` and capture current failure summary.
- Confirm failures are baseline/package-boundary issues, not implementation-path-specific issues.

**Implementation**
- Fix the RN package TypeScript boundary so `@marwes-ui/core` imports do not break `rootDir`.
- Fix generated resolver typing if it still fails on optional rule fields.
- Keep the fix path-neutral so all POC branches inherit it.
- Avoid solving unrelated RN architecture questions in this ticket.

**Done when**
- [ ] `pnpm --filter @marwes-ui/react-native typecheck` passes.
- [ ] Any remaining typecheck failure is documented as a blocker in `RN_POC_BASELINE.md`.
- [ ] The fix can be reused by all POC branches without favoring one path.

### [ ] 3. Add Shared Evidence Template

**Test first**
- Review `spec.md` complexity matrix and ensure every required metric has a slot.

**Implementation**
- Add `RN_POC_EVIDENCE.template.md` at repo root.
- Include sections for:
  - branch identity
  - implementation summary
  - component scope
  - changed files
  - authored lines
  - generated lines
  - manifests/config/schema count
  - new abstractions
  - dependencies
  - validation commands and results
  - visual parity notes
  - native UX notes
  - accessibility notes
  - next component cost
  - recommendation

**Done when**
- [ ] Template covers every metric from `spec.md`.
- [ ] Template can be copied unchanged into each POC branch as `RN_POC_EVIDENCE.md`.

### [ ] 4. Add Baseline Measurement Script Or Checklist

**Test first**
- Manually identify which counts can be automated safely with shell commands.
- Decide whether a script is worth it or a documented checklist is enough for the first pass.

**Implementation**
- Add either:
  - `scripts/measure-rn-poc.mjs`, or
  - a command checklist inside `RN_POC_EVIDENCE.template.md`.
- Measurements should cover source lines, generated lines, changed file counts, manifest/config/schema
  counts, and dependency deltas.
- Keep visual and native UX notes manual.

**Done when**
- [ ] A maintainer can fill the evidence template consistently across branches.
- [ ] The measurement method does not depend on one implementation path.

### [ ] 5. Validate Current Baseline POC

**Test first**
- Run current validation commands and record failures before changes:
  - `pnpm native-styles:check`
  - `pnpm --filter @marwes-ui/react-native typecheck`
  - Expo playground command if practical.

**Implementation**
- Update `RN_POC_BASELINE.md` with current supported families:
  - Button
  - Badge
  - Divider
- Record known compiler limitations and known Metro/Expo constraints.
- If a visual parity harness is cheap, add only the minimal version needed for current Button, Badge,
  Divider; otherwise document it as deferred.

**Done when**
- [ ] Baseline validation status is recorded.
- [ ] Current POC state is reproducible or blockers are documented.
- [ ] Baseline does not make an architecture recommendation.

### [ ] 6. Create POC Branches Or Worktrees From Baseline

**Test first**
- Verify `rn-poc/baseline` has the final baseline commit.

**Implementation**
- Create branches from the same baseline commit:
  - `rn-poc/a-hybrid-compiler`
  - `rn-poc/c-handwritten-native`
  - `rn-poc/d-token-compiler`
  - `rn-poc/e-recipe-dsl`
  - `rn-poc/f-external-runtime`
  - `rn-poc/g-native-first`
- Prefer sibling worktrees for side-by-side comparison.
- Copy `RN_POC_EVIDENCE.template.md` to `RN_POC_EVIDENCE.md` in each branch.

**Done when**
- [ ] Every POC branch exists and points at the same baseline commit initially.
- [ ] Every branch has an evidence file.
- [ ] Worktree paths are documented in `RN_POC_BASELINE.md`.

### [ ] 7. POC A: Hybrid Compiler

**Test first**
- Run baseline validation in the A branch.
- Define expected output for one clean compiled family and one native-authored hard family.

**Implementation**
- Keep current compiled Button, Badge, Divider.
- Add one clean compiled family: choose `Card` unless `Input` is clearly cheaper.
- Add `Checkbox` as native-authored RN component using `ResolvedTheme`.
- Add support matrix notes showing compiled vs native-authored families.
- Fill `RN_POC_EVIDENCE.md`.

**Done when**
- [ ] `pnpm native-styles:check` passes or failures are explained.
- [ ] `pnpm --filter @marwes-ui/react-native typecheck` passes or branch is marked blocked.
- [ ] Expo playground can inspect Badge plus Checkbox in light and dark mode, or blocker is recorded.
- [ ] Evidence file includes next-component cost and recommendation.

### [ ] 8. POC C: Handwritten Native

**Test first**
- Run baseline validation in the C branch.
- Capture current compiled Badge visual/behavior assumptions before replacing the style path.

**Implementation**
- Implement Badge with hand-written `themeToBadgeStyles()` or equivalent.
- Implement Checkbox with hand-written native styles using `ResolvedTheme`.
- Avoid adding compiler features for new work.
- Keep provider and core recipe usage.
- Fill `RN_POC_EVIDENCE.md`.

**Done when**
- [ ] RN package typecheck passes or blocker is recorded.
- [ ] Badge and Checkbox are inspectable in Expo playground or blocker is recorded.
- [ ] Evidence compares simplicity against visual drift risk.
- [ ] Evidence includes next-component cost and recommendation.

### [ ] 9. POC D: Token Compiler

**Test first**
- Define the semantic token shape before generating or authoring output.
- Confirm which values are required by Badge, Checkbox, and Spinner or Skeleton.

**Implementation**
- Add experimental native design token output for Badge, Checkbox, and Spinner or Skeleton.
- Components own layout and behavior.
- Generated/authored token layer only provides semantic values.
- Avoid generating final RN style objects in this branch.
- Fill `RN_POC_EVIDENCE.md`.

**Done when**
- [ ] Token schema is documented in the evidence file.
- [ ] At least Badge and one hard component consume the token layer.
- [ ] Typecheck status is recorded.
- [ ] Evidence compares compiler complexity against Path A and drift risk against Path C.

### [ ] 10. POC E: Recipe DSL

**Test first**
- Write expected current Badge outputs:
  - web CSS surface
  - RN style/token output
  - variants and slots

**Implementation**
- Author a single experimental typed `Badge` style recipe source.
- Generate or materialize web CSS from that source.
- Generate or materialize RN resolver/token output from that source.
- Compare generated web CSS against current `packages/presets/src/firstEdition/badge.css`.
- Fill `RN_POC_EVIDENCE.md`.

**Done when**
- [ ] One source can produce useful web and RN output for Badge.
- [ ] Differences from current Badge CSS are listed.
- [ ] Migration cost is estimated.
- [ ] Evidence says whether the DSL feels like a Marwes-owned source of truth or too much private
  language.

### [ ] 11. POC F: External Runtime

**Test first**
- Choose one candidate runtime before implementation.
- Record expected install/config changes.

**Implementation**
- Spike NativeWind or Unistyles first unless there is a concrete reason to choose another runtime.
- Implement Badge, Checkbox, and Spinner or Skeleton in isolation.
- Keep runtime usage contained to this branch.
- Record dependency, Metro/Babel, theme, and variant friction.
- Fill `RN_POC_EVIDENCE.md`.

**Done when**
- [ ] Expo monorepo setup works or failure is documented.
- [ ] Runtime dependency/config delta is clear.
- [ ] Evidence states whether the dependency reduces enough Marwes-owned complexity to be worth it.

### [ ] 12. POC G: Native-First Product Kit

**Test first**
- Choose one hard component: `Select`, `Dialog`, or `Spinner`.
- Write behavior and accessibility expectations before styling.

**Implementation**
- Build the component as a native-first RN product component.
- Use Marwes tokens and core intent where practical.
- Do not force web DOM structure or CSS parity.
- Validate mobile-native interaction quality.
- Fill `RN_POC_EVIDENCE.md`.

**Done when**
- [ ] Component behavior is inspectable in Expo playground or blocker is recorded.
- [ ] Evidence explains API similarity/difference versus web Marwes.
- [ ] Evidence judges native UX before pixel parity.

### [ ] 13. Compare Branches

**Test first**
- Verify every selected branch has `RN_POC_EVIDENCE.md`.
- Verify missing branches are explicitly marked skipped, not silently omitted.

**Implementation**
- Create `RN_POC_COMPARISON.md`.
- Include a table for all selected branches:
  - path
  - component scope
  - authored lines
  - generated lines
  - abstractions
  - dependencies
  - typecheck/build status
  - visual/native UX notes
  - next-component cost
  - recommendation
- Separate final recommendation from reusable ideas.

**Done when**
- [ ] `RN_POC_COMPARISON.md` recommends one primary path.
- [ ] It names one fallback path.
- [ ] It lists ideas worth stealing from losing branches.
- [ ] It documents blocked or skipped POCs honestly.

### [ ] 14. Decision Review

**Test first**
- Read `research.md`, `spec.md`, `todo.md`, all evidence files, and comparison doc.
- Confirm the recommendation follows from evidence rather than preference.

**Implementation**
- Update `new-implementation-rn.md` or create a dedicated decision record with the final chosen path.
- Record:
  - chosen architecture
  - rejected paths
  - why they were rejected
  - next implementation phase
  - validation required before shipping

**Done when**
- [ ] Decision record exists.
- [ ] It links or references all evidence.
- [ ] It gives the next implementation phase clear scope.

---
Tickets ready. Confirm to switch to implementation mode.
