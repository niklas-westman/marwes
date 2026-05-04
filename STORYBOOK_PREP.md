# Storybook Prep

Status from the May 3, 2026 sweep:

- React and Vue Storybook static builds complete successfully.
- Storybook consistency audit passes across 22 families.
- Docs-layout guard passes against 5 representative React docs entries and 5 representative Vue docs entries.
- React a11y smoke passes 34 browser tests.
- Vue a11y smoke passes 31 browser tests.
- Vue a11y smoke output no longer includes repeated `[@vue/compiler-core] decodeEntities option is passed but will be ignored in non-browser builds.` warnings.
- Sampled React and Vue autodocs pages no longer render each docs preview inside a viewport-height shell.
- React and Vue static Storybook builds complete without the previous Storybook runtime chunk-size warnings.

## Fixed In This Sweep

- Made the React and Vue global Marwes Storybook decorators docs-aware. Docs mode now keeps the provider shell at `min-height: auto` with no extra padding, while story/canvas mode keeps the full-height padded preview shell.
- Added missing `autodocs` tags to React Dialog stories so Dialog Atom, Molecule, ConfirmDialog, DestructiveDialog, and InfoDialog pages are generated in the production docs surface.
- Added missing `autodocs` tags to React and Vue Icon gallery stories.
- Added a shared browser docs-layout guard and wired it into React/Vue Storybook validation. It opens representative `--docs` iframe entries and fails if any inline docs wrapper regresses to `min-height: 100vh`.
- Added missing Vue Button purpose stories for UploadButton, DownloadButton, CopyButton, SearchButton, FilterButton, SortButton, and DropdownButton so the Vue docs surface now matches the documented Vue package exports.
- Suppressed the known Vue compiler-core `decodeEntities` warning in Vue Storybook Vitest setup so real a11y failures are easier to scan in CI.
- Raised the Storybook app Vite chunk warning limit to account for Storybook/docs/a11y runtime bundles without hiding package component output behind manual chunking.

## Remaining Prep Before Production Release

1. Run a final visual pass on the deployed static output.
   - The local static DOM check sampled representative docs pages only.
   - Before production release, open both deployed Storybooks and scan Introduction pages, autodocs pages, dark mode, fullscreen stories, and mobile widths.

2. Investigate interaction layer on each component.
   - Some stories are interactable and some are static examples.
   - Before release, decide the Storybook policy for when stories should be controlled, uncontrolled, or intentionally static, then audit families against that policy.
