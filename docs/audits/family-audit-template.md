# `<family>` Accessibility Audit

## Goal
Describe what this family audit is supposed to prove or improve.

## Scope
List the subcomponents, variants, and compositions included in this family.

## Tree anchors

### Core
- `packages/core/src/components/atoms/<family>/`

### Presets
- `packages/presets/src/firstEdition/<family>.css`

### React
- `packages/react/src/components/<family>/`
- `apps/storybook-react/src/stories/<family>/`

### Vue
- `packages/vue/src/components/<family>/`
- `apps/storybook-vue/src/stories/<family>/`

### Contracts
- `tests/contracts/<family>.contract.ts`

## Step-by-step checklist

### 0. Spec and decisions
- [ ] confirm the relevant requirement in `docs/reference/spec.md`
- [ ] confirm any open decisions before editing behavior
- [ ] confirm whether public docs need updates
- [ ] confirm which status docs must be updated when the family pass is complete

### 1. Core
- [ ] review `*-types.ts`
- [ ] review `*-a11y.ts`
- [ ] review `*-recipe.ts`
- [ ] review helper files for hidden keyboard or naming logic

### 2. Preset CSS
- [ ] review focus-visible treatment
- [ ] review disabled state treatment
- [ ] review invalid state treatment if relevant
- [ ] review visual states against semantic states

### 3. React adapter
- [ ] verify native element choice
- [ ] verify ARIA emission from core render kit
- [ ] verify keyboard and event behavior
- [ ] verify no adapter-only a11y divergence from core

### 4. React stories and tests
- [ ] review story coverage for important states
- [ ] review tests for keyboard and name/description behavior
- [ ] review docs wording for accuracy

### 5. Vue adapter
- [ ] verify native element choice
- [ ] verify ARIA emission from core render kit
- [ ] verify keyboard and event behavior
- [ ] verify no adapter-only a11y divergence from core

### 6. Vue stories and tests
- [ ] review story coverage for important states
- [ ] review tests for keyboard and name/description behavior
- [ ] review docs wording for accuracy

### 7. Shared contracts
- [ ] add or update shared contract coverage
- [ ] ensure React and Vue both run it

### 8. Verification and doc completion
- [ ] update the family audit doc findings and completion notes
- [ ] update `docs/audits/README.md` if the family status changed
- [ ] update `AXE_ROADMAP.md` if roadmap checklist/status changed
- [ ] update Storybook/docs/spec text if shipped guidance changed
- [ ] `pnpm typecheck`
- [ ] `pnpm test:packages`
- [ ] `pnpm storybook:consistency`
- [ ] `pnpm check`

## Findings

### Good
- 

### Risks
- 

### Decisions needed
- 

## Expected outputs
- code and tests aligned with the intended family contract
- public docs updated to match the shipped behavior
- audit status docs updated so the next pass can resume without rediscovery
