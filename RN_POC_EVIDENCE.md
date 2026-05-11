# RN POC Evidence: [Path Name]

## Branch Identity

- Branch:
- Baseline branch:
- Baseline commit:
- POC owner:
- Date:

## Implementation Summary

[Short summary of what this branch proves or disproves.]

## Component Scope

| Family | Status | Style source | Notes |
|---|---|---|---|
| Badge | Pending | Pending | |
| Checkbox | Pending | Pending | |
| Spinner/Skeleton | Pending | Pending | |

## Changed Files

| Area | Files | Notes |
|---|---|---|
| Components | | |
| Styles/tokens/compiler | | |
| Playground | | |
| Config/dependencies | | |
| Docs/evidence | | |

## Complexity Metrics

| Metric | Value | How measured |
|---|---:|---|
| Authored source lines | 0 | |
| Generated lines | 0 | |
| Manifest/config/schema files | 0 | |
| New abstractions | 0 | |
| Runtime dependencies added | 0 | |

## Measurement Checklist

Recommended commands/checks:

```sh
git diff --stat rn-poc/baseline...HEAD
git diff --numstat rn-poc/baseline...HEAD
git diff --name-only rn-poc/baseline...HEAD
```

Line-count guidance:

- Count authored source separately from generated output.
- Treat files under `src/styles/generated` as generated lines.
- Treat manifests, schema files, Metro/Babel config, and package metadata as config/schema files.
- Count each new reusable helper, compiler phase, runtime resolver, DSL primitive, or style factory as
  a new abstraction.
- Count only runtime dependencies for dependency metrics; list dev-only dependencies separately in
  notes.

## Validation

| Command | Status | Notes |
|---|---|---|
| `pnpm native-styles:check` | Not run | |
| `pnpm --filter @marwes-ui/react-native typecheck` | Not run | |
| Expo playground | Not run | |

## Visual Parity Notes

- Light mode:
- Dark mode:
- Custom theme:
- Known drift:

## Native UX Notes

- Interaction quality:
- Platform fit:
- Performance concerns:

## Accessibility Notes

- Roles/states:
- Labels/descriptions:
- Known gaps:

## Next Component Cost

[Estimate what it would take to add one more family with this architecture.]

## Risks

- 

## Recommendation

[Keep, reject, continue exploring, or steal specific ideas.]
