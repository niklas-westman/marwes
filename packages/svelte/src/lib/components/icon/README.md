# Icon — Parity Findings

## Svelte vs React/Vue

### Aligned ✅
- Full `iconRegistry` integration
- All props: name, size, strokeWidth, decorative, aria-label
- SVG rendering from core registry nodes
- Proper kebab-case attribute conversion via `svgAttrsToKebab`
- All SVG element types handled (path, circle, line, polygon, polyline, rect, ellipse)
- Accessibility: role="img", aria-hidden, aria-label from `resolveIconA11y`
- `class` prop merging

### Missing ❌
- None — full parity with React/Vue atom.

### Notes
- The `color` prop from core (`IconColor`) is accepted in types but visual application relies on preset CSS (`mw-icon--currentColor` etc.)
