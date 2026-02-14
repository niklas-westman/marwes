# Changelog

All notable changes to Marwes will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- **Complete color system from Figma** (18 semantic colors)
  - Contrast colors: `onPrimary`, `onSecondary`, `onDanger`, `onSuccess`, `onWarning`
  - Surface variants: `surfaceInverted`, `textInverted`
  - Border variants: `borderSubtle`
  - ColorSwatch component for Storybook color documentation
  - Color palette story showcasing all 18 colors with copy-to-clipboard
- Typography components (H1, H2, H3, Paragraph) with size variants
- Figma MCP integration for design token sync
- Letter-spacing support in heading components
- `AI_CONTEXT.md` - Quick reference for AI assistants
- `CHANGELOG.md` - Project changelog
- `docs/ROADMAP.md` - Feature roadmap
- `docs/TESTING.md` - Testing strategy documentation
- Improved package READMEs for Storybook and Playground apps
- **Figma node cache** (`.figma/nodes.json` and `.figma/NODE_REFERENCE.md`)
  - Complete offline reference for all Figma design nodes
  - 12 cached sections: Styleguide, Typography, Grids, Buttons, Dividers, Inputs, Dropdowns, Selects, Checkboxes, Focus States, Step Navigator, Assets
- **Button error state support** based on Figma design (node 1:1072)

### Changed
- **Updated all color values to match Figma design system**:
  - `surface`: `#F7F7F8` → `#F9FAFB` (Soft White)
  - `textMuted`: `#5B5B5F` → `#9CA3AF` (Medium Grey)
  - `border`: `#D9D9DE` → `#E5E7EB` (Light Grey)
  - `danger`: `#D92D20` → `#D90429` (Coral Red)
  - `success`: `#067647` → `#006633` (Field Green)
  - `warning`: `#B54708` → `#FFB703` (Amber Yellow)
- Extended theme color structure from 10 to 18 semantic tokens
- Updated theme with Instrument Sans as primary font (from Figma)
- Aligned H1 size to 44px (Display Hero from Figma)
- Updated text color to #141414 (Rich Black from Figma)
- **Button component updated with Figma design specifications**:
  - Focus state: 2px Accessible Blue (#2684FF) outline with 2px offset
  - Disabled state: 20% opacity (light mode), 40% opacity (dark mode)
  - Active state: Enhanced visual feedback on press
  - Hover states: Proper `:not(:disabled)` guards to prevent hover on disabled buttons
  - Error state: New error variant with danger color styling
  - Improved primary button contrast with `onPrimary` color
- **Input field component updated with Figma design specifications** (node 1:969):
  - Focus state: 2px Accessible Blue (#2684FF) outline with 2px offset (matches spec from node 120:927)
  - Disabled state: 20% opacity (light mode), 40% opacity (dark mode)
  - Hover state: Subtle border interaction on non-disabled, non-focused inputs
  - Error/Success tones: Proper border colors and focus outline colors for validation states
  - Transition effects: Smooth 150ms transitions for interactive states
  - All 5 Figma states implemented: default (1:984), pressed (1:989), active (1:994), error (1:999), disabled (1:1004)
- Improved heading line-heights and letter-spacing values
- Enhanced typography CSS with proper variable support
- Checkbox recipe now properly uses `onPrimary` for check color
- Removed hardcoded color fallbacks from checkbox CSS

### Fixed
- Typography CSS empty ruleset linting errors
- HeadingSize type export in core package
- React component style prop merging with CSS variables
- Checkbox CSS undefined variables (`--mw-fg`, `--mw-bg`)
- Checkbox using wrong color for checkmark (now uses `onPrimary`)

### Documentation
- Updated `FIGMA_TO_MARWES.md` with complete color token mapping
- Added contrast color pattern (`on-*`) explanation
- Documented dark mode preparation strategy

## [0.0.1] - 2026-02-09

### Added - Initial Setup
- Monorepo structure with pnpm workspaces
- `@marwes/core` package - Framework-agnostic component logic
- `@marwes/presets` package - firstEdition preset with CSS
- `@marwes/react` package - React adapter components
- Core components:
  - Button (with variants: solid, outline, soft, ghost)
  - Input (with validation states)
  - Checkbox (with indeterminate support)
  - Icon (lucide icons integration)
  - CheckboxField molecule
- Theme system with merge and normalize utilities
- MarwesProvider for React apps
- Storybook setup for component development
- React Playground for integration testing
- Documentation:
  - PROJECT.md
  - ARCHITECTURE.md
  - ENGINEERING.md
  - FIGMA_TO_MARWES.md
  - AI_NOTE_REFERENCE.md
- TypeScript strict mode configuration
- CSS variable-based styling approach
- Accessibility-first component design

### Infrastructure
- Biome for linting and formatting
- tsup for package building
- Vite for app development
- Storybook with a11y addon
